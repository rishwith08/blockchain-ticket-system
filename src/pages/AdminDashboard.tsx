import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Users as UsersIcon, CalendarDays, BarChart3, Ticket, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/config";

const easing = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/analytics`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch analytics", err);
        setLoading(false);
      });
  }, []);

  const cards = [
    { icon: UsersIcon, label: "Total Users", value: stats.totalUsers, color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Shield, label: "Organizers", value: stats.totalOrganizers, color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: CalendarDays, label: "Total Events", value: stats.totalEvents, color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Ticket, label: "Tickets Sold", value: stats.totalTickets, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  if (loading) return <div className="p-20 text-center italic text-muted-foreground">Loading Analytics...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance leading-tight">System Analytics</h1>
          <p className="text-xs text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: easing }}
            className="rounded-xl border bg-card p-6 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <p className="font-mono text-2xl font-bold tabular-nums text-foreground">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Simple Chart Simulation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              User Distribution
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Attendees</span>
                <span className="font-mono font-bold">{stats.totalUsers - stats.totalOrganizers}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${stats.totalUsers > 0 ? ((stats.totalUsers - stats.totalOrganizers) / stats.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Organizers</span>
                <span className="font-mono font-bold">{stats.totalOrganizers}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-purple-500 transition-all duration-1000" 
                  style={{ width: `${stats.totalUsers > 0 ? (stats.totalOrganizers / stats.totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border bg-card p-6 shadow-card flex flex-col justify-center items-center text-center space-y-4"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Growth Potential</h3>
            <p className="max-w-[280px] text-xs leading-relaxed text-muted-foreground">
              Your platform has {stats.totalEvents} active events. Monitor organizer activity to drive more ticket sales.
            </p>
          </div>
          <button className="rounded-md bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all">
            Download Full Report
          </button>
        </motion.div>
      </div>

      <div className="mt-8 rounded-lg bg-orange-500/5 p-4 border border-orange-500/20">
         <p className="text-[10px] text-orange-600 font-medium uppercase tracking-widest flex items-center gap-2">
           <Shield className="h-3 w-3" />
           Security Note
         </p>
         <p className="mt-1 text-xs text-orange-700/80 leading-relaxed">
           You are in Admin View. Event creation and ticket verification are restricted to Organizers. Please switch accounts if you need to perform field operations.
         </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
