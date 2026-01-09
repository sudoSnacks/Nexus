"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ThemeTestPage() {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 transition-colors duration-300">
            <Link
                href="/"
                className="absolute top-6 left-20 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Theme System Test</h1>
                    <p className="text-muted-foreground text-lg">
                        Current active theme: <span className="font-mono font-bold text-primary">{theme}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">Card Component</h2>
                        <p className="text-muted-foreground">
                            This card uses <code className="bg-muted px-1 py-0.5 rounded text-sm">bg-card</code> and <code className="bg-muted px-1 py-0.5 rounded text-sm">text-card-foreground</code>.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
                        <h2 className="text-xl font-semibold mb-2">Destructive State</h2>
                        <p className="opacity-90">
                            This box demonstrates the <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-sm">destructive</code> color tokens.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-primary/20 bg-primary/10 text-primary">
                        <h2 className="text-xl font-semibold mb-2">Primary State</h2>
                        <p className="opacity-90">
                            This box demonstrates the <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-sm">primary</code> brand color.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-secondary/20 bg-secondary/10 text-secondary">
                        <h2 className="text-xl font-semibold mb-2">Secondary State</h2>
                        <p className="opacity-90">
                            This box demonstrates the <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-sm">secondary</code> brand color.
                        </p>
                    </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold">Form Elements</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Input field..."
                            className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                            Primary Button
                        </button>
                        <button className="px-4 py-2 ml-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors font-medium">
                            Secondary Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
