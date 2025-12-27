import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Event Details
    const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (eventError || !event) {
        return <div className="p-8 text-white">Event not found</div>;
    }

    // Fetch Attendees
    const { data: attendees, error: attendeesError } = await supabase
        .from("attendees")
        .select("*")
        .eq("event_id", id)
        .order("created_at", { ascending: false });

    return (
        <DashboardClient
            event={event}
            initialAttendees={attendees || []}
        />
    );
}
