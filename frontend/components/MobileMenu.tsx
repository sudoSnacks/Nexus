'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Home, Calendar, Ticket, Shield, PlusCircle, LogOut, ChevronRight } from 'lucide-react';
import { signout } from '@/app/auth/actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
    user: any;
    isUserAdmin: boolean;
    isUserHelper: boolean;
}

export default function MobileMenu({ user, isUserAdmin, isUserHelper }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Drawer animation variants
    const drawerVariants: Variants = {
        closed: { x: '-100%', opacity: 1 },
        open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    return (
        <div className="md:hidden">
            {/* Toggle Button */}
            <button
                onClick={toggleMenu}
                className="p-2 text-foreground focus:outline-none hover:bg-muted/20 rounded-lg transition-colors"
                aria-label="Toggle menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay & Sidebar - Portaled to Body to avoid stacking context issues */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleMenu}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                            />

                            {/* Sidebar Drawer */}
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={drawerVariants}
                                className="fixed top-0 left-0 bottom-0 z-[9999] w-[320px] max-w-[85vw] bg-card dark:bg-zinc-950 border-r border-border shadow-2xl flex flex-col h-[100dvh]"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                                            N
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg leading-tight">Nexus</h2>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleMenu}
                                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content & Footer grouped together */}
                                <div className="overflow-y-auto py-6 px-4 flex flex-col gap-6">

                                    {/* Navigation Group */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                                            Menu
                                        </h3>
                                        <ul className="flex flex-col gap-1">
                                            <MenuItem href="/" icon={Home} label="Home" onClick={toggleMenu} />
                                            <MenuItem href="/events" icon={Calendar} label="All Events" onClick={toggleMenu} />
                                            <MenuItem href="/tickets" icon={Ticket} label="My Tickets" onClick={toggleMenu} />
                                        </ul>
                                    </div>

                                    {/* Admin Group */}
                                    {(isUserAdmin || isUserHelper) && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                                                Admin
                                            </h3>
                                            <ul className="flex flex-col gap-1">
                                                {isUserAdmin && (
                                                    <MenuItem href="/events/new" icon={PlusCircle} label="Create Event" onClick={toggleMenu} />
                                                )}
                                                <MenuItem href="/admin/helpers" icon={Shield} label="Manage Helpers" onClick={toggleMenu} />
                                            </ul>
                                        </div>
                                    )}

                                    {/* Sign Out (Stacked naturally) */}
                                    <div className="pt-2">
                                        <form action={async () => {
                                            await signout();
                                            toggleMenu();
                                        }}>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-3 py-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-200 dark:border-red-900/30"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span className="font-medium">Sign Out</span>
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

// Helper Component for consistent links
function MenuItem({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick: () => void }) {
    return (
        <li>
            <Link
                href={href}
                onClick={onClick}
                className="flex items-center justify-between p-3 rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/5 active:bg-primary/10 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">{label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
            </Link>
        </li>
    );
}
