"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

// Enhanced Singlish Mapping based on user provided 3.0 tables
const CONSONANTS: Record<string, string> = {
    "kha": "ඛ", "gha": "ඝ", "chha": "ඡ", "jha": "ඣ", "Tha": "ඨ", "Dha": "ඪ", "tha": "ථ", "dha": "ධ", "pha": "ඵ", "bha": "භ",
    "k": "ක", "g": "ග", "ng": "ඞ", "ch": "ච", "j": "ජ", "ny": "ඤ",
    "T": "ට", "D": "ඩ", "N": "ණ", "L": "ළ", "S": "ෂ",
    "t": "ත", "d": "ද", "n": "න", "p": "ප", "b": "බ", "m": "ම", 
    "y": "ය", "r": "ර", "l": "ල", "w": "ව", "v": "ව", "sh": "ශ", "s": "ස", "h": "හ", "f": "ෆ",
    "gn": "ඥ", "nj": "ඤ"
};

const VOWELS: Record<string, string> = {
    "aa": "ආ", "ae": "ඇ", "aae": "ඈ", "ii": "ඊ", "ee": "ඒ", "uu": "ඌ", "oo": "ඕ", "au": "ඖ", "ri": "ඍ",
    "a": "අ", "A": "ආ", "Ae": "ඈ", "i": "ඉ", "I": "ඊ", "e": "එ", "E": "ඒ", "u": "උ", "U": "ඌ", "o": "ඔ", "O": "ඕ"
};

const PILLA: Record<string, string> = {
    "aa": "ා", "ae": "ැ", "aae": "ෑ", "ii": "ී", "ee": "ේ", "uu": "ූ", "oo": "ෝ", "au": "ෞ",
    "A": "ා", "Ae": "ෑ", "I": "ී", "E": "ේ", "U": "ූ", "O": "ෝ",
    "i": "ි", "e": "ෙ", "u": "ු", "o": "ො"
};

const SPECIAL: Record<string, string> = {
    "n": "ං", "x": "ං", "H": "ඃ"
};

export default function SinglishPage() {
    const [singlishInput, setSinglishInput] = useState("");
    const [unicodeOutput, setUnicodeOutput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [activeLang, setActiveLang] = useState<"si" | "en" | "ta">("si");
    const [copied, setCopied] = useState(false);
    const { language } = useAppContext();

    const wordCount = unicodeOutput.trim() ? unicodeOutput.trim().split(/\s+/).length : 0;

    // Advanced Transliteration Logic v3.0
    useEffect(() => {
        let text = singlishInput;
        let result = "";
        let i = 0;

        while (i < text.length) {
            let found = false;

            // 1. Check for Special symbols at end or alone
            if (SPECIAL[text[i]]) {
                if (i === text.length - 1 || text[i+1] === " " || text[i+1] === "\n") {
                    result += SPECIAL[text[i]];
                    i++;
                    continue;
                }
            }

            // 2. Check for Standalone Vowels (Start of word)
            if (i === 0 || text[i-1] === " " || text[i-1] === "\n") {
                for (let len = 3; len >= 1; len--) {
                    let part = text.substring(i, i + len);
                    if (VOWELS[part]) {
                        result += VOWELS[part];
                        i += len;
                        found = true;
                        break;
                    }
                }
            }
            if (found) continue;

            // 3. Check for Consonants
            for (let len = 3; len >= 1; len--) {
                let part = text.substring(i, i + len);
                if (CONSONANTS[part] || (part.length === 1 && CONSONANTS[part.toLowerCase()])) {
                    let charPart = CONSONANTS[part] || CONSONANTS[part.toLowerCase()];
                    let originalLen = len;
                    i += len;

                    // Check for Special combos (Raka, Yansha)
                    if (text.substring(i, i+2) === "ra") {
                        result += charPart + "්ර";
                        i += 2;
                        found = true;
                    } else if (text.substring(i, i+2) === "ya") {
                        result += charPart + "්ය";
                        i += 2;
                        found = true;
                    } else {
                        // Check for Pilla (Vowel signs)
                        let pillaFound = false;
                        for (let pLen = 3; pLen >= 1; pLen--) {
                            let pPart = text.substring(i, i + pLen);
                            if (PILLA[pPart]) {
                                result += charPart + PILLA[pPart];
                                i += pLen;
                                pillaFound = true;
                                break;
                            } else if (pPart === "a") {
                                result += charPart; // Inherent a
                                i += 1;
                                pillaFound = true;
                                break;
                            }
                        }

                        if (!pillaFound) {
                            result += charPart + "්"; // Hal Kirima
                        }
                        found = true;
                    }
                    break;
                }
            }

            if (!found) {
                result += text[i];
                i++;
            }
        }
        setUnicodeOutput(result);
    }, [singlishInput]);

    const startSpeech = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'si-LK';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) setUnicodeOutput(prev => prev + " " + finalTranscript);
        };
        if (isListening) recognition.stop();
        else recognition.start();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(unicodeOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setSinglishInput("");
        setUnicodeOutput("");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-black text-[#dc2626]">සිංහල</span>
                            <span className="text-2xl font-black text-gray-400">Typing</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Tecsub Sinhala Typing Workstation v3.0</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#keymap" className="text-[11px] font-black uppercase text-gray-400 hover:text-blue-500 flex items-center gap-1.5 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h10"/></svg>
                            Keymap Guide
                        </a>
                    </div>
                </div>

                {/* Privacy Banner */}
                <div className="bg-[#eff6ff] dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <h4 className="text-[13px] font-black text-blue-600 dark:text-blue-400 uppercase">100% Secure Node</h4>
                        <p className="text-[11px] text-blue-500/80 font-medium leading-tight">Your data remains <strong className="text-blue-700 dark:text-blue-300 uppercase">browser-bound</strong>. We use a purely client-side transliteration engine for your absolute privacy.</p>
                    </div>
                </div>

                {/* Main Typing Interface */}
                <div className="bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                            <button onClick={() => setActiveLang("si")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeLang === "si" ? "bg-[#dc2626] text-white shadow-md" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"}`}>සිංහල</button>
                            <button onClick={() => setActiveLang("en")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeLang === "en" ? "bg-blue-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"}`}>English</button>
                            <button onClick={() => setActiveLang("ta")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeLang === "ta" ? "bg-orange-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"}`}>தமிழ்</button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{wordCount} words Typed</span>
                            <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                            <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-500 hover:text-blue-500 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button onClick={handleClear} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="relative p-8 min-h-[450px] flex flex-col">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                                <button className="px-5 py-2 bg-white dark:bg-[#1a1a1a] rounded-lg text-[12px] font-black shadow-sm flex items-center gap-3 italic">
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                    TRANSLITERATING...
                                </button>
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={singlishInput}
                                    onChange={(e) => setSinglishInput(e.target.value)}
                                    placeholder="Type Singlish here (e.g. lanka, ayubowan, gedara)"
                                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/5 px-0 py-3 outline-none text-xl font-bold text-gray-400 dark:text-gray-700 focus:border-red-500/50 transition-all placeholder:text-gray-200 dark:placeholder:text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <textarea 
                                value={unicodeOutput}
                                readOnly
                                placeholder="Sinhala output will appear here..."
                                className="w-full h-full bg-transparent border-none outline-none resize-none text-4xl sm:text-5xl font-black leading-[1.4] text-gray-900 dark:text-white placeholder:text-gray-50 dark:placeholder:text-gray-[0.02] scrollbar-none"
                            />
                        </div>

                        <button 
                            onClick={startSpeech}
                            className={`absolute left-8 bottom-8 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/20 transition-all z-10 ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-white dark:bg-[#1a1a1a] text-red-500 hover:scale-110"}`}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </button>
                    </div>
                </div>

                {/* Detailed Keymap Guide v3.0 */}
                <div id="keymap" className="mt-16 space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Singlish 3.0 Standard Reference</h2>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Vowels Column */}
                        <div className="bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 rounded-3xl p-8">
                            <h3 className="text-sm font-black uppercase italic text-red-500 mb-6">1. Vowels (ස්වර)</h3>
                            <div className="space-y-3">
                                {[
                                    { k: "a", v: "අ" }, { k: "aa / A", v: "ආ" },
                                    { k: "ae", v: "ඇ" }, { k: "aae / Ae", v: "ඈ" },
                                    { k: "i", v: "ඉ" }, { k: "ii / I", v: "ඊ" },
                                    { k: "u", v: "උ" }, { k: "uu / U", v: "ඌ" },
                                    { k: "e", v: "එ" }, { k: "ee / E", v: "ඒ" },
                                    { k: "o", v: "ඔ" }, { k: "oo / O", v: "ඕ" },
                                    { k: "au", v: "ඖ" }, { k: "ri", v: "ඍ" }
                                ].map((item) => (
                                    <div key={item.k} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5">
                                        <code className="text-gray-400 font-bold">{item.k}</code>
                                        <span className="text-xl font-black">{item.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Consonants Column */}
                        <div className="bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 rounded-3xl p-8">
                            <h3 className="text-sm font-black uppercase italic text-blue-500 mb-6">2. Consonants (ව්යංජන)</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {[
                                    { k: "ka", v: "ක" }, { k: "kha", v: "ඛ" },
                                    { k: "ga", v: "ග" }, { k: "gha", v: "ඝ" },
                                    { k: "ta", v: "ත" }, { k: "tha", v: "ථ" },
                                    { k: "da", v: "ද" }, { k: "dha", v: "ධ" },
                                    { k: "Ta", v: "ට" }, { k: "Tha", v: "ඨ" },
                                    { k: "Da", v: "ඩ" }, { k: "Dha", v: "ඪ" },
                                    { k: "pa", v: "ප" }, { k: "pha", v: "ඵ" },
                                    { k: "ba", v: "බ" }, { k: "bha", v: "භ" }
                                ].map((item) => (
                                    <div key={item.k} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5">
                                        <code className="text-gray-400 font-bold">{item.k}</code>
                                        <span className="text-xl font-black">{item.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pili & Special Column */}
                        <div className="bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 rounded-3xl p-8">
                            <h3 className="text-sm font-black uppercase italic text-orange-500 mb-6">3. Pili & Special</h3>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-[10px] font-black uppercase text-gray-400">Raka-paanshaya</span>
                                        <code className="text-gray-400 font-bold">kra → ක්ර</code>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-[10px] font-black uppercase text-gray-400">Yanshaya</span>
                                        <code className="text-gray-400 font-bold">kya → ක්ය</code>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-[10px] font-black uppercase text-gray-400">Anusvara</span>
                                        <code className="text-gray-400 font-bold">n / x → ං</code>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                    <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2">Pili Combination</h4>
                                    <div className="text-sm font-black space-y-1">
                                        <p>ka + aa → කා</p>
                                        <p>ka + ae → කෑ</p>
                                        <p>ka + ee → කේ</p>
                                        <p>ka + oo → කෝ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 bg-black rounded-[3rem] p-12 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent pointer-events-none" />
                    <h3 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter mb-4 relative z-10">READY FOR PRODUCTION?</h3>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto mb-8 relative z-10">Start typing or speaking to generate clean, high-standard Sinhala Unicode text for your websites, documents, and social media.</p>
                    <button onClick={handleClear} className="px-12 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-110 transition-transform relative z-10">New Session</button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
