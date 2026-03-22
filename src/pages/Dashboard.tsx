import { useState } from "react";
import { TicketCard } from "@/components/TicketCard";
import { mockTickets, mockEvents, mockWalletAddress } from "@/lib/mockData";
import { CalendarDays, Ticket, BarChart3 } from "lucide-react";

type Tab = "tickets" | "events" | "analytics";

const Dashboard = () => {
  const [tab, setTab] = useState<Tab>("tickets");

  const tabs: { key: Tab; label: string; icon: typeof Ticket }[] = [
    { key: "tickets", label: "My Tickets", icon: Ticket },
    { key: "events", label: "My Events", icon: CalendarDays },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {mockWalletAddress.slice(0, 6)}...{mockWalletAddress.slice(-4)}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tickets Tab */}
      {tab === "tickets" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Events Tab (Organizer view) */}
      {tab === "events" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Events you've created</p>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              + Create Event
            </button>
          </div>

          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Sold</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.slice(0, 3).map((event) => (
                  <tr key={event.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{event.id.toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                      {event.soldTickets}/{event.totalTickets}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                      {(event.soldTickets * event.price).toFixed(2)} ETH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {tab === "analytics" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Revenue", value: "14.35 ETH" },
            { label: "Tickets Sold", value: "5,557" },
            { label: "Verification Rate", value: "98.2%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-card p-5 shadow-card">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
