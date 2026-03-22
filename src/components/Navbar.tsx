import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Ticket, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Wallet } from "lucide-react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { account, isConnected, isConnecting, connectWallet } = useBlockchain();

  const navLinks = [
    { to: "/events", label: "Events", show: true },
    { 
      to: role === "admin" ? "/admin-dashboard" : role === "organizer" ? "/organizer-dashboard" : "/user-dashboard", 
      label: "Dashboard", 
      show: !!user 
    },
    { to: "/verify", label: "Scan QR", show: role === "organizer" },
  ].filter((l) => l.show);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ChainTicket" className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-foreground">ChainTicket</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks?.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label === "Admin" && <Shield className="h-3 w-3" />}
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-x-1 -bottom-[1px] h-0.5 rounded-full bg-primary"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
                {role && (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    {role}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2 rounded-md bg-accent/10 px-3 py-1.5">
                <Wallet className="h-3.5 w-3.5 text-accent" />
                {isConnected ? (
                  <span className="text-xs font-mono text-accent">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                ) : (
                  <button 
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </button>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="border-t bg-background px-4 pb-4 md:hidden"
        >
          {navLinks?.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { setOpen(false); handleSignOut(); }}
              className="mt-2 w-full rounded-md bg-muted px-4 py-2.5 text-sm font-medium text-foreground"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
};
