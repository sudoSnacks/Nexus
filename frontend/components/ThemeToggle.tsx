"use client";

import * as React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const cycleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("rainbow");
        else setTheme("light");
    };

    return (
        <button
            onClick={cycleTheme}
            className="fixed top-6 left-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg hover:scale-110 transition-transform cursor-pointer group"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "light" && (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="h-6 w-6 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                    </motion.div>
                )}
                {theme === "dark" && (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="h-6 w-6 text-blue-600 group-hover:text-blue-500 transition-colors" />
                    </motion.div>
                )}
                {theme === "rainbow" && (
                    <motion.div
                        key="rainbow"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Palette className="h-6 w-6 text-pink-500 group-hover:text-pink-400 transition-colors" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
