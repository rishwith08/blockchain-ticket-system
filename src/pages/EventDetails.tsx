import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, MapPin, Users, Wallet, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { eventImages } from "@/lib/eventImages";
import { useState, useEffect } from "react";

import { API_URL } from "@/config";
const easing = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const EventDetails = () => {
  const { user } = useAuth();
  const { account, isConnected, isConnecting, connectWallet, processPayment } = useBlockchain();
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      console.log(`EventDetails.tsx: Fetching details for event id: ${id}`);
      try {
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) throw new Error("Failed to fetch event details");
        const events = await res.json();
        const found = events.find((e: any) => e.id === id);
        if (!found) throw new Error("Event not found");
        setEvent(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <p className="text-muted-foreground">{error || "Event not found"}</p>
        <Link to="/events" className="mt-4 inline-block text-sm text-primary underline">
          Back to events
        </Link>
      </div>
    );
  }

  const soldOut = event.totalTickets && event.soldTickets >= event.totalTickets;
  const pctSold = event.totalTickets ? Math.round((event.soldTickets / event.totalTickets) * 100) : 0;

  const handleCryptoPayment = async () => {
    if (!user) {
      alert("Please sign in to buy a ticket.");
      return;
    }

    if (!isConnected) {
      const addr = await connectWallet();
      if (!addr) return;
    }

    setPurchasing(true);
    try {
      const payResult = await processPayment(String(event.price));
      if (!payResult.success) throw new Error(payResult.error || "Payment failed");

      const res = await fetch(`${API_URL}/buy-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          eventId: event.id, 
          userId: user.email,
          userEmail: user.email,
          txHash: payResult.hash
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ticket creation failed");
      setPurchased(true);
    } catch (err: any) {
      alert(err.message || "Error during payment.");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/events"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Events
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easing }}
        className="grid gap-8 lg:grid-cols-3"
      >
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-[2/1] overflow-hidden rounded-lg bg-muted shadow-card">
            <img
              src={eventImages[event.id]}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{event.organizer}</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground text-balance">{event.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {event.time}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </div>

          <div className="rounded-lg bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
          </div>

          {/* Contract Info */}
          <div className="rounded-lg bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-foreground mb-3">Contract Details</h2>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-muted-foreground">
                <span>EVENT_ID</span>
                <span className="text-foreground">{event.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>STANDARD</span>
                <span className="text-foreground">ERC-721</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>NETWORK</span>
                <span className="text-foreground">Polygon Amoy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg bg-card p-5 shadow-card space-y-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Price</p>
              <p className="font-mono text-2xl font-bold tabular-nums text-foreground">{event.price} ETH</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Availability
                </div>
                <span className="font-mono tabular-nums">{event.totalTickets - event.soldTickets} left</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pctSold}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground text-right">
                {event.soldTickets}/{event.totalTickets} sold
              </p>
            </div>

            {purchased ? (
              <div className="rounded-md bg-accent/10 p-4 text-center">
                <p className="text-sm font-semibold text-accent">Payment Successful!</p>
                <p className="mt-1 text-[10px] text-muted-foreground truncate">Ref: {id}-TX</p>
                <p className="mt-1.5 text-xs text-muted-foreground">Ticket has been minted on-chain</p>
                <Link
                  to="/dashboard"
                  className="mt-3 inline-block text-xs font-medium text-primary underline"
                >
                  View Tickets →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleCryptoPayment}
                disabled={soldOut || purchasing || isConnecting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {purchasing || isConnecting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    {soldOut ? "Sold Out" : isConnected ? "Pay with Crypto" : "Connect Wallet to Buy"}
                  </>
                )}
              </button>
            )}

            <p className="text-[10px] text-muted-foreground text-center">
              Requires MetaMask · Polygon Amoy Testnet
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
