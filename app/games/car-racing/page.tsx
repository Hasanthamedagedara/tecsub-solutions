"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const W=400, H=600, CAR_W=40, CAR_H=60, LANE_W=80, LANES=3;
const LANE_X = (i:number) => (W/2) + (i-1)*LANE_W;

export default function CarRacingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const stateRef = useRef({lane:1,obstacles:[] as {x:number;y:number;lane:number;color:string}[],speed:4,frame:0,roadOffset:0,alive:true});

    const spawnObstacle = useCallback(() => {
        const s = stateRef.current;
        const lane = Math.floor(Math.random()*LANES);
        const colors = ["#ef4444","#3b82f6","#eab308","#22c55e","#a855f7"];
        s.obstacles.push({x:LANE_X(lane),y:-CAR_H,lane,color:colors[Math.floor(Math.random()*colors.length)]});
    },[]);

    useEffect(() => {
        if(!started||gameOver) return;
        const canvas = canvasRef.current; if(!canvas) return;
        const ctx = canvas.getContext("2d"); if(!ctx) return;
        const s = stateRef.current;

        const loop = () => {
            if(!s.alive) return;
            s.frame++; s.roadOffset = (s.roadOffset+s.speed)%40;
            if(s.frame%40===0) spawnObstacle();
            if(s.frame%200===0) s.speed = Math.min(s.speed+0.5, 12);

            // Update obstacles
            s.obstacles = s.obstacles.filter(o => {
                o.y += s.speed;
                if(o.y > H+CAR_H) { setScore(sc=>sc+10); return false; }
                // Collision check
                const px = LANE_X(s.lane), py = H-100;
                if(Math.abs(o.x-px)<CAR_W && Math.abs(o.y-py)<CAR_H) {
                    s.alive=false; setGameOver(true); return true;
                }
                return true;
            });

            // Draw
            ctx.fillStyle="#333"; ctx.fillRect(0,0,W,H);
            // Road
            ctx.fillStyle="#555"; ctx.fillRect(W/2-LANE_W*1.5-10,0,LANE_W*3+20,H);
            // Lane markings
            ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.setLineDash([20,20]);
            for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(W/2+(i-0.5)*LANE_W,s.roadOffset-40);for(let y=s.roadOffset-40;y<H;y+=40){ctx.lineTo(W/2+(i-0.5)*LANE_W,y);}ctx.stroke();}
            ctx.setLineDash([]);
            // Road edges
            ctx.fillStyle="#ff0";ctx.fillRect(W/2-LANE_W*1.5-12,0,4,H);ctx.fillRect(W/2+LANE_W*1.5+8,0,4,H);
            // Player car
            const px = LANE_X(s.lane), py = H-100;
            ctx.fillStyle="#00E5FF"; ctx.beginPath(); ctx.roundRect(px-CAR_W/2,py-CAR_H/2,CAR_W,CAR_H,8); ctx.fill();
            ctx.fillStyle="#006"; ctx.fillRect(px-15,py-15,30,20); // windshield
            ctx.fillStyle="#fff"; ctx.fillRect(px-18,py+15,8,8); ctx.fillRect(px+10,py+15,8,8); // headlights
            // Obstacles
            s.obstacles.forEach(o => {
                ctx.fillStyle=o.color; ctx.beginPath(); ctx.roundRect(o.x-CAR_W/2,o.y-CAR_H/2,CAR_W,CAR_H,8); ctx.fill();
                ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(o.x-15,o.y-15,30,20);
                ctx.fillStyle="#faa"; ctx.fillRect(o.x-16,o.y-25,8,6); ctx.fillRect(o.x+8,o.y-25,8,6);
            });
            // Score
            ctx.fillStyle="#fff"; ctx.font="bold 14px monospace"; ctx.fillText(`Score: ${s.frame}`,10,25);
            ctx.fillText(`Speed: ${s.speed.toFixed(1)}x`,10,45);

            if(s.alive) requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },[started,gameOver,spawnObstacle]);

    useEffect(()=>{
        const h=(e:KeyboardEvent)=>{
            const s=stateRef.current;
            if(e.key==="ArrowLeft"&&s.lane>0) s.lane--;
            if(e.key==="ArrowRight"&&s.lane<LANES-1) s.lane++;
        };
        window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
    },[]);

    const restart=()=>{stateRef.current={lane:1,obstacles:[],speed:4,frame:0,roadOffset:0,alive:true};setScore(0);setGameOver(false);setStarted(true);};

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar/>
            <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2 gradient-text uppercase">🏎️ Mini Car Racing</h1>
                <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-8">Dodge traffic · Score: {score}</p>
                <div className="rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
                    <canvas ref={canvasRef} width={W} height={H} style={{width:300,height:450}} className="bg-[#333]"/>
                    {!started&&!gameOver&&(
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-3xl font-black mb-4">🏎️ Ready?</h2>
                            <button onClick={restart} className="px-8 py-3 bg-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Start Race</button>
                        </div>
                    )}
                    {gameOver&&(
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-3xl font-black text-red-400 mb-4">💥 Crashed!</h2>
                            <p className="text-lg mb-6">Score: {stateRef.current.frame}</p>
                            <button onClick={restart} className="px-8 py-3 bg-red-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Try Again</button>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 mt-6 sm:hidden">
                    <button onClick={()=>{const s=stateRef.current;if(s.lane>0)s.lane--;}} className="w-16 h-16 bg-white/10 rounded-2xl text-2xl font-black">←</button>
                    <button onClick={()=>{const s=stateRef.current;if(s.lane<LANES-1)s.lane++;}} className="w-16 h-16 bg-white/10 rounded-2xl text-2xl font-black">→</button>
                </div>
                <p className="mt-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">← → Arrow keys to switch lanes</p>
            </main>
            <Footer/>
        </div>
    );
}
