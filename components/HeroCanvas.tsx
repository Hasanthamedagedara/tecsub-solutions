"use client";

import { useEffect, useRef, useCallback } from "react";
import { FRAME_COUNT, SEQUENCE_PATH } from "@/data/product";

export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[frameIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const dpr = window.devicePixelRatio || 1;
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, displayWidth, displayHeight);

        // Object-fit: cover — fill the entire viewport
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = displayWidth / displayHeight;

        let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

        if (imgRatio > canvasRatio) {
            drawHeight = displayHeight;
            drawWidth = displayHeight * imgRatio;
            drawX = (displayWidth - drawWidth) / 2;
            drawY = 0;
        } else {
            drawWidth = displayWidth;
            drawHeight = displayWidth / imgRatio;
            drawX = 0;
            drawY = (displayHeight - drawHeight) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }, []);

    const handleScroll = useCallback(() => {
        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min(1, Math.max(0, scrollTop / docHeight));
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.floor(progress * (FRAME_COUNT - 1))
            );

            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                drawFrame(frameIndex);
            }

            rafRef.current = null;
        });
    }, [drawFrame]);

    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const num = String(i).padStart(3, "0");
            img.src = `${SEQUENCE_PATH}${num}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) drawFrame(0);
            };
            images.push(img);
        }

        imagesRef.current = images;

        window.addEventListener("scroll", handleScroll, { passive: true });
        const resizeHandler = () => drawFrame(currentFrameRef.current);
        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", resizeHandler);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [drawFrame, handleScroll]);

    return (
        <>
            {/* Fixed background canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-screen h-screen"
                style={{ zIndex: 0 }}
            />
            {/* Dark overlay for content readability */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    background:
                        "linear-gradient(180deg, rgba(10,10,11,0.3) 0%, rgba(10,10,11,0.5) 40%, rgba(10,10,11,0.7) 100%)",
                }}
            />
        </>
    );
}
