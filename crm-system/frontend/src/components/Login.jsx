import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const data = await authService.login(email, password);
      // data.user from Supabase Auth
      login({ email: data.user.email, id: data.user.id }, data.session.access_token);
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <h2>Nexus CRM</h2>
        {errorMsg && <div style={{color: 'red', marginBottom: '1rem'}}>{errorMsg}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@crm.local"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Sign In</button>
        </form>
        <p style={{marginTop: '1rem', textAlign: 'center'}}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
