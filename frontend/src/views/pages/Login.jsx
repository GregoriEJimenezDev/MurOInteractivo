import React, { useState } from 'react';
import { ArrowLeft, CircleHelp, Eye, EyeOff } from 'lucide-react';

/**
 * Login Page Component (View).
 * SOLID Principle: SRP - Strictly handles rendering the login form and local form states.
 */
export default function Login({ login, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        <button type="button" onClick={() => onNavigate('home')} className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50"><ArrowLeft size={16} /> Volver</button>
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
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="-mt-12 mr-3 self-end rounded-md p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-50" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
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
          </span>{' '}<button type="button" onClick={() => onNavigate('help')} className="ml-2 inline-flex items-center gap-1 text-gray-500 hover:text-gray-900"><CircleHelp size={14} /> Ayuda</button>
        </p>
      </div>
    </div>
  );
}
