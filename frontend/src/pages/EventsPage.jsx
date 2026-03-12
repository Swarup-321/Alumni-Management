import React, { useEffect, useState } from 'react';
import api from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', max_capacity: '' });
  const role = localStorage.getItem('role');

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { ...form, created_by: localStorage.getItem('user_id') });
      setShowForm(false);
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) { alert('Error creating event'); }
  };

  const handleRegister = async (event_id) => {
    try {
      await api.post('/events/register', { event_id, user_id: localStorage.getItem('user_id') });
      alert('Registered successfully!');
    } catch (err) { alert('Already registered or error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>📅 Events</h1>
        {role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Create Event'}
          </button>
        )}
      </div>

      {showForm && role === 'admin' && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Create New Event</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <input type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <input type="number" placeholder="Max Capacity" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ gridColumn: 'span 2', padding: 10, border: '1px solid #ddd', borderRadius: 6, minHeight: 80 }} />
            <button type="submit" style={{ gridColumn: 'span 2', padding: 12, background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Create Event</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {events.map(event => (
          <div key={event.event_id} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #7b1fa2' }}>
            <h3 style={{ color: '#1e3a5f' }}>{event.title}</h3>
            <p style={{ color: '#555', marginTop: 4 }}>📍 {event.location}</p>
            <p style={{ color: '#7b1fa2', marginTop: 4 }}>🗓️ {new Date(event.event_date).toLocaleString()}</p>
            <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>{event.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ color: '#388e3c', fontSize: 13 }}>👥 {event.registered_count}/{event.max_capacity} registered</span>
              {['alumni', 'student', 'admin'].includes(role) && (
                <button onClick={() => handleRegister(event.event_id)} style={{ padding: '8px 16px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  Register
                </button>
              )}
            </div>
          </div>
        ))}
        {events.length === 0 && <p style={{ color: '#888' }}>No events yet.</p>}
      </div>
    </div>
  );
}

export default EventsPage;
