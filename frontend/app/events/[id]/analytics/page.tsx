import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, DollarSign, Activity, QrCode } from "lucide-react";
import { isHelper } from "@/utils/roles";
import BackgroundGradient from "@/components/BackgroundGradient";
import StatsCard from "@/components/analytics/StatsCard";
import RegistrationChart from "@/components/analytics/RegistrationChart";
import CheckInVelocityChart from "@/components/analytics/CheckInVelocityChart";
import ExportButton from "@/components/analytics/ExportButton";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    if (!await isHelper()) {
        redirect("/?error=Unauthorized");
    }

    const { id } = await params;
    const supabase = await createClient();

    // Fetch event details
    const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (!event) {
        redirect("/?error=Event not found");
    }

    // Fetch attendees
    const { data: attendees } = await supabase
        .from("attendees")
        .select("*")
        .eq("event_id", id);

    // --- Data Processing for Stats --- //
    const totalAttendees = attendees?.length || 0;
    const checkedInCount = attendees?.filter(a => a.checked_in).length || 0;
    const revenue = totalAttendees * (event.price || 0);
    const checkInRate = totalAttendees > 0 ? Math.round((checkedInCount / totalAttendees) * 100) : 0;

    // --- Data Processing for Charts --- //

    // 1. Registrations over time
    // Group by date (YYYY-MM-DD)
    const registrationsMap = new Map<string, number>();
    attendees?.forEach(a => {
        const date = new Date(a.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
        registrationsMap.set(date, (registrationsMap.get(date) || 0) + 1);
    });

    const registrationData = Array.from(registrationsMap.entries())
        .map(([date, count]) => ({ date, count }))
        // Simple sort assumes dates are chronological enough or Map insertion order if data came sorted from DB
        // For production, parse dates to sort correctly.
        .reverse(); // Supabase default order is descending created_at usually? Actually default is insertion order if no ORDER BY.
    // Let's rely on explicit query order if we want, but here we'll just reverse if we assume they come in newest first from previous pages. 
    // Actually, let's sort properly.

    // Re-fetch with order to be safe or sort in JS.
    // JS Sort:
    const sortedAttendees = [...(attendees || [])].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const regMapSorted = new Map<string, number>();
    sortedAttendees.forEach(a => {
        const date = new Date(a.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
        regMapSorted.set(date, (regMapSorted.get(date) || 0) + 1);
    });
    const finalRegistrationData = Array.from(regMapSorted.entries()).map(([date, count]) => ({ date, count }));


    // 2. Check-in Velocity
    // Group check-ins by hour (only for those checked in)
    const checkIns = attendees?.filter(a => a.checked_in && a.checked_in_at) || [];
    const velocityMap = new Map<string, number>();

    checkIns.forEach(a => {
        const date = new Date(a.checked_in_at);
        const hour = date.getHours();
        const label = `${hour}:00`;
        velocityMap.set(label, (velocityMap.get(label) || 0) + 1);
    });

    // Fill in gaps if needed, or just show active hours.
    // Let's sort by hour.
    const velocityData = Array.from(velocityMap.entries())
        .map(([time, count]) => ({ time, count }))
        .sort((a, b) => parseInt(a.time) - parseInt(b.time));


    // --- Data for Export --- //
    const exportData = attendees?.map(a => ({
        Name: a.name,
        Email: a.email,
        Status: a.status,
        "Checked In": a.checked_in ? "Yes" : "No",
        "Registration Date": new Date(a.created_at).toLocaleString(),
        "Check-in Time": a.checked_in_at ? new Date(a.checked_in_at).toLocaleString() : "N/A"
    })) || [];


    return (
        <div className="min-h-screen text-gray-100 font-sans p-4 md:p-8">
            <BackgroundGradient />
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link href={`/events/${id}/attendees`} className="flex items-center gap-2 text-gray-400 text-sm mb-2 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Attendees
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Event Analytics</h1>
                        <p className="text-indigo-400 font-medium text-lg">{event.name}</p>
                    </div>
                    <div>
                        <ExportButton data={exportData} filename={`${event.name.replace(/\s+/g, '_')}_attendees.csv`} />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Attendees"
                        value={totalAttendees}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Revenue Estimate"
                        value={`$${revenue.toLocaleString()}`}
                        icon={DollarSign}
                        color="green"
                        description={`Based on $${event.price || 0} per ticket`}
                    />
                    <StatsCard
                        title="Checked In"
                        value={checkedInCount}
                        icon={QrCode}
                        color="purple"
                        description={`${checkInRate}% turnout rate`}
                    />
                    <StatsCard
                        title="Real-time Status"
                        value="Live"
                        icon={Activity}
                        color="yellow"
                        description="Tracking active check-ins"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RegistrationChart data={finalRegistrationData} />
                    <CheckInVelocityChart data={velocityData} />
                </div>
            </div>
        </div>
    );
}
