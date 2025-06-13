import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import UserReservations from "./pages/UserReservations";
import PaymentPage from "./pages/PaymentPage";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCars from "./pages/admin/Cars";
import AdminReservations from "./pages/admin/Reservations";
import AdminUsers from "./pages/admin/Users";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <title>CarRentalConnect Tinghir | Location de Voitures au Maroc</title>
          <meta name="description" content="Location de voitures à Tinghir et dans la région. Flexibilité, qualité et prix compétitifs pour vos déplacements au Maroc." />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:carId" element={<CarDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:locationId" element={<LocationDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/reservations" element={<UserReservations />} />
            <Route path="/payment/:reservationId" element={<PaymentPage />} />
            <Route path="/reservation/confirmation/:reservationId" element={<ReservationConfirmation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-reservations" element={<UserReservations />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/cars" element={<AdminCars />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
