import avatar01 from '../assets/avatars/avatar-01.svg';
import avatar02 from '../assets/avatars/avatar-02.svg';
import avatar03 from '../assets/avatars/avatar-03.svg';
import avatar04 from '../assets/avatars/avatar-04.svg';
import avatar05 from '../assets/avatars/avatar-05.svg';
import avatar06 from '../assets/avatars/avatar-06.svg';
import avatar07 from '../assets/avatars/avatar-07.svg';
import avatar08 from '../assets/avatars/avatar-08.svg';

/**
 * Static catalogue of available profile avatars.
 * Each entry maps a stable id (stored in Firestore "users/{uid}.avatarId")
 * to its bundled SVG asset so the image URL can be resolved client-side
 * regardless of the hashed filename Vite produces at build time.
 */
export const AVATARS = [
  { id: 'avatar-01', src: avatar01, label: 'Menta' },
  { id: 'avatar-02', src: avatar02, label: 'Ámbar' },
  { id: 'avatar-03', src: avatar03, label: 'Violeta' },
  { id: 'avatar-04', src: avatar04, label: 'Rosa' },
  { id: 'avatar-05', src: avatar05, label: 'Cielo' },
  { id: 'avatar-06', src: avatar06, label: 'Esmeralda' },
  { id: 'avatar-07', src: avatar07, label: 'Naranja' },
  { id: 'avatar-08', src: avatar08, label: 'Índigo' }
];

/**
 * Finds an avatar entry by its id.
 * @param {string} id
 * @returns {{ id: string, src: string, label: string } | null}
 */
export function getAvatarById(id) {
  return AVATARS.find((a) => a.id === id) || null;
}

/**
 * Resolves an avatar id to its image src URL.
 * @param {string} id
 * @returns {string | null}
 */
export function getAvatarSrc(id) {
  return getAvatarById(id)?.src || null;
}
