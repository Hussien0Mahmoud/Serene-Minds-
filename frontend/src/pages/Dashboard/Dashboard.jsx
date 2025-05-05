import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SearchProvider } from '../../context/SearchContext';
import DashboardHeader from './components/DashboardHeader';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import TherapistDashboard from './components/TherapistDashboard';
import UserDashboard from './components/UserDashboard';
import ManageTherapists from './components/ManageTherapists';
import ManageUsers from './components/ManageUsers';
import AppointmentsList from './components/AppointmentsList';
import ResourcesManager from './components/ResourcesManager';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import ManageEvents from './components/ManageEvents';

export default function Dashboard() {
  const { currentUser } = useSelector(state => state.user);

  const renderDashboard = () => {
    switch(currentUser?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'therapist':
        return <TherapistDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <SearchProvider>
      <div className="dashboard-container">
        <DashboardHeader />
        <div className="d-flex">
          <Sidebar userRole={currentUser.role} />
          <main className="flex-grow-1 dashboard-main p-4">
            <Routes>
              <Route path="/" element={renderDashboard()} />
              
              {currentUser.role === 'admin' && (
                <>
                  <Route path="/therapists" element={<ManageTherapists />} />
                  <Route path="/users" element={<ManageUsers />} />
                  <Route path="/appointments" element={<AppointmentsList />} />
                  <Route path="/resources" element={<ResourcesManager />} />
                  <Route path="/events" element={<ManageEvents />} />
                </>
              )}

              {currentUser.role === 'therapist' && (
                <>
                  <Route path="/appointments" element={<AppointmentsList />} />
                  <Route path="/clients" element={<ManageUsers />} />
                  <Route path="/resources" element={<ResourcesManager />} />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

              {currentUser.role === 'user' && (
                <>
                  <Route path="/appointments" element={<AppointmentsList />} />
                  <Route path="/resources" element={<ResourcesManager />} />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}