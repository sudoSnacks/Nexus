"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe, Mail, Code, User, Send, Instagram, Linkedin } from "lucide-react";
import { useRef, useState } from "react";
import clsx from "clsx";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);
  const smoothX = useSpring(x, { damping: 20, stiffness: 90 });

  const [activeSection, setActiveSection] = useState("home");

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
    <div ref={containerRef} className="h-[300vh] bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">

      {/* Dynamic Background Gradient (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Blue Red Green Yellow Gradient Mesh */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,#3B82F6_0deg,#EF4444_90deg,#22C55E_180deg,#EAB308_270deg,#3B82F6_360deg)] opacity-30 blur-[120px] animate-spin-slow" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center font-mono text-lg font-bold">O</div>
          <span className="font-bold text-xl tracking-tight">OnCampus</span>
        </div>

        <div className="hidden md:flex items-center bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/10 relative">
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
                activeSection === item.id ? "text-black" : "text-gray-400 hover:text-white"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <Link href="/events" className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-bold text-white rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-all duration-300">
          <span className="mr-2">View Events</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>

      {/* Horizontal Scroll Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          style={{ x: smoothX }}
          className="flex h-full w-[300vw]"
        >

          {/* SECTION 1: HOME */}
          <section className="w-screen h-screen flex flex-col justify-center items-center px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 tracking-wide uppercase mb-4">
                <Sparkles className="w-3 h-3" /> Digital Experience
              </div>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
                GDG <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400">OnCampus</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Scroll down to explore deeper. A horizontal journey through our world.
              </p>
            </motion.div>

            {/* Scroll Hint Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-12 left-8 md:left-12"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-md shadow-lg shadow-black/10">
                <span className="font-mono text-xs uppercase tracking-widest text-white/80">Scroll to explore</span>
                <div className="w-10 h-5 rounded-full border border-white/20 flex items-center p-1">
                  <motion.div
                    animate={{ x: [0, 16, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3 h-3 bg-white rounded-full shadow-sm"
                  />
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECTION 2: ABOUT */}
          <section className="w-screen h-screen flex items-center px-8 md:px-32 relative">
            <div className="border-l border-white/10 pl-8 md:pl-20 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-mono text-red-400">02. About</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-green-400">GDGoC IET DAVV</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <p className="text-lg text-gray-400 leading-relaxed">
                    GDGoC IET DAVV is a part of dynamic community where students from various backgrounds come together to explore the latest in technology, learn about Google's tools and platforms, and collaborate on innovative projects.
                    <br /><br />
                    GDGoC is a place to grow as a developer, starting from a beginner developer to an advanced developer. It's not always about “programming” but also about connecting, learning together and growing together.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-white/80">
                      <Code className="w-5 h-5 text-blue-400" />
                      <span>Google Technologies</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/80">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span>Innovation & Growth</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/80">
                      <Globe className="w-5 h-5 text-green-400" />
                      <span>Community & Collaboration</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* SECTION 3: CONTACT */}
          <section className="w-screen h-screen flex items-center justify-center px-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl relative overflow-hidden"
            >
              {/* Decorative background blob */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/20 rounded-full blur-[80px]" />

              <div className="relative z-10 text-center space-y-8">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-500 to-blue-500 shadow-lg shadow-green-500/20 mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold">Contact Us</h2>
                <p className="text-xl text-gray-400">
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

      <style jsx global>{`
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
