"use client";

import React, { useEffect, useState } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function BackgroundGradient({ primaryColor = "#4f46e5" }: { primaryColor?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) return <div className="fixed inset-0 z-[-1] bg-background" />;

    const isLight = theme === "light";
    const isRainbow = theme === "rainbow";

    let gradientBackground;
    if (isLight) {
        gradientBackground = `conic-gradient(from 0deg at 50% 50%, #ffffff 0deg, ${primaryColor} 50deg, #fce7f3 100deg, #e0e7ff 180deg, ${primaryColor} 270deg, #ffffff 360deg)`;
    } else if (isRainbow) {
        gradientBackground = `conic-gradient(from 0deg at 50% 50%, #0F172A 0deg, ${primaryColor} 50deg, #D97706 100deg, #8B5CF6 180deg, ${primaryColor} 270deg, #0F172A 360deg)`;
    } else {
        // Dark Mode - Subtle, deep, dark
        gradientBackground = `conic-gradient(from 0deg at 50% 50%, #000000 0deg, #1e1b4b 50deg, #0f172a 100deg, #1e1b4b 180deg, #0f172a 270deg, #000000 360deg)`;
    }

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background overflow-hidden transition-colors duration-500">
            <motion.div
                style={{ translateX: springX, translateY: springY }}
                className="absolute inset-0"
            >
                {/* Interactive Gradient Mesh */}
                <div
                    className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60 blur-[100px] animate-spin-slow"
                    style={{
                        background: gradientBackground
                    }}
                />

                {/* Secondary accent blob for depth - adjusted per theme */}
                <div
                    className="absolute top-[20%] right-[20%] w-[50vh] h-[50vh] rounded-full blur-[120px]"
                    style={{
                        backgroundColor: isRainbow
                            ? `color-mix(in srgb, ${primaryColor}, transparent 70%)`
                            : (isLight ? 'rgba(79, 70, 229, 0.1)' : 'rgba(30, 27, 75, 0.4)')
                    }}
                />
                <div className={`absolute bottom-[20%] left-[20%] w-[50vh] h-[50vh] rounded-full blur-[120px] ${isLight ? 'bg-blue-200/40' : (isRainbow ? 'bg-blue-600/30' : 'bg-slate-900/40')
                    }`} />
            </motion.div>

            <div className={`absolute inset-0 backdrop-blur-[100px] ${isLight ? 'bg-white/40' : (isRainbow ? 'bg-black/20' : 'bg-black/40')
                }`} />

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
