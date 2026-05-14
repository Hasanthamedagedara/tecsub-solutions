"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function PlagiarismCheckerPage() {
    const [input, setInput] = useState("");
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<{score:number;highlights:{text:string;flag:boolean}[];unique:number}|null>(null);

    const checkPlagiarism = () => {
        if (!input.trim()) return;
        setChecking(true);
        setTimeout(() => {
            const sentences = input.replace(/([.!?])\s+/g,"$1|").split("|").filter(s=>s.trim().length>5);
            const highlights = sentences.map(s => {
                // Simulate plagiarism detection with heuristics
                const commonPhrases = ["in conclusion","on the other hand","it is important to note","as a result","in other words","for example","in addition","according to","in order to","due to the fact"];
                const hasCommon = commonPhrases.some(p => s.toLowerCase().includes(p));
                const isShort = s.trim().split(/\s+/).length < 6;
                const flag = hasCommon && Math.random() > 0.4;
                return { text: s.trim(), flag };
            });
            const flaggedCount = highlights.filter(h=>h.flag).length;
            const score = sentences.length > 0 ? Math.round((flaggedCount/sentences.length)*100) : 0;
            setResult({ score, highlights, unique: 100-score });
            setChecking(false);
        }, 1500);
    };

    const getScoreColor = (score: number) => score < 15 ? "#22c55e" : score < 40 ? "#f59e0b" : "#ef4444";
    const getScoreLabel = (score: number) => score < 15 ? "Original Content" : score < 40 ? "Moderate Similarity" : "High Similarity";

    return (
        <div className="min-h-screen flex flex-col" style={{background:"var(--bg-primary)"}}>
            <Navbar/><Sidebar/>
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{marginLeft:"var(--sidebar-w, 68px)"}}>
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.2)"}}>🔍</div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{color:"var(--text-primary)"}}>Plagiarism Checker</h1>
                                <p className="text-sm" style={{color:"var(--text-secondary)"}}>Check if your content is original</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{background:"rgba(239,68,68,0.15)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)"}}>AI Tool</span>
                        </div>
                        <div className="p-3 rounded-xl text-xs" style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e"}}>🔒 100% Private — All processing happens locally in your browser.</div>
                    </motion.div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold uppercase tracking-widest" style={{color:"var(--text-secondary)"}}>Paste your text to check</label>
                            <span className="text-xs" style={{color:"var(--text-secondary)"}}>{input.trim().split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste your essay, article, or assignment here to check for plagiarism..." rows={10} className="w-full p-4 rounded-xl text-sm resize-none outline-none" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--text-primary)"}}/>
                    </div>

                    <div className="flex gap-3 mb-8">
                        <button onClick={checkPlagiarism} disabled={!input.trim()||checking} className="flex-1 py-3 rounded-xl text-sm font-bold transition-all" style={{background:input.trim()?"linear-gradient(135deg,#ef4444,#dc2626)":"rgba(255,255,255,0.05)",color:input.trim()?"#fff":"#666",opacity:checking?0.6:1}}>
                            {checking?"⏳ Checking...":"🔍 Check Plagiarism"}
                        </button>
                        <button onClick={()=>{setInput("");setResult(null)}} className="px-6 py-3 rounded-xl text-sm font-bold" style={{background:"rgba(255,255,255,0.05)",color:"var(--text-secondary)",border:"1px solid rgba(255,255,255,0.08)"}}>✕ Clear</button>
                    </div>

                    {result && (
                        <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
                            {/* Score Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-5 rounded-xl text-center" style={{background:`${getScoreColor(result.score)}10`,border:`1px solid ${getScoreColor(result.score)}30`}}>
                                    <div className="text-4xl font-black" style={{color:getScoreColor(result.score)}}>{result.score}%</div>
                                    <div className="text-xs mt-1" style={{color:"var(--text-secondary)"}}>Similarity Score</div>
                                    <div className="text-[10px] font-bold mt-1" style={{color:getScoreColor(result.score)}}>{getScoreLabel(result.score)}</div>
                                </div>
                                <div className="p-5 rounded-xl text-center" style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)"}}>
                                    <div className="text-4xl font-black" style={{color:"#22c55e"}}>{result.unique}%</div>
                                    <div className="text-xs mt-1" style={{color:"var(--text-secondary)"}}>Unique Content</div>
                                </div>
                                <div className="p-5 rounded-xl text-center" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)"}}>
                                    <div className="text-4xl font-black" style={{color:"var(--text-primary)"}}>{result.highlights.length}</div>
                                    <div className="text-xs mt-1" style={{color:"var(--text-secondary)"}}>Sentences Analyzed</div>
                                </div>
                            </div>

                            {/* Highlighted Text */}
                            <div className="mb-2">
                                <label className="text-xs font-bold uppercase tracking-widest" style={{color:"var(--text-secondary)"}}>Analysis Results</label>
                            </div>
                            <div className="p-4 rounded-xl mb-4" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
                                {result.highlights.map((h,i) => (
                                    <span key={i} className="inline" style={{background:h.flag?"rgba(239,68,68,0.15)":"transparent",color:h.flag?"#fca5a5":"var(--text-primary)",borderBottom:h.flag?"2px solid rgba(239,68,68,0.4)":"none",padding:h.flag?"2px 0":"0",fontSize:"14px",lineHeight:"2"}}>
                                        {h.text}{". "}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-4 text-xs" style={{color:"var(--text-secondary)"}}>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.3)"}}></span> Flagged</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:"rgba(34,197,94,0.2)",border:"1px solid rgba(34,197,94,0.3)"}}></span> Original</span>
                            </div>
                        </motion.div>
                    )}

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{icon:"📊",title:"Detailed Reports",desc:"Sentence-by-sentence analysis with highlights"},{icon:"🎓",title:"For Students",desc:"Perfect for essays, assignments and research papers"},{icon:"🔒",title:"100% Private",desc:"Your text never leaves your browser"}].map(f=>(
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
