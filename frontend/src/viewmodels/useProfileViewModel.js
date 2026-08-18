import { useState } from 'react';
import { authService } from '../config/services.js';
import { getAvatarById } from '../config/avatars.js';

/** Maximum allowed length for the user biography. */
export const BIO_MAX_LENGTH = 160;

/**
 * Profile Settings ViewModel.
 * Design Pattern: MVVM - Custom Hook acting as the ViewModel for the ProfileSettings View.
 * Orchestrates two profile flows while the View stays purely presentational:
 *   1) Avatar: persist a chosen avatar id into the Firestore "users" document.
 *   2) Bio: persist the biography text into the same Firestore document.
 * After every successful write it notifies an optional onUserUpdated callback
 * so the global session state (useAuthViewModel) stays in sync.
 */
export function useProfileViewModel(onUserUpdated) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /** Shows a transient success message that auto-dismisses. */
  const notifySuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  /**
   * Saves a selected avatar id into Firestore.
   * Returns true on success so the View can react; false when error state was set.
   */
  const selectAvatar = async (avatarId, user) => {
    setError(null);
    setSuccessMessage('');

    if (!user?.uid) {
      setError('Debes iniciar sesión para cambiar tu avatar.');
      return false;
    }
    if (!getAvatarById(avatarId)) {
      setError('El avatar seleccionado no es válido.');
      return false;
    }

    setIsLoading(true);
    try {
      await authService.updateUserProfile(user.uid, { avatarId });

      if (typeof onUserUpdated === 'function') {
        onUserUpdated({ avatarId });
      }

      notifySuccess('¡Avatar actualizado con éxito!');
      return true;
    } catch (err) {
      setError(err?.message || 'No se pudo guardar el avatar. Inténtalo de nuevo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Saves the biography text into Firestore.
   * Returns true on success so the View can react; false when error state was set.
   */
  const saveBio = async (bioText, user) => {
    setError(null);
    setSuccessMessage('');

    if (!user?.uid) {
      setError('Debes iniciar sesión para editar tu biografía.');
      return false;
    }

    const bio = (bioText || '').trim();
    if (bio.length > BIO_MAX_LENGTH) {
      setError(`La biografía no puede superar los ${BIO_MAX_LENGTH} caracteres.`);
      return false;
    }

    setIsLoading(true);
    try {
      await authService.updateUserProfile(user.uid, { bio });

      if (typeof onUserUpdated === 'function') {
        onUserUpdated({ bio });
      }

      notifySuccess('¡Biografía guardada con éxito!');
      return true;
    } catch (err) {
      setError(err?.message || 'No se pudo guardar la biografía. Inténtalo de nuevo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    successMessage,
    selectAvatar,
    saveBio
  };
}
