import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2.5 12C2.5 12 6 5.5 12 5.5C18 5.5 21.5 12 21.5 12C21.5 12 18 18.5 12 18.5C6 18.5 2.5 12 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 5.7C11.05 5.57 11.52 5.5 12 5.5C18 5.5 21.5 12 21.5 12C21.5 12 20.1 14.6 17.7 16.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.3 7.6C3.9 9.4 2.5 12 2.5 12C2.5 12 6 18.5 12 18.5C13.2 18.5 14.3 18.25 15.3 17.85"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const next = params.get('next') || '/dashboard';

  const message = location.state?.message || '';

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(form);

      navigate(next, {
        replace: true
      });
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
          <h1>Welcome back</h1>

          <p className="auth-sub">
            Log in to manage your invitations.
          </p>

          {message && (
            <div className="success-banner">
              {message}
            </div>
          )}

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="field">
              <label>Password</label>

              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  title={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="auth-switch">
            New here?{' '}
            <Link
              to={`/signup?next=${encodeURIComponent(next)}`}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-wrap {
          display: flex;
          justify-content: center;
          padding: 50px 24px 80px;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          background: var(--site-card);
          border: 1px solid var(--site-line);
          border-radius: 6px;
          padding: 34px 30px;
        }

        .auth-card h1 {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }

        .auth-sub {
          font-size: 0.9rem;
          opacity: 0.62;
          margin-bottom: 26px;
        }

        .auth-switch {
          text-align: center;
          margin-top: 18px;
          font-size: 0.88rem;
          opacity: 0.75;
        }

        .auth-switch a {
          color: var(--site-accent);
          text-decoration: none;
          font-weight: 600;
        }

        .password-wrap {
          position: relative;
          width: 100%;
        }

        .password-wrap input {
          width: 100%;
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: currentColor;
          cursor: pointer;
          padding: 0;
          border-radius: 50%;
        }

        .password-toggle:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .password-toggle:focus-visible {
          outline: 2px solid var(--site-accent);
          outline-offset: 2px;
        }

        .password-toggle svg {
          display: block;
        }
      `}</style>
    </div>
  );
}