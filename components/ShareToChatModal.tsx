"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareToChatModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [postData, setPostData] = useState<{ title: string, id: string } | null>(null);

    // Mock friends/chats to share to
    const shareTargets = [
        { id: "u1", name: "Hasantha M.", avatar: "👤" },
        { id: "u2", name: "Dilshan K.", avatar: "🧑‍💻" },
        { id: "g1", name: "Tecsub Community", avatar: "🌐" }
    ];

    useEffect(() => {
        const handleOpen = (e: any) => {
            setPostData(e.detail);
            setIsOpen(true);
        };
        window.addEventListener("tecsub-open-share", handleOpen);
        return () => window.removeEventListener("tecsub-open-share", handleOpen);
    }, []);

    const handleShare = (targetName: string) => {
        alert(`Successfully shared "\${postData?.title}" to \${targetName}!`);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="share-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
            >
                <div
                    className="share-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-bold text-lg">Send to Chat</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <div className="bg-[#272727] p-3 rounded-lg border border-gray-700 mb-4">
                        <p className="text-sm text-gray-300 truncate">
                            Sharing: <span className="font-semibold text-white">{postData?.title}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                        {shareTargets.map(target => (
                            <button
                                key={target.id}
                                onClick={() => handleShare(target.name)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#272727] transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{target.avatar}</span>
                                    <span className="text-white font-medium">{target.name}</span>
                                </div>
                                <div className="bg-[#3ea6ff] px-4 py-1.5 rounded-full text-black text-sm font-bold">
                                    Send
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
