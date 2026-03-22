import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/lib/mockData";
import { eventImages } from "@/lib/eventImages";

const easing = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export const EventCard = ({ event }: { event: Event }) => {
  const soldOut = event.soldTickets >= event.totalTickets;
  const pctSold = Math.round((event.soldTickets / event.totalTickets) * 100);
  const bannerSrc = eventImages[event.id];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: easing }}
    >
      <Link
        to={`/events/${event.id}`}
        className="group block overflow-hidden rounded-lg bg-card shadow-card transition-shadow hover:shadow-card-hover"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={bannerSrc}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {soldOut && (
            <div className="absolute right-2 top-2 rounded-sm bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground">
              Sold Out
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {event.organizer}
            </p>
            <h3 className="text-base font-semibold text-foreground text-balance leading-tight">
              {event.title}
            </h3>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{event.price} ETH</span>
            </div>
            <div className="text-right">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pctSold}%` }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {event.soldTickets}/{event.totalTickets}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
