import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminLogin from "./adminauth/AdminLogin";
import AdminDashboard from "./layout/admin/AdminDashboard";
import AddCategory from "./layout/admin/pages/eventcategories/AddCategory";
import ManageCategory from "./layout/admin/pages/eventcategories/ManageCategory";
import AddEvent from "./layout/admin/pages/events/AddEvent";
import ManageEvent from "./layout/admin/pages/events/ManageEvent";
import SearchPage from "./pages/SearchPage";
import EventDetail from "./pages/EventDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/manage-category" element={<ManageCategory />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/manage-event" element={<ManageEvent />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </>
  );
}

export default App;