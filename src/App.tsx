
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Main Routes */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Client Routes */}
              <Route path="/my-requests" element={<ClientRequests />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/request/:id" element={<RequestDetail />} />
              
              {/* Agency Routes */}
              <Route path="/requests" element={<AgencyRequests />} />
              <Route path="/agency/request/:id" element={<AgencyRequestDetail />} />
              <Route path="/my-offers" element={<AgencyOffers />} />
              
              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
