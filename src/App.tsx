import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const OrganizerDashboard = React.lazy(() => import("./pages/OrganizerDashboard"));
const UserDashboard = React.lazy(() => import("./pages/UserDashboard"));
import DashboardRedirect from "./pages/DashboardRedirect";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 text-center">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong.</h1>
          <p className="mt-4 text-muted-foreground">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 rounded bg-primary px-4 py-2 text-white">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

console.log("App is initializing...");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <BlockchainProvider>
            <AuthProvider>
              <Navbar />
              <React.Suspense fallback={<div className="p-20 text-center italic">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route
                    path="/dashboard"
                    element={
                      <DashboardRedirect />
                    }
                  />
                  <Route
                    path="/user-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["attendee"]}>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizer-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["organizer"]}>
                        <OrganizerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/verify"
                    element={
                      <ProtectedRoute allowedRoles={["organizer"]}>
                        <Verify />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
            </AuthProvider>
          </BlockchainProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
