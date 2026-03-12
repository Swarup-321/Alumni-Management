import React, { useState } from 'react';
import api from '../services/api';

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '', password: '', role: 'alumni',
    full_name: '', graduation_year: '', degree: '',
    department: '', phone: '', current_city: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await api.post('/auth/register', form);
        alert('Registered successfully! Please login.');
        setIsRegister(false);
      } else {
        const res = await api.post('/auth/login', { email: form.email, password: form.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('user_id', res.data.user_id);
        onLogin(res.data.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 460, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, color: '#1e3a5f' }}>🎓 Alumni Portal</h1>
          <p style={{ color: '#888', marginTop: 4 }}>{isRegister ? 'Create your account' : 'Welcome back!'}</p>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Register Extra Fields */}
          {isRegister && (
            <>
              <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange}
                style={inputStyle} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input name="graduation_year" placeholder="Graduation Year" value={form.graduation_year} onChange={handleChange} style={inputStyle} />
                <input name="degree" placeholder="Degree (e.g. B.Tech)" value={form.degree} onChange={handleChange} style={inputStyle} />
                <input name="department" placeholder="Department" value={form.department} onChange={handleChange} style={inputStyle} />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={inputStyle} />
                <input name="current_city" placeholder="Current City" value={form.current_city} onChange={handleChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
              </div>
              <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, marginTop: 0 }}>
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </>
          )}

          {/* Common Fields */}
          <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange}
            style={inputStyle} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
            style={inputStyle} required />

          <button type="submit" style={{
            width: '100%', padding: 14, background: '#1e3a5f',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 16, cursor: 'pointer', marginTop: 8
          }}>
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: 14 }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ color: '#1976d2', cursor: 'pointer', marginLeft: 6, fontWeight: 'bold' }}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: 12, border: '1px solid #ddd',
  borderRadius: 8, fontSize: 14, marginBottom: 12,
  boxSizing: 'border-box', outline: 'none'
};

export default LoginPage;
