import React, { useEffect, useState } from 'react';
import api from '../services/api';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [form, setForm] = useState({
    title: '', company: '', location: '',
    job_type: 'Full-time', description: '',
    salary_range: '', deadline: ''
  });

  const role = localStorage.getItem('role');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', { ...form, posted_by: user_id });
      alert('Job posted successfully! 🎉');
      setShowForm(false);
      setForm({ title: '', company: '', location: '', job_type: 'Full-time', description: '', salary_range: '', deadline: '' });
      fetchJobs();
    } catch (err) {
      alert('Error posting job');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (err) {
        alert('Error deleting job');
      }
    }
  };

  const handleApply = async (job_id) => {
    try {
      await api.post('/jobs/apply', { job_id, applicant_id: user_id });
      alert('Applied successfully! ✅');
    } catch (err) {
      alert('Already applied or error');
    }
  };

  const jobTypeColors = {
    'Full-time': { color: '#1976d2', bg: '#e3f2fd' },
    'Part-time': { color: '#f57c00', bg: '#fff3e0' },
    'Internship': { color: '#388e3c', bg: '#e8f5e9' },
    'Contract': { color: '#9c27b0', bg: '#f3e5f5' },
    'Remote': { color: '#00897b', bg: '#e0f2f1' },
  };

  const filters = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];
  const filtered = activeFilter === 'All' ? jobs : jobs.filter(j => j.job_type === activeFilter);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1565c0 100%)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(21,101,192,0.3)'
      }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 24 }}>💼 Job Board</h1>
          <p style={{ color: '#90caf9', margin: '6px 0 0', fontSize: 14 }}>
            {jobs.length} opportunities available for alumni network
          </p>
        </div>
        {(role === 'admin' || role === 'alumni') && (
          <button onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 22px',
              background: showForm ? 'rgba(255,255,255,0.15)' : '#f57c00',
              color: '#fff', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600, fontSize: 14,
              boxShadow: showForm ? 'none' : '0 4px 12px rgba(245,124,0,0.4)'
            }}>
            {showForm ? '✕ Cancel' : '+ Post a Job'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Jobs', value: jobs.length, color: '#1976d2', bg: '#e3f2fd', icon: '💼' },
          { label: 'Full-time', value: jobs.filter(j => j.job_type === 'Full-time').length, color: '#1976d2', bg: '#e3f2fd', icon: '🏢' },
          { label: 'Internships', value: jobs.filter(j => j.job_type === 'Internship').length, color: '#388e3c', bg: '#e8f5e9', icon: '🎓' },
          { label: 'Remote', value: jobs.filter(j => j.job_type === 'Remote').length, color: '#00897b', bg: '#e0f2f1', icon: '🌐' },
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

      {/* Post Job Form */}
      {showForm && (
        <div style={{
          background: '#fff', padding: 28, borderRadius: 14, marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #1976d2'
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#1976d2' }}>💼 Post a New Job</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input placeholder="Job Title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input placeholder="Company" value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })} required
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input placeholder="Location" value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <select value={form.job_type}
              onChange={e => setForm({ ...form, job_type: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
            <input placeholder="Salary Range (e.g. ₹5L-₹10L)" value={form.salary_range}
              onChange={e => setForm({ ...form, salary_range: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <input type="date" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14 }} />
            <textarea placeholder="Job Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} style={{ padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, gridColumn: 'span 2', resize: 'vertical' }} />
            <button type="submit"
              style={{ gridColumn: 'span 2', padding: 14, background: 'linear-gradient(135deg, #1976d2, #64b5f6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
              🚀 Post Job
            </button>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{
              padding: '8px 18px', borderRadius: 20, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: activeFilter === f ? '#1976d2' : '#fff',
              color: activeFilter === f ? '#fff' : '#666',
              boxShadow: activeFilter === f ? '0 4px 12px rgba(25,118,210,0.3)' : '0 2px 6px rgba(0,0,0,0.08)'
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {filtered.map((j, i) => {
          const jColor = jobTypeColors[j.job_type] || { color: '#1976d2', bg: '#e3f2fd' };
          const isExpired = j.deadline && new Date(j.deadline) < new Date();

          return (
            <div key={j.job_id} style={{
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              opacity: isExpired ? 0.7 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}>

              {/* Top */}
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', color: '#1e3a5f', fontSize: 16 }}>{j.title}</h3>
                    <p style={{ margin: '0 0 6px', color: jColor.color, fontWeight: 600, fontSize: 14 }}>🏢 {j.company}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: jColor.bg, color: jColor.color }}>
                        {j.job_type}
                      </span>
                      {j.location && (
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: '#f5f5f5', color: '#666' }}>
                          📍 {j.location}
                        </span>
                      )}
                      {isExpired && (
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: '#ffebee', color: '#e53935', fontWeight: 700 }}>
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: jColor.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    💼
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 20px' }}>
                {j.salary_range && (
                  <p style={{ margin: '0 0 6px', color: '#388e3c', fontWeight: 600, fontSize: 13 }}>💰 {j.salary_range}</p>
                )}
                {j.deadline && (
                  <p style={{ margin: '0 0 8px', color: isExpired ? '#e53935' : '#f57c00', fontSize: 12 }}>
                    ⏰ Deadline: {new Date(j.deadline).toDateString()}
                  </p>
                )}
                <p style={{ margin: '0 0 14px', color: '#666', fontSize: 13, lineHeight: 1.5 }}>
                  {j.description || 'No description provided.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#aaa' }}>
                    By: {j.poster_email} • {new Date(j.created_at).toLocaleDateString()}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {role !== 'admin' && !isExpired && (
                      <button onClick={() => handleApply(j.job_id)}
                        style={{
                          padding: '7px 16px',
                          background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
                          color: '#fff', border: 'none', borderRadius: 6,
                          cursor: 'pointer', fontSize: 13, fontWeight: 600
                        }}>
                        ✅ Apply
                      </button>
                    )}
                    {role === 'admin' && (
                      <button onClick={() => handleDelete(j.job_id)}
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

        {filtered.length === 0 && (
          <div style={{
            gridColumn: 'span 2', padding: 60, textAlign: 'center',
            background: '#fff', borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
            <h3 style={{ color: '#bbb', margin: 0 }}>No jobs found</h3>
            <p style={{ color: '#ccc', margin: '8px 0 0' }}>Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsPage;
