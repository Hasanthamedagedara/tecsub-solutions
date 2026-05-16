"use client";

import { motion } from "framer-motion";
import type { ProcessingStatus } from "@/hooks/useAudioProcessor";

interface Props {
    status: ProcessingStatus;
    onCancel: () => void;
}

const STAGES = [
    { key: "loading", icon: "⏳", label: "Loading file", desc: "Reading file data into memory..." },
    { key: "analyzing", icon: "🎧", label: "Analyzing audio", desc: "Extracting waveform and frequency data..." },
    { key: "silence", icon: "🤫", label: "Detecting silence", desc: "Scanning for silent regions..." },
    { key: "chapters", icon: "📝", label: "Generating chapters", desc: "Identifying content boundaries..." },
    { key: "ready", icon: "✅", label: "Complete", desc: "Ready to edit and export!" },
];

export default function ProcessingOverlay({ status, onCancel }: Props) {
    if (status.stage === "idle" || status.stage === "ready") return null;

    const currentIdx = STAGES.findIndex(s => s.key === status.stage);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-lg w-full mx-4"
            >
                {/* Glow ring */}
                <div className="absolute inset-0 -m-8">
                    <div className="absolute inset-0 rounded-full animate-pulse" style={{
                        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                    }} />
                </div>

                <div className="relative bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Animated ring */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <motion.circle
                                    cx="50" cy="50" r="42"
                                    fill="none"
                                    stroke="url(#progressGrad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 42}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - status.progress / 100) }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                                <defs>
                                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-white">{status.progress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Stage steps */}
                    <div className="space-y-3 mb-8">
                        {STAGES.map((stage, idx) => {
                            const isActive = stage.key === status.stage;
                            const isDone = idx < currentIdx;
                            const isPending = idx > currentIdx;

                            return (
                                <motion.div
                                    key={stage.key}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                                        isActive ? "bg-indigo-500/10 border border-indigo-500/20" :
                                        isDone ? "bg-white/[0.02]" :
                                        "opacity-30"
                                    }`}
                                >
                                    <span className="text-lg flex-shrink-0">{isDone ? "✅" : stage.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold ${isActive ? "text-white" : isDone ? "text-white/50" : "text-white/30"}`}>
                                            {stage.label}
                                        </p>
                                        {isActive && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-[11px] text-indigo-300/60 mt-0.5"
                                            >
                                                {status.message || stage.desc}
                                            </motion.p>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin flex-shrink-0" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Cancel button */}
                    <div className="flex justify-center">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-400 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
