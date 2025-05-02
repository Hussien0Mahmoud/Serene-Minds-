import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { ProtectedRoute } from './utils/ProtectedRoute';
import './App.css'
import SharedLayout from './sharedlayout/SharedLayout.jsx'
import { Home } from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Appointment from "./pages/Appointment.jsx";
import DoctorDetail from "./pages/DoctorDetail.jsx";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from './pages/Profile';
import BookAppointment from './pages/BookAppointment';

import Events from "./pages/Events.jsx";
import Resources from "./pages/Resources.jsx";

function App() {
  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="appointment" element={<Appointment />} />
          <Route 
            path="doctor/:id" 
            element={
              <ProtectedRoute>
                <DoctorDetail />
              </ProtectedRoute>
            } 
          />
          <Route path="events" element={<Events />} />
          <Route path="resources" element={<Resources />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
