"use client";

import React, { useEffect } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export default function BackgroundGradient({ primaryColor = "#4f46e5" }: { primaryColor?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 50, stiffness: 400 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate mouse position as percentage of window size centered at 0
            const x = (e.clientX / window.innerWidth - 0.5) * 100;
            const y = (e.clientY / window.innerHeight - 0.5) * 100;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#0a0a0a] overflow-hidden">
            <motion.div
                style={{ translateX: springX, translateY: springY }}
                className="absolute inset-0"
            >
                {/* Interactive Gradient Mesh - matching the Orange/Blue/Purple reference */}
                <div
                    className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60 blur-[100px] animate-spin-slow"
                    style={{
                        background: `conic-gradient(from 0deg at 50% 50%, #0F172A 0deg, ${primaryColor} 50deg, #D97706 100deg, #8B5CF6 180deg, ${primaryColor} 270deg, #0F172A 360deg)`
                    }}
                />

                {/* Secondary accent blob for depth */}
                <div
                    className="absolute top-[20%] right-[20%] w-[50vh] h-[50vh] rounded-full blur-[120px]"
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor}, transparent 70%)` }}
                />
                <div className="absolute bottom-[20%] left-[20%] w-[50vh] h-[50vh] bg-blue-600/30 rounded-full blur-[120px]" />
            </motion.div>

            <div className="absolute inset-0 bg-black/20 backdrop-blur-[100px]" />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 40s linear infinite;
                }
            `}</style>
        </div>
    );
}
