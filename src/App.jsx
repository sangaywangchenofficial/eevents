import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

import AdminLogin from "./adminauth/AdminLogin";
import AdminDashboard from "./layout/admin/AdminDashboard";

import AddCategory from "./layout/admin/pages/eventcategories/AddCategory";
import ManageCategory from "./layout/admin/pages/eventcategories/ManageCategory";

import AddEvent from "./layout/admin/pages/events/AddEvent";
import ManageEvent from "./layout/admin/pages/events/ManageEvent";

import BookingNotConfrim from "./layout/admin/pages/bookings/BookingNotConfrim";
import BookingList from "./layout/admin/pages/bookings/BookingList";
import BookingConfirm from "./layout/admin/pages/bookings/BookingConfirm";
import BookingConfirmed from "./layout/admin/pages/bookings/BookingConfirmed";
import BookingStatus from "./layout/admin/pages/bookings/BookingStatus";
import BookingCancel from "./layout/admin/pages/bookings/BookingCancel";
import BookingsDetails from "./layout/admin/pages/bookings/BookingsDetails";
import SearchBookings from "./layout/admin/pages/searchbookings/SearchBookings";
import BookingReport from "./layout/admin/pages/bookingreport/bookingreport";

import SearchPage from "./pages/SearchPage";
import EventDetail from "./pages/EventDetails";
import RegisterPage from "./auth/RegisterPage";
import LoginPage from "./auth/LoginPage";
import UserDashboard from "./pages/UserDashboardPage";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/PaymentPage";
import MyBookings from "./pages/MyBookings";
import MyBookingDetails from "./pages/MyBookingDetails";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./auth/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";

import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HelpCenter from "./pages/HelpCentre";
import BookingGuide from "./pages/BookingGuide";
import TermsOfService from "./pages/TermSection";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Categories from "./pages/CategoriesPage";

function App() {
  useEffect(() => {
    const handleSessionExpired = () => {
      toast.warn("Your session has expired. Please login again.");
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "auth:session-expired",
        handleSessionExpired
      );
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/events" element={<SearchPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/event/:id" element={<EventDetail />} />

        {/* Authentication Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Information Routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/booking-guide" element={<BookingGuide />} />
        <Route path="/terms-conditions" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/manage-category" element={<ManageCategory />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/manage-event" element={<ManageEvent />} />

        {/* Admin Booking Routes */}
        <Route
          path="/booking-not-confirm"
          element={<BookingNotConfrim />}
        />
        <Route path="/admin/bookings" element={<BookingList />} />
        <Route path="/admin/bookings/:id" element={<BookingsDetails />} />

        {/* Redirect old booking URL */}
        <Route
          path="/booking-list"
          element={<Navigate to="/admin/bookings" replace />}
        />

        <Route
          path="/search-bookings"
          element={<SearchBookings />}
        />
        <Route path="/booking-cancel" element={<BookingCancel />} />
        <Route path="/booking-confirm" element={<BookingConfirm />} />
        <Route
          path="/booking-confirmed"
          element={<BookingConfirmed />}
        />
        <Route path="/booking-status" element={<BookingStatus />} />
        <Route path="/booking-report" element={<BookingReport />} />

        {/* Protected User Routes */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-booking-details/:bookingId"
          element={
            <ProtectedRoute>
              <MyBookingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;