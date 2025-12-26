import { login, signup } from '../auth/actions'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
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
                            <input id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="relative block w-full rounded-md border-0 bg-gray-700 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 pl-3" placeholder="Password" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button formAction={login} className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Sign in
                        </button>
                        <button formAction={signup} className="group relative flex w-full justify-center rounded-md bg-transparent border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
