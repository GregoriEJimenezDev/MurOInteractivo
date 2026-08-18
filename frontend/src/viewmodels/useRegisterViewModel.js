import { useState } from 'react';
import { authService } from '../config/services.js';

/**
 * Register ViewModel.
 * Design Pattern: MVVM - Custom Hook acting as the ViewModel for the Register View.
 * Owns the whole registration form state (including email) plus isLoading/error,
 * and delegates sign-up to the injected authService (Firebase or Mock).
 */
export function useRegisterViewModel() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    const { name, lastname, username, email, password, confirmPassword } = formData;

    if (
      !name.trim() ||
      !lastname.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      return 'Todos los campos son obligatorios.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Ingresa un correo electrónico válido.';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas ingresadas no coinciden.';
    }
    return null;
  };

  /**
   * Executes the registration via the injected authService.
   * Returns the registered email on success so the View can redirect
   * to the verification page; false when error state was set.
   */
  const registerUser = async () => {
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsLoading(true);
    try {
      await authService.register(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        formData.lastname.trim(),
        formData.username.trim()
      );
      return formData.email.trim();
    } catch (err) {
      setError(err?.message || 'Ocurrió un error al procesar el registro. Inténtalo de nuevo.');
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
    registerUser
  };
}
