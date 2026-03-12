import React, { useEffect, useState } from 'react';
import api from '../services/api';

function MentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mentor_id: '', mentee_id: '', domain: '', start_date: '' });
  const role = localStorage.getItem('role');

  useEffect(() => {
    api.get('/mentorship').then(res => setMentorships(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mentorship', form);
      setShowForm(false);
      const res = await api.get('/mentorship');
      setMentorships(res.data);
    } catch (err) { alert('Error creating mentorship'); }
  };

  const statusColor = { active: '#388e3c', completed: '#1976d2', dropped: '#c62828' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>👥 Mentorship</h1>
        {['alumni', 'admin'].includes(role) && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#f57c00', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Add Mentorship'}
          </button>
        )}
      </div>

      {showForm && ['alumni', 'admin'].includes(role) && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Create Mentorship</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input type="number" placeholder="Mentor User ID" value={form.mentor_id} onChange={e => setForm({ ...form, mentor_id: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <input type="number" placeholder="Mentee User ID" value={form.mentee_id} onChange={e => setForm({ ...form, mentee_id: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <input placeholder="Domain (e.g. Web Dev)" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <button type="submit" style={{ gridColumn: 'span 2', padding: 12, background: '#f57c00', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Create Mentorship</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {mentorships.map(m => (
          <div key={m.mentorship_id} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${statusColor[m.status]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: '#1e3a5f' }}>{m.domain}</h3>
              <span style={{ background: statusColor[m.status], color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>{m.status}</span>
            </div>
            <p style={{ marginTop: 8 }}>🎓 <strong>Mentor:</strong> {m.mentor_name}</p>
            <p style={{ marginTop: 4 }}>👤 <strong>Mentee:</strong> {m.mentee_name}</p>
            <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Started: {new Date(m.start_date).toLocaleDateString()}</p>
          </div>
        ))}
        {mentorships.length === 0 && <p style={{ color: '#888' }}>No mentorships yet.</p>}
      </div>
    </div>
  );
}

export default MentorshipPage;
