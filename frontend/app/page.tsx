import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/auth/actions";
import { deleteEvent } from "@/app/events/actions";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: events } = await supabase.from("events").select("*").order('date', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="p-6 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Event Manager
        </h1>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/events/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              + New Event
            </Link>
            <span className="text-sm text-gray-400 hidden sm:inline"> | </span>
            <span className="text-sm text-gray-400 hidden sm:inline">{user.email}</span>
            <form action={signout}>
              <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
            Sign in
          </Link>
        )}
      </header>

      <main className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">
          Upcoming Events
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-semibold mb-2">{event.name}</h3>
                <div className="flex items-center text-gray-400 mb-4">
                  <span className="mr-2">📍</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-400 mb-6">
                  <span className="mr-2">📅</span>
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric"
                    })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-700/50 border-t border-gray-700 flex gap-2">
                <Link href={`/events/${event.id}/register`} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-3 rounded text-sm transition-colors text-center">
                  Register
                </Link>
                <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-3 rounded text-sm transition-colors">
                  View
                </button>
                {user && (
                  <>
                    <Link href={`/events/${event.id}/edit`} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-3 rounded text-sm transition-colors text-center">
                      Edit
                    </Link>
                    <form action={deleteEvent.bind(null, event.id)} className="flex-1">
                      <button className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-3 rounded text-sm transition-colors">
                        Delete
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ))}

          {(!events || events.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl border border-gray-800 border-dashed">
              <p className="text-xl mb-4">No events found.</p>
              {user && (
                <Link href="/events/new" className="text-indigo-400 hover:text-indigo-300 underline">
                  Create the first one!
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
