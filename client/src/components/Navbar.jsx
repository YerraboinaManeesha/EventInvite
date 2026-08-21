import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Event<span>Invite</span></Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="btn btn-outline navbar-btn" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup" className="btn btn-outline navbar-btn">Sign Up</Link>
          </>
        )}
      </div>

      <style>{`
        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 28px; max-width: 1040px; margin: 0 auto;
        }
        .navbar-logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.25rem; text-decoration: none; color: var(--site-ink); }
        .navbar-logo span { color: var(--site-accent); }
        .navbar-links { display: flex; align-items: center; gap: 20px; font-size: 0.92rem; }
        .navbar-links a { text-decoration: none; color: var(--site-ink); opacity: 0.8; }
        .navbar-links a:hover { opacity: 1; }
        .navbar-btn { padding: 9px 20px; font-size: 0.85rem; }
      `}</style>
    </nav>
  );
}
