import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, CheckCircle2, XCircle, RotateCcw, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { API_URL } from "@/config";
type VerifyState = "idle" | "scanning" | "valid" | "used" | "invalid";

const easing = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const Verify = () => {
  const [state, setState] = useState<VerifyState>("idle");
  const [ticketInput, setTicketInput] = useState("");
  const [foundTicket, setFoundTicket] = useState<any>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (state === "scanning") {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner on unmount", err));
      }
    };
  }, [state]);

  const verifyTicket = async (ticketId: string) => {
    try {
      const res = await fetch(`${API_URL}/verify-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticketId.trim() }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setState("valid");
        setFoundTicket(data.ticket);
      } else if (res.status === 400) {
        setState("used");
        setFoundTicket(data.ticket || { ticketId });
      } else {
        setState("invalid");
        setFoundTicket(null);
      }
    } catch (err) {
      console.error(err);
      setState("invalid");
      setFoundTicket(null);
    }
  };

  const onScanSuccess = (decodedText: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        scannerRef.current = null;
        verifyTicket(decodedText);
      });
    }
  };

  const onScanFailure = (error: any) => {
    // console.warn(`QR error = ${error}`);
  };

  const handleManualVerify = () => {
    verifyTicket(ticketInput);
  };

  const handleReset = () => {
    setState("idle");
    setTicketInput("");
    setFoundTicket(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-foreground">Verify Ticket</h1>
        <p className="mb-8 text-sm text-muted-foreground">Staff verification portal</p>

        <AnimatePresence mode="wait">
          {(state === "idle" || state === "scanning") && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: easing }}
              className="space-y-4"
            >
              {/* Scanner area */}
              <div 
                id="reader" 
                className={`relative flex aspect-square items-center justify-center rounded-lg bg-muted shadow-card overflow-hidden border-2 ${state === 'scanning' ? 'border-primary' : 'border-dashed border-muted-foreground/30'}`}
              >
                {state === "idle" && (
                  <button 
                    onClick={() => setState("scanning")}
                    className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Camera className="h-12 w-12" />
                    <p className="text-sm font-medium">Click to Start Scanner</p>
                  </button>
                )}
              </div>

              {/* Manual input */}
              <div className="text-center text-xs text-muted-foreground pt-4">or enter ticket ID manually</div>
              <div className="flex gap-2">
                <input
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. TICK-123456789"
                  className="flex-1 rounded-md bg-muted px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleManualVerify}
                  disabled={!ticketInput.trim()}
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          )}

          {(state === "valid" || state === "used" || state === "invalid") && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: easing }}
              className="space-y-4"
            >
              {/* Flash result */}
              <div
                className={`flex flex-col items-center gap-3 rounded-lg p-10 ${
                  state === "valid" ? "bg-accent/10" : "bg-destructive/10"
                }`}
              >
                {state === "valid" ? (
                  <CheckCircle2 className="h-16 w-16 text-accent" />
                ) : (
                  <XCircle className="h-16 w-16 text-destructive" />
                )}
                <p className="text-lg font-bold text-foreground uppercase">
                  {state === "valid" ? "Valid Ticket" : state === "used" ? "Already Used" : "Invalid Ticket"}
                </p>
              </div>

              {/* Ticket details */}
              {foundTicket && (
                <div className="rounded-lg bg-card p-5 shadow-card space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-muted-foreground">
                    <span>TICKET_ID</span>
                    <span className="text-foreground">#{foundTicket.ticketId || foundTicket.id}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>EVENT</span>
                    <span className="text-foreground">{foundTicket.eventName || "Unknown Event"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>HOLDER</span>
                    <span className="text-foreground">{foundTicket.userId || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground border-t pt-1.5 mt-1.5">
                    <span>STATUS</span>
                    <span className={state === "valid" ? "text-accent font-bold" : "text-destructive font-bold"}>
                      {state === "valid" ? "VERIFIED & MARKED USED" : "ALREADY USED"}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleReset}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Scan Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 rounded-lg bg-muted/50 p-4 text-[10px] text-muted-foreground">
          <p className="font-bold uppercase mb-1">Scanner Instructions:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Ensure the ticket QR code is clearly visible.</li>
            <li>Grant camera permissions when prompted.</li>
            <li>On success, the ticket is automatically marked as used in the database.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verify;
