import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', graduation_year: '', degree: '', department: '', phone: '', current_city: '', linkedin_url: '' });

  useEffect(() => {
    api.get('/alumni').then(res => setAlumni(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alumni', { ...form, user_id: 1 });
      setShowForm(false);
      const res = await api.get('/alumni');
      setAlumni(res.data);
    } catch (err) {
      alert('Error adding alumni');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>🎓 Alumni</h1>
        {localStorage.getItem('role') === 'admin' && (
  <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
    {showForm ? 'Cancel' : '+ Add Alumni'}
  </button>
)}

      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Add New Alumni</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['full_name', 'graduation_year', 'degree', 'department', 'phone', 'current_city', 'linkedin_url'].map(field => (
              <input key={field} placeholder={field.replace('_', ' ')}
                value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            ))}
            <button type="submit" style={{ gridColumn: 'span 2', padding: 12, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Save Alumni
            </button>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e3f2fd' }}>
              {['Name', 'Email', 'Degree', 'Department', 'Year', 'City'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#1e3a5f' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alumni.map((a, i) => (
              <tr key={a.profile_id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ padding: '10px 12px' }}>{a.full_name}</td>
                <td style={{ padding: '10px 12px', color: '#666' }}>{a.email}</td>
                <td style={{ padding: '10px 12px' }}>{a.degree}</td>
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

export default AlumniPage;
