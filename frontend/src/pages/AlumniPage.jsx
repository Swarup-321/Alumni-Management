import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    user_id: '', full_name: '', graduation_year: '', degree: '',
    department: '', phone: '', current_city: '', linkedin_url: '', current_company: ''
  });
  const [profileForm, setProfileForm] = useState({
    full_name: '', graduation_year: '', degree: '',
    department: '', phone: '', current_city: '', linkedin_url: '', current_company: ''
  });

  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('user_id');
  const location = useLocation();

  useEffect(() => { fetchAlumni(); }, []);

  useEffect(() => {
    if (location.state?.openProfile && alumni.length > 0) {
      handleEditMyProfile();
    }
  }, [alumni]);

  const fetchAlumni = () => {
    api.get('/alumni').then(res => setAlumni(res.data)).catch(console.error);
  };

  const handleEditMyProfile = () => {
    const myProfile = alumni.find(a => String(a.user_id) === String(user_id));
    if (myProfile) {
      setProfileForm({
        full_name: myProfile.full_name || '',
        graduation_year: myProfile.graduation_year || '',
        degree: myProfile.degree || '',
        department: myProfile.department || '',
        phone: myProfile.phone || '',
        current_city: myProfile.current_city || '',
        linkedin_url: myProfile.linkedin_url || '',
        current_company: myProfile.current_company || ''
      });
      setEditId(myProfile.profile_id);
      setShowProfileForm(true);
    } else {
      alert('No alumni profile found for your account!');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/alumni/${editId}`, { ...profileForm });
      alert('Profile updated successfully! ✅');
      setShowProfileForm(false);
      fetchAlumni();
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alumni', { ...form });
      setShowForm(false);
      setForm({ user_id: '', full_name: '', graduation_year: '', degree: '', department: '', phone: '', current_city: '', linkedin_url: '', current_company: '' });
      fetchAlumni();
    } catch (err) {
      alert('Error adding alumni');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this alumni?')) {
      try {
        await api.delete(`/alumni/${id}`);
        fetchAlumni();
      } catch (err) {
        alert('Error deleting alumni');
      }
    }
  };

  const filtered = alumni.filter(a =>
    (a.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.department?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.current_company?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deptColors = {
    'Computer Engineering': '#1976d2',
    'Information Technology': '#388e3c',
    'Electronics': '#f57c00',
    'Mechanical': '#9c27b0',
    'Civil': '#e53935',
  };

  const getDeptColor = (dept) => deptColors[dept] || '#00897b';

  const totalByDept = alumni.reduce((acc, a) => {
    if (a.department) acc[a.department] = (acc[a.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1976d2 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(25,118,210,0.3)'
      }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 24 }}>🎓 Alumni Network</h1>
          <p style={{ color: '#90caf9', margin: '6px 0 0', fontSize: 14 }}>
            {alumni.length} alumni registered across {Object.keys(totalByDept).length} departments
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleEditMyProfile}
            style={{
              padding: '10px 20px', background: '#f57c00',
              color: '#fff', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600, fontSize: 14
            }}>
            ✏️ My Profile
          </button>
          {role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px',
                background: showForm ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14
              }}>
              {showForm ? '✕ Cancel' : '+ Add Alumni'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {Object.entries(totalByDept).slice(0, 4).map(([dept, count], i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 12, padding: '16px 18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            borderLeft: `4px solid ${getDeptColor(dept)}`
          }}>
            <p style={{ color: '#888', margin: 0, fontSize: 12 }}>{dept}</p>
            <h2 style={{ color: getDeptColor(dept), margin: '4px 0 0', fontSize: 22 }}>{count}</h2>
          </div>
        ))}
      </div>

      {/* Update My Profile Form */}
      {showProfileForm && (
        <div style={{
          background: '#fff', padding: 28, borderRadius: 14, marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #f57c00'
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#f57c00' }}>✏️ Update My Profile</h3>
          <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'full_name', label: 'Full Name' },
              { key: 'graduation_year', label: 'Graduation Year' },
              { key: 'degree', label: 'Degree' },
              { key: 'department', label: 'Department' },
              { key: 'phone', label: 'Phone' },
              { key: 'current_city', label: 'Current City' },
              { key: 'linkedin_url', label: 'LinkedIn URL' },
              { key: 'current_company', label: 'Current Company' }
            ].map(f => (
              <input key={f.key}
                placeholder={f.label}
                value={profileForm[f.key]}
                onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }}
              />
            ))}
            <button type="submit"
              style={{ gridColumn: 'span 2', padding: 14, background: 'linear-gradient(135deg, #f57c00, #ffb74d)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
              Save Changes
            </button>
            <button type="button" onClick={() => setShowProfileForm(false)}
              style={{ gridColumn: 'span 2', padding: 12, background: '#f5f5f5', color: '#666', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Add Alumni Form */}
      {showForm && role === 'admin' && (
        <div style={{
          background: '#fff', padding: 28, borderRadius: 14, marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #1976d2'
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#1976d2' }}>➕ Add New Alumni</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="User ID" value={form.user_id}
              onChange={e => setForm({ ...form, user_id: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            {['full_name', 'graduation_year', 'degree', 'department', 'phone', 'current_city', 'linkedin_url', 'current_company'].map(field => (
              <input key={field}
                placeholder={field.replace(/_/g, ' ')}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }}
              />
            ))}
            <button type="submit"
              style={{ gridColumn: 'span 2', padding: 14, background: 'linear-gradient(135deg, #1976d2, #64b5f6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
              Save Alumni
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        <input
          placeholder="Search by name, department or company..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 44px',
            borderRadius: 10, border: '2px solid #e3f2fd',
            fontSize: 14, outline: 'none', boxSizing: 'border-box',
            background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onFocus={e => e.target.style.border = '2px solid #1976d2'}
          onBlur={e => e.target.style.border = '2px solid #e3f2fd'}
        />
      </div>

      {/* Alumni Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map((a, i) => (
          <div key={a.profile_id} style={{
            background: '#fff', borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}>

            {/* Top Color Strip */}
            <div style={{
              background: `linear-gradient(135deg, ${getDeptColor(a.department)}, ${getDeptColor(a.department)}99)`,
              padding: '20px 20px 40px', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', bottom: -24, left: 20,
                width: 48, height: 48, borderRadius: '50%',
                background: '#fff', border: `3px solid ${getDeptColor(a.department)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 20, color: getDeptColor(a.department)
              }}>
                {a.full_name?.[0] || '?'}
              </div>
              <span style={{
                position: 'absolute', top: 14, right: 14,
                background: 'rgba(255,255,255,0.25)', color: '#fff',
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600
              }}>
                {a.graduation_year || 'N/A'}
              </span>
            </div>

            {/* Card Body */}
            <div style={{ padding: '32px 20px 20px' }}>
              <h3 style={{ margin: '0 0 4px', color: '#1e3a5f', fontSize: 16 }}>{a.full_name}</h3>
              <p style={{ margin: '0 0 8px', color: '#666', fontSize: 13 }}>{a.email}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {a.department && (
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11,
                    background: `${getDeptColor(a.department)}15`,
                    color: getDeptColor(a.department), fontWeight: 600
                  }}>
                    {a.department}
                  </span>
                )}
                {a.degree && (
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: '#f5f5f5', color: '#666' }}>
                    {a.degree}
                  </span>
                )}
              </div>

              <div style={{ fontSize: 13, color: '#555' }}>
                {a.current_company && (
                  <p style={{ margin: '4px 0' }}>🏢 {a.current_company}</p>
                )}
                {a.current_city && (
                  <p style={{ margin: '4px 0' }}>📍 {a.current_city}</p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                {a.linkedin_url ? (
                  <a href={a.linkedin_url} target="_blank" rel="noreferrer"
                    style={{ color: '#1976d2', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                    🔗 LinkedIn
                  </a>
                ) : <span />}
                {role === 'admin' && (
                  <button onClick={() => handleDelete(a.profile_id)}
                    style={{
                      padding: '5px 12px', background: '#ffebee',
                      color: '#e53935', border: '1px solid #ef9a9a',
                      borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600
                    }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{
            gridColumn: 'span 3', padding: 60, textAlign: 'center',
            background: '#fff', borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
            <h3 style={{ color: '#bbb', margin: 0 }}>No alumni found</h3>
            <p style={{ color: '#ccc', margin: '8px 0 0' }}>Try a different search</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlumniPage;
