"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import RainbowBackground from "./RainbowBackground";

import { AnimatePresence, motion } from "framer-motion";
import UnifiedFluidBackground from "./UnifiedFluidBackground";

export default function GlobalBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence mode="popLayout">
            {theme === "rainbow" ? (
                <motion.div
                    key="rainbow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 -z-10"
                >
                    <RainbowBackground />
                </motion.div>
            ) : (
                <motion.div
                    /* KEY FIX: 'fluid' key ensures this component persists between light <-> dark switches */
                    key="fluid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 -z-10"
                >
                    {/* The mode prop updates, but the component stays mounted, preserving the wave phase */}
                    <UnifiedFluidBackground mode={theme === "dark" ? "dark" : "light"} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
