"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const W=400, H=500, PLAYER_W=30, PLAYER_H=40, GROUND=H-60;

export default function SubwayRunPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const stateRef = useRef({
        x:W/2, y:GROUND, vy:0, lane:1, jumping:false, ducking:false,
        obstacles:[] as {x:number;y:number;w:number;h:number;type:string}[],
        coins:[] as {x:number;y:number;collected:boolean}[],
        speed:5, frame:0, scrollX:0, alive:true, coinCount:0
    });

    const spawnObstacle = useCallback(()=>{
        const s=stateRef.current;
        const types = ["barrier","train","cone"];
        const type = types[Math.floor(Math.random()*types.length)];
        const laneX = [W/2-80, W/2, W/2+80][Math.floor(Math.random()*3)];
        let w=30,h=40;
        if(type==="train"){w=35;h=80;}else if(type==="cone"){w=20;h=25;}
        s.obstacles.push({x:laneX,y:GROUND-h,w,h,type});
        // Spawn coins
        if(Math.random()>0.5){
            for(let i=0;i<3;i++) s.coins.push({x:laneX+(i-1)*20,y:GROUND-100-i*25,collected:false});
        }
    },[]);

    useEffect(()=>{
        if(!started||gameOver) return;
        const canvas=canvasRef.current; if(!canvas) return;
        const ctx=canvas.getContext("2d"); if(!ctx) return;
        const s=stateRef.current;

        const loop=()=>{
            if(!s.alive) return;
            s.frame++; s.scrollX=(s.scrollX+s.speed)%60;
            if(s.frame%50===0) spawnObstacle();
            if(s.frame%300===0) s.speed=Math.min(s.speed+0.5,14);

            // Jump physics
            if(s.jumping){s.vy+=0.8;s.y+=s.vy;if(s.y>=GROUND){s.y=GROUND;s.jumping=false;s.vy=0;}}

            // Move obstacles toward player
            s.obstacles=s.obstacles.filter(o=>{
                o.x-=0; o.y+=s.speed*0.3;// scroll effect
                // Collision
                const px=W/2,py=s.y,pw=PLAYER_W,ph=s.ducking?PLAYER_H/2:PLAYER_H;
                const playerTop=py-ph;
                if(o.x+o.w/2>px-pw/2&&o.x-o.w/2<px+pw/2&&o.y+o.h>playerTop&&o.y<py){
                    if(!(s.ducking&&o.type==="barrier"&&o.h<50)){
                        s.alive=false;setGameOver(true);
                    }
                }
                return o.y<H+50;
            });
            s.coins=s.coins.filter(c=>{
                c.y+=s.speed*0.3;
                if(!c.collected){
                    const dist=Math.hypot(c.x-W/2,(c.y)-(s.y-PLAYER_H/2));
                    if(dist<25){c.collected=true;s.coinCount++;setScore(sc=>sc+50);}
                }
                return c.y<H+20&&!c.collected;
            });

            // Draw
            // Sky
            ctx.fillStyle="#1a1a2e"; ctx.fillRect(0,0,W,H);
            // Track
            ctx.fillStyle="#2a2a3e"; ctx.fillRect(W/2-130,0,260,H);
            // Lane lines
            ctx.strokeStyle="#444";ctx.lineWidth=2;ctx.setLineDash([15,15]);
            for(let i=-1;i<=1;i+=2){ctx.beginPath();for(let y=-s.scrollX;y<H;y+=30){ctx.moveTo(W/2+i*50,y);ctx.lineTo(W/2+i*50,y+15);}ctx.stroke();}
            ctx.setLineDash([]);
            // Rails
            ctx.fillStyle="#666";ctx.fillRect(W/2-125,0,4,H);ctx.fillRect(W/2+121,0,4,H);
            // Railroad ties
            for(let y=-s.scrollX;y<H;y+=30){ctx.fillStyle="#554";ctx.fillRect(W/2-130,y,260,4);}
            // Obstacles
            s.obstacles.forEach(o=>{
                if(o.type==="train"){ctx.fillStyle="#ef4444";ctx.fillRect(o.x-o.w/2,o.y,o.w,o.h);ctx.fillStyle="#b91c1c";ctx.fillRect(o.x-o.w/2+5,o.y+5,o.w-10,15);ctx.fillStyle="#fbbf24";ctx.fillRect(o.x-5,o.y,10,5);}
                else if(o.type==="barrier"){ctx.fillStyle="#f59e0b";ctx.fillRect(o.x-o.w/2,o.y,o.w,o.h);ctx.fillStyle="#000";ctx.fillRect(o.x-o.w/2,o.y+o.h/3,o.w,5);}
                else{ctx.fillStyle="#f97316";ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x-o.w/2,o.y+o.h);ctx.lineTo(o.x+o.w/2,o.y+o.h);ctx.fill();}
            });
            // Coins
            s.coins.forEach(c=>{
                if(c.collected) return;
                ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(c.x,c.y,8,0,Math.PI*2);ctx.fill();
                ctx.fillStyle="#f59e0b";ctx.font="bold 10px sans-serif";ctx.fillText("$",c.x-4,c.y+4);
            });
            // Player
            const py=s.y,ph=s.ducking?PLAYER_H/2:PLAYER_H;
            ctx.fillStyle="#00E5FF";ctx.beginPath();ctx.roundRect(W/2-PLAYER_W/2,py-ph,PLAYER_W,ph,6);ctx.fill();
            // Head
            ctx.fillStyle="#00BCD4";ctx.beginPath();ctx.arc(W/2,py-ph-8,10,0,Math.PI*2);ctx.fill();
            // Eyes
            ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(W/2+3,py-ph-10,3,0,Math.PI*2);ctx.fill();
            ctx.fillStyle="#000";ctx.beginPath();ctx.arc(W/2+4,py-ph-10,1.5,0,Math.PI*2);ctx.fill();
            // HUD
            ctx.fillStyle="#fff";ctx.font="bold 14px monospace";
            ctx.fillText(`Score: ${s.frame+s.coinCount*50}`,10,25);
            ctx.fillText(`🪙 ${s.coinCount}`,10,45);
            ctx.fillText(`Speed: ${s.speed.toFixed(1)}x`,W-120,25);

            if(s.alive) requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },[started,gameOver,spawnObstacle]);

    useEffect(()=>{
        const h=(e:KeyboardEvent)=>{
            const s=stateRef.current;
            if((e.key==="ArrowUp"||e.key===" ")&&!s.jumping){s.jumping=true;s.vy=-14;}
            if(e.key==="ArrowDown"){s.ducking=true;}
        };
        const u=(e:KeyboardEvent)=>{if(e.key==="ArrowDown")stateRef.current.ducking=false;};
        window.addEventListener("keydown",h);window.addEventListener("keyup",u);
        return()=>{window.removeEventListener("keydown",h);window.removeEventListener("keyup",u);};
    },[]);

    const restart=()=>{
        stateRef.current={x:W/2,y:GROUND,vy:0,lane:1,jumping:false,ducking:false,obstacles:[],coins:[],speed:5,frame:0,scrollX:0,alive:true,coinCount:0};
        setScore(0);setGameOver(false);setStarted(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar/>
            <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2 gradient-text uppercase">🏃 Subway Runner</h1>
                <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-8">Run · Jump · Dodge · Score: {score}</p>
                <div className="rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
                    <canvas ref={canvasRef} width={W} height={H} style={{width:300,height:375}}/>
                    {!started&&!gameOver&&(
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-3xl font-black mb-4">🏃 Ready to Run?</h2>
                            <button onClick={restart} className="px-8 py-3 bg-green-500 text-black rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Start Running</button>
                        </div>
                    )}
                    {gameOver&&(
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-3xl font-black text-red-400 mb-4">💀 Caught!</h2>
                            <p className="text-lg mb-2">Score: {stateRef.current.frame+stateRef.current.coinCount*50}</p>
                            <p className="text-sm mb-6 text-yellow-400">🪙 {stateRef.current.coinCount} coins</p>
                            <button onClick={restart} className="px-8 py-3 bg-green-500 text-black rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Run Again</button>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 mt-6 sm:hidden">
                    <button onTouchStart={()=>{const s=stateRef.current;if(!s.jumping){s.jumping=true;s.vy=-14;}}} className="w-16 h-16 bg-white/10 rounded-2xl text-2xl">⬆️</button>
                    <button onTouchStart={()=>{stateRef.current.ducking=true;}} onTouchEnd={()=>{stateRef.current.ducking=false;}} className="w-16 h-16 bg-white/10 rounded-2xl text-2xl">⬇️</button>
                </div>
                <p className="mt-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">↑ Jump · ↓ Duck · Space to jump</p>
            </main>
            <Footer/>
        </div>
    );
}
