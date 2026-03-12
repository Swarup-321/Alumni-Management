import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaBriefcase, FaCalendar, FaHandHoldingHeart, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';

const links = [
  { path: '/', label: 'Dashboard', icon: <FaHome /> },
  { path: '/alumni', label: 'Alumni', icon: <FaUserGraduate /> },
  { path: '/jobs', label: 'Jobs', icon: <FaBriefcase /> },
  { path: '/events', label: 'Events', icon: <FaCalendar /> },
  { path: '/donations', label: 'Donations', icon: <FaHandHoldingHeart /> },
  { path: '/mentorship', label: 'Mentorship', icon: <FaUserFriends /> },
];

function Sidebar({ onLogout, role }) {
  const location = useLocation();

  return (
    <div style={{
      width: 220, background: '#1e3a5f', color: '#fff',
      position: 'fixed', top: 0, left: 0, height: '100vh',
      display: 'flex', flexDirection: 'column', padding: '20px 0'
    }}>
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #2d5a8e' }}>
        <h2 style={{ fontSize: 18, color: '#64b5f6' }}>🎓 Alumni Portal</h2>
        <p style={{ fontSize: 12, color: '#90caf9', marginTop: 4 }}>Role: {role}</p>
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {links.map(link => (
          <Link key={link.path} to={link.path} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px',
            color: location.pathname === link.path ? '#64b5f6' : '#ccc',
            background: location.pathname === link.path ? '#2d5a8e' : 'transparent',
            textDecoration: 'none', fontSize: 14, transition: 'all 0.2s'
          }}>
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>

      <button onClick={onLogout} style={{
        margin: '0 20px 20px', padding: '10px', background: '#c62828',
        color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
      }}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
