import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarPlus, QrCode, LayoutDashboard, Search, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { API_URL } from "@/config";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<"events" | "scan">("events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Event Creation State
  const [showCreate, setShowCreate] = useState(false);
  const [newEvt, setNewEvt] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: 0,
    totalTickets: 100,
    organizer: user?.email || "Organizer"
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    console.log("OrganizerDashboard: Fetching events...");
    fetch(`${API_URL}/events`)
      .then(res => res.json())
      .then(data => {
        console.log("OrganizerDashboard: Received data:", data);
        if (Array.isArray(data)) {
          setEvents(data.filter((e: any) => e.organizerEmail === user?.email || e.organizer === user?.email));
        } else {
          console.error("OrganizerDashboard: Data is not an array:", data);
          setEvents([]);
        }
        setLoading(false);
      });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OrganizerDashboard: Creating event:", newEvt);
    const res = await fetch(`${API_URL}/create-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newEvt, organizerEmail: user?.email })
    });
    if (res.ok) {
      console.log("OrganizerDashboard: Event created successfully");
      setShowCreate(false);
      fetchEvents();
    } else {
      console.error("OrganizerDashboard: Event creation failed:", res.status);
    }
  };

  useEffect(() => {
    if (tab === "scan") {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [tab]);

  async function onScanSuccess(decodedText: string) {
    // Value is just the ticketId
    const ticketId = decodedText.trim();
    if (!ticketId) return;

    const res = await fetch(`${API_URL}/verify-ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId })
    });
    const data = await res.json();
    setScanResult(data.message);
  }

  function onScanError(err: any) {
    // console.warn(err);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Organizer Dashboard</h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("events")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "events" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            My Events
          </button>
          <button
            onClick={() => setTab("scan")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "scan" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </button>
        </div>
      </div>

      {tab === "events" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Events Managed</h2>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <CalendarPlus className="h-4 w-4" />
              Create Event
            </button>
          </div>

          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Sold</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((e: any) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 font-medium">{e.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                    <td className="px-4 py-3 text-right">{e.soldTickets}/{e.totalTickets}</td>
                    <td className="px-4 py-3 text-right">{(e.soldTickets * e.price).toFixed(2)} ETH</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground italic">No events created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="rounded-lg bg-card p-8 shadow-card border-2 border-dashed border-primary/20">
            <div id="reader" className="w-full bg-black rounded-md overflow-hidden" />
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              Place the ticket QR code in front of the camera
            </div>
          </div>

          {scanResult && (
            <div className={`p-4 rounded-md text-sm font-medium ${scanResult.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {scanResult}
            </div>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-xl border">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Event Title</label>
                <input required className="w-full bg-muted border-none p-2 rounded-md" value={newEvt.title} onChange={e => setNewEvt({...newEvt, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
                  <input type="date" required className="w-full bg-muted border-none p-2 rounded-md" value={newEvt.date} onChange={e => setNewEvt({...newEvt, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Time</label>
                  <input type="time" required className="w-full bg-muted border-none p-2 rounded-md" value={newEvt.time} onChange={e => setNewEvt({...newEvt, time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Price (ETH)</label>
                <input type="number" step="0.001" required className="w-full bg-muted border-none p-2 rounded-md" value={newEvt.price} onChange={e => setNewEvt({...newEvt, price: parseFloat(e.target.value)})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 bg-muted py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
