'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, Mail, CheckCircle, Edit, Trash2, Award, QrCode, RefreshCw, BarChart, Search, Filter } from 'lucide-react';
import { updateAttendeeStatus, confirmAllAttendees, deleteEvent } from '../../actions';
import { resendAttendeeEmail } from '@/actions/email';

interface Attendee {
    id: string;
    name: string;
    email: string;
    status: string;
    checked_in: boolean;
    created_at: string;
    event_id: string;
}

interface Event {
    id: string;
    name: string;
}

interface Props {
    attendees: Attendee[];
    event: Event;
    admin: boolean;
}

export default function AttendeeListClient({ attendees, event, admin }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter Logic
    const filteredAttendees = attendees.filter(attendee => {
        const matchesSearch =
            attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'checked_in' ? attendee.checked_in :
                    attendee.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Counts for stats
    const totalCount = attendees.length;
    const confirmedCount = attendees.filter(a => a.status === 'confirmed').length;
    const checkedInCount = attendees.filter(a => a.checked_in).length;
    const pendingCount = attendees.filter(a => a.status === 'pending').length;

    // Tabs configuration
    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'checked_in', label: 'Checked In' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'pending', label: 'Pending' },
        { id: 'rejected', label: 'Rejected' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Link href="/events" className="hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Attendee Management</h1>
                    <p className="text-indigo-400 font-medium text-lg">{event.name}</p>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Link href="/scanner" className="flex items-center justify-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-100 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                        <QrCode className="w-4 h-4" />
                        Scanner
                    </Link>
                    {admin && (
                        <>
                            <form action={async () => await confirmAllAttendees(event.id)}>
                                <button className="flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-100 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm All
                                </button>
                            </form>
                            <Link href={`/events/${event.id}/analytics`} className="flex items-center justify-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-100 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hidden md:flex">
                                <BarChart className="w-4 h-4" />
                                Analytics
                            </Link>
                            <Link href={`/events/${event.id}/email`} className="flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-100 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hidden md:flex">
                                <Mail className="w-4 h-4" />
                                Send Emails
                            </Link>
                            <Link href={`/events/${event.id}/certificates`} className="flex items-center justify-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-100 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg hidden md:flex">
                                <Award className="w-4 h-4" />
                                Certificates
                            </Link>
                            <div className="hidden md:block h-8 w-px bg-white/10 mx-2"></div>
                            <Link href={`/events/${event.id}/edit`} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-gray-200 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg">
                                <Edit className="w-4 h-4" />
                                <span className="hidden md:inline">Edit</span>
                            </Link>
                            <button
                                onClick={async () => {
                                    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                                        await deleteEvent(event.id);
                                    }
                                }}
                                className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 rounded-lg backdrop-blur-md transition-all shadow-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden md:inline">Delete</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Cards - Mobile Optimized Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div onClick={() => setStatusFilter('all')} className={`p-4 md:p-6 rounded-xl border cursor-pointer transition-all ${statusFilter === 'all' ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <p className="text-gray-400 text-xs md:text-sm">Total Attendees</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{totalCount}</p>
                </div>
                <div onClick={() => setStatusFilter('confirmed')} className={`p-4 md:p-6 rounded-xl border cursor-pointer transition-all ${statusFilter === 'confirmed' ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <p className="text-gray-400 text-xs md:text-sm">Confirmed</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-400">{confirmedCount}</p>
                </div>
                <div onClick={() => setStatusFilter('checked_in')} className={`p-4 md:p-6 rounded-xl border cursor-pointer transition-all ${statusFilter === 'checked_in' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <p className="text-gray-400 text-xs md:text-sm">Checked In</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-400">{checkedInCount}</p>
                </div>
                <div onClick={() => setStatusFilter('pending')} className={`p-4 md:p-6 rounded-xl border cursor-pointer transition-all ${statusFilter === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <p className="text-gray-400 text-xs md:text-sm">Pending</p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-400">{pendingCount}</p>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Filter Tabs (Desktop) */}
                <div className="hidden md:flex bg-black/20 p-1 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${statusFilter === tab.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Filter Dropdown (Mobile) */}
                <div className="md:hidden relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                        {tabs.map(tab => <option key={tab.id} value={tab.id} className="bg-gray-900">{tab.label}</option>)}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Content Display */}
            <div className="space-y-4">
                {filteredAttendees.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No attendees found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards View */}
                        <div className="md:hidden grid gap-4">
                            {filteredAttendees.map((attendee) => (
                                <div key={attendee.id} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{attendee.name}</h3>
                                            <p className="text-gray-400 text-sm">{attendee.email}</p>
                                        </div>
                                        <StatusBadge status={attendee.status} />
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                        {attendee.checked_in ? (
                                            <span className="text-green-400 flex items-center gap-1 text-sm bg-green-500/10 px-2 py-1 rounded-full">
                                                <CheckCircle className="w-3 h-3" /> Checked In
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-sm flex items-center gap-1">
                                                <X className="w-3 h-3" /> No Check-in
                                            </span>
                                        )}

                                        <div className="flex gap-2">
                                            <ActionButtons attendee={attendee} admin={admin} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-700/50 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-medium">Name</th>
                                        <th className="p-4 font-medium">Email</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Check-in</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredAttendees.map((attendee) => (
                                        <tr key={attendee.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4 font-medium text-white">{attendee.name}</td>
                                            <td className="p-4 text-gray-300">{attendee.email}</td>
                                            <td className="p-4"><StatusBadge status={attendee.status} /></td>
                                            <td className="p-4">
                                                {attendee.checked_in ? (
                                                    <span className="text-green-400 flex items-center gap-1 text-sm">
                                                        <CheckCircle className="w-4 h-4" /> Checked In
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Not Checked In</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <ActionButtons attendee={attendee} admin={admin} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Subcomponents for cleaner code
function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
        ${status === 'confirmed' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : ''}
        ${status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : ''}
        ${status === 'rejected' ? 'bg-red-400/10 text-red-400 border border-red-400/20' : ''}
    `}>
            {status}
        </span>
    );
}

function ActionButtons({ attendee, admin }: { attendee: Attendee, admin: boolean }) {
    return (
        <>
            <form action={async () => {
                await resendAttendeeEmail(attendee.id);
            }}>
                <button title="Resend Email" className="p-2 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </form>
            <Link href="/scanner" title="Verify Ticket" className="p-2 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors">
                <QrCode className="w-4 h-4" />
            </Link>
            {admin && (
                <>
                    <form action={async () => await updateAttendeeStatus(attendee.id, 'confirmed')}>
                        <button title="Confirm" className="p-2 hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded-lg transition-colors">
                            <Check className="w-4 h-4" />
                        </button>
                    </form>
                    <form action={async () => await updateAttendeeStatus(attendee.id, 'rejected')}>
                        <button title="Reject" className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                </>
            )}
        </>
    );
}
