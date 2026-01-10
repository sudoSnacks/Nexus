import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";
import Link from "next/link";
import { Home, Shield } from "lucide-react";
import FluidBackground from "@/components/FluidBackground";
import { isAdmin, isHelper } from "@/utils/roles";
import TestEventList from "@/components/TestEventList";

import MobileMenu from "@/components/MobileMenu";

export default async function TestEventsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: events } = await supabase.from("events").select("*").order('date', { ascending: true });
    const isUserAdmin = await isAdmin();
    const isUserHelper = await isHelper();

    return (
        <div className="min-h-screen text-gray-900 font-sans bg-white selection:bg-blue-500 selection:text-white">
            <FluidBackground />

            <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center border-b border-black/5 backdrop-blur-md bg-white/60 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu (Left) */}
                    <div className="md:hidden">
                        <MobileMenu user={user} isUserAdmin={isUserAdmin} isUserHelper={isUserHelper} />
                    </div>

                    <Link href="/test-landing" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 border border-black/10 transition-all font-bold text-black shadow-sm group">
                        <Home className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                    </Link>
                </div>

                {user ? (
                    <>
                        <div className="hidden md:flex items-center gap-2 md:gap-4 mr-16">
                            {isUserAdmin && (
                                <Link
                                    href="/admin/helpers"
                                    className="bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-700 px-2 py-1 text-xs md:text-base md:px-4 md:py-2 rounded-lg transition-all shadow-sm hidden md:flex items-center gap-2 font-medium"
                                >
                                    <Shield className="w-4 h-4" />
                                    Manage Helpers
                                </Link>
                            )}
                            {isUserAdmin && (
                                <Link
                                    href="/events/new"
                                    className="bg-white hover:bg-gray-5 border border-black/10 text-black px-2 py-1 text-xs md:text-base md:px-4 md:py-2 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
                                >
                                    + Create Event
                                </Link>
                            )}
                            <Link
                                href="/tickets"
                                className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2 py-1 text-xs md:text-base md:px-4 md:py-2 rounded-lg transition-all shadow-sm font-medium"
                            >
                                My Tickets
                            </Link>
                            <span className="text-sm text-gray-400 hidden sm:inline"> | </span>
                            <span className="text-sm text-gray-600 hidden sm:inline font-medium">{user.email}</span>
                            <form action={signout}>
                                <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md">
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <Link href="/login" className="bg-[#1e1e1e] hover:bg-black text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-md mr-16">
                        Sign in
                    </Link>
                )
                }
            </header>

            <main className="container mx-auto px-4 py-24 relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center text-black tracking-tight" style={{ mixBlendMode: 'difference', color: 'white' }}>
                    Upcoming Events
                </h2>

                {/* 
                  Note: The EventList component might behave differently if it has hardcoded styles.
                  If the user wants strictly new aesthetics, we might need to modify EventList or wrap it.
                  For now, we will render it and see. The user asked for "similar aesthetics".
                  If EventList has dark mode cards by default, they might clash. 
                  However, I will wait to see the result or proactively check EventList.
                */}
                <TestEventList
                    events={events}
                    user={user}
                    isUserAdmin={isUserAdmin}
                    isUserHelper={isUserHelper}
                />
            </main>
        </div>
    );
}
