'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || 'Something went wrong.'

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100 font-sans">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Error</h2>
                <p className="text-gray-300 mb-8">{message}</p>
                <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
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
