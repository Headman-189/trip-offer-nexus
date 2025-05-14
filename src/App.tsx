
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import ClientRequests from "@/pages/ClientRequests"; 
import RequestDetail from "@/pages/RequestDetail";
import CreateRequest from "@/pages/CreateRequest";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import AgencyRequests from "@/pages/AgencyRequests";
import AgencyRequestDetail from "@/pages/AgencyRequestDetail";
import AgencyOffers from "@/pages/AgencyOffers";
import ClientProfile from "@/pages/ClientProfile";
import AgencyProfile from "@/pages/AgencyProfile";
import ClientWallet from "@/pages/ClientWallet";
import Notification from "@/pages/Notification";
import Index from "@/pages/Index";
import Messages from "@/pages/Messages";
import AgencyExplorer from "@/pages/AgencyExplorer";
import AgencyPublicProfile from "@/pages/AgencyPublicProfile";

import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/index" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Client routes */}
              <Route path="/requests" element={<ClientRequests />} />
              <Route path="/request/:id" element={<RequestDetail />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/wallet" element={<ClientWallet />} />
              <Route path="/notifications" element={<Notification />} />

              {/* Agency routes */}
              <Route path="/agency-requests" element={<AgencyRequests />} />
              <Route path="/agency-request/:id" element={<AgencyRequestDetail />} />
              <Route path="/agency-offers" element={<AgencyOffers />} />
              <Route path="/agency-profile" element={<AgencyProfile />} />

              {/* Nouvelles routes */}
              <Route path="/messages" element={<Messages />} />
              <Route path="/agencies" element={<AgencyExplorer />} />
              <Route path="/agency/:id" element={<AgencyPublicProfile />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
