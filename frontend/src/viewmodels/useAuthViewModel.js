import { useState, useEffect } from 'react';
import { authService } from '../config/services.js';

/**
 * Authentication ViewModel.
 * Design Pattern: MVVM - Custom Hook acting as a ViewModel.
 * Decouples the visual components (Views) from the Firebase Auth client SDK logic.
 */
export function useAuthViewModel() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state updates on mount.
    // Unsubscribes when the component unmounts.
    const unsubscribe = authService.onAuthStateChanged((currentUser, activeToken) => {
      setUser(currentUser);
      setToken(activeToken);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(username, password);
      setUser(result.user);
      setToken(result.token);
      return result.user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, name, lastname) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(username, password, name, lastname);
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (err) {
      setError(err.message || 'Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}
