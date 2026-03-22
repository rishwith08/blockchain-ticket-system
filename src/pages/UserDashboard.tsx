import { useState, useEffect } from "react";
import { TicketCard } from "@/components/TicketCard";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket as TicketIcon, Calendar } from "lucide-react";
import { API_URL } from "@/config";

const UserDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      console.log("UserDashboard: Fetching tickets for", user.email);
      setLoading(true);
      fetch(`${API_URL}/my-tickets?email=${user.email}`)
        .then(res => {
          console.log("UserDashboard: Response status:", res.status);
          if (!res.ok) throw new Error("Failed to fetch tickets");
          return res.json();
        })
        .then(data => {
          console.log("UserDashboard: Received data:", data);
          if (Array.isArray(data)) {
            setTickets(data);
          } else {
            console.error("UserDashboard: Data is not an array:", data);
            setTickets([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("UserDashboard: Fetch error:", err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 items-center gap-3 flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <TicketIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket: any) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-20 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No tickets yet</h3>
          <p className="text-muted-foreground mb-6">Browse events to purchase your first ticket.</p>
          <a href="/events" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Browse Events
          </a>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
