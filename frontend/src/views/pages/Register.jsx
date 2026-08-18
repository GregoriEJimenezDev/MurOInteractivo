import React from 'react';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel.js';

/**
 * Register Page Component (View).
 * Design Pattern: MVVM - Pure View. All form state, validation and the Firebase
 * sign-up flow live in useRegisterViewModel; this component only renders
 * the UI and handles navigation feedback.
 */
export default function Register({ onNavigate }) {
  const { formData, handleChange, isLoading, error, registerUser } = useRegisterViewModel();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerUser();
    if (result) {
      // result is the email string - redirect to verify email page
      onNavigate('verify-email', { email: result });
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card glass-card">
        <h2 className="auth-title text-center">Registrarse</h2>
        <p className="auth-subtitle text-center">Crea tu cuenta de Muro Interactivo</p>

        {error && (
          <div className="form-alert error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="reg-name">Nombre</label>
              <input
                type="text"
                id="reg-name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan"
                disabled={isLoading}
                autoComplete="given-name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-lastname">Apellido</label>
              <input
                type="text"
                id="reg-lastname"
                name="lastname"
                className="form-input"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Pérez"
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-username">Nombre de Usuario</label>
            <input
              type="text"
              id="reg-username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ej: juan_perez"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Correo Electrónico</label>
            <input
              type="email"
              id="reg-email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan@correo.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Contraseña</label>
            <input
              type="password"
              id="reg-password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Debe tener mínimo 6 caracteres"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirmar Contraseña</label>
            <input
              type="password"
              id="reg-confirm"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-pulse"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Crear Cuenta'}
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
