import { resetPassword } from '../auth/actions'
import BackgroundGradient from "@/components/BackgroundGradient";
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-md p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl relative">
                <Link href="/login" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full rounded-md border-white/10 bg-black/20 text-white placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3 py-3"
                            placeholder="Email address"
                        />
                    </div>

                    <button formAction={resetPassword} className="group relative flex w-full justify-center rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 px-3 py-2 text-sm font-semibold backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 transition-all">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    )
}
