import { useState } from 'react';
import { authService } from '../config/services.js';

/**
 * Login ViewModel.
 * Design Pattern: MVVM - Custom Hook acting as the ViewModel for the Login View.
 * Owns the login form state (email + password) plus isLoading/error,
 * and authenticates against the injected authService (Firebase or Mock).
 */
export function useLoginViewModel() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  /**
   * Authenticates the user via the injected authService.
   * Returns true on success so the View can navigate; false when error state was set.
   */
  const loginUser = async () => {
    setError(null);

    if (!formData.email.trim() || !formData.password) {
      setError('Por favor, ingresa tanto tu correo como tu contraseña.');
      return false;
    }

    setIsLoading(true);
    try {
      await authService.login(formData.email.trim(), formData.password);
      return true;
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión. Revisa tus credenciales.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    isLoading,
    error,
    loginUser
  };
}
