"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function TextSummarizerPage() {
    const [input, setInput] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"short"|"medium"|"bullet">("medium");

    const summarize = () => {
        if (!input.trim()) return;
        setLoading(true);
        setTimeout(() => {
            const sentences = input.replace(/([.!?])\s+/g,"$1|").split("|").filter(s=>s.trim().length>10);
            let result = "";
            if (mode==="short") {
                result = sentences.sort((a,b)=>b.length-a.length).slice(0,Math.min(2,sentences.length)).join(" ");
            } else if (mode==="medium") {
                const count = Math.max(2,Math.ceil(sentences.length*0.4));
                const ranked = sentences.map((s,i)=>({s,idx:i,score:s.length+(i===0?100:0)+(i===sentences.length-1?50:0)})).sort((a,b)=>b.score-a.score).slice(0,count).sort((a,b)=>a.idx-b.idx);
                result = ranked.map(r=>r.s).join(" ");
            } else {
                const count = Math.max(3,Math.ceil(sentences.length*0.5));
                const ranked = sentences.map((s,i)=>({s,idx:i,score:s.length+(i===0?100:0)})).sort((a,b)=>b.score-a.score).slice(0,count).sort((a,b)=>a.idx-b.idx);
                result = ranked.map(r=>`• ${r.s.trim()}`).join("\n");
            }
            setSummary(result);
            setLoading(false);
        }, 800);
    };

    const reduction = input.length>0 && summary.length>0 ? Math.round((1-summary.length/input.length)*100) : 0;

    return (
        <div className="min-h-screen flex flex-col" style={{background:"var(--bg-primary)"}}>
            <Navbar/><Sidebar/>
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{marginLeft:"var(--sidebar-w, 68px)"}}>
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:"rgba(168,85,247,0.15)",border:"1px solid rgba(168,85,247,0.2)"}}>📝</div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{color:"var(--text-primary)"}}>Text Summarizer</h1>
                                <p className="text-sm" style={{color:"var(--text-secondary)"}}>Summarize long articles and documents instantly</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{background:"rgba(168,85,247,0.15)",color:"#a855f7",border:"1px solid rgba(168,85,247,0.2)"}}>AI Tool</span>
                        </div>
                        <div className="p-3 rounded-xl text-xs" style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e"}}>🔒 100% Private — All processing happens locally in your browser.</div>
                    </motion.div>

                    <div className="flex gap-2 mb-6">
                        {([{id:"short",label:"🎯 Short",desc:"2-3 sentences"},{id:"medium",label:"📄 Medium",desc:"~40% of original"},{id:"bullet",label:"📋 Bullet Points",desc:"Key points"}] as const).map(m=>(
                            <button key={m.id} onClick={()=>setMode(m.id)} className="flex-1 p-3 rounded-xl text-left transition-all" style={{background:mode===m.id?"rgba(168,85,247,0.12)":"rgba(255,255,255,0.03)",border:`1px solid ${mode===m.id?"rgba(168,85,247,0.3)":"rgba(255,255,255,0.06)"}`,color:mode===m.id?"#a855f7":"var(--text-secondary)"}}>
                                <div className="text-sm font-bold">{m.label}</div>
                                <div className="text-[10px] opacity-60">{m.desc}</div>
                            </button>
                        ))}
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold uppercase tracking-widest" style={{color:"var(--text-secondary)"}}>Paste your text</label>
                            <span className="text-xs" style={{color:"var(--text-secondary)"}}>{input.length} chars</span>
                        </div>
                        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste a long article, essay, or document here..." rows={10} className="w-full p-4 rounded-xl text-sm resize-none outline-none" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--text-primary)"}}/>
                    </div>

                    <div className="flex gap-3 mb-8">
                        <button onClick={summarize} disabled={!input.trim()||loading} className="flex-1 py-3 rounded-xl text-sm font-bold transition-all" style={{background:input.trim()?"linear-gradient(135deg,#a855f7,#6366f1)":"rgba(255,255,255,0.05)",color:input.trim()?"#fff":"#666",opacity:loading?0.6:1}}>
                            {loading?"⏳ Summarizing...":"✨ Summarize Text"}
                        </button>
                        <button onClick={()=>{setInput("");setSummary("")}} className="px-6 py-3 rounded-xl text-sm font-bold" style={{background:"rgba(255,255,255,0.05)",color:"var(--text-secondary)",border:"1px solid rgba(255,255,255,0.08)"}}>✕ Clear</button>
                    </div>

                    {summary && (
                        <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
                            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl" style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.12)"}}>
                                <span className="text-xs" style={{color:"var(--text-secondary)"}}>📊 Original: <b style={{color:"var(--text-primary)"}}>{input.length}</b> chars</span>
                                <span className="text-xs" style={{color:"var(--text-secondary)"}}>📝 Summary: <b style={{color:"var(--text-primary)"}}>{summary.length}</b> chars</span>
                                <span className="text-xs font-bold ml-auto" style={{color:"#22c55e"}}>🔻 {reduction}% reduction</span>
                            </div>
                            <div className="p-4 rounded-xl text-sm whitespace-pre-wrap mb-4" style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",color:"var(--text-primary)",lineHeight:"1.8"}}>{summary}</div>
                            <div className="flex gap-2">
                                <button onClick={()=>navigator.clipboard.writeText(summary)} className="px-5 py-2.5 rounded-xl text-xs font-bold" style={{background:"rgba(168,85,247,0.15)",color:"#a855f7",border:"1px solid rgba(168,85,247,0.2)"}}>📋 Copy</button>
                                <button onClick={()=>{const b=new Blob([summary],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="summary.txt";a.click();URL.revokeObjectURL(u)}} className="px-5 py-2.5 rounded-xl text-xs font-bold" style={{background:"rgba(255,255,255,0.05)",color:"var(--text-secondary)",border:"1px solid rgba(255,255,255,0.08)"}}>⬇️ Download</button>
                            </div>
                        </motion.div>
                    )}

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{icon:"⚡",title:"Instant Results",desc:"Get summaries in under a second"},{icon:"🎯",title:"Multiple Modes",desc:"Short, medium, or bullet-point summaries"},{icon:"🔒",title:"100% Private",desc:"Your text never leaves your browser"}].map(f=>(
                            <div key={f.title} className="p-4 rounded-xl text-center" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                                <div className="text-2xl mb-2">{f.icon}</div>
                                <div className="text-xs font-bold mb-1" style={{color:"var(--text-primary)"}}>{f.title}</div>
                                <div className="text-[10px]" style={{color:"var(--text-secondary)"}}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
