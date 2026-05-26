import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/authService';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await authService.register(email, password);
      setSuccessMsg("¡Registro exitoso! Por favor, verifica tu correo o inicia sesión directamente.");
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setErrorMsg(error.message || "Error al registrarse");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <h2>Nexus CRM - Registro</h2>
        {errorMsg && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{errorMsg}</div>}
        {successMsg && <div className="success-message" style={{color: 'green', marginBottom: '1rem'}}>{successMsg}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Registrarse</button>
        </form>
        <p style={{marginTop: '1rem', textAlign: 'center'}}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
