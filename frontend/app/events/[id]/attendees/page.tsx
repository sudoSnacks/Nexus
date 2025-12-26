import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, X, Mail, CheckCircle, Edit, Trash2 } from 'lucide-react'
import { updateAttendeeStatus, confirmAllAttendees } from '../../actions'
import BackgroundGradient from '@/components/BackgroundGradient'

export default async function AttendeesPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Fetch event to confirm it exists and get details
    const { data: event } = await supabase.from('events').select('*').eq('id', id).single()

    if (!event) {
        redirect('/?error=Event not found')
    }

    // Fetch attendees for THIS event only
    const { data: attendees } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen text-gray-100 font-sans p-8">
            <BackgroundGradient />
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <Link href="/events" className="hover:text-white transition-colors flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Attendee Management</h1>
                        <p className="text-indigo-400 font-medium text-lg">{event.name}</p>
                    </div>

                    <div className="flex gap-3">
                        <form action={confirmAllAttendees.bind(null, id)}>
                            <button className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-100 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                                <CheckCircle className="w-4 h-4" />
                                Confirm All
                            </button>
                        </form>
                        <Link href={`/events/${id}/email`} className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-100 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                            <Mail className="w-4 h-4" />
                            Send Emails
                        </Link>
                        <div className="h-8 w-px bg-white/10 mx-2"></div>
                        <Link href={`/events/${id}/edit`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-gray-200 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                        <Link href={`/events/${id}/delete`} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 px-4 py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm">Total Attendees</p>
                        <p className="text-3xl font-bold text-white">{attendees?.length || 0}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm">Confirmed</p>
                        <p className="text-3xl font-bold text-green-400">{attendees?.filter(a => a.status === 'confirmed').length || 0}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm">Pending Approval</p>
                        <p className="text-3xl font-bold text-yellow-400">{attendees?.filter(a => a.status === 'pending').length || 0}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-700/50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {attendees?.map((attendee) => (
                                <tr key={attendee.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 font-medium text-white">{attendee.name}</td>
                                    <td className="p-4 text-gray-300">{attendee.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${attendee.status === 'confirmed' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : ''}
                                    ${attendee.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : ''}
                                    ${attendee.status === 'rejected' ? 'bg-red-400/10 text-red-400 border border-red-400/20' : ''}
                                `}>
                                            {attendee.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <form action={updateAttendeeStatus.bind(null, attendee.id, 'confirmed')}>
                                            <button title="Confirm" className="p-2 hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded-lg transition-colors">
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </form>
                                        <form action={updateAttendeeStatus.bind(null, attendee.id, 'rejected')}>
                                            <button title="Reject" className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {(!attendees || attendees.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No attendees found for this event.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
