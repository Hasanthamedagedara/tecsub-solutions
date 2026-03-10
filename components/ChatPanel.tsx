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
    const [groupName, setGroupName] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /* ─── Listen for toggle event ─── */
    useEffect(() => {
        const handler = () => setIsOpen((prev) => !prev);
        window.addEventListener("tecsub-toggle-chat", handler);
        return () => window.removeEventListener("tecsub-toggle-chat", handler);
    }, []);

    /* ─── Auto scroll to bottom ─── */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ─── Send message ─── */
    const sendMessage = useCallback(() => {
        if (!inputText.trim()) return;

        const newMsg: ChatMessage = {
            id: `m-${Date.now()}`,
            text: inputText.trim(),
            sender: "me",
            senderName: "You",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText("");

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const reply: ChatMessage = {
                id: `m-reply-${Date.now()}`,
                text: "Thanks for the message! 👍 Our community is here to help.",
                sender: "other",
                senderName: activeConv?.name || "Tecsub",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                read: false,
            };
            setMessages((prev) => [...prev, reply]);
        }, 1500);
    }, [inputText, activeConv]);

    /* ─── Conversation List View ─── */
    const [activeTab, setActiveTab] = useState<"inbox" | "groups" | "channels">("inbox");

    const filteredConversations = sampleConversations.filter(c => {
        if (activeTab === "inbox") return !c.isGroup && !c.id.includes("channel");
        if (activeTab === "groups") return c.isGroup && !c.id.includes("channel");
        if (activeTab === "channels") return c.id.includes("channel");
        return true;
    });

    const renderConversationList = () => (
        <div className="chat-conv-list flex flex-col h-full">
            {/* Header */}
            <div className="chat-conv-header flex-col items-start gap-4">
                <div className="w-full flex justify-between items-center">
                    <h3 className="chat-conv-title">Messages</h3>
                    <div className="chat-header-actions">
                        <button
                            onClick={() => setShowCreateGroup(true)}
                            className="chat-action-btn"
                            title="Create Group"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </button>
                        <button onClick={() => setIsOpen(false)} className="chat-action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Chat Tabs */}
                <div className="flex bg-[#272727] p-1 rounded-xl w-[calc(100%-32px)] mx-auto mb-3">
                    <button
                        onClick={() => setActiveTab("inbox")}
                        className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors \${activeTab === "inbox" ? "bg-[#3ea6ff] text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Inbox
                    </button>
                    <button
                        onClick={() => setActiveTab("groups")}
                        className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors \${activeTab === "groups" ? "bg-[#3ea6ff] text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Groups
                    </button>
                    <button
                        onClick={() => setActiveTab("channels")}
                        className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors \${activeTab === "channels" ? "bg-[#3ea6ff] text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Channels
                    </button>
                </div>

                {/* E2E Badge */}
                <div className="chat-e2e-badge mx-4 mt-0 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#2ba640">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                    </svg>
                    <span>End-to-end encrypted</span>
                </div>

                {/* Conversations */}
                <div className="chat-conv-items flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No {activeTab} available yet.
                        </div>
                    )}
                    {filteredConversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setActiveConv(conv)}
                            className="chat-conv-item"
                        >
                            <div className="chat-conv-avatar-wrap">
                                <span className="chat-conv-avatar">{conv.avatar}</span>
                                {conv.online && <span className="chat-online-dot" />}
                            </div>
                            <div className="chat-conv-info">
                                <div className="chat-conv-name-row">
                                    <span className="chat-conv-name">
                                        {conv.isGroup && "👥 "}{conv.name}
                                    </span>
                                    <span className="chat-conv-time">{conv.time}</span>
                                </div>
                                <p className="chat-conv-last">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                                <span className="chat-unread-badge">{conv.unread}</span>
                            )}
                        </button>
                    ))}
                </div>
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
                            {showCreateGroup
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
