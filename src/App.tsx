
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRequest from "./pages/CreateRequest";
import ClientRequests from "./pages/ClientRequests";
import RequestDetail from "./pages/RequestDetail";
import AgencyRequests from "./pages/AgencyRequests";
import AgencyRequestDetail from "./pages/AgencyRequestDetail";
import AgencyOffers from "./pages/AgencyOffers";
import AgencyProfile from "./pages/AgencyProfile";
import AgencyExplorer from "./pages/AgencyExplorer";
import AgencyPublicProfile from "./pages/AgencyPublicProfile";
import Messages from "./pages/Messages";
import ClientWallet from "./pages/ClientWallet";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import ClientProfile from "./pages/ClientProfile";
import Notification from "./pages/Notification";

// Create a new query client with default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              {/* Landing Route for non-authenticated users */}
              <Route path="/" element={<Landing />} />
              
              {/* Index Route - handles redirection logic */}
              <Route path="/app" element={<Index />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Main Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Client Routes */}
              <Route path="/my-requests" element={<ClientRequests />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/request/:id" element={<RequestDetail />} />
              <Route path="/wallet" element={<ClientWallet />} />
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/notification/:id" element={<Notification />} />
              <Route path="/agencies" element={<AgencyExplorer />} />
              <Route path="/agency/:id" element={<AgencyPublicProfile />} />
              <Route path="/messages" element={<Messages />} />
              
              {/* Agency Routes */}
              <Route path="/requests" element={<AgencyRequests />} />
              <Route path="/agency/request/:id" element={<AgencyRequestDetail />} />
              <Route path="/my-offers" element={<AgencyOffers />} />
              <Route path="/agency/profile" element={<AgencyProfile />} />
              
              {/* Redirects for easier navigation */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
