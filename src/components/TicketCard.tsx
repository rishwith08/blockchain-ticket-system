import React from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const easing = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export const TicketCard = ({ ticket }: { ticket: any }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: easing }}
      className="relative overflow-hidden rounded-lg bg-card p-5 shadow-card flex flex-col gap-4 border"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Event Ticket</h3>
          <p className="text-lg font-semibold text-foreground leading-tight text-balance">
            {ticket.eventName}
          </p>
        </div>
        <div
          className={`rounded-sm px-2 py-1 text-[10px] font-bold uppercase ${
            ticket.used
              ? "bg-muted text-muted-foreground"
              : "bg-accent/10 text-accent"
          }`}
        >
          {ticket.used ? "Used" : "Valid"}
        </div>
      </div>

      <div className="flex items-center justify-center rounded-md bg-white p-4">
        <QRCode
          value={ticket.ticketId || ticket.id}
          size={160}
        />
      </div>

      <div className="space-y-1.5 border-t pt-4">
        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>TICKET_ID</span>
          <span className="text-foreground">#{ticket.ticketId || ticket.id}</span>
        </div>
        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>EVENT_ID</span>
          <span className="text-foreground">{ticket.eventId}</span>
        </div>
        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>HOLDER</span>
          <span className="text-foreground">{ticket.userId}</span>
        </div>
        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>DATE</span>
          <span className="text-foreground">{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
        </div>
      </div>

      <button 
        onClick={async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          const originalText = btn.innerText;
          btn.innerText = "Generating...";
          
          const card = (btn.parentElement as HTMLElement);
          if (card) {
            // Hide the button from PDF
            btn.style.display = 'none';
            const canvas = await html2canvas(card, {
              backgroundColor: "#ffffff",
              scale: 2,
              useCORS: true
            });
            btn.style.display = 'block';
            
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 120;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.setFontSize(16);
            pdf.text("CHAIN TICKET - OFFICIAL TICKET", 105, 20, { align: "center" });
            pdf.addImage(imgData, 'PNG', (210 - imgWidth) / 2, 30, imgWidth, imgHeight);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(`Generated on ${new Date().toLocaleString()}`, 105, 30 + imgHeight + 10, { align: "center" });
            pdf.save(`ticket-${ticket.ticketId || ticket.id}.pdf`);
          }
          
          btn.disabled = false;
          btn.innerText = originalText;
        }}
        className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        Download Ticket PDF
      </button>
    </motion.div>
  );
};
