'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

import BackgroundGradient from "@/components/BackgroundGradient";

function ErrorContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || 'Something went wrong.'

    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Error</h2>
                <p className="text-gray-300 mb-8">{message}</p>
                <Link href="/login" className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 font-medium py-2 px-4 rounded-lg backdrop-blur-md transition-all shadow-lg hover:shadow-indigo-500/20 inline-block">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default function ErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    )
}
