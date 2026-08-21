import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container auth-wrap">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="auth-sub">Free to sign up — build your first invitation in minutes.</p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              <span className="hint">At least 6 characters.</span>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className="spinner" /> : 'Sign Up'}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to={`/login?next=${encodeURIComponent(next)}`}>Log in</Link></p>
        </div>
      </div>

      <style>{`
        .auth-wrap { display: flex; justify-content: center; padding: 50px 24px 80px; }
        .auth-card { width: 100%; max-width: 400px; background: var(--site-card); border: 1px solid var(--site-line); border-radius: 6px; padding: 34px 30px; }
        .auth-card h1 { font-size: 1.6rem; margin-bottom: 6px; }
        .auth-sub { font-size: 0.9rem; opacity: 0.62; margin-bottom: 26px; }
        .auth-switch { text-align: center; margin-top: 18px; font-size: 0.88rem; opacity: 0.75; }
        .auth-switch a { color: var(--site-accent); text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
}
