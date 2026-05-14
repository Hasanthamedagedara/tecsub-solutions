"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const W=400,H=500,COLS=8,ROWS=10,BUBBLE_R=22,COLORS=["#ef4444","#3b82f6","#22c55e","#eab308","#a855f7","#f97316"];

interface Bubble {x:number;y:number;color:string;col:number;row:number}

function createGrid():Bubble[]{
    const bubbles:Bubble[]=[];
    for(let r=0;r<5;r++){
        const offset=r%2===1?BUBBLE_R:0;
        const cols=r%2===1?COLS-1:COLS;
        for(let c=0;c<cols;c++){
            bubbles.push({x:BUBBLE_R+c*BUBBLE_R*2+offset,y:BUBBLE_R+r*BUBBLE_R*1.8,color:COLORS[Math.floor(Math.random()*COLORS.length)],col:c,row:r});
        }
    }
    return bubbles;
}

export default function BubbleShooterPage(){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    const [score,setScore]=useState(0);
    const [gameOver,setGameOver]=useState(false);
    const [started,setStarted]=useState(false);
    const stateRef=useRef({
        grid:createGrid(),
        shooterX:W/2,shooterY:H-40,
        aimAngle:-Math.PI/2,
        currentBubble:{x:W/2,y:H-40,color:COLORS[Math.floor(Math.random()*COLORS.length)],vx:0,vy:0,active:false},
        nextColor:COLORS[Math.floor(Math.random()*COLORS.length)],
    });

    const shoot=useCallback(()=>{
        const s=stateRef.current;
        if(s.currentBubble.active) return;
        const speed=8;
        s.currentBubble.vx=Math.cos(s.aimAngle)*speed;
        s.currentBubble.vy=Math.sin(s.aimAngle)*speed;
        s.currentBubble.active=true;
    },[]);

    const findMatches=(grid:Bubble[],target:Bubble):Bubble[]=>{
        const matches:Bubble[]=[target];
        const visited=new Set<string>();
        visited.add(`${target.row}-${target.col}`);
        const queue=[target];
        while(queue.length>0){
            const curr=queue.shift()!;
            grid.forEach(b=>{
                const key=`${b.row}-${b.col}`;
                if(!visited.has(key)&&b.color===target.color){
                    const dist=Math.hypot(b.x-curr.x,b.y-curr.y);
                    if(dist<BUBBLE_R*2.5){visited.add(key);matches.push(b);queue.push(b);}
                }
            });
        }
        return matches;
    };

    useEffect(()=>{
        if(!started||gameOver) return;
        const canvas=canvasRef.current;if(!canvas) return;
        const ctx=canvas.getContext("2d");if(!ctx) return;
        const s=stateRef.current;

        const handleMove=(e:MouseEvent)=>{
            const rect=canvas.getBoundingClientRect();
            const mx=(e.clientX-rect.left)*(W/rect.width);
            const my=(e.clientY-rect.top)*(H/rect.height);
            s.aimAngle=Math.atan2(my-s.shooterY,mx-s.shooterX);
            if(s.aimAngle>-0.1) s.aimAngle=-0.1;
            if(s.aimAngle<-Math.PI+0.1) s.aimAngle=-Math.PI+0.1;
        };
        const handleClick=()=>shoot();
        canvas.addEventListener("mousemove",handleMove);
        canvas.addEventListener("click",handleClick);

        const loop=()=>{
            if(gameOver) return;
            // BG
            ctx.fillStyle="#0f0f23";ctx.fillRect(0,0,W,H);
            // Grid border
            ctx.fillStyle="#1a1a3e";ctx.fillRect(0,0,W,ROWS*BUBBLE_R*2);

            // Draw grid bubbles
            s.grid.forEach(b=>{
                ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(b.x,b.y,BUBBLE_R-2,0,Math.PI*2);ctx.fill();
                ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.arc(b.x-5,b.y-5,6,0,Math.PI*2);ctx.fill();
            });

            // Aim line
            ctx.strokeStyle="rgba(255,255,255,0.15)";ctx.lineWidth=2;ctx.setLineDash([5,8]);
            ctx.beginPath();ctx.moveTo(s.shooterX,s.shooterY);
            ctx.lineTo(s.shooterX+Math.cos(s.aimAngle)*200,s.shooterY+Math.sin(s.aimAngle)*200);
            ctx.stroke();ctx.setLineDash([]);

            // Current bubble
            const cb=s.currentBubble;
            if(cb.active){
                cb.x+=cb.vx;cb.y+=cb.vy;
                // Wall bounce
                if(cb.x<BUBBLE_R||cb.x>W-BUBBLE_R){cb.vx*=-1;cb.x=Math.max(BUBBLE_R,Math.min(W-BUBBLE_R,cb.x));}
                // Ceiling
                if(cb.y<BUBBLE_R){
                    cb.active=false;
                    const col=Math.round((cb.x-BUBBLE_R)/(BUBBLE_R*2));
                    const row=0;
                    const newB:Bubble={x:BUBBLE_R+col*BUBBLE_R*2,y:BUBBLE_R,color:cb.color,col,row};
                    s.grid.push(newB);
                    const matches=findMatches(s.grid,newB);
                    if(matches.length>=3){s.grid=s.grid.filter(b=>!matches.includes(b));setScore(sc=>sc+matches.length*10);}
                    cb.x=s.shooterX;cb.y=s.shooterY;cb.color=s.nextColor;
                    s.nextColor=COLORS[Math.floor(Math.random()*COLORS.length)];
                }
                // Grid collision
                let hit=false;
                s.grid.forEach(b=>{
                    if(hit) return;
                    const dist=Math.hypot(b.x-cb.x,b.y-cb.y);
                    if(dist<BUBBLE_R*2){
                        hit=true;cb.active=false;
                        // Snap to grid
                        const row=Math.round((cb.y-BUBBLE_R)/(BUBBLE_R*1.8));
                        const offset=row%2===1?BUBBLE_R:0;
                        const col=Math.round((cb.x-BUBBLE_R-offset)/(BUBBLE_R*2));
                        const newB:Bubble={x:BUBBLE_R+col*BUBBLE_R*2+offset,y:BUBBLE_R+row*BUBBLE_R*1.8,color:cb.color,col,row};
                        s.grid.push(newB);
                        const matches=findMatches(s.grid,newB);
                        if(matches.length>=3){s.grid=s.grid.filter(gb=>!matches.includes(gb));setScore(sc=>sc+matches.length*10);}
                        cb.x=s.shooterX;cb.y=s.shooterY;cb.color=s.nextColor;
                        s.nextColor=COLORS[Math.floor(Math.random()*COLORS.length)];
                        // Check game over
                        if(s.grid.some(gb=>gb.y>H-100)){setGameOver(true);}
                        if(s.grid.length===0){setScore(sc=>sc+500);setGameOver(true);}
                    }
                });
            }
            // Draw shooter bubble
            ctx.fillStyle=cb.color;ctx.beginPath();ctx.arc(cb.x,cb.y,BUBBLE_R-2,0,Math.PI*2);ctx.fill();
            ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.arc(cb.x-5,cb.y-5,6,0,Math.PI*2);ctx.fill();
            // Next bubble indicator
            ctx.fillStyle="#333";ctx.beginPath();ctx.arc(50,H-40,15,0,Math.PI*2);ctx.fill();
            ctx.fillStyle=s.nextColor;ctx.beginPath();ctx.arc(50,H-40,12,0,Math.PI*2);ctx.fill();
            ctx.fillStyle="#fff";ctx.font="bold 10px sans-serif";ctx.fillText("NEXT",35,H-15);
            // Score
            ctx.fillStyle="#fff";ctx.font="bold 14px monospace";ctx.fillText(`Score: ${score}`,W-120,H-20);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        return()=>{canvas.removeEventListener("mousemove",handleMove);canvas.removeEventListener("click",handleClick);};
    },[started,gameOver,shoot,score]);

    const restart=()=>{
        stateRef.current.grid=createGrid();
        stateRef.current.currentBubble={x:W/2,y:H-40,color:COLORS[Math.floor(Math.random()*COLORS.length)],vx:0,vy:0,active:false};
        stateRef.current.nextColor=COLORS[Math.floor(Math.random()*COLORS.length)];
        setScore(0);setGameOver(false);setStarted(true);
    };

    return(
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar/>
            <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2 gradient-text uppercase">🫧 Bubble Shooter</h1>
                <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-8">Match 3+ to pop · Score: {score}</p>
                <div className="rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
                    <canvas ref={canvasRef} width={W} height={H} style={{width:320,height:400}}/>
                    {!started&&!gameOver&&(
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-3xl font-black mb-4">🫧 Bubble Shooter</h2>
                            <button onClick={restart} className="px-8 py-3 bg-purple-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Start Game</button>
                        </div>
                    )}
                    {gameOver&&(
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                            <h2 className="text-3xl font-black text-purple-400 mb-4">{stateRef.current.grid.length===0?"🎉 You Win!":"Game Over"}</h2>
                            <p className="text-lg mb-6">Score: {score}</p>
                            <button onClick={restart} className="px-8 py-3 bg-purple-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">Play Again</button>
                        </div>
                    )}
                </div>
                <p className="mt-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">Move mouse to aim · Click to shoot</p>
            </main>
            <Footer/>
        </div>
    );
}
