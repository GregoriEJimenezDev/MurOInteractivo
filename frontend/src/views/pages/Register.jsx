import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

/**
 * Register Page Component (View).
 * SOLID Principle: SRP - Strictly handles rendering the user registration form and state validation.
 */
export default function Register({ register, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setLoading(true);

    if (!username.trim() || !password.trim() || !name.trim() || !lastname.trim()) {
      setLocalError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas ingresadas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      await register(username, password, name, lastname);
      setSuccessMsg('¡Usuario registrado con éxito! Redirigiendo al inicio de sesión...');
      
      // Delay redirection slightly so the user sees the success prompt
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err) {
      setLocalError(err.message || 'Ocurrió un error al procesar el registro.');
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card glass-card">
        <button type="button" onClick={() => onNavigate('home')} className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50"><ArrowLeft size={16} /> Volver</button>
        <h2 className="auth-title text-center">Registrarse</h2>
        <p className="auth-subtitle text-center">Crea tu cuenta de Muro Interactivo</p>

        {localError && (
          <div className="form-alert error">
            <span>⚠️</span> {localError}
          </div>
        )}

        {successMsg && (
          <div className="form-alert success">
            <span>✅</span> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="reg-name">Nombre</label>
              <input
                type="text"
                id="reg-name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-lastname">Apellido</label>
              <input
                type="text"
                id="reg-lastname"
                className="form-input"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Pérez"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-username">Nombre de Usuario</label>
            <input
              type="text"
              id="reg-username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: juan_perez"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Contraseña</label>
            <input
                type={showPassword ? 'text' : 'password'}
              id="reg-password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Debe tener mínimo 6 caracteres"
              disabled={loading}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="-mt-12 mr-3 self-end rounded-md p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-50" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirmar Contraseña</label>
            <input
              type="password"
              id="reg-confirm"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-pulse" 
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="auth-footer text-center">
          ¿Ya tienes una cuenta?{' '}
          <span className="auth-link" onClick={() => onNavigate('login')}>
            Inicia Sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
}
