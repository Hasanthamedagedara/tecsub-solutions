"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Bird { x:number;y:number;vx:number;vy:number;r:number;launched:boolean;color:string }
interface Block { x:number;y:number;w:number;h:number;hp:number;color:string }
interface Pig { x:number;y:number;r:number;alive:boolean }

const GRAVITY = 0.3;
const W = 800, H = 450;
const GROUND_Y = H - 40;

function createLevel(lvl:number):{blocks:Block[];pigs:Pig[]} {
    const blocks:Block[]=[];const pigs:Pig[]=[];
    if(lvl===1){
        blocks.push({x:550,y:GROUND_Y-60,w:20,h:60,hp:2,color:"#8B4513"},{x:610,y:GROUND_Y-60,w:20,h:60,hp:2,color:"#8B4513"},{x:545,y:GROUND_Y-80,w:90,h:15,hp:1,color:"#DEB887"});
        pigs.push({x:580,y:GROUND_Y-20,r:15,alive:true});
    } else if(lvl===2){
        blocks.push({x:500,y:GROUND_Y-60,w:20,h:60,hp:2,color:"#8B4513"},{x:560,y:GROUND_Y-60,w:20,h:60,hp:2,color:"#8B4513"},{x:620,y:GROUND_Y-60,w:20,h:60,hp:2,color:"#8B4513"},{x:495,y:GROUND_Y-80,w:150,h:15,hp:1,color:"#DEB887"},{x:530,y:GROUND_Y-120,w:20,h:40,hp:2,color:"#8B4513"},{x:590,y:GROUND_Y-120,w:20,h:40,hp:2,color:"#8B4513"},{x:525,y:GROUND_Y-135,w:90,h:12,hp:1,color:"#DEB887"});
        pigs.push({x:530,y:GROUND_Y-20,r:15,alive:true},{x:560,y:GROUND_Y-100,r:12,alive:true});
    } else {
        blocks.push({x:480,y:GROUND_Y-80,w:25,h:80,hp:3,color:"#696969"},{x:560,y:GROUND_Y-80,w:25,h:80,hp:3,color:"#696969"},{x:640,y:GROUND_Y-80,w:25,h:80,hp:3,color:"#696969"},{x:475,y:GROUND_Y-100,w:195,h:15,hp:2,color:"#A9A9A9"},{x:510,y:GROUND_Y-150,w:20,h:50,hp:2,color:"#8B4513"},{x:600,y:GROUND_Y-150,w:20,h:50,hp:2,color:"#8B4513"},{x:505,y:GROUND_Y-165,w:120,h:12,hp:1,color:"#DEB887"});
        pigs.push({x:520,y:GROUND_Y-20,r:15,alive:true},{x:600,y:GROUND_Y-20,r:15,alive:true},{x:560,y:GROUND_Y-120,r:12,alive:true});
    }
    return {blocks,pigs};
}

export default function AngryBirdsPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [level,setLevel] = useState(1);
    const [score,setScore] = useState(0);
    const [birdsLeft,setBirdsLeft] = useState(3);
    const [gameState,setGameState] = useState<"aiming"|"flying"|"won"|"lost">("aiming");
    const birdRef = useRef<Bird>({x:120,y:GROUND_Y-15,vx:0,vy:0,r:12,launched:false,color:"#ef4444"});
    const blocksRef = useRef<Block[]>([]);
    const pigsRef = useRef<Pig[]>([]);
    const aimRef = useRef({dragging:false,startX:120,startY:GROUND_Y-15,dx:0,dy:0});
    const animRef = useRef<number>(0);

    const initLevel = useCallback((lvl:number) => {
        const {blocks,pigs} = createLevel(lvl);
        blocksRef.current = blocks; pigsRef.current = pigs;
        birdRef.current = {x:120,y:GROUND_Y-15,vx:0,vy:0,r:12,launched:false,color:["#ef4444","#eab308","#3b82f6"][lvl%3]};
        aimRef.current = {dragging:false,startX:120,startY:GROUND_Y-15,dx:0,dy:0};
        setGameState("aiming");
    },[]);

    useEffect(()=>{initLevel(level);},[level,initLevel]);

    const checkCollisions = useCallback(() => {
        const b = birdRef.current;
        // Block collisions
        blocksRef.current = blocksRef.current.filter(bl => {
            const cx = Math.max(bl.x, Math.min(b.x, bl.x+bl.w));
            const cy = Math.max(bl.y, Math.min(b.y, bl.y+bl.h));
            const dist = Math.hypot(b.x-cx, b.y-cy);
            if(dist < b.r) { bl.hp--; setScore(s=>s+25); return bl.hp > 0; }
            return true;
        });
        // Pig collisions
        pigsRef.current.forEach(p => {
            if(!p.alive) return;
            const dist = Math.hypot(b.x-p.x, b.y-p.y);
            if(dist < b.r + p.r) { p.alive=false; setScore(s=>s+100); }
        });
    },[]);

    useEffect(() => {
        const canvas = canvasRef.current; if(!canvas) return;
        const ctx = canvas.getContext("2d"); if(!ctx) return;

        const draw = () => {
            ctx.clearRect(0,0,W,H);
            // Sky gradient
            const sky = ctx.createLinearGradient(0,0,0,H);
            sky.addColorStop(0,"#87CEEB"); sky.addColorStop(1,"#E0F7FA");
            ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
            // Ground
            ctx.fillStyle="#4CAF50"; ctx.fillRect(0,GROUND_Y,W,40);
            ctx.fillStyle="#388E3C"; ctx.fillRect(0,GROUND_Y,W,5);
            // Slingshot
            ctx.fillStyle="#5D4037"; ctx.fillRect(115,GROUND_Y-50,10,55); ctx.fillRect(130,GROUND_Y-50,10,55);
            ctx.fillStyle="#795548"; ctx.fillRect(112,GROUND_Y-55,30,8);
            // Aim line
            if(aimRef.current.dragging) {
                ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=2; ctx.setLineDash([5,5]);
                ctx.beginPath(); ctx.moveTo(127,GROUND_Y-40);
                const power = Math.min(Math.hypot(aimRef.current.dx,aimRef.current.dy),80);
                const angle = Math.atan2(aimRef.current.dy,aimRef.current.dx);
                for(let t=0;t<30;t++){const px=127+(-Math.cos(angle)*power*0.15)*t;const py=(GROUND_Y-40)+(-Math.sin(angle)*power*0.15)*t+(GRAVITY*t*t)/2;if(py>GROUND_Y)break;ctx.lineTo(px,py);}
                ctx.stroke(); ctx.setLineDash([]);
            }
            // Blocks
            blocksRef.current.forEach(bl => {
                ctx.fillStyle=bl.color; ctx.fillRect(bl.x,bl.y,bl.w,bl.h);
                ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.strokeRect(bl.x,bl.y,bl.w,bl.h);
                if(bl.hp===1){ctx.strokeStyle="rgba(255,0,0,0.5)";ctx.beginPath();ctx.moveTo(bl.x,bl.y);ctx.lineTo(bl.x+bl.w,bl.y+bl.h);ctx.stroke();}
            });
            // Pigs
            pigsRef.current.forEach(p => {
                if(!p.alive) return;
                ctx.fillStyle="#4CAF50"; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle="#388E3C"; ctx.lineWidth=2; ctx.stroke();
                // Eyes
                ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(p.x-4,p.y-3,4,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(p.x+4,p.y-3,4,0,Math.PI*2); ctx.fill();
                ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(p.x-3,p.y-3,2,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(p.x+5,p.y-3,2,0,Math.PI*2); ctx.fill();
                // Snout
                ctx.fillStyle="#66BB6A"; ctx.beginPath(); ctx.ellipse(p.x,p.y+4,5,3,0,0,Math.PI*2); ctx.fill();
            });
            // Bird
            const b = birdRef.current;
            ctx.fillStyle=b.color; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=2; ctx.stroke();
            // Bird eyes
            ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(b.x+3,b.y-3,4,0,Math.PI*2); ctx.fill();
            ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(b.x+4,b.y-3,2,0,Math.PI*2); ctx.fill();
            // Bird beak
            ctx.fillStyle="#FF9800"; ctx.beginPath(); ctx.moveTo(b.x+b.r,b.y); ctx.lineTo(b.x+b.r+8,b.y+2); ctx.lineTo(b.x+b.r,b.y+5); ctx.fill();

            // Physics update
            if(b.launched) {
                b.vy += GRAVITY; b.x += b.vx; b.y += b.vy;
                checkCollisions();
                if(b.y >= GROUND_Y-b.r) { b.y=GROUND_Y-b.r; b.vx*=0.7; b.vy=-b.vy*0.3;
                    if(Math.abs(b.vx)<0.5&&Math.abs(b.vy)<1){
                        b.launched=false;
                        const allDead = pigsRef.current.every(p=>!p.alive);
                        if(allDead){setGameState("won");}
                        else if(birdsLeft<=1){setGameState("lost");}
                        else{setBirdsLeft(bl=>bl-1);birdRef.current={x:120,y:GROUND_Y-15,vx:0,vy:0,r:12,launched:false,color:b.color};}
                    }
                }
                if(b.x>W+50||b.x<-50){
                    b.launched=false;
                    const allDead=pigsRef.current.every(p=>!p.alive);
                    if(allDead){setGameState("won");}
                    else if(birdsLeft<=1){setGameState("lost");}
                    else{setBirdsLeft(bl=>bl-1);birdRef.current={x:120,y:GROUND_Y-15,vx:0,vy:0,r:12,launched:false,color:b.color};}
                }
            }
            animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    },[checkCollisions,birdsLeft]);

    const handleMouseDown = (e:React.MouseEvent) => {
        if(gameState!=="aiming"||birdRef.current.launched) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const sx = (e.clientX-rect.left)*(W/rect.width), sy = (e.clientY-rect.top)*(H/rect.height);
        const b=birdRef.current;
        if(Math.hypot(sx-b.x,sy-b.y)<30) aimRef.current.dragging=true;
    };
    const handleMouseMove = (e:React.MouseEvent) => {
        if(!aimRef.current.dragging) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const mx = (e.clientX-rect.left)*(W/rect.width), my = (e.clientY-rect.top)*(H/rect.height);
        aimRef.current.dx = 127-mx; aimRef.current.dy = (GROUND_Y-40)-my;
        birdRef.current.x = mx; birdRef.current.y = my;
    };
    const handleMouseUp = () => {
        if(!aimRef.current.dragging) return;
        aimRef.current.dragging=false;
        const power = Math.min(Math.hypot(aimRef.current.dx,aimRef.current.dy),80);
        const angle = Math.atan2(aimRef.current.dy,aimRef.current.dx);
        birdRef.current.vx = Math.cos(angle)*power*0.15;
        birdRef.current.vy = Math.sin(angle)*power*0.15;
        birdRef.current.launched = true;
        setGameState("flying");
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar/>
            <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2 gradient-text uppercase">🐦 Angry Birds</h1>
                <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-8">Level {level} · Score: {score} · Birds: {birdsLeft}</p>
                <div className="rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
                    <canvas ref={canvasRef} width={W} height={H} className="cursor-crosshair" style={{width:"100%",maxWidth:800}}
                        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}/>
                    {gameState==="won"&&(
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-4xl font-black text-green-400 mb-4">🎉 Level Complete!</h2>
                            <p className="text-lg mb-6">Score: {score}</p>
                            <button onClick={()=>{setLevel(l=>l<3?l+1:1);setBirdsLeft(3);}} className="px-8 py-3 bg-green-500 text-black rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Next Level →</button>
                        </div>
                    )}
                    {gameState==="lost"&&(
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-4xl font-black text-red-400 mb-4">💀 Game Over</h2>
                            <p className="text-lg mb-6">Score: {score}</p>
                            <button onClick={()=>{setScore(0);setBirdsLeft(3);initLevel(level);}} className="px-8 py-3 bg-red-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Try Again</button>
                        </div>
                    )}
                </div>
                <p className="mt-6 text-[10px] text-gray-500 font-black uppercase tracking-widest">Click & drag the bird to aim, release to launch</p>
            </main>
            <Footer/>
        </div>
    );
}
