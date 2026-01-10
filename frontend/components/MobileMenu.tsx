'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Calendar, Ticket, Shield, PlusCircle, LogOut } from 'lucide-react';
import { signout } from '@/app/auth/actions';

interface MobileMenuProps {
    user: any;
    isUserAdmin: boolean;
    isUserHelper: boolean;
}

export default function MobileMenu({ user, isUserAdmin, isUserHelper }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-foreground focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div className="absolute top-16 right-4 z-50">
                    {/* 
                        Use inline styles for the complex gradient and specific colors 
                        to match the user's request precisely where utility classes might fall short,
                        but maps to Tailwind where possible.
                    */}
                    <div className="w-[200px] bg-[#242832] rounded-[10px] p-[15px_0px] flex flex-col gap-[10px] shadow-2xl border border-white/10"
                        style={{
                            backgroundImage: 'linear-gradient(139deg, rgba(36, 40, 50, 1) 0%, rgba(36, 40, 50, 1) 0%, rgba(37, 28, 40, 1) 100%)'
                        }}
                    >

                        {/* Navigation Section */}
                        <ul className="list-none flex flex-col gap-[8px] px-[10px]">
                            <Link href="/">
                                <li className="flex items-center text-[#7e8590] gap-[10px] px-[7px] py-[4px] rounded-[6px] cursor-pointer transition-all duration-300 hover:bg-[#5353ff] hover:text-white hover:translate-x-[1px] hover:-translate-y-[1px] active:scale-[0.99] group">
                                    <Home className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
                                    <span className="font-semibold text-sm">Home</span>
                                </li>
                            </Link>

                            <Link href="/events">
                                <li className="flex items-center text-[#7e8590] gap-[10px] px-[7px] py-[4px] rounded-[6px] cursor-pointer transition-all duration-300 hover:bg-[#5353ff] hover:text-white hover:translate-x-[1px] hover:-translate-y-[1px] active:scale-[0.99] group">
                                    <Calendar className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
                                    <span className="font-semibold text-sm">All Events</span>
                                </li>
                            </Link>

                            <Link href="/tickets">
                                <li className="flex items-center text-[#7e8590] gap-[10px] px-[7px] py-[4px] rounded-[6px] cursor-pointer transition-all duration-300 hover:bg-[#5353ff] hover:text-white hover:translate-x-[1px] hover:-translate-y-[1px] active:scale-[0.99] group">
                                    <Ticket className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
                                    <span className="font-semibold text-sm">My Tickets</span>
                                </li>
                            </Link>
                        </ul>

                        <div className="border-t border-[#42434a] my-1"></div>

                        {/* Admin Section */}
                        {(isUserAdmin || isUserHelper) && (
                            <>
                                <ul className="list-none flex flex-col gap-[8px] px-[10px]">
                                    {isUserAdmin && (
                                        <Link href="/events/new">
                                            <li className="flex items-center text-[#7e8590] gap-[10px] px-[7px] py-[4px] rounded-[6px] cursor-pointer transition-all duration-300 hover:bg-[#5353ff] hover:text-white hover:translate-x-[1px] hover:-translate-y-[1px] active:scale-[0.99] group">
                                                <PlusCircle className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
                                                <span className="font-semibold text-sm">Create Event</span>
                                            </li>
                                        </Link>
                                    )}
                                    <Link href="/admin/helpers">
                                        <li className="flex items-center text-[#7e8590] gap-[10px] px-[7px] py-[4px] rounded-[6px] cursor-pointer transition-all duration-300 hover:bg-[#5353ff] hover:text-white hover:translate-x-[1px] hover:-translate-y-[1px] active:scale-[0.99] group">
                                            <Shield className="w-[19px] h-[19px] transition-all duration-300 group-hover:stroke-white" />
                                            <span className="font-semibold text-sm">Helpers</span>
                                        </li>
                                    </Link>
                                </ul>
                                <div className="border-t border-[#42434a] my-1"></div>
                            </>
                        )}


                        {/* Action Section */}
                        <ul className="list-none flex flex-col gap-[8px] px-[10px]">
                            <form action={signout}>
                                <button className="w-full flex items-center text-[#bd89ff] gap-[10px] px-[7px] py-[4px] rounded-[6px] cursor-pointer transition-all duration-300 hover:bg-[#8e2a2a] hover:text-white hover:translate-x-[1px] hover:-translate-y-[1px] active:scale-[0.99] group">
                                    <LogOut className="w-[19px] h-[19px] stroke-[#bd89ff] transition-all duration-300 group-hover:stroke-white" />
                                    <span className="font-semibold text-sm">Sign Out</span>
                                </button>
                            </form>
                        </ul>

                    </div>
                </div>
            )}
        </div>
    );
}
