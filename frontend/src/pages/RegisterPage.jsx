import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.password2) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    setLoading(true);
    try {
      await authService.register({ ...form, role: 'user' });
      setSuccess('✅ Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      // Show exact error from backend
      const errors = err.response?.data?.errors || err.response?.data || {};
      const messages = Object.entries(errors)
        .map(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
          return field === 'non_field_errors' || field === 'detail' ? msg : `${field}: ${msg}`;
        })
        .join('\n');
      setError(messages || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>📝 Create Account</h2>

        {error && (
          <div style={s.error}>
            {error.split('\n').map((line, i) => <p key={i} style={{ margin: '2px 0' }}>{line}</p>)}
          </div>
        )}
        {success && <p style={s.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Username</label>
          <input style={s.input} placeholder="e.g. john123" value={form.username} onChange={set('username')} required />

          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="e.g. john@email.com" value={form.email} onChange={set('email')} required />

          <label style={s.label}>Password <span style={s.hint}>(min 8 characters)</span></label>
          <input style={s.input} type="password" placeholder="Enter password" value={form.password} onChange={set('password')} required />

          <label style={s.label}>Confirm Password</label>
          <input style={s.input} type="password" placeholder="Repeat password" value={form.password2} onChange={set('password2')} required />

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={s.footer}>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

const s = {
  page:    { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card:    { background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title:   { textAlign: 'center', marginBottom: '1.5rem', color: '#1a1a2e' },
  label:   { display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '4px' },
  hint:    { fontWeight: 400, color: '#999', fontSize: '12px' },
  input:   { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn:     { width: '100%', padding: '0.75rem', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer', fontWeight: 600 },
  error:   { color: '#ff4d4f', background: '#fff1f0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px', border: '1px solid #ffccc7' },
  success: { color: '#52c41a', background: '#f6ffed', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px', textAlign: 'center', border: '1px solid #b7eb8f' },
  footer:  { textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#666' },
};
