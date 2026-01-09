"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { loginWithGoogle } from "../auth/actions";
import FluidBackground from "@/components/FluidBackground";
import FluidBackgroundBlack from "@/components/FluidBackgroundBlack";
import RainbowBackground from "@/components/RainbowBackground";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Dynamic Background matching Global Layout */}
            <div className="fixed inset-0 -z-10">
                {theme === "rainbow" ? <RainbowBackground /> : theme === "dark" ? <FluidBackgroundBlack /> : <FluidBackground />}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl"
            >
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-4">
                        <span className="font-mono text-3xl font-bold text-white">N</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to access your dashboard</p>
                    </div>

                    <form action={loginWithGoogle}>
                        <button
                            type="submit"
                            className="w-full relative group cursor-pointer overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl gap-3 transition-colors group-hover:bg-slate-900">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Sign in with Google
                            </span>
                        </button>
                    </form>

                    <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        <span>Secure Authentication</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
