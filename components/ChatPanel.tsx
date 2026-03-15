"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
interface ChatMessage {
    id: string;
    text: string;
    sender: "me" | "other";
    senderName: string;
    time: string;
    read: boolean;
    type?: "text" | "image" | "file";
}

interface ChatConversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    isGroup: boolean;
    members?: string[];
}

/* ─── Sample Data ─── */
const sampleConversations: ChatConversation[] = [
    {
        id: "conv-1",
        name: "Tecsub Community",
        avatar: "🌐",
        lastMessage: "Welcome to the Tecsub community group!",
        time: "Now",
        unread: 3,
        online: true,
        isGroup: true,
        members: ["Hasantha", "Dilshan", "Kamal", "Nimal", "+24 more"],
    },
    {
        id: "conv-2",
        name: "Hasantha M.",
        avatar: "👤",
        lastMessage: "Check out the new app update",
        time: "2m",
        unread: 1,
        online: true,
        isGroup: false,
    },
    {
        id: "conv-3",
        name: "Dev Support",
        avatar: "🛠️",
        lastMessage: "Your ticket has been resolved",
        time: "1h",
        unread: 0,
        online: false,
        isGroup: false,
    },
    {
        id: "conv-4",
        name: "Tecsub Apps Beta",
        avatar: "📱",
        lastMessage: "New beta version available for testing",
        time: "3h",
        unread: 5,
        online: true,
        isGroup: true,
        members: ["Hasantha", "Kasun", "Ruwan"],
    },
    {
        id: "conv-5",
        name: "Dilshan K.",
        avatar: "🧑‍💻",
        lastMessage: "Thanks for the guide!",
        time: "1d",
        unread: 0,
        online: false,
        isGroup: false,
    },
    {
        id: "channel-1",
        name: "Official Announcements",
        avatar: "📢",
        lastMessage: "Version 2.0 is officially live! Read the patch notes...",
        time: "10m",
        unread: 1,
        online: true,
        isGroup: true,
        members: ["14.2k subscribers"],
    },
    {
        id: "channel-2",
        name: "Daily Tech Prompts",
        avatar: "🤖",
        lastMessage: "Prompt #442: How to jailbreak an LLM securely...",
        time: "5h",
        unread: 0,
        online: false,
        isGroup: true,
        members: ["8.5k subscribers"],
    },
];

const sampleMessages: ChatMessage[] = [
    { id: "m1", text: "Hey! Welcome to Tecsub Community 🎉", sender: "other", senderName: "Hasantha", time: "10:30 AM", read: true },
    { id: "m2", text: "Thanks! Excited to be here", sender: "me", senderName: "You", time: "10:31 AM", read: true },
    { id: "m3", text: "Check out the latest app update, lots of new features", sender: "other", senderName: "Hasantha", time: "10:32 AM", read: true },
    { id: "m4", text: "The new UI looks amazing! 🔥", sender: "me", senderName: "You", time: "10:33 AM", read: true },
    { id: "m5", text: "We just pushed a PDF viewer feature too", sender: "other", senderName: "Dilshan", time: "10:35 AM", read: false },
];

/* ─── Component ─── */
export default function ChatPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [channelName, setChannelName] = useState("");
    const [channelDesc, setChannelDesc] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /* ─── Tabs State ─── */
    type ChatTab = "Inbox" | "Groups" | "Channels";
    const [activeTab, setActiveTab] = useState<ChatTab>("Inbox");
    const [shareContent, setShareContent] = useState<any>(null);

    /* ─── Listen for toggles & shares ─── */
    useEffect(() => {
        const toggleHandler = () => setIsOpen((prev) => !prev);
        const shareHandler = (e: any) => {
            setShareContent(e.detail);
            setIsOpen(true);
            setActiveTab("Inbox");
        };

        window.addEventListener("tecsub-toggle-chat", toggleHandler);
        window.addEventListener("tecsub-share-content", shareHandler);
        return () => {
            window.removeEventListener("tecsub-toggle-chat", toggleHandler);
            window.removeEventListener("tecsub-share-content", shareHandler);
        };
    }, []);

    /* ─── Auto scroll to bottom ─── */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ─── Send message / Share ─── */
    const sendMessage = useCallback(() => {
        if (!inputText.trim() && !shareContent) return;

        let msgText = inputText.trim();
        if (shareContent) {
            msgText = `Check out this \${shareContent.category}: \${shareContent.title}\n\${msgText}`;
        }

        const newMsg: ChatMessage = {
            id: `m-\${Date.now()}`,
            text: msgText,
            sender: "me",
            senderName: "You",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText("");
        setShareContent(null);

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const reply: ChatMessage = {
                id: `m-reply-\${Date.now()}`,
                text: shareContent ? "Thanks for sharing! 🔥" : "Got it! 👍 Our community is here to help.",
                sender: "other",
                senderName: activeConv?.name || "Tecsub",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                read: false,
            };
            setMessages((prev) => [...prev, reply]);
        }, 1500);
    }, [inputText, activeConv, shareContent]);

    /* ─── Filtering Logic ─── */
    const filteredConversations = sampleConversations.filter(conv => {
        if (activeTab === "Inbox") return !conv.isGroup && !conv.id.includes("channel");
        if (activeTab === "Groups") return conv.isGroup;
        if (activeTab === "Channels") return conv.id.includes("channel"); // Assuming channels might have a specific ID flag later
        return true;
    });

    /* ─── Conversation List View ─── */
    const renderConversationList = () => (
        <div className="chat-conv-list h-full flex flex-col bg-black text-white">
            {/* Header */}
            <div className="chat-conv-header p-4 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
                <h3 className="text-xl font-bold tracking-tight">Messages</h3>
                <div className="flex gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowCreateMenu((p) => !p)}
                            className="p-2 bg-[#222] hover:bg-[#333] rounded-full transition-colors"
                            title="Create New"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                        </button>
                        {showCreateMenu && (
                            <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden">
                                <button
                                    onClick={() => { setShowCreateGroup(true); setShowCreateMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#222] text-sm text-left transition-colors"
                                >
                                    <span className="text-lg">👥</span> New Group
                                </button>
                                <button
                                    onClick={() => { setShowCreateChannel(true); setShowCreateMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#222] text-sm text-left transition-colors border-t border-[#222]"
                                >
                                    <span className="text-lg">📢</span> New Channel
                                </button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 bg-[#222] hover:bg-[#333] rounded-full transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 py-2 gap-2 overflow-x-auto no-scrollbar border-b border-[#222]">
                <button
                    onClick={() => setActiveTab("Inbox")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors \${activeTab === "Inbox" ? "bg-white text-black" : "bg-[#222] text-gray-300 hover:bg-[#333]"}`}
                >
                    Inbox
                </button>
                <button
                    onClick={() => setActiveTab("Groups")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors \${activeTab === "Groups" ? "bg-green-500 text-white" : "bg-[#222] text-gray-300 hover:bg-[#333]"}`}
                >
                    Groups
                </button>
                <button
                    onClick={() => setActiveTab("Channels")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors \${activeTab === "Channels" ? "bg-blue-500 text-white" : "bg-[#222] text-gray-300 hover:bg-[#333]"}`}
                >
                    Channels
                </button>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto w-full p-2 space-y-1">
                {filteredConversations.map((conv) => (
                    <button
                        key={conv.id}
                        onClick={() => setActiveConv(conv)}
                        className="w-full flex items-center p-3 hover:bg-[#1a1a1a] rounded-xl transition-colors text-left group"
                    >
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#222] flex items-center justify-center text-xl shadow-md border border-[#333]">
                            {conv.avatar}
                            {conv.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-semibold text-gray-100 truncate pr-2">
                                    {conv.isGroup && "👥 "}{conv.name}
                                </span>
                                <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                            </div>
                            <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                                {conv.lastMessage}
                            </p>
                        </div>
                        {conv.unread > 0 && (
                            <span className="ml-3 flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {conv.unread}
                            </span>
                        )}
                    </button>
                ))}

                {filteredConversations.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                        <span className="text-4xl mb-3">👻</span>
                        <p>No messages in {activeTab}</p>
                    </div>
                )}
            </div>

            {/* Share Tooltip Alert */}
            {shareContent && (
                <div className="bg-purple-600/20 text-purple-300 p-3 text-sm border-t border-purple-500/30 font-medium">
                    ✨ Select a conversation below to share <strong>{shareContent.title}</strong>
                </div>
            )}
        </div>
    );

    /* ─── Chat View ─── */
    const renderChatView = () => (
        <div className="chat-view">
            {/* Chat Header */}
            <div className="chat-view-header">
                <button onClick={() => setActiveConv(null)} className="chat-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                </button>
                <div className="chat-view-header-info">
                    <span className="chat-view-avatar">{activeConv?.avatar}</span>
                    <div>
                        <div className="chat-view-name">{activeConv?.name}</div>
                        <div className="chat-view-status">
                            {activeConv?.online ? "Online" : "Last seen recently"}
                            {activeConv?.isGroup && ` · ${activeConv.members?.length || 0} members`}
                        </div>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button className="chat-action-btn" title="Video call">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </button>
                    <button className="chat-action-btn" title="Voice call">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-bubble-wrap ${msg.sender === "me" ? "chat-bubble-sent" : "chat-bubble-received"}`}
                    >
                        {msg.sender === "other" && activeConv?.isGroup && (
                            <span className="chat-bubble-sender">{msg.senderName}</span>
                        )}
                        <div className={`chat-bubble ${msg.sender === "me" ? "chat-bubble-me" : "chat-bubble-other"}`}>
                            <p>{msg.text}</p>
                            <span className="chat-bubble-time">
                                {msg.time}
                                {msg.sender === "me" && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill={msg.read ? "#3ea6ff" : "#aaa"}>
                                        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="chat-bubble-wrap chat-bubble-received">
                        <div className="chat-bubble chat-bubble-other">
                            <div className="chat-typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-bar">
                <button className="chat-action-btn" title="Attach file">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                    </svg>
                </button>
                <button className="chat-action-btn" title="Emoji">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="chat-text-input"
                />
                <button
                    onClick={sendMessage}
                    className="chat-send-btn"
                    disabled={!inputText.trim()}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );

    /* ─── Create Group Modal ─── */
    const renderCreateGroup = () => (
        <div className="chat-create-group">
            <div className="chat-conv-header">
                <button onClick={() => setShowCreateGroup(false)} className="chat-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                </button>
                <h3 className="chat-conv-title">Create Group</h3>
            </div>
            <div className="chat-group-form">
                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="chat-text-input"
                />
                <p className="chat-group-hint">Add members by searching their names:</p>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="chat-text-input"
                />
                <div className="chat-group-members">
                    {["Hasantha M.", "Dilshan K.", "Kamal P."].map((name) => (
                        <label key={name} className="chat-member-item">
                            <input type="checkbox" className="chat-checkbox" />
                            <span>{name}</span>
                        </label>
                    ))}
                </div>
                <button
                    className="chat-create-btn"
                    onClick={() => setShowCreateGroup(false)}
                >
                    Create Group
                </button>
            </div>
        </div>
    );

    /* ─── Create Channel Modal ─── */
    const renderCreateChannel = () => (
        <div className="chat-create-group">
            <div className="chat-conv-header">
                <button onClick={() => setShowCreateChannel(false)} className="chat-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                </button>
                <h3 className="chat-conv-title">Create Channel</h3>
            </div>
            <div className="chat-group-form">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl">📢</div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Channels are for broadcasting to unlimited subscribers</p>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Channel name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="chat-text-input"
                />
                <textarea
                    placeholder="Channel description (optional)"
                    value={channelDesc}
                    onChange={(e) => setChannelDesc(e.target.value)}
                    className="chat-text-input mt-2"
                    rows={3}
                    style={{ resize: "none", minHeight: "70px" }}
                />
                <div className="flex gap-2 mt-3">
                    <label className="flex items-center gap-2 text-xs text-gray-400 bg-[#1a1a1a] px-3 py-2 rounded-lg border border-[#333] cursor-pointer">
                        <input type="radio" name="channel-type" defaultChecked className="accent-blue-500" />
                        Public
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-400 bg-[#1a1a1a] px-3 py-2 rounded-lg border border-[#333] cursor-pointer">
                        <input type="radio" name="channel-type" className="accent-blue-500" />
                        Private
                    </label>
                </div>
                <button
                    className="chat-create-btn mt-4"
                    style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
                    onClick={() => setShowCreateChannel(false)}
                >
                    Create Channel
                </button>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="chat-backdrop"
                        onClick={() => { setIsOpen(false); setActiveConv(null); }}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="chat-panel"
                    >
                        {showCreateChannel
                            ? renderCreateChannel()
                            : showCreateGroup
                                ? renderCreateGroup()
                                : activeConv
                                    ? renderChatView()
                                    : renderConversationList()
                        }
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
