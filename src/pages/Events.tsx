import { useState, useEffect } from "react";
import { EventCard } from "@/components/EventCard";
import { Search } from "lucide-react";

import { API_URL } from "@/config";

const Events = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Events.tsx: Fetching events from", `${API_URL}/events`);
      try {
        const res = await fetch(`${API_URL}/events`);
        console.log("Events.tsx: Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Events.tsx: Received data:", data);
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Events.tsx: Data is not an array:", data);
          setEvents([]);
        }
      } catch (err: any) {
        console.error("Events.tsx: Fetch error:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? (
              "Loading events..."
            ) : (
              <>
                <span className="font-mono tabular-nums">{events.length}</span> events on-chain
              </>
            )}
          </p>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="h-9 w-full rounded-md bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error}. Please ensure the backend is running.
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No events found matching "{search}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
