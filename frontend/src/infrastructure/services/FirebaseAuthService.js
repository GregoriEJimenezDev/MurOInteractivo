import { IAuthService } from '../../domain/services/IAuthService.js';
import { auth } from '../../config/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import axios from 'axios';
import { User } from '../../domain/entities/User.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const userFromFirebase = (firebaseUser, username) => {
  const [name = 'Usuario', ...lastName] = (firebaseUser.displayName || '').split(' ').filter(Boolean);
  return new User({
    uid: firebaseUser.uid,
    username: username || firebaseUser.email?.split('@')[0] || '',
    name,
    lastname: lastName.join(' ')
  });
};

/**
 * Concrete implementation of AuthService using Firebase Client SDK and Backend API.
 * SOLID Principle: SRP - Strictly focuses on communication with Firebase Auth Client.
 */
export class FirebaseAuthService extends IAuthService {
  async register(username, password, name, lastname) {
    const normalizedUsername = username.trim().toLowerCase();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: normalizedUsername,
        password,
        name,
        lastname
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status < 500) throw error;
      if (!auth) throw error;

      const virtualEmail = `${normalizedUsername}@murointeractivo.local`;
      const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
      await updateProfile(userCredential.user, { displayName: `${name} ${lastname}` });
      return { user: userFromFirebase(userCredential.user, normalizedUsername), mode: 'firebase-only' };
    }
  }

  async login(username, password) {
    if (!auth) {
      throw new Error('Firebase Authentication is not configured.');
    }

    const normalizedUsername = username.trim().toLowerCase();
    try {
      const mockResponse = await axios.post(`${API_URL}/auth/login`, { username: normalizedUsername, password });
      if (mockResponse.data.mode === 'mock') {
        const profile = mockResponse.data.user;
        return { user: new User(profile), token: mockResponse.data.token };
      }
    } catch (error) {
      if (error.response?.status && error.response.status !== 404 && error.response.status < 500) throw error;
    }

    // Map username to the Firebase virtual email when Admin is configured.
    const virtualEmail = `${normalizedUsername}@murointeractivo.local`;
    const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, password);
    const token = await userCredential.user.getIdToken();

    // Load full profile details from MongoDB using Firebase ID token
    let user;
    try {
      const profileResponse = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      user = new User({ uid: userCredential.user.uid, username: profileResponse.data.username, name: profileResponse.data.name, lastname: profileResponse.data.lastname });
    } catch {
      user = userFromFirebase(userCredential.user, normalizedUsername);
    }

    return { user, token };
  }

  async logout() {
    if (!auth) return;
    await signOut(auth);
  }

  async getCurrentUser() {
    if (!auth || !auth.currentUser) return null;
    
    const firebaseUser = auth.currentUser;
    const token = await firebaseUser.getIdToken();
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return new User({
      uid: firebaseUser.uid,
      username: profileResponse.data.username,
      name: profileResponse.data.name,
      lastname: profileResponse.data.lastname
    });
  }

  onAuthStateChanged(callback) {
    if (!auth) {
      // Fire callback with null if Firebase is unavailable
      callback(null, null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          let user;
          try {
            const profileResponse = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
            user = new User({ uid: firebaseUser.uid, username: profileResponse.data.username, name: profileResponse.data.name, lastname: profileResponse.data.lastname });
          } catch {
            user = userFromFirebase(firebaseUser);
          }
          callback(user, token);
        } catch (error) {
          console.error("Firebase auth state sync error:", error.message);
          callback(null, null);
        }
      } else {
        callback(null, null);
      }
    });
  }
}
