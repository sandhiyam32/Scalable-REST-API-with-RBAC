import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/tasks');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🔐 Login</h2>
        {error && <p style={s.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={s.input} placeholder="Username" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={s.footer}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#1a1a2e' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer', fontWeight: 600 },
  error: { color: '#ff4d4f', background: '#fff1f0', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', fontSize: '13px' },
  footer: { textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#666' },
};
