'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function FullCapacityPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 font-sans">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[100px]" />
            </div>

            <div className="w-full max-w-md p-8 relative holo-gradient rounded-2xl text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-500/20 p-4 rounded-full">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                    Event at Full Capacity
                </h2>
                <p className="text-gray-300 mb-8">
                    We apologize, but this event cannot accept more participants at this time.
                    <br /><br />
                    For inquiries, please contact us at: <br />
                    <a href="mailto:placeholder@example.com" className="text-indigo-400 hover:text-indigo-300 underline">placeholder@example.com</a>
                </p>

                <Link href="/events" className="inline-block w-full justify-center rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all">
                    Back to Events
                </Link>
            </div>
        </div>
    )
}
