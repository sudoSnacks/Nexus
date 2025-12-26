import { login, signup } from '../auth/actions'
import BackgroundGradient from "@/components/BackgroundGradient";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 font-sans text-white">
            <BackgroundGradient />
            <div className="w-full max-w-md p-8 space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Or create a new one
                    </p>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full rounded-md border-white/10 bg-black/20 text-white placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3 py-2" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="relative block w-full rounded-md border-white/10 bg-black/20 text-white placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3 py-2" placeholder="Password" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button formAction={login} className="group relative flex w-full justify-center rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-100 px-3 py-2 text-sm font-semibold backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 transition-all">
                            Sign in
                        </button>
                        <button formAction={signup} className="group relative flex w-full justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 px-3 py-2 text-sm font-semibold backdrop-blur-md transition-all">
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
