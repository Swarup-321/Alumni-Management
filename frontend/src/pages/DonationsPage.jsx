import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DonationPage() {
  const [donations, setDonations] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [donationStats, setDonationStats] = useState({});
  const [topDonors, setTopDonors] = useState([]);
  const [form, setForm] = useState({
    amount: '', purpose: '', payment_mode: 'UPI'
  });

  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    fetchAllDonations();
    fetchMyDonations();
    fetchDonationStats();
    fetchTopDonors();
  }, []);

  const fetchAllDonations = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const fetchMyDonations = async () => {
    try {
      const res = await api.get(`/donations/user/${user_id}`);
      setMyDonations(res.data);
    } catch (err) {
      console.error('Error fetching my donations:', err);
    }
  };

  const fetchDonationStats = async () => {
    try {
      const res = await api.get('/dashboard/donation-stats');
      setDonationStats(res.data);
    } catch (err) {
      console.error('Error fetching donation stats:', err);
    }
  };

  const fetchTopDonors = async () => {
    try {
      const res = await api.get('/dashboard/top-donors');
      setTopDonors(res.data);
    } catch (err) {
      console.error('Error fetching top donors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/donations', { ...form, user_id });
      alert('Donation submitted successfully! 🎉');
      setShowForm(false);
      setForm({ amount: '', purpose: '', payment_mode: 'UPI' });
      fetchAllDonations();
      fetchMyDonations();
      fetchDonationStats();
    } catch (err) {
      alert('Error submitting donation');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this donation?')) {
      try {
        await api.delete(`/donations/${id}`);
        fetchAllDonations();
        fetchMyDonations();
        fetchDonationStats();
      } catch (err) {
        alert('Error deleting donation');
      }
    }
  };

  const displayList = activeTab === 'my' ? myDonations : donations;

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    cursor: 'pointer',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #f57c00' : '3px solid transparent',
    background: 'transparent',
    color: activeTab === tab ? '#f57c00' : '#666',
    fontWeight: activeTab === tab ? 700 : 400,
    fontSize: 15
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>💰 Donations</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#f57c00', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Make a Donation'}
        </button>
      </div>

      {/* Donation Form */}
      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #f57c00' }}>
          <h3 style={{ marginBottom: 16, color: '#f57c00' }}>💰 Make a Donation</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              placeholder="Amount (₹)" type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
            />
            <select value={form.purpose}
              onChange={e => setForm({ ...form, purpose: e.target.value })}
              required
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
              <option value="">Select Purpose</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Library">Library</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sports">Sports</option>
              <option value="General">General Fund</option>
            </select>
            <select value={form.payment_mode}
              onChange={e => setForm({ ...form, payment_mode: e.target.value })}
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
              <option value="UPI">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
            <button type="submit"
              style={{ padding: 12, background: '#f57c00', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
              💰 Submit Donation
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #f57c00' }}>
          <p style={{ color: '#888', margin: 0, fontSize: 13 }}>Total Donations</p>
          <h2 style={{ color: '#1e3a5f', margin: '4px 0 0' }}>{donations.length}</h2>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #388e3c' }}>
          <p style={{ color: '#888', margin: 0, fontSize: 13 }}>Total Raised</p>
          <h2 style={{ color: '#388e3c', margin: '4px 0 0' }}>
            ₹{Number(donationStats.total || 0).toLocaleString()}
          </h2>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #1976d2' }}>
          <p style={{ color: '#888', margin: 0, fontSize: 13 }}>My Total Donated</p>
          <h2 style={{ color: '#1976d2', margin: '4px 0 0' }}>
            ₹{myDonations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0).toLocaleString()}
          </h2>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #9c27b0' }}>
          <p style={{ color: '#888', margin: 0, fontSize: 13 }}>Avg Donation</p>
          <h2 style={{ color: '#9c27b0', margin: '4px 0 0' }}>
            ₹{Number(donationStats.avg_donation || 0).toFixed(0)}
          </h2>
        </div>
      </div>

      {/* Top Donors */}
      {topDonors.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#1e3a5f', marginBottom: 16 }}>🏆 Top Donors</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {topDonors.map((donor, i) => (
              <div key={i} style={{ background: '#fff8e1', borderRadius: 10, padding: '12px 20px', border: '1px solid #ffe082', minWidth: 160 }}>
                <div style={{ fontSize: 20 }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}</div>
                <div style={{ fontWeight: 700, color: '#1e3a5f' }}>{donor.full_name || 'Anonymous'}</div>
                <div style={{ color: '#388e3c', fontWeight: 600 }}>₹{Number(donor.total_donated).toLocaleString()}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{donor.donation_count} donation(s)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs + Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ borderBottom: '1px solid #eee', display: 'flex' }}>
          <button style={tabStyle('all')} onClick={() => setActiveTab('all')}>
            📋 All Donations ({donations.length})
          </button>
          <button style={tabStyle('my')} onClick={() => setActiveTab('my')}>
            🙋 My Donations ({myDonations.length})
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e3f2fd' }}>
                {['Donor', 'Email', 'Amount', 'Purpose', 'Payment Mode', 'Date',
                  ...(role === 'admin' ? ['Action'] : [])].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#1e3a5f' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayList.map((d, i) => (
                <tr key={d.donation_id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '10px 12px' }}>{d.full_name || 'Anonymous'}</td>
                  <td style={{ padding: '10px 12px', color: '#666' }}>{d.email || '-'}</td>
                  <td style={{ padding: '10px 12px', color: '#388e3c', fontWeight: 600 }}>₹{d.amount}</td>
                  <td style={{ padding: '10px 12px' }}>{d.purpose || '-'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: '#e3f2fd', color: '#1976d2' }}>
                      {d.payment_mode}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#888', fontSize: 13 }}>
                    {new Date(d.donated_at).toLocaleDateString()}
                  </td>
                  {role === 'admin' && (
                    <td style={{ padding: '10px 12px' }}>
                      <button onClick={() => handleDelete(d.donation_id)}
                        style={{ padding: '4px 10px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                        🗑️ Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {displayList.length === 0 && (
                <tr>
                  <td colSpan={role === 'admin' ? 7 : 6}
                    style={{ padding: 30, textAlign: 'center', color: '#888' }}>
                    {activeTab === 'my' ? '🙋 You have not made any donations yet.' : '💰 No donations found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;
