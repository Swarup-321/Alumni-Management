import React, { useEffect, useState } from 'react';
import api from '../services/api';

function MentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [form, setForm] = useState({
    mentor_id: '', mentee_id: '', domain: '', start_date: ''
  });

  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => { fetchMentorships(); }, []);

  const fetchMentorships = async () => {
    try {
      const res = await api.get('/mentorship');
      setMentorships(res.data);
    } catch (err) {
      console.error('Error fetching mentorships:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mentorship', form);
      alert('Mentorship created successfully! 🎉');
      setShowForm(false);
      setForm({ mentor_id: '', mentee_id: '', domain: '', start_date: '' });
      fetchMentorships();
    } catch (err) {
      alert('Error creating mentorship');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this mentorship?')) {
      try {
        await api.delete(`/mentorship/${id}`);
        fetchMentorships();
      } catch (err) {
        alert('Error deleting mentorship');
      }
    }
  };

  const statusConfig = {
    active:    { color: '#388e3c', bg: '#e8f5e9', icon: '🟢' },
    completed: { color: '#1976d2', bg: '#e3f2fd', icon: '✅' },
    dropped:   { color: '#c62828', bg: '#ffebee', icon: '🔴' },
    pending:   { color: '#f57c00', bg: '#fff3e0', icon: '🟡' },
  };

  const domainColors = [
    '#1976d2', '#388e3c', '#f57c00', '#9c27b0',
    '#e53935', '#00897b', '#6d4c41', '#0288d1'
  ];

  const filters = ['all', 'active', 'completed', 'dropped', 'pending'];

  const filtered = activeFilter === 'all'
    ? mentorships
    : mentorships.filter(m => m.status === activeFilter);

  const activeCount = mentorships.filter(m => m.status === 'active').length;
  const completedCount = mentorships.filter(m => m.status === 'completed').length;
  const uniqueDomains = [...new Set(mentorships.map(m => m.domain).filter(Boolean))].length;

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4a148c 0%, #9c27b0 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(156,39,176,0.3)'
      }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 24 }}>👥 Mentorship Program</h1>
          <p style={{ color: '#e1bee7', margin: '6px 0 0', fontSize: 14 }}>
            {mentorships.length} mentorship pairs • {uniqueDomains} domains
          </p>
        </div>
        {['alumni', 'admin'].includes(role) && (
          <button onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 22px',
              background: showForm ? 'rgba(255,255,255,0.15)' : '#f57c00',
              color: '#fff', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600, fontSize: 14,
              boxShadow: showForm ? 'none' : '0 4px 12px rgba(245,124,0,0.4)'
            }}>
            {showForm ? '✕ Cancel' : '+ Add Mentorship'}
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Pairs', value: mentorships.length, icon: '👥', color: '#9c27b0', bg: '#f3e5f5' },
          { label: 'Active', value: activeCount, icon: '🟢', color: '#388e3c', bg: '#e8f5e9' },
          { label: 'Completed', value: completedCount, icon: '✅', color: '#1976d2', bg: '#e3f2fd' },
          { label: 'Domains', value: uniqueDomains, icon: '🎯', color: '#f57c00', bg: '#fff3e0' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 12, padding: '16px 18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ color: '#888', margin: 0, fontSize: 12 }}>{s.label}</p>
              <h2 style={{ color: s.color, margin: '2px 0 0', fontSize: 20 }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && ['alumni', 'admin'].includes(role) && (
        <div style={{
          background: '#fff', padding: 28, borderRadius: 14, marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #9c27b0'
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#9c27b0' }}>👥 Create Mentorship</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input type="number" placeholder="Mentor User ID"
              value={form.mentor_id}
              onChange={e => setForm({ ...form, mentor_id: e.target.value })}
              required
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input type="number" placeholder="Mentee User ID"
              value={form.mentee_id}
              onChange={e => setForm({ ...form, mentee_id: e.target.value })}
              required
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input placeholder="Domain (e.g. Web Dev, AI, Finance)"
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input type="date" value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <button type="submit"
              style={{
                gridColumn: 'span 2', padding: 14,
                background: 'linear-gradient(135deg, #9c27b0, #ce93d8)',
                color: '#fff', border: 'none', borderRadius: 8,
                cursor: 'pointer', fontWeight: 600, fontSize: 15
              }}>
              🚀 Create Mentorship
            </button>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{
              padding: '8px 20px', borderRadius: 20, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              textTransform: 'capitalize', transition: 'all 0.2s',
              background: activeFilter === f ? '#9c27b0' : '#fff',
              color: activeFilter === f ? '#fff' : '#666',
              boxShadow: activeFilter === f
                ? '0 4px 12px rgba(156,39,176,0.3)'
                : '0 2px 6px rgba(0,0,0,0.08)'
            }}>
            {f === 'all' ? `All (${mentorships.length})` : `${statusConfig[f]?.icon} ${f}`}
          </button>
        ))}
      </div>

      {/* Mentorship Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {filtered.map((m, i) => {
          const sc = statusConfig[m.status] || statusConfig['pending'];
          const domainColor = domainColors[i % domainColors.length];

          return (
            <div key={m.mentorship_id} style={{
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}>

              {/* Top Color Bar */}
              <div style={{
                background: `linear-gradient(135deg, ${domainColor}, ${domainColor}99)`,
                padding: '14px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: 16 }}>
                    🎯 {m.domain || 'General Mentorship'}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    Started: {m.start_date ? new Date(m.start_date).toDateString() : 'N/A'}
                  </p>
                </div>
                <span style={{
                  background: sc.bg, color: sc.color,
                  padding: '4px 12px', borderRadius: 20,
                  fontSize: 12, fontWeight: 700
                }}>
                  {sc.icon} {m.status || 'pending'}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 20px' }}>

                {/* Mentor → Mentee */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  {/* Mentor */}
                  <div style={{ flex: 1, background: '#f3e5f5', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 11, color: '#9c27b0', fontWeight: 700 }}>🎓 MENTOR</p>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e3a5f', fontSize: 14 }}>
                      {m.mentor_name || 'Unknown'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{m.mentor_email}</p>
                  </div>

                  {/* Arrow */}
                  <div style={{ fontSize: 20, color: '#bbb' }}>→</div>

                  {/* Mentee */}
                  <div style={{ flex: 1, background: '#e8f5e9', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 11, color: '#388e3c', fontWeight: 700 }}>👤 MENTEE</p>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e3a5f', fontSize: 14 }}>
                      {m.mentee_name || 'Unknown'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{m.mentee_email}</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {role === 'admin' && (
                    <button onClick={() => handleDelete(m.mentorship_id)}
                      style={{
                        padding: '7px 14px', background: '#ffebee',
                        color: '#e53935', border: '1px solid #ef9a9a',
                        borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600
                      }}>
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            gridColumn: 'span 2', padding: 60, textAlign: 'center',
            background: '#fff', borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <h3 style={{ color: '#bbb', margin: 0 }}>No mentorships found</h3>
            <p style={{ color: '#ccc', margin: '8px 0 0' }}>Create your first mentorship!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorshipPage;
