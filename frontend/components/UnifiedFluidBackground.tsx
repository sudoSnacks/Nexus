"use client";

import { useEffect, useRef } from "react";

interface UnifiedFluidBackgroundProps {
    mode: "light" | "dark";
}

export default function UnifiedFluidBackground({ mode }: UnifiedFluidBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const configRef = useRef({
        bg: mode === "dark" ? "#000000" : "#ffffff",
        composite: (mode === "dark" ? "screen" : "multiply") as GlobalCompositeOperation
    });

    // Update config ref when mode changes so the animation loop picks it up instantly
    useEffect(() => {
        configRef.current = {
            bg: mode === "dark" ? "#000000" : "#ffffff",
            composite: (mode === "dark" ? "screen" : "multiply") as GlobalCompositeOperation
        };
    }, [mode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        const waves = [
            {
                color: "#699cf0", // Original Base Blue
                amplitude: 150,
                frequency: 0.002,
                speed: 0.004,
                offset: 0,
                yOffset: 0,
                alpha: 0.4
            },
            {
                color: "#9fc5e8", // Lighter Blue
                amplitude: 200,
                frequency: 0.0015,
                speed: 0.003,
                offset: 2,
                yOffset: 100,
                alpha: 0.4
            },
            {
                color: "#4a86e8", // Darker Blue
                amplitude: 180,
                frequency: 0.001,
                speed: 0.005,
                offset: 4,
                yOffset: 200,
                alpha: 0.3
            },
            {
                color: "#a4c2f4", // Very Light Blue
                amplitude: 160,
                frequency: 0.003,
                speed: 0.002,
                offset: 1,
                yOffset: -100,
                alpha: 0.3
            }
        ];

        const draw = () => {
            // Read current config from ref
            const { bg, composite } = configRef.current;

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Apply blend mode
            ctx.globalCompositeOperation = composite;

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2 + wave.yOffset);

                for (let x = 0; x < canvas.width; x++) {
                    const y =
                        Math.sin(x * wave.frequency + time * wave.speed + wave.offset) *
                        wave.amplitude *
                        Math.sin(time * 0.001);

                    ctx.lineTo(x, canvas.height / 2 + wave.yOffset + y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();

                ctx.fillStyle = wave.color;
                ctx.globalAlpha = wave.alpha;
                ctx.fill();
            });

            // Reset
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;

            time += 1;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Run only ONCE to keep 'time' persistent

    // Add CSS transition for the canvas background color itself if needed, though canvas redraw handles it frame-by-frame.
    // However, canvas clearRect is instant. For a fade effect between BG colors inside canvas, we'd need to interpolate 'bg'.
    // Given the user asked for "waves... continue", the instant color switch with continuous waves is likely what's expected 
    // or acceptable. If they want color fade + continuous waves, that's much harder (requires blending two variants).
    // For now, preserving wave phase is the priority.

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 w-full h-full pointer-events-none transition-colors duration-1000" // CSS transition won't affect canvas content, but can help if we add a bg color to the canvas element itself
        />
    );
}
