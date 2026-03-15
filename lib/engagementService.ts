/**
 * Tecsub — Engagement Firestore Service
 *
 * Data shape in Firestore:
 *   engagement/{contentId}
 *     likes: number
 *     reposts: number
 *     views: number
 *     commentCount: number
 *
 *   engagement/{contentId}/comments/{commentId}
 *     author: string
 *     avatar: string
 *     text: string
 *     timestamp: Timestamp
 *     likes: number
 *     likedBy: string[]
 *     replies: Reply[]
 *
 * User own-state (liked / reposted / saved) is stored in localStorage
 * keyed by a stable anonymous session ID so counts come from Firestore
 * but personal toggle state works offline.
 */

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    increment,
    collection,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─── Types ─── */
export interface EngagementData {
    likes: number;
    reposts: number;
    views: number;
    commentCount: number;
}

export interface FireComment {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: number;
    likes: number;
    likedBy: string[];
    replies: FireReply[];
}

export interface FireReply {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: number;
    likes: number;
    likedBy: string[];
}

/* ─── Anonymous session ID ─── */
function getSessionId(): string {
    if (typeof window === "undefined") return "anon";
    let id = localStorage.getItem("tecsub-session-id");
    if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("tecsub-session-id", id);
    }
    return id;
}

/* ─── Ensure document exists ─── */
async function ensureDoc(contentId: string) {
    const ref = doc(db, "engagement", contentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, { likes: 0, reposts: 0, views: 0, commentCount: 0 });
    }
    return ref;
}

/* ─── Get one-time engagement data ─── */
export async function getEngagement(contentId: string): Promise<EngagementData> {
    try {
        const ref = doc(db, "engagement", contentId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const d = snap.data();
            return {
                likes: d.likes ?? 0,
                reposts: d.reposts ?? 0,
                views: d.views ?? 0,
                commentCount: d.commentCount ?? 0,
            };
        }
        return { likes: 0, reposts: 0, views: 0, commentCount: 0 };
    } catch {
        return { likes: 0, reposts: 0, views: 0, commentCount: 0 };
    }
}

/* ─── Real-time engagement listener ─── */
export function subscribeEngagement(
    contentId: string,
    callback: (data: EngagementData) => void
): () => void {
    const ref = doc(db, "engagement", contentId);
    const unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
            const d = snap.data();
            callback({
                likes: d.likes ?? 0,
                reposts: d.reposts ?? 0,
                views: d.views ?? 0,
                commentCount: d.commentCount ?? 0,
            });
        } else {
            callback({ likes: 0, reposts: 0, views: 0, commentCount: 0 });
        }
    }, () => {
        // On error (offline / no project configured), silently return zeros
        callback({ likes: 0, reposts: 0, views: 0, commentCount: 0 });
    });
    return unsub;
}

/* ─── Toggle Like ─── */
export async function toggleLike(
    contentId: string,
    currentlyLiked: boolean
): Promise<void> {
    try {
        const ref = await ensureDoc(contentId);
        await updateDoc(ref, { likes: increment(currentlyLiked ? -1 : 1) });
    } catch { /* offline — handled by optimistic update */ }
}

/* ─── Toggle Repost ─── */
export async function toggleRepost(
    contentId: string,
    currentlyReposted: boolean
): Promise<void> {
    try {
        const ref = await ensureDoc(contentId);
        await updateDoc(ref, { reposts: increment(currentlyReposted ? -1 : 1) });
    } catch { /* offline */ }
}

/* ─── Increment View (once per session per content) ─── */
export async function incrementView(contentId: string): Promise<void> {
    try {
        const sessionKey = `tecsub-viewed-${contentId}`;
        if (localStorage.getItem(sessionKey)) return;
        localStorage.setItem(sessionKey, "1");
        const ref = await ensureDoc(contentId);
        await updateDoc(ref, { views: increment(1) });
    } catch { /* offline */ }
}

/* ─── Add Comment ─── */
export async function addComment(
    contentId: string,
    text: string,
    author: string,
    avatar: string
): Promise<void> {
    try {
        const colRef = collection(db, "engagement", contentId, "comments");
        await addDoc(colRef, {
            author,
            avatar,
            text,
            timestamp: serverTimestamp(),
            likes: 0,
            likedBy: [],
            replies: [],
        });
        // Increment commentCount on parent doc
        const ref = await ensureDoc(contentId);
        await updateDoc(ref, { commentCount: increment(1) });
    } catch { /* offline */ }
}

/* ─── Toggle Comment Like ─── */
export async function toggleCommentLike(
    contentId: string,
    commentId: string,
    currentlyLiked: boolean
): Promise<void> {
    try {
        const sessionId = getSessionId();
        const ref = doc(db, "engagement", contentId, "comments", commentId);
        await updateDoc(ref, {
            likes: increment(currentlyLiked ? -1 : 1),
            likedBy: currentlyLiked ? arrayRemove(sessionId) : arrayUnion(sessionId),
        });
    } catch { /* offline */ }
}

/* ─── Add Reply to Comment ─── */
export async function addReply(
    contentId: string,
    commentId: string,
    text: string,
    author: string,
    avatar: string
): Promise<void> {
    try {
        const ref = doc(db, "engagement", contentId, "comments", commentId);
        const reply: FireReply = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            author,
            avatar,
            text,
            timestamp: Date.now(),
            likes: 0,
            likedBy: [],
        };
        await updateDoc(ref, { replies: arrayUnion(reply) });
    } catch { /* offline */ }
}

/* ─── Real-time Comments Listener ─── */
export function subscribeComments(
    contentId: string,
    callback: (comments: FireComment[]) => void
): () => void {
    const colRef = collection(db, "engagement", contentId, "comments");
    const q = query(colRef, orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
        const comments: FireComment[] = snap.docs.map((d) => {
            const data = d.data();
            const ts = data.timestamp instanceof Timestamp
                ? data.timestamp.toMillis()
                : (data.timestamp ?? Date.now());
            return {
                id: d.id,
                author: data.author ?? "Anonymous",
                avatar: data.avatar ?? "🧑",
                text: data.text ?? "",
                timestamp: ts,
                likes: data.likes ?? 0,
                likedBy: data.likedBy ?? [],
                replies: (data.replies ?? []).map((r: FireReply) => ({
                    id: r.id,
                    author: r.author ?? "Anonymous",
                    avatar: r.avatar ?? "🧑",
                    text: r.text ?? "",
                    timestamp: r.timestamp ?? Date.now(),
                    likes: r.likes ?? 0,
                    likedBy: r.likedBy ?? [],
                })),
            };
        });
        callback(comments);
    }, () => callback([]));
    return unsub;
}

/* ─── User own-state helpers (localStorage) ─── */
export function getUserState(contentId: string): { liked: boolean; reposted: boolean; saved: boolean } {
    try {
        const raw = localStorage.getItem(`tecsub-own-${contentId}`);
        return raw ? JSON.parse(raw) : { liked: false, reposted: false, saved: false };
    } catch {
        return { liked: false, reposted: false, saved: false };
    }
}

export function setUserState(contentId: string, state: { liked: boolean; reposted: boolean; saved: boolean }): void {
    try {
        localStorage.setItem(`tecsub-own-${contentId}`, JSON.stringify(state));
    } catch { /* ignore */ }
}

export { getSessionId };
