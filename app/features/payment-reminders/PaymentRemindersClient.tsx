"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Reminder {
    id: string;
    title: string;
    type: "daily" | "monthly" | "custom";
    triggerDetail: string;
    time: string;
}

export default function PaymentRemindersClient() {
    const [reminders, setReminders] = useState<Reminder[]>([
        { id: "rem-1", title: "Internet Subscription Due", type: "monthly", triggerDetail: "Day 28 of every month", time: "09:00 AM" },
        { id: "rem-2", title: "Electricity Bill Alert", type: "custom", triggerDetail: "Specific Date: June 15, 2026", time: "10:30 AM" },
    ]);

    const [title, setTitle] = useState("");
    const [type, setType] = useState<"daily" | "monthly" | "custom">("monthly");
    const [dayOfMonth, setDayOfMonth] = useState("1");
    const [customDate, setCustomDate] = useState("");
    const [time, setTime] = useState("09:00");

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        let triggerDetail = "";
        if (type === "daily") {
            triggerDetail = "Daily Alert";
        } else if (type === "monthly") {
            triggerDetail = `Day ${dayOfMonth} of every month`;
        } else {
            triggerDetail = customDate ? `Specific Date: ${customDate}` : "Specific Date (Today)";
        }

        // Convert 24h to 12h
        const [h, m] = time.split(":");
        const hr = parseInt(h);
        const ampm = hr >= 12 ? "PM" : "AM";
        const formattedHour = hr % 12 || 12;
        const time12 = `${formattedHour}:${m} ${ampm}`;

        const newReminder: Reminder = {
            id: `rem-${Date.now()}`,
            title: title.trim(),
            type,
            triggerDetail,
            time: time12
        };

        setReminders([newReminder, ...reminders]);
        setTitle("");
        setAlertMessage(`⏰ Reminder for "${newReminder.title}" scheduled successfully!`);
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const handleDelete = (id: string) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Custom Payment & Due Date Notification Reminders | Tecsub Solutions",
        "description": "Set up daily, specific, or custom date payment notification reminders easily with our app. Never miss a due date again.",
        "publisher": {
            "@type": "Organization",
            "name": "Tecsub Solutions",
            "logo": "https://tecsub.online/logo/tecsub.jpg"
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            {/* SEO JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero Header */}
                    <div className="text-center mb-10">
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-yt-accent">Due Date Management</span>
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mt-2 mb-4">
                            ⏰ PAYMENT REMINDERS
                        </h1>
                        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Set up daily, specific, or custom date payment notification reminders easily. Never miss a due date again.
                        </p>
                    </div>

                    {/* Dynamic Alert Banner */}
                    <AnimatePresence>
                        {alertMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-6 p-4 rounded-xl text-center text-xs font-bold text-green-400 border border-green-500/20"
                                style={{ background: "rgba(34, 197, 94, 0.08)" }}
                            >
                                {alertMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid md:grid-cols-5 gap-8 items-start">
                        {/* Scheduler Form */}
                        <div 
                            className="md:col-span-2 rounded-3xl p-6 border"
                            style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}
                        >
                            <h3 className="font-bold text-sm uppercase tracking-wider mb-6 text-[#3ea6ff]">
                                Create Reminder
                            </h3>

                            <form onSubmit={handleAddReminder} className="space-y-4 text-xs">
                                <div>
                                    <label className="block uppercase tracking-wider text-[10px] text-gray-400 mb-1 font-bold">
                                        Reminder Title
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Hosting Bill, Office Rent"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all focus:border-[#3ea6ff]"
                                        style={{ background: "var(--yt-bg)", borderColor: "var(--yt-border)", color: "var(--yt-text-primary)" }}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block uppercase tracking-wider text-[10px] text-gray-400 mb-1 font-bold">
                                        Reminder Frequency
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as any)}
                                        className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                                        style={{ background: "var(--yt-bg)", borderColor: "var(--yt-border)", color: "var(--yt-text-primary)" }}
                                    >
                                        <option value="monthly">Monthly Specific Day</option>
                                        <option value="daily">Daily Notification</option>
                                        <option value="custom">Custom Date Single Alert</option>
                                    </select>
                                </div>

                                {type === "monthly" && (
                                    <div>
                                        <label className="block uppercase tracking-wider text-[10px] text-gray-400 mb-1 font-bold">
                                            Day of Month (1 - 31)
                                        </label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="31"
                                            value={dayOfMonth}
                                            onChange={(e) => setDayOfMonth(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                                            style={{ background: "var(--yt-bg)", borderColor: "var(--yt-border)", color: "var(--yt-text-primary)" }}
                                        />
                                    </div>
                                )}

                                {type === "custom" && (
                                    <div>
                                        <label className="block uppercase tracking-wider text-[10px] text-gray-400 mb-1 font-bold">
                                            Select Custom Alert Date
                                        </label>
                                        <input 
                                            type="date"
                                            value={customDate}
                                            onChange={(e) => setCustomDate(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                                            style={{ background: "var(--yt-bg)", borderColor: "var(--yt-border)", color: "var(--yt-text-primary)" }}
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block uppercase tracking-wider text-[10px] text-gray-400 mb-1 font-bold">
                                        Time (24h)
                                    </label>
                                    <input 
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm"
                                        style={{ background: "var(--yt-bg)", borderColor: "var(--yt-border)", color: "var(--yt-text-primary)" }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-yt-accent hover:brightness-110 transition-all font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20"
                                >
                                    ⏰ Set Reminder
                                </button>
                            </form>
                        </div>

                        {/* List View */}
                        <div className="md:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-yt-text-primary">
                                    Active Scheduled Reminders
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yt-accent/15 text-[#3ea6ff]">
                                    {reminders.length} Active
                                </span>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {reminders.map((reminder) => (
                                        <motion.div
                                            key={reminder.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-4 rounded-2xl border flex items-center justify-between"
                                            style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}
                                        >
                                            <div>
                                                <h4 className="font-bold text-sm text-[var(--yt-text-primary)] mb-1">{reminder.title}</h4>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                    <span className="capitalize px-2 py-0.5 rounded bg-yt-chip-bg text-yt-text-primary font-bold">
                                                        {reminder.type}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{reminder.triggerDetail}</span>
                                                    <span>•</span>
                                                    <span>🔔 {reminder.time}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(reminder.id)}
                                                className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                                                title="Delete Reminder"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {reminders.length === 0 && (
                                    <div className="text-center py-12 rounded-2xl border border-dashed border-gray-800 text-gray-500">
                                        <p className="text-2xl mb-2">📭</p>
                                        <p className="text-xs">No active payment reminders scheduled. Add one on the left!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div>
    );
}
