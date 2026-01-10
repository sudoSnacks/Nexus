
"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { login, signup, loginWithGoogle } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BackgroundGradient from "@/components/BackgroundGradient";

interface LoginFormProps {
    mode: "login" | "signup";
    heading?: string;
    logo?: {
        url: string;
        src: string;
        alt: string;
        title?: string;
    };
}

export function LoginForm({
    mode,
    heading = mode === "login" ? "Welcome Back" : "Create Account",
    logo = {
        url: "/",
        src: "/logo.png", // Fallback, though we might use text or specific component
        alt: "Nexus Logo",
        title: "Nexus",
    },
}: LoginFormProps) {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const message = searchParams.get("message");
        const error = searchParams.get("error");

        if (message) {
            toast.success(message);
        }
        if (error) {
            toast.error(error);
        }
    }, [searchParams]);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            if (mode === "login") {
                await login(formData);
            } else {
                await signup(formData);
            }
        } catch (error) {
            console.error(error);
            toast.error("Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden text-foreground">
            <BackgroundGradient />
            {/* Blur Layer for Auth Page Only */}
            <div className="absolute inset-0 backdrop-blur-[3px] z-0" />

            <div className="absolute top-6 left-4 md:left-8 z-20">
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-background/50 px-4 py-2 rounded-full border border-border backdrop-blur-md">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-y-8 relative z-10">
                <div className="flex flex-col items-center gap-y-2 text-center">
                    <Link href={logo.url} className="mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-mono text-xl font-bold shadow-lg">
                            N
                        </div>
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">{heading}</h1>
                    <p className="text-muted-foreground text-sm">
                        {mode === "login"
                            ? "Enter your credentials to access your account"
                            : "Enter your details to create a new account"}
                    </p>
                </div>

                <div className="flex flex-col gap-6 bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl">
                    <form action={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Input name="email" type="email" placeholder="Email" required className="py-6 bg-background/50 border-input" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Input name="password" type="password" placeholder="Password" required className="py-6 bg-background/50 border-input" />
                        </div>

                        <Button type="submit" className="w-full py-6 text-base font-medium" disabled={loading}>
                            {loading ? "Processing..." : (mode === "login" ? "Sign In" : "Sign Up")}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <form action={loginWithGoogle}>
                        <Button type="submit" variant="outline" className="w-full py-6 text-base font-medium bg-background/50 hover:bg-background/80 border-border">
                            <FcGoogle className="mr-2 size-5" />
                            Sign {mode === "login" ? "in" : "up"} with Google
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        {mode === "login" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-primary font-medium hover:underline">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary font-medium hover:underline">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
