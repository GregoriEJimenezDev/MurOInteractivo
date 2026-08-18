import { useState, useEffect } from 'react';
import { authService } from '../config/services.js';
import { User } from '../domain/entities/User.js';

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

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
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

  const register = async (email, password, name, lastname, username) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(email, password, name, lastname, username);
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

  /**
   * Merges locally-edited profile fields (avatarId, bio, ...) into the active
   * session user, so every subscribed View reflects the change instantly
   * without waiting for a full auth state refresh.
   */
  const updateLocalUser = (updatedFields) => {
    setUser((prevUser) =>
      prevUser ? new User({ ...prevUser, ...updatedFields }) : prevUser
    );
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateLocalUser,
    isAuthenticated: !!user
  };
}
