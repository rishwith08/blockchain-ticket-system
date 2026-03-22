import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, QrCode, Blocks, ArrowRight } from "lucide-react";

const easing = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const features = [
  {
    icon: Blocks,
    title: "On-Chain Ownership",
    desc: "Every ticket is an ERC-721 token. Ownership is cryptographically verifiable and immutable.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    desc: "Instant scan-to-verify at venue gates. Real-time blockchain lookup confirms validity.",
  },
  {
    icon: Shield,
    title: "Fraud Prevention",
    desc: "Duplicate tickets are impossible. Each token ID is unique and can only be used once.",
  },
];

const stats = [
  { value: "12,847", label: "Tickets Minted" },
  { value: "156", label: "Events Deployed" },
  { value: "0", label: "Fraudulent Entries" },
  { value: "< 2s", label: "Verification Time" },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 pb-24 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easing }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
            Polygon Amoy Testnet
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Cryptographic proof,{" "}
            <span className="text-primary">not paper promises</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
            ChainTicket replaces fragile PDFs and screenshots with ERC-721 tokens.
            Every ticket is verifiable on-chain in under two seconds.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-muted px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
            >
              Organizer Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto grid grid-cols-2 gap-px sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-6 py-8 text-center">
              <div className="font-mono text-2xl font-bold tabular-nums text-foreground">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Three layers of trust between event and attendee.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1, ease: easing }}
              className="rounded-lg bg-card p-6 shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contract */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-lg bg-card p-6 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">Smart Contract</h3>
            <div className="mt-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-muted-foreground">
                <span>CONTRACT_ADDR</span>
                <span className="text-foreground">0x1a2B...9f0E</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>NETWORK</span>
                <span className="text-foreground">Polygon Amoy</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>STANDARD</span>
                <span className="text-foreground">ERC-721</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>STATUS</span>
                <span className="text-accent font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <span className="text-xs text-muted-foreground">© 2026 ChainTicket</span>
          <span className="font-mono text-[10px] text-muted-foreground">v0.1.0-testnet</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
