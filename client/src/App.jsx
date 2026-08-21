import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PickEventType from './pages/PickEventType';
import CreateInvitation from './pages/CreateInvitation';
import EditInvitation from './pages/EditInvitation';
import PublicInvitation from './pages/PublicInvitation';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/i/:slug" element={<PublicInvitation />} />

      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/create" element={<RequireAuth><PickEventType /></RequireAuth>} />
      <Route path="/create/:eventType" element={<RequireAuth><CreateInvitation /></RequireAuth>} />
      <Route path="/edit/:id" element={<RequireAuth><EditInvitation /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
