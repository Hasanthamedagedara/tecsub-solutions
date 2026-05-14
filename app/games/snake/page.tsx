"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10,10],[10,11],[10,12]];
const INITIAL_DIRECTION = [0,-1];
const SPEED = 150;

export default function SnakePage() {
    const [snake,setSnake]=useState(INITIAL_SNAKE);
    const [food,setFood]=useState([5,5]);
    const [direction,setDirection]=useState(INITIAL_DIRECTION);
    const [gameOver,setGameOver]=useState(false);
    const [score,setScore]=useState(0);
    const [isPaused,setIsPaused]=useState(true);

    const generateFood=useCallback(()=>{
        let nf;
        while(true){nf=[Math.floor(Math.random()*GRID_SIZE),Math.floor(Math.random()*GRID_SIZE)];if(!snake.some(s=>s[0]===nf![0]&&s[1]===nf![1]))break;}
        setFood(nf);
    },[snake]);

    const moveSnake=useCallback(()=>{
        if(gameOver||isPaused)return;
        const ns=[...snake];const head=[ns[0][0]+direction[0],ns[0][1]+direction[1]];
        if(head[0]<0||head[0]>=GRID_SIZE||head[1]<0||head[1]>=GRID_SIZE){setGameOver(true);return;}
        if(ns.some(s=>s[0]===head[0]&&s[1]===head[1])){setGameOver(true);return;}
        ns.unshift(head);
        if(head[0]===food[0]&&head[1]===food[1]){setScore(p=>p+10);generateFood();}else{ns.pop();}
        setSnake(ns);
    },[snake,direction,food,gameOver,isPaused,generateFood]);

    useEffect(()=>{const i=setInterval(moveSnake,SPEED);return()=>clearInterval(i);},[moveSnake]);

    useEffect(()=>{
        const h=(e:KeyboardEvent)=>{
            switch(e.key){case"ArrowUp":if(direction[1]!==1)setDirection([0,-1]);break;case"ArrowDown":if(direction[1]!==-1)setDirection([0,1]);break;case"ArrowLeft":if(direction[0]!==1)setDirection([-1,0]);break;case"ArrowRight":if(direction[0]!==-1)setDirection([1,0]);break;case" ":setIsPaused(p=>!p);break;}
        };window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
    },[direction]);

    const resetGame=()=>{setSnake(INITIAL_SNAKE);setDirection(INITIAL_DIRECTION);setGameOver(false);setScore(0);setIsPaused(false);generateFood();};

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar/>
            <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black italic tracking-tighter mb-2 gradient-text uppercase">🐍 Snake Classic</h1>
                    <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Nokia 3310 Edition</p>
                </div>
                <div className="relative p-8 bg-[#2a2a2a] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-4 border-[#3a3a3a]">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-white/20 tracking-widest uppercase">Tecsub 3310</div>
                    <div className="bg-[#8dad15] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-xl border-8 border-black p-1 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between px-2 py-1 text-black font-mono text-[10px] font-black uppercase border-b border-black/20">
                            <span>Score: {score}</span><span>{isPaused?"Paused":"Playing"}</span>
                        </div>
                        <div className="flex-1 relative">
                            <div className="grid w-full h-full" style={{gridTemplateColumns:`repeat(${GRID_SIZE},1fr)`}}>
                                {Array.from({length:GRID_SIZE*GRID_SIZE}).map((_,i)=>{
                                    const x=i%GRID_SIZE,y=Math.floor(i/GRID_SIZE);
                                    const isSnake=snake.some(s=>s[0]===x&&s[1]===y);
                                    const isFood=food[0]===x&&food[1]===y;
                                    const isHead=snake[0][0]===x&&snake[0][1]===y;
                                    return <div key={i} className="flex items-center justify-center p-[1px]"><div className={`w-full h-full rounded-[1px] transition-all ${isHead?"bg-black scale-110":isSnake?"bg-black/80":isFood?"bg-black animate-pulse scale-90 rounded-full":"opacity-5"}`}/></div>;
                                })}
                            </div>
                            <AnimatePresence>{gameOver&&(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-[#8dad15] flex flex-col items-center justify-center text-black z-20"><h2 className="text-3xl font-black italic mb-4 uppercase">Game Over</h2><p className="text-sm font-bold mb-6">Final Score: {score}</p><button onClick={resetGame} className="px-8 py-3 bg-black text-[#8dad15] rounded-lg font-black text-[10px] uppercase tracking-widest hover:scale-110 transition-transform">Restart</button></motion.div>)}</AnimatePresence>
                            {isPaused&&!gameOver&&(<div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]"><button onClick={()=>setIsPaused(false)} className="px-10 py-4 bg-black text-[#8dad15] rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl scale-110">Press Start</button></div>)}
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-2 sm:hidden">
                        <div/><button onClick={()=>setDirection([0,-1])} className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl">↑</button><div/>
                        <button onClick={()=>setDirection([-1,0])} className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl">←</button>
                        <button onClick={()=>setIsPaused(p=>!p)} className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-[8px] font-black">OK</button>
                        <button onClick={()=>setDirection([1,0])} className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl">→</button>
                        <div/><button onClick={()=>setDirection([0,1])} className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl">↓</button><div/>
                    </div>
                </div>
                <div className="mt-12 text-center text-gray-500"><p className="text-[10px] font-black uppercase tracking-widest">Arrow Keys to move · Space to pause</p></div>
            </main>
            <Footer/>
        </div>
    );
}
