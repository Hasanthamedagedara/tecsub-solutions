"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const humanizePatterns = [
    { search: "Furthermore,", replace: "Plus," },
    { search: "Consequently,", replace: "So," },
    { search: "In addition,", replace: "Also," },
    { search: "Moreover,", replace: "Another thing is," },
    { search: "Utilize", replace: "use" },
    { search: "Commence", replace: "start" },
    { search: "Therefore,", replace: "That's why" },
    { search: "Additionally,", replace: "And," },
    { search: "however", replace: "but" },
    { search: "I believe that", replace: "I think" },
    { search: "It is important to note that", replace: "Notice that" },
    { search: "provides", replace: "gives" },
    { search: "substantial", replace: "big" },
    { search: "facilitate", replace: "help" },
];

export default function AIHumanizerPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [intensity, setIntensity] = useState(50);

    const humanizeText = () => {
        if (!input.trim()) return;
        setLoading(true);
        setTimeout(() => {
            let result = input;
            
            // 1. Basic Synonym/Pattern Replacement
            humanizePatterns.forEach(p => {
                const regex = new RegExp(p.search, "gi");
                if (Math.random() * 100 < intensity) {
                    result = result.replace(regex, p.replace);
                }
            });

            // 2. Break long sentences
            if (intensity > 40) {
                result = result.replace(/, and /g, ". And ").replace(/, but /g, ". But ");
            }

            // 3. Add slight "human" filler words at the start of some sentences
            if (intensity > 70) {
                const sentences = result.split(". ");
                result = sentences.map((s, i) => {
                    if (i > 0 && Math.random() > 0.8) {
                        const fillers = ["Actually, ", "Well, ", "You know, ", "Basically, "];
                        return fillers[Math.floor(Math.random() * fillers.length)] + s.charAt(0).toLowerCase() + s.slice(1);
                    }
                    return s;
                }).join(". ");
            }

            setOutput(result);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{background:"var(--bg-primary)"}}>
            <Navbar/><Sidebar/>
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{marginLeft:"var(--sidebar-w, 68px)"}}>
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.2)"}}>👤</div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{color:"var(--text-primary)"}}>AI Humanizer</h1>
                                <p className="text-sm" style={{color:"var(--text-secondary)"}}>Transform robotic AI text into natural, human-like writing</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{background:"rgba(34,197,94,0.15)",color:"#22c55e",border:"1px solid rgba(34,197,94,0.2)"}}>AI Tool</span>
                        </div>
                        <div className="p-3 rounded-xl text-xs" style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e"}}>🔒 100% Private — All processing happens locally. No data is sent to AI servers.</div>
                    </motion.div>

                    {/* Intensity Slider */}
                    <div className="mb-8 p-6 rounded-2xl border border-white/5 bg-white/5">
                        <div className="flex justify-between mb-4">
                            <label className="text-xs font-black uppercase tracking-widest" style={{color:"var(--text-secondary)"}}>Humanization Intensity</label>
                            <span className="text-xs font-bold text-green-400">{intensity}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={intensity} 
                            onChange={(e)=>setIntensity(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                        <div className="flex justify-between mt-2 text-[10px] uppercase font-bold opacity-40">
                            <span>Balanced</span>
                            <span>Natural</span>
                            <span>Full Human</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{color:"var(--text-secondary)"}}>AI Generated Content</label>
                            <textarea 
                                value={input} 
                                onChange={e=>setInput(e.target.value)} 
                                placeholder="Paste your ChatGPT/Claude generated text here..." 
                                rows={12} 
                                className="w-full p-4 rounded-xl text-sm resize-none outline-none transition-all" 
                                style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--text-primary)"}}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{color:"#22c55e"}}>Humanized Version</label>
                            <div className="w-full p-4 rounded-xl text-sm min-h-[288px] whitespace-pre-wrap transition-all" style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.12)",color:"var(--text-primary)",lineHeight:"1.8"}}>
                                {output || <span style={{color:"#555"}}>Humanized text will appear here...</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-8">
                        <button 
                            onClick={humanizeText} 
                            disabled={!input.trim()||loading} 
                            className="flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all" 
                            style={{background:input.trim()?"linear-gradient(135deg,#22c55e,#10b981)":"rgba(255,255,255,0.05)",color:input.trim()?"#000":"#666",opacity:loading?0.6:1}}
                        >
                            {loading?"⏳ Humanizing Content...":"👤 Humanize AI Text"}
                        </button>
                        {output && (
                            <button onClick={()=>navigator.clipboard.writeText(output)} className="px-6 py-4 rounded-xl text-xs font-bold transition-all" style={{background:"rgba(34,197,94,0.15)",color:"#22c55e",border:"1px solid rgba(34,197,94,0.2)"}}>
                                📋 Copy
                            </button>
                        )}
                        <button onClick={()=>{setInput("");setOutput("")}} className="px-6 py-4 rounded-xl text-sm font-bold" style={{background:"rgba(255,255,255,0.05)",color:"var(--text-secondary)",border:"1px solid rgba(255,255,255,0.08)"}}>
                            ✕ Clear
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {icon:"🛡️",title:"Bypass Detection",desc:"Avoid AI detection from tools like GPTZero and Originality.ai"},
                            {icon:"✍️",title:"Natural Flow",desc:"Improves readability and sentence structure for human readers"},
                            {icon:"🔒",title:"Safe & Secure",desc:"No external API calls — your data stays in your browser"}
                        ].map(f=>(
                            <div key={f.title} className="p-5 rounded-2xl text-center transition-all hover:bg-white/5 border border-white/5 bg-white/2" style={{background:"rgba(255,255,255,0.02)"}}>
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <div className="text-xs font-black uppercase tracking-tight mb-2" style={{color:"var(--text-primary)"}}>{f.title}</div>
                                <div className="text-[10px] leading-relaxed" style={{color:"var(--text-secondary)"}}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
