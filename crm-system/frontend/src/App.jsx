import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Usuarios from './pages/Usuarios';
import Campanas from './pages/Campanas';
import Reportes from './pages/Reportes';
import { useAuthStore } from './store/useAuthStore';
import { authService } from './api/authService';
import { supabase } from './api/supabaseClient';

function App() {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    // Check active session on load
    authService.getSession().then((session) => {
      if (session) {
        login({ email: session.user.email, id: session.user.id }, session.access_token);
      } else {
        logout();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        login({ email: session.user.email, id: session.user.id }, session.access_token);
      } else {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, [login, logout]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="campanas" element={<Campanas />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>
    </Routes>
  );
}

export default App;
