import React, { useEffect, useState } from 'react';
import { Check, Loader2, User as UserIcon } from 'lucide-react';
import { AVATARS, getAvatarSrc } from '../../config/avatars.js';
import { useProfileViewModel, BIO_MAX_LENGTH } from '../../viewmodels/useProfileViewModel.js';

/**
 * Profile Settings Page Component (View).
 * Design Pattern: MVVM - Pure View. All orchestration, validation and feedback
 * state live in useProfileViewModel; this component only renders the UI
 * and forwards user intents to the ViewModel.
 * Style: Clean UI / Modern Minimalist - light backgrounds, soft shadows,
 * subtle borders. No dark/cyberpunk palette.
 */
export default function ProfileSettings({ user, onNavigate, onUserUpdated }) {
  const {
    isLoading,
    error,
    successMessage,
    selectAvatar,
    saveBio
  } = useProfileViewModel(onUserUpdated);

  const [bioText, setBioText] = useState(user?.bio || '');
  const [pendingAvatarId, setPendingAvatarId] = useState(null);

  // Keep the textarea in sync if the session user changes from outside.
  useEffect(() => {
    setBioText(user?.bio || '');
  }, [user?.bio]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-gray-400">
            <UserIcon size={22} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Acceso restringido</h2>
          <p className="mt-1 text-sm text-gray-500">
            Debes iniciar sesión para editar tu perfil.
          </p>
          <button
            className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-gray-700 active:scale-95"
            onClick={() => onNavigate('login')}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const currentAvatarSrc = getAvatarSrc(user.avatarId);

  const handleAvatarClick = async (avatarId) => {
    if (isLoading) return;
    setPendingAvatarId(avatarId);
    await selectAvatar(avatarId, user);
    setPendingAvatarId(null);
  };

  const handleSaveBio = async (e) => {
    e.preventDefault();
    await saveBio(bioText, user);
  };

  const bioUnchanged = bioText.trim() === (user.bio || '').trim();

  return (
    <div className="min-h-[calc(100vh-76px)] bg-gray-50 px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Editar Perfil
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Elige tu avatar y escribe una biografía.
          </p>
        </header>

        {error && (
          <div className="form-alert error mb-6" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {successMessage && (
          <div className="form-alert success mb-6">
            <span>✅</span> {successMessage}
          </div>
        )}

        {/* Avatar Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Avatar
          </h2>

          {/* Current preview */}
          <div className="mt-5 flex items-center gap-5">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {currentAvatarSrc ? (
                <img
                  src={currentAvatarSrc}
                  alt={`Avatar de ${user.fullName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-extrabold text-gray-400">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Selecciona tu avatar favorito de la galería.
            </p>
          </div>

          {/* Avatar grid */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {AVATARS.map((avatar) => {
              const isSelected = user.avatarId === avatar.id;
              const isPending = pendingAvatarId === avatar.id;

              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => handleAvatarClick(avatar.id)}
                  disabled={isLoading}
                  aria-label={avatar.label}
                  title={avatar.label}
                  className={`group relative aspect-square overflow-hidden rounded-full border transition duration-200 focus:outline-none disabled:cursor-wait ${
                    isSelected
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                  } ${isLoading ? 'opacity-60' : ''}`}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.label}
                    className="h-full w-full object-cover"
                  />

                  {/* Selected check badge */}
                  {isSelected && !isPending && (
                    <span className="absolute inset-0 grid place-items-center bg-black/30">
                      <Check size={20} className="text-white" />
                    </span>
                  )}

                  {/* Pending spinner */}
                  {isPending && (
                    <span className="absolute inset-0 grid place-items-center bg-black/40">
                      <Loader2 size={20} className="animate-spin text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Biography Section */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSaveBio}>
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-bio"
                className="text-sm font-bold uppercase tracking-wider text-gray-400"
              >
                Biografía
              </label>
              <span className="text-xs tabular-nums text-gray-400">
                {bioText.length}/{BIO_MAX_LENGTH}
              </span>
            </div>

            <textarea
              id="profile-bio"
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              maxLength={BIO_MAX_LENGTH}
              rows={4}
              placeholder="Cuéntale al mundo quién eres..."
              disabled={isLoading}
              className="mt-3 w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || bioUnchanged}
                className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-gray-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
