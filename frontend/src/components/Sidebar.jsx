import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ onLogout, role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/alumni', label: '🎓 Alumni' },
    { path: '/jobs', label: '💼 Jobs' },
    { path: '/events', label: '📅 Events' },
    { path: '/donations', label: '💰 Donations' },
    { path: '/mentorship', label: '👥 Mentorship' },
  ];

  return (
    <div style={{
      width: 220,
      minHeight: '100vh',
      background: '#1e3a5f',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0, left: 0,
      padding: '0 0 20px 0'
    }}>
      {/* Top - Logo + Nav */}
      <div>
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 18 }}>🎓 Alumni Portal</h2>
          <p style={{ color: '#90caf9', margin: '4px 0 0', fontSize: 12, textTransform: 'capitalize' }}>
            Logged in as: <strong>{role}</strong>
          </p>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '12px 0' }}>
          {navItems.map(item => (
            <div key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                color: location.pathname === item.path ? '#fff' : '#90caf9',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid #f57c00' : '4px solid transparent',
                fontSize: 15,
                transition: 'all 0.2s'
              }}>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom - Update Profile + Logout */}
      <div style={{ padding: '0 12px' }}>
        <button
          onClick={() => navigate('/alumni', { state: { openProfile: true } })}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: 10,
            background: '#f57c00',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}>
          ✏️ Update Profile
        </button>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
