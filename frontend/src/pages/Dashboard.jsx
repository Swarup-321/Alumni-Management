import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ total_alumni: 0, total_donations: 0, total_users: 0, total_jobs: 0 });
  const [donationStats, setDonationStats] = useState({ avg_donation: 0, highest: 0, lowest: 0, total: 0, count: 0 });
  const [alumniByDept, setAlumniByDept] = useState([]);
  const [donationsByMode, setDonationsByMode] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [s, ds, ad, dm, td, ra] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/donation-stats'),
        api.get('/dashboard/alumni-by-department'),
        api.get('/dashboard/donations-by-mode'),
        api.get('/dashboard/top-donors'),
        api.get('/dashboard/recent-alumni'),
      ]);
      setStats(s.data);
      setDonationStats(ds.data);
      setAlumniByDept(ad.data);
      setDonationsByMode(dm.data);
      setTopDonors(td.data);
      setRecentAlumni(ra.data);
    } catch (err) {
      console.error('Dashboard error:', err.message);
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length >= 2) {
      try {
        const res = await api.get(`/dashboard/search?q=${q}`);
        setSearchResults(res.data);
      } catch (err) { console.error(err); }
    } else {
      setSearchResults([]);
    }
  };

  const modeColors = { UPI: '#4caf50', netbanking: '#1976d2', cash: '#f57c00', cheque: '#9c27b0' };
  const modeIcons = { UPI: '📱', netbanking: '🏦', cash: '💵', cheque: '📝' };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1976d2 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(25,118,210,0.3)'
      }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 26 }}>👋 Welcome Back!</h1>
          <p style={{ color: '#90caf9', margin: '6px 0 0', fontSize: 15 }}>
            Here's what's happening in your Alumni Network today.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            padding: '6px 16px', borderRadius: 20, fontSize: 14,
            textTransform: 'capitalize', fontWeight: 600
          }}>
            🔑 {role}
          </span>
          <p style={{ color: '#90caf9', margin: '8px 0 0', fontSize: 13 }}>
            {new Date().toDateString()}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
          <input
            placeholder="Search alumni by name, department or company..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%', padding: '14px 16px 14px 48px',
              borderRadius: 12, border: '2px solid #e3f2fd',
              fontSize: 15, outline: 'none', boxSizing: 'border-box',
              background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.border = '2px solid #1976d2'}
            onBlur={e => e.target.style.border = '2px solid #e3f2fd'}
          />
        </div>
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: 56, left: 0, right: 0,
            background: '#fff', borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 100, maxHeight: 260, overflowY: 'auto',
            border: '1px solid #e3f2fd'
          }}>
            {searchResults.map((r, i) => (
              <div key={i} style={{
                padding: '12px 20px', borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1976d2' }}>
                  {r.full_name?.[0] || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e3a5f' }}>{r.full_name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{r.department} • {r.current_company || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4 Main Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Alumni', value: stats.total_alumni, icon: '🎓', color: '#1976d2', bg: '#e3f2fd' },
          { label: 'Total Raised', value: `₹${Number(stats.total_donations || 0).toLocaleString()}`, icon: '💰', color: '#388e3c', bg: '#e8f5e9' },
          { label: 'Total Users', value: stats.total_users, icon: '👥', color: '#f57c00', bg: '#fff3e0' },
          { label: 'Active Jobs', value: stats.total_jobs, icon: '💼', color: '#9c27b0', bg: '#f3e5f5' },
        ].map((card, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: '20px 24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', gap: 16,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              {card.icon}
            </div>
            <div>
              <p style={{ color: '#888', margin: 0, fontSize: 13 }}>{card.label}</p>
              <h2 style={{ color: card.color, margin: '4px 0 0', fontSize: 24 }}>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Alumni by Department */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e3a5f', margin: '0 0 20px', fontSize: 16 }}>🏫 Alumni by Department</h3>
          {alumniByDept.slice(0, 5).map((d, i) => {
            const percent = Math.min((d.total / (alumniByDept[0]?.total || 1)) * 100, 100);
            const colors = ['#1976d2', '#388e3c', '#f57c00', '#9c27b0', '#e53935'];
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#444' }}>{d.department}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors[i] }}>{d.total}</span>
                </div>
                <div style={{ background: '#f0f0f0', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${colors[i]}, ${colors[i]}aa)`,
                    width: `${percent}%`, height: '100%', borderRadius: 8,
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            );
          })}
          {alumniByDept.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>No data yet</p>}
        </div>

        {/* Donations by Payment Mode */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e3a5f', margin: '0 0 20px', fontSize: 16 }}>💳 Donations by Payment Mode</h3>
          {donationsByMode.map((d, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', marginBottom: 10, borderRadius: 10,
              background: `${modeColors[d.payment_mode] || '#666'}11`,
              border: `1px solid ${modeColors[d.payment_mode] || '#666'}33`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{modeIcons[d.payment_mode] || '💳'}</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e3a5f', textTransform: 'capitalize' }}>{d.payment_mode}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{d.total_transactions} transactions</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: modeColors[d.payment_mode] || '#666', fontSize: 16 }}>
                ₹{Number(d.total_amount).toLocaleString()}
              </div>
            </div>
          ))}
          {donationsByMode.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>No donations yet</p>}
        </div>
      </div>

      {/* Donation Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Highest Donation', value: `₹${Number(donationStats.highest || 0).toLocaleString()}`, icon: '📈', color: '#e53935' },
          { label: 'Average Donation', value: `₹${Number(donationStats.avg_donation || 0).toFixed(0)}`, icon: '📊', color: '#00897b' },
          { label: 'Total Transactions', value: donationStats.count || 0, icon: '🔄', color: '#6d4c41' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: '18px 22px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', gap: 14
          }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <p style={{ color: '#888', margin: 0, fontSize: 13 }}>{s.label}</p>
              <h3 style={{ color: s.color, margin: '4px 0 0' }}>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Top Donors */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e3a5f', margin: '0 0 20px', fontSize: 16 }}>🏆 Top Donors</h3>
          {topDonors.map((donor, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 0', borderBottom: i < topDonors.length - 1 ? '1px solid #f5f5f5' : 'none'
            }}>
              <span style={{ fontSize: 24, minWidth: 30 }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}
              </span>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1976d2', fontSize: 16 }}>
                {donor.full_name?.[0] || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#1e3a5f' }}>{donor.full_name || 'Anonymous'}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{donor.donation_count} donation(s)</div>
              </div>
              <div style={{ fontWeight: 700, color: '#388e3c', fontSize: 15 }}>
                ₹{Number(donor.total_donated).toLocaleString()}
              </div>
            </div>
          ))}
          {topDonors.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>No donors yet</p>}
        </div>

        {/* Recent Alumni */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#1e3a5f', margin: '0 0 20px', fontSize: 16 }}>🆕 Recent Alumni (Last 5 Years)</h3>
          {recentAlumni.slice(0, 5).map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 0', borderBottom: i < 4 ? '1px solid #f5f5f5' : 'none'
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#388e3c', fontSize: 16 }}>
                {a.full_name?.[0] || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#1e3a5f' }}>{a.full_name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{a.department}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, color: '#f57c00', fontSize: 13 }}>{a.graduation_year}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{a.current_company || 'N/A'}</div>
              </div>
            </div>
          ))}
          {recentAlumni.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 20 }}>No recent alumni</p>}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
