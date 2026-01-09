"use client";

import { useEffect, useRef } from "react";

export default function FluidBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            ctx.fillStyle = "#ffffff"; // White background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add composite operation for blending
            // multiply works well for colored waves on white
            ctx.globalCompositeOperation = "multiply";

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2 + wave.yOffset);

                for (let x = 0; x < canvas.width; x++) {
                    // Add complex wave motion by combining multiple sines
                    const y =
                        Math.sin(x * wave.frequency + time * wave.speed + wave.offset) *
                        wave.amplitude *
                        Math.sin(time * 0.001); // Slowly pulsate amplitude

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
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 w-full h-full pointer-events-none"
        />
    );
}
