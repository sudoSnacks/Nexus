
import { updatePassword } from '../auth/actions'
import BackgroundGradient from "@/components/BackgroundGradient";
import { Lock } from 'lucide-react';

export default function UpdatePasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-md p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl relative">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Update your password
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your new password below.
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="password" className="sr-only">New Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="relative block w-full rounded-md border-white/10 bg-black/20 text-white placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3 py-3"
                            placeholder="New Password"
                        />
                    </div>

                    <button formAction={updatePassword} className="group relative flex w-full justify-center rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 px-3 py-2 text-sm font-semibold backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 transition-all">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}
