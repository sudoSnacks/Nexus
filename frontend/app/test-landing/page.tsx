"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe, Mail, Code, User, Send, Instagram, Linkedin } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import FluidBackground from "@/components/FluidBackground";

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);
    const smoothX = useSpring(x, { damping: 20, stiffness: 90 });

    const [activeSection, setActiveSection] = useState("home");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Update active section based on scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest < 0.33) setActiveSection("home");
        else if (latest < 0.66) setActiveSection("about");
        else setActiveSection("contact");
    });

    const scrollToSection = (index: number) => {
        // Calculate total scroll height
        const totalHeight = containerRef.current?.scrollHeight || 0;
        // Subtract viewport height to get scrollable distance
        const scrollableDistance = totalHeight - window.innerHeight;
        // Scroll to percentage
        const target = (index / 2) * scrollableDistance;

        window.scrollTo({
            top: target,
            behavior: 'smooth'
        });
    };

    return (
        <div ref={containerRef} className="relative min-h-screen md:h-[300vh] bg-white text-black font-sans selection:bg-blue-500 selection:text-white">

            {/* Dynamic Background Gradient (Fixed) */}
            <FluidBackground />

            {/* Fixed Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-mono text-lg font-bold text-white">N</div>
                    <span className="font-bold text-xl tracking-tight text-black">Nexus</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center bg-white/60 backdrop-blur-md rounded-full px-2 py-1 border border-black/5 relative shadow-sm">
                    {[
                        { id: 'home', label: 'Home', index: 0 },
                        { id: 'about', label: 'About', index: 1 },
                        { id: 'contact', label: 'Contact', index: 2 }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.index)}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-medium transition-colors relative z-10",
                                activeSection === item.id ? "text-white" : "text-gray-600 hover:text-black"
                            )}
                        >
                            {item.label}
                            {activeSection === item.id && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute inset-0 bg-[#1e1e1e] rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <Link href="/events" className="hidden md:inline-flex group relative items-center justify-center px-6 py-2 overflow-hidden font-bold text-white rounded-full bg-[#1e1e1e] border border-[#1e1e1e] hover:bg-black transition-all duration-300">
                    <span className="mr-2">View Events</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Mobile Menu Toggle - Simplified for now, can be expanded to a full sheet if needed */}
                <div className="md:hidden">
                    {/* Creating a simple mobile menu using standard Next.js/React patterns would require more state. 
                For this quick refactor, I'll auto-stack sections so scrolling works naturally.
                Nav links could just scroll to view.
             */}
                    <Link href="/events" className="p-2 text-sm bg-black/5 rounded-lg">Events</Link>
                </div>
            </nav>

            {/* Scroll Container - Horizontal on Desktop, Vertical on Mobile */}
            <div className="relative md:sticky top-0 h-auto md:h-screen overflow-hidden flex flex-col md:flex-row items-center">
                <motion.div
                    style={isMobile ? {} : { x: smoothX }}
                    className="flex flex-col md:flex-row h-full w-full md:w-[300vw]"
                >

                    {/* SECTION 1: HOME */}
                    <section className="w-full md:w-screen h-screen flex flex-col justify-center items-center px-4 relative shrink-0">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-5xl space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-600 tracking-wide uppercase mb-4">
                                <Sparkles className="w-3 h-3" /> Digital Experience
                            </div>

                            {/* Using mix-blend-difference with text-white creates inverted effect:
                                - On White BG -> Black Text
                                - On Blue BG -> Yellow/Orange Text (Complimentary)
                                This ensures visibility and reactivity.
                            */}
                            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
                                <span className="text-gray-600">GDG</span> <br />
                                <span className="text-gray-100 mix-blend-difference">Nexus</span>
                            </h1>

                            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                                Scroll down to explore deeper. A horizontal journey through our world.
                            </p>
                        </motion.div>

                        {/* Scroll Hint Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-12 left-8 md:left-12 hidden md:block"
                        >
                            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/40 border border-black/5 backdrop-blur-md shadow-lg shadow-black/5">
                                <span className="font-mono text-xs uppercase tracking-widest text-black/60">Scroll to explore</span>
                                <div className="w-10 h-5 rounded-full border border-black/10 flex items-center p-1">
                                    <motion.div
                                        animate={{ x: [0, 16, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-3 h-3 bg-black rounded-full shadow-sm"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* SECTION 2: ABOUT */}
                    <section className="w-full md:w-screen min-h-screen flex items-center px-8 md:px-32 relative shrink-0 py-20 md:py-0">
                        <div className="border-l border-black/10 pl-8 md:pl-20 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-600">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <span className="text-xl font-mono text-red-600">02. About</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-black">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">GDGoC IET DAVV</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        GDGoC IET DAVV is a part of dynamic community where students from various backgrounds come together to explore the latest in technology, learn about Google's tools and platforms, and collaborate on innovative projects.
                                        <br /><br />
                                        GDGoC is a place to grow as a developer, starting from a beginner developer to an advanced developer. It's not always about “programming” but also about connecting, learning together and growing together.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-gray-800">
                                            <Code className="w-5 h-5 text-blue-600" />
                                            <span>Google Technologies</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-800">
                                            <Zap className="w-5 h-5 text-yellow-600" />
                                            <span>Innovation & Growth</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-800">
                                            <Globe className="w-5 h-5 text-green-600" />
                                            <span>Community & Collaboration</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* SECTION 3: CONTACT */}
                    <section className="w-full md:w-screen min-h-screen flex items-center justify-center px-4 relative shrink-0 py-20 md:py-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/10 p-12 rounded-3xl relative overflow-hidden"
                        >
                            {/* Decorative background blob */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

                            <div className="relative z-10 text-center space-y-8">
                                <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 mb-4">
                                    <Send className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl md:text-6xl font-bold text-gray-900">Contact Us</h2>
                                <p className="text-xl text-gray-600">
                                    Join us in creating something GRAND
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                    {/* Instagram Button */}
                                    <a
                                        href="https://www.instagram.com/gdgoc.ietdavv/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group px-8 py-4 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Instagram
                                    </a>

                                    {/* LinkedIn Button */}
                                    <a
                                        href="https://www.linkedin.com/company/gdgoc-iet-davv/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group px-8 py-4 rounded-xl bg-[#0077b5] text-white font-bold text-lg hover:bg-[#006097] hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                </motion.div>
            </div>
        </div>
    );
}
