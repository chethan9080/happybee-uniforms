import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import LoginNew from "./pages/login-new";
import Login from "./pages/Login";
import WorkerDashboard from "./pages/WorkerDashboard";
import Attendance from "./pages/Attendance";
import Stock from "./pages/Stock";
import EnterStock from "./pages/EnterStock";
import ViewStock from "./pages/ViewStock";
import Billing from "./pages/Billing";
import BillsRecord from "./pages/BillsRecord";
import Returns from "./pages/Returns";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerStock from "./pages/OwnerStock";
import OwnerEnterStock from "./pages/OwnerEnterStock";
import OwnerViewStock from "./pages/OwnerViewStock";
import OwnerRemaining from "./pages/OwnerRemaining";
import OwnerPlanning from "./pages/OwnerPlanning";
import NotFound from "./pages/NotFound";
import HappyBLogin from "./pages/HappyBLogin";
import { LogoBackground } from "./components/LogoBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LogoBackground />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginNew />} />
          <Route path="/old-login" element={<Login />} />
          <Route path="/dashboard" element={<WorkerDashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/enter" element={<EnterStock />} />
          <Route path="/stock/view" element={<ViewStock />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/bills-record" element={<BillsRecord />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/stock" element={<OwnerStock />} />
          <Route path="/owner/stock/enter" element={<OwnerEnterStock />} />
          <Route path="/owner/stock/view" element={<OwnerViewStock />} />
          <Route path="/owner/remaining" element={<OwnerRemaining />} />
          <Route path="/owner/planning" element={<OwnerPlanning />} />
          <Route path="/owner/bills" element={<BillsRecord />} />
          <Route path="/happyb-login" element={<HappyBLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
