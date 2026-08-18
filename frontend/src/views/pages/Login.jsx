import React, { useState } from 'react';

/**
 * Login Page Component (View).
 * SOLID Principle: SRP - Strictly handles rendering the login form and local form states.
 */
export default function Login({ login, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setLocalError('Por favor, ingresa tanto tu usuario como tu contraseña.');
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
      onNavigate('home');
    } catch (err) {
      setLocalError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card glass-card">
        <h2 className="auth-title text-center">Iniciar Sesión</h2>
        <p className="auth-subtitle text-center">Conéctate para compartir contenido en el muro</p>
        
        {localError && (
          <div className="form-alert error">
            <span>⚠️</span> {localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Usuario</label>
            <input
              type="text"
              id="login-username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: juan_perez"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Contraseña</label>
            <input
              type="password"
              id="login-password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-pulse" 
            disabled={loading}
          >
            {loading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-footer text-center">
          ¿Aún no tienes cuenta?{' '}
          <span className="auth-link" onClick={() => onNavigate('register')}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}
