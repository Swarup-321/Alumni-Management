import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AlumniPage from './pages/AlumniPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import DonationsPage from './pages/DonationsPage';
import MentorshipPage from './pages/MentorshipPage';
import Sidebar from './components/Sidebar';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');  // ✅ important for donations/profile
    setRole(null);
  };

  if (!role) return <LoginPage onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
        <Sidebar onLogout={handleLogout} role={role} />
        <div style={{ flex: 1, padding: 24, marginLeft: 220, maxWidth: 'calc(100vw - 220px)', overflowX: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
