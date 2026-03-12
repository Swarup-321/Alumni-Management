import React, { useEffect, useState } from 'react';
import api from '../services/api';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', location: '', job_type: 'full-time', description: '', salary_range: '', deadline: '' });
  const role = localStorage.getItem('role');

  useEffect(() => {
    api.get('/jobs').then(res => setJobs(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', { ...form, posted_by: localStorage.getItem('user_id') });
      setShowForm(false);
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) { alert('Error posting job'); }
  };

  const handleApply = async (job_id) => {
    try {
      await api.post('/jobs/apply', { job_id, applicant_id: localStorage.getItem('user_id') });
      alert('Applied successfully!');
    } catch (err) { alert('Already applied or error'); }
  };

  const tagColor = { 'full-time': '#1976d2', 'part-time': '#f57c00', 'internship': '#388e3c', 'contract': '#7b1fa2' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1e3a5f' }}>💼 Job Postings</h1>
        {['alumni', 'admin'].includes(role) && (
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Post Job'}
          </button>
        )}
      </div>

      {showForm && ['alumni', 'admin'].includes(role) && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Post New Job</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['title', 'company', 'location', 'salary_range'].map(field => (
              <input key={field} placeholder={field.replace('_', ' ')} value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            ))}
            <input type="date" value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <select value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}
              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
              {['full-time', 'part-time', 'internship', 'contract'].map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea placeholder="Job description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ gridColumn: 'span 2', padding: 10, border: '1px solid #ddd', borderRadius: 6, minHeight: 80 }} />
            <button type="submit" style={{ gridColumn: 'span 2', padding: 12, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Post Job
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {jobs.map(job => (
          <div key={job.job_id} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ color: '#1e3a5f' }}>{job.title}</h3>
              <span style={{ background: tagColor[job.job_type], color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>
                {job.job_type}
              </span>
            </div>
            <p style={{ color: '#555', marginTop: 4 }}>🏢 {job.company} — 📍 {job.location}</p>
            <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>{job.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ color: '#388e3c', fontWeight: 'bold' }}>💰 {job.salary_range || 'Not disclosed'}</span>
              {['alumni', 'student', 'admin'].includes(role) && (
                <button onClick={() => handleApply(job.job_id)} style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p style={{ color: '#888' }}>No jobs posted yet.</p>}
      </div>
    </div>
  );
}

export default JobsPage;
