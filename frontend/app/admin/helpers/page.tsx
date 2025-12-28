import { createClient } from '@/utils/supabase/server';
import { isAdmin } from '@/utils/roles';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, User, UserPlus, UserMinus, Search } from 'lucide-react';
import { updateUserRole } from '@/actions/admin';

export default async function HelpersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    if (!await isAdmin()) {
        redirect('/');
    }
    const params = await searchParams;
    const query = params.q || '';

    const supabase = await createClient();

    // Fetch profiles - filtering by email if query exists
    let dbQuery = supabase.from('profiles').select('*').order('email');
    if (query) {
        dbQuery = dbQuery.ilike('email', `%${query}%`);
    }

    const { data: profiles, error } = await dbQuery;

    if (error) {
        console.error(error);
        return <div className="text-white">Error loading profiles</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-500" />
                            Manage Helpers
                        </h1>
                        <p className="text-gray-400">Assign helper roles to trust users for scanning tickets.</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <form className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                name="q"
                                defaultValue={query}
                                placeholder="Search by email..."
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-white"
                            />
                        </div>
                        <button className="bg-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-colors">Search</button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-800">
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {profiles?.map((profile) => (
                                <tr key={profile.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-200">{profile.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${profile.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
                                            ${profile.role === 'helper' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
                                            ${profile.role === 'user' ? 'bg-gray-700/50 text-gray-400 border border-gray-700' : ''}
                                        `}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {profile.role !== 'admin' && (
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {profile.role === 'user' ? (
                                                    <form action={updateUserRole.bind(null, profile.id, 'helper')}>
                                                        <button className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 px-3 py-1.5 rounded-md text-sm transition-colors border border-purple-500/30">
                                                            <UserPlus className="w-3 h-3" />
                                                            Promote to Helper
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <form action={updateUserRole.bind(null, profile.id, 'user')}>
                                                        <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-200 px-3 py-1.5 rounded-md text-sm transition-colors border border-red-500/20">
                                                            <UserMinus className="w-3 h-3" />
                                                            Demote to User
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {profiles?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
