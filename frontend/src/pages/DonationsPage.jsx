import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', purpose: '', payment_mode: 'UPI' });
  const role = localStorage.getItem('role');

  useEffect(() => {
    api.get('/donations').then(res => setDonations(res.data)).catch(console.error);
    api.get('/donations/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/donations', { ...form, donor_id: localStorage.getItem('user_id') });
      setShowForm(false);
      const res = await api.get('/donations');
      setDonations(res.data);
      const s = await api.get('/donations/stats');
      setStats(s.data);
    } catch (err) { alert('Error recording donation'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>❤️ Donations</h1>
        {['alumni', 'admin'].includes(role) && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Donate'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Donations', value: stats.total_donations || 0, color: '#1976d2' },
          { label: 'Total Amount', value: `₹${Number(stats.total_amount || 0).toLocaleString()}`, color: '#388e3c' },
          { label: 'Average Donation', value: `₹${Number(stats.avg_amount || 0).toFixed(0)}`, color: '#f57c00' },
          { label: 'Highest Donation', value: `₹${Number(stats.max_donation || 0).toLocaleString()}`, color: '#7b1fa2' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.color}` }}>
            <p style={{ color: '#888', fontSize: 13 }}>{s.label}</p>
            <h2 style={{ color: s.color, fontSize: 24 }}>{s.value}</h2>
          </div>
        ))}
      </div>

      {showForm && ['alumni', 'admin'].includes(role) && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Make a Donation</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <select value={form.payment_mode} onChange={e => setForm({ ...form, payment_mode: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
              {['UPI', 'netbanking', 'cash', 'cheque'].map(m => <option key={m}>{m}</option>)}
            </select>
            <input placeholder="Purpose" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} style={{ gridColumn: 'span 2', padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <button type="submit" style={{ gridColumn: 'span 2', padding: 12, background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Donate Now</button>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: 16 }}>Donation History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fce4ec' }}>
              {['Donor', 'Amount', 'Purpose', 'Mode', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#c62828' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.map((d, i) => (
              <tr key={d.donation_id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ padding: '10px 12px' }}>{d.donor_name}</td>
                <td style={{ padding: '10px 12px', color: '#388e3c', fontWeight: 'bold' }}>₹{Number(d.amount).toLocaleString()}</td>
                <td style={{ padding: '10px 12px' }}>{d.purpose}</td>
                <td style={{ padding: '10px 12px' }}>{d.payment_mode}</td>
                <td style={{ padding: '10px 12px', color: '#888' }}>{new Date(d.donated_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {donations.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20, color: '#888' }}>No donations yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonationsPage;
