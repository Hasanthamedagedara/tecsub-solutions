"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const synonymMap: Record<string, string[]> = {
    "good":"great,excellent,fine,superb,wonderful".split(","),
    "bad":"poor,terrible,awful,dreadful,unpleasant".split(","),
    "big":"large,huge,enormous,massive,vast".split(","),
    "small":"tiny,little,miniature,compact,petite".split(","),
    "happy":"joyful,cheerful,delighted,pleased,content".split(","),
    "sad":"unhappy,sorrowful,gloomy,melancholy,downcast".split(","),
    "important":"crucial,vital,essential,significant,critical".split(","),
    "use":"utilize,employ,apply,implement,leverage".split(","),
    "make":"create,produce,build,construct,develop".split(","),
    "show":"demonstrate,illustrate,display,reveal,exhibit".split(","),
    "help":"assist,support,aid,facilitate,contribute".split(","),
    "get":"obtain,acquire,receive,gain,secure".split(","),
    "give":"provide,offer,supply,deliver,present".split(","),
    "think":"believe,consider,suppose,assume,reckon".split(","),
    "say":"state,mention,declare,express,assert".split(","),
    "very":"extremely,highly,remarkably,exceptionally,incredibly".split(","),
    "also":"additionally,furthermore,moreover,likewise,besides".split(","),
    "but":"however,nevertheless,yet,although,nonetheless".split(","),
    "because":"since,as,due to,owing to,given that".split(","),
    "start":"begin,commence,initiate,launch,embark".split(","),
    "end":"conclude,finish,terminate,complete,cease".split(","),
    "fast":"quick,rapid,swift,speedy,prompt".split(","),
    "slow":"gradual,unhurried,leisurely,sluggish,steady".split(","),
    "new":"novel,fresh,recent,modern,innovative".split(","),
    "old":"ancient,aged,vintage,former,previous".split(","),
};

export default function ParaphrasingToolPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [style, setStyle] = useState<"standard"|"formal"|"simple">("standard");

    const paraphrase = () => {
        if (!input.trim()) return;
        setLoading(true);
        setTimeout(() => {
            let result = input;
            const words = Object.keys(synonymMap);
            for (const word of words) {
                const syns = synonymMap[word];
                const replacement = style === "formal" ? syns[syns.length-1] : style === "simple" ? syns[0] : syns[Math.floor(Math.random()*syns.length)];
                const regex = new RegExp(`\\b${word}\\b`, "gi");
                result = result.replace(regex, replacement);
            }
            // Restructure some sentences
            result = result.replace(/\. However,/g, ", yet").replace(/\. Additionally,/g, ". Moreover,");
            setOutput(result);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{background:"var(--bg-primary)"}}>
            <Navbar/><Sidebar/>
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{marginLeft:"var(--sidebar-w, 68px)"}}>
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:"rgba(59,130,246,0.15)",border:"1px solid rgba(59,130,246,0.2)"}}>🔄</div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{color:"var(--text-primary)"}}>Paraphrasing Tool</h1>
                                <p className="text-sm" style={{color:"var(--text-secondary)"}}>Rewrite text without changing the meaning</p>
                            </div>
                            <span className="ml-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{background:"rgba(59,130,246,0.15)",color:"#3b82f6",border:"1px solid rgba(59,130,246,0.2)"}}>AI Tool</span>
                        </div>
                        <div className="p-3 rounded-xl text-xs" style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e"}}>🔒 100% Private — All processing happens locally in your browser.</div>
                    </motion.div>

                    <div className="flex gap-2 mb-6">
                        {([{id:"standard",label:"✍️ Standard",desc:"Natural rewrite"},{id:"formal",label:"🎩 Formal",desc:"Academic style"},{id:"simple",label:"💡 Simple",desc:"Easy to read"}] as const).map(m=>(
                            <button key={m.id} onClick={()=>setStyle(m.id)} className="flex-1 p-3 rounded-xl text-left transition-all" style={{background:style===m.id?"rgba(59,130,246,0.12)":"rgba(255,255,255,0.03)",border:`1px solid ${style===m.id?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.06)"}`,color:style===m.id?"#3b82f6":"var(--text-secondary)"}}>
                                <div className="text-sm font-bold">{m.label}</div>
                                <div className="text-[10px] opacity-60">{m.desc}</div>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{color:"var(--text-secondary)"}}>Original Text</label>
                            <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter or paste your text here..." rows={12} className="w-full p-4 rounded-xl text-sm resize-none outline-none" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"var(--text-primary)"}}/>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{color:"#3b82f6"}}>Paraphrased Text</label>
                            <div className="w-full p-4 rounded-xl text-sm min-h-[288px] whitespace-pre-wrap" style={{background:"rgba(59,130,246,0.04)",border:"1px solid rgba(59,130,246,0.12)",color:"var(--text-primary)",lineHeight:"1.8"}}>
                                {output || <span style={{color:"#555"}}>Paraphrased text will appear here...</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-8">
                        <button onClick={paraphrase} disabled={!input.trim()||loading} className="flex-1 py-3 rounded-xl text-sm font-bold transition-all" style={{background:input.trim()?"linear-gradient(135deg,#3b82f6,#6366f1)":"rgba(255,255,255,0.05)",color:input.trim()?"#fff":"#666",opacity:loading?0.6:1}}>
                            {loading?"⏳ Paraphrasing...":"🔄 Paraphrase Text"}
                        </button>
                        {output && <button onClick={()=>navigator.clipboard.writeText(output)} className="px-6 py-3 rounded-xl text-xs font-bold" style={{background:"rgba(59,130,246,0.15)",color:"#3b82f6",border:"1px solid rgba(59,130,246,0.2)"}}>📋 Copy</button>}
                        <button onClick={()=>{setInput("");setOutput("")}} className="px-6 py-3 rounded-xl text-sm font-bold" style={{background:"rgba(255,255,255,0.05)",color:"var(--text-secondary)",border:"1px solid rgba(255,255,255,0.08)"}}>✕ Clear</button>
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{icon:"✍️",title:"Smart Rewriting",desc:"Preserves meaning while changing words and structure"},{icon:"🎓",title:"Academic Ready",desc:"Perfect for research papers and assignments"},{icon:"🔒",title:"100% Private",desc:"Your text never leaves your browser"}].map(f=>(
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
