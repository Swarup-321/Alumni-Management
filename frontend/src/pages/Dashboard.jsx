import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${color}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <p style={{ color: '#888', fontSize: 13 }}>{title}</p>
        <h2 style={{ fontSize: 32, color, marginTop: 4 }}>{value}</h2>
      </div>
      <span style={{ fontSize: 36 }}>{icon}</span>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({});
  const [alumni, setAlumni] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    api.get('/alumni/stats/dashboard').then(res => setStats(res.data)).catch(console.error);
    api.get('/alumni').then(res => setAlumni(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>📊 Dashboard</h1>
        <p style={{ color: '#888', marginTop: 4 }}>Welcome back, <strong>{role}</strong>!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard title="Total Alumni" value={stats.total_alumni || 0} color="#1976d2" icon="🎓" />
        <StatCard title="Active Jobs" value={stats.total_jobs || 0} color="#f57c00" icon="💼" />
        <StatCard title="Events" value={stats.total_events || 0} color="#7b1fa2" icon="📅" />
        <StatCard title="Total Donations" value={`₹${Number(stats.total_donations || 0).toLocaleString()}`} color="#388e3c" icon="❤️" />
        <StatCard title="Active Mentorships" value={stats.total_mentorships || 0} color="#c62828" icon="👥" />
        <StatCard title="Total Users" value={stats.total_users || 0} color="#1e3a5f" icon="👤" />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: 16, color: '#1e3a5f' }}>Recent Alumni</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e3f2fd' }}>
              {['Name', 'Email', 'Department', 'Year', 'City'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#1e3a5f', fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alumni.slice(0, 5).map((a, i) => (
              <tr key={a.profile_id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ padding: '10px 12px' }}>{a.full_name}</td>
                <td style={{ padding: '10px 12px', color: '#666' }}>{a.email}</td>
                <td style={{ padding: '10px 12px' }}>{a.department}</td>
                <td style={{ padding: '10px 12px' }}>{a.graduation_year}</td>
                <td style={{ padding: '10px 12px' }}>{a.current_city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
