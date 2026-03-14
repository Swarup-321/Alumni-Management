import React, { useEffect, useState } from 'react';
import api from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', event_date: '',
    location: '', max_capacity: ''
  });

  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { ...form, created_by: user_id });
      alert('Event created successfully! 🎉');
      setShowForm(false);
      setForm({ title: '', description: '', event_date: '', location: '', max_capacity: '' });
      fetchEvents();
    } catch (err) {
      alert('Error creating event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Error deleting event');
      }
    }
  };

  const handleRegister = async (event_id) => {
    try {
      await api.post('/events/register', { event_id, user_id });
      alert('Registered successfully! ✅');
      fetchEvents();
    } catch (err) {
      alert('Already registered or error');
    }
  };

  const getEventStatus = (event_date) => {
    const today = new Date();
    const eDate = new Date(event_date);
    if (eDate < today) return { label: 'Completed', color: '#888', bg: '#f5f5f5' };
    const diff = Math.ceil((eDate - today) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return { label: `In ${diff} day${diff > 1 ? 's' : ''}`, color: '#e53935', bg: '#ffebee' };
    return { label: 'Upcoming', color: '#388e3c', bg: '#e8f5e9' };
  };

  const eventColors = ['#1976d2', '#388e3c', '#f57c00', '#9c27b0', '#e53935', '#00897b'];

  const upcomingCount = events.filter(e => new Date(e.event_date) >= new Date()).length;
  const completedCount = events.filter(e => new Date(e.event_date) < new Date()).length;
  const totalRegistrations = events.reduce((sum, e) => sum + (parseInt(e.registered_count) || 0), 0);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#1e3a5f', margin: 0 }}>📅 Events</h1>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
            Manage and register for alumni events
          </p>
        </div>
        {role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px', background: showForm ? '#ccc' : 'linear-gradient(135deg, #388e3c, #66bb6a)',
              color: '#fff', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontSize: 15, fontWeight: 600,
              boxShadow: '0 4px 12px rgba(56,142,60,0.3)'
            }}>
            {showForm ? '✕ Cancel' : '+ Add Event'}
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Events', value: events.length, icon: '📅', color: '#1976d2', bg: '#e3f2fd' },
          { label: 'Upcoming', value: upcomingCount, icon: '🚀', color: '#388e3c', bg: '#e8f5e9' },
          { label: 'Total Registrations', value: totalRegistrations, icon: '✅', color: '#f57c00', bg: '#fff3e0' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 12, padding: '18px 22px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', gap: 14
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ color: '#888', margin: 0, fontSize: 13 }}>{s.label}</p>
              <h2 style={{ color: s.color, margin: '2px 0 0', fontSize: 22 }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div style={{
          background: '#fff', padding: 28, borderRadius: 14, marginBottom: 28,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #388e3c'
        }}>
          <h3 style={{ marginBottom: 20, color: '#388e3c', margin: '0 0 20px' }}>📅 Create New Event</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input placeholder="Event Title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input placeholder="Location" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input type="date" value={form.event_date}
              onChange={e => setForm({ ...form, event_date: e.target.value })} required
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input placeholder="Max Capacity" type="number" value={form.max_capacity}
              onChange={e => setForm({ ...form, max_capacity: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <textarea placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, gridColumn: 'span 2', resize: 'vertical' }} />
            <button type="submit"
              style={{
                gridColumn: 'span 2', padding: 14,
                background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
                color: '#fff', border: 'none', borderRadius: 8,
                cursor: 'pointer', fontSize: 15, fontWeight: 600
              }}>
              🎉 Create Event
            </button>
          </form>
        </div>
      )}

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {events.map((ev, i) => {
          const status = getEventStatus(ev.event_date);
          const color = eventColors[i % eventColors.length];
          const capacityPercent = ev.max_capacity
            ? Math.min((ev.registered_count / ev.max_capacity) * 100, 100)
            : null;

          return (
            <div key={ev.event_id} style={{
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}>

              {/* Color Top Bar */}
              <div style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)`, padding: '16px 20px', position: 'relative' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 17 }}>{ev.title}</h3>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  📍 {ev.location || 'TBD'}
                </p>
                <span style={{
                  position: 'absolute', top: 14, right: 16,
                  background: status.bg, color: status.color,
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600
                }}>
                  {status.label}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: '#555' }}>
                    📅 {ev.event_date ? new Date(ev.event_date).toDateString() : 'TBD'}
                  </span>
                  <span style={{ fontSize: 13, color: '#555' }}>
                    👥 {ev.registered_count || 0} registered
                    {ev.max_capacity ? ` / ${ev.max_capacity}` : ''}
                  </span>
                </div>

                {/* Capacity Bar */}
                {capacityPercent !== null && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#888' }}>Capacity</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: capacityPercent >= 80 ? '#e53935' : '#388e3c' }}>
                        {Math.round(capacityPercent)}%
                      </span>
                    </div>
                    <div style={{ background: '#f0f0f0', borderRadius: 8, height: 8 }}>
                      <div style={{
                        background: capacityPercent >= 80
                          ? 'linear-gradient(90deg, #e53935, #ef9a9a)'
                          : `linear-gradient(90deg, ${color}, ${color}88)`,
                        width: `${capacityPercent}%`, height: '100%', borderRadius: 8,
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>
                )}

                <p style={{ margin: '0 0 14px', color: '#666', fontSize: 13, lineHeight: 1.5 }}>
                  {ev.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#aaa' }}>
                    By: {ev.creator_email}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {role !== 'admin' && new Date(ev.event_date) >= new Date() && (
                      <button onClick={() => handleRegister(ev.event_id)}
                        style={{
                          padding: '7px 16px', background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                          color: '#fff', border: 'none', borderRadius: 6,
                          cursor: 'pointer', fontSize: 13, fontWeight: 600
                        }}>
                        ✅ Register
                      </button>
                    )}
                    {role === 'admin' && (
                      <button onClick={() => handleDelete(ev.event_id)}
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
            </div>
          );
        })}

        {events.length === 0 && (
          <div style={{
            gridColumn: 'span 2', padding: 60, textAlign: 'center',
            color: '#888', background: '#fff', borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <h3 style={{ color: '#bbb', margin: 0 }}>No events yet</h3>
            <p style={{ color: '#ccc', margin: '8px 0 0' }}>Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
