"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MEDIA_ICONS = ["🎬","🎵","📷","🎮","📺","🎧","📱","🎤","💿","🖥️","📻","🎸"];

function shuffleArray<T>(arr:T[]):T[] {
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
}

function createCards(pairs:number):{id:number;icon:string;flipped:boolean;matched:boolean}[] {
    const icons=MEDIA_ICONS.slice(0,pairs);
    const cards=[...icons,...icons].map((icon,i)=>({id:i,icon,flipped:false,matched:false}));
    return shuffleArray(cards);
}

export default function MediaMatchPage() {
    const [difficulty,setDifficulty]=useState<4|6|8>(4);
    const [cards,setCards]=useState(createCards(4));
    const [flippedIds,setFlippedIds]=useState<number[]>([]);
    const [moves,setMoves]=useState(0);
    const [score,setScore]=useState(0);
    const [gameWon,setGameWon]=useState(false);
    const [started,setStarted]=useState(false);

    const startGame=useCallback((pairs:4|6|8)=>{
        setDifficulty(pairs);setCards(createCards(pairs));setFlippedIds([]);setMoves(0);setScore(0);setGameWon(false);setStarted(true);
    },[]);

    const handleFlip=(id:number)=>{
        if(flippedIds.length>=2) return;
        const card=cards.find(c=>c.id===id);
        if(!card||card.flipped||card.matched) return;

        const newCards=cards.map(c=>c.id===id?{...c,flipped:true}:c);
        setCards(newCards);
        const newFlipped=[...flippedIds,id];
        setFlippedIds(newFlipped);

        if(newFlipped.length===2){
            setMoves(m=>m+1);
            const [first,second]=newFlipped.map(fid=>newCards.find(c=>c.id===fid)!);
            if(first.icon===second.icon){
                setTimeout(()=>{
                    setCards(prev=>prev.map(c=>(c.id===first.id||c.id===second.id)?{...c,matched:true}:c));
                    setScore(s=>s+100);
                    setFlippedIds([]);
                    // Check win
                    const allMatched=newCards.filter(c=>!c.matched&&c.id!==first.id&&c.id!==second.id).length===0;
                    if(allMatched) setTimeout(()=>setGameWon(true),500);
                },500);
            } else {
                setTimeout(()=>{
                    setCards(prev=>prev.map(c=>(c.id===first.id||c.id===second.id)?{...c,flipped:false}:c));
                    setFlippedIds([]);
                },800);
            }
        }
    };

    const cols = difficulty===4?4:difficulty===6?4:4;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar/>
            <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2 gradient-text uppercase">🎴 Media Match</h1>
                <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-8">Memory Card Game · Moves: {moves} · Score: {score}</p>

                {!started ? (
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-black">Select Difficulty</h2>
                        <div className="flex gap-4">
                            {([{p:4 as const,label:"Easy",desc:"4 pairs",color:"#22c55e"},{p:6 as const,label:"Medium",desc:"6 pairs",color:"#eab308"},{p:8 as const,label:"Hard",desc:"8 pairs",color:"#ef4444"}]).map(d=>(
                                <button key={d.p} onClick={()=>startGame(d.p)} className="p-6 rounded-2xl border transition-all hover:scale-105" style={{background:`${d.color}10`,borderColor:`${d.color}30`}}>
                                    <div className="text-lg font-black" style={{color:d.color}}>{d.label}</div>
                                    <div className="text-xs text-gray-500">{d.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={`grid gap-3 mb-8`} style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
                            {cards.map(card=>(
                                <motion.button
                                    key={card.id}
                                    onClick={()=>handleFlip(card.id)}
                                    whileTap={{scale:0.95}}
                                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 flex items-center justify-center text-2xl sm:text-3xl transition-all relative"
                                    style={{
                                        background:card.matched?"rgba(34,197,94,0.15)":card.flipped?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.03)",
                                        borderColor:card.matched?"rgba(34,197,94,0.3)":card.flipped?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.08)",
                                        transform:card.flipped||card.matched?"rotateY(0deg)":"rotateY(0deg)",
                                    }}
                                >
                                    {(card.flipped||card.matched)?card.icon:"❓"}
                                    {card.matched&&<div className="absolute inset-0 rounded-xl" style={{background:"rgba(34,197,94,0.1)"}}/>}
                                </motion.button>
                            ))}
                        </div>
                        <button onClick={()=>startGame(difficulty)} className="px-6 py-2 rounded-xl text-xs font-bold" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"var(--text-secondary)"}}>🔄 Restart</button>
                    </>
                )}

                <AnimatePresence>
                    {gameWon&&(
                        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="p-8 rounded-3xl text-center" style={{background:"rgba(10,10,11,0.95)",border:"1px solid rgba(34,197,94,0.3)"}}>
                                <div className="text-5xl mb-4">🎉</div>
                                <h2 className="text-2xl font-black text-green-400 mb-2">You Win!</h2>
                                <p className="text-sm text-gray-400 mb-1">Score: {score}</p>
                                <p className="text-sm text-gray-400 mb-6">Moves: {moves}</p>
                                <div className="flex gap-3">
                                    <button onClick={()=>startGame(difficulty)} className="px-6 py-3 bg-green-500 text-black rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Play Again</button>
                                    <button onClick={()=>setStarted(false)} className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest" style={{background:"rgba(255,255,255,0.1)",color:"#fff"}}>Menu</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer/>
        </div>
    );
}
