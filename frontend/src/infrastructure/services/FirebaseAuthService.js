import { IAuthService } from '../../domain/services/IAuthService.js';
import { auth } from '../../config/firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { User } from '../../domain/entities/User.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Concrete implementation of AuthService using Firebase Client SDK and Backend API.
 * SOLID Principle: SRP - Strictly focuses on communication with Firebase Auth Client.
 */
export class FirebaseAuthService extends IAuthService {
  async register(username, password, name, lastname) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      password,
      name,
      lastname
    });
    return response.data;
  }

  async login(username, password) {
    if (!auth) {
      throw new Error('Firebase Authentication is not configured.');
    }

    // Map username to the backend-simulated virtual email
    const virtualEmail = `${username.toLowerCase()}@murointeractivo.local`;
    const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, password);
    const token = await userCredential.user.getIdToken();

    // Load full profile details from MongoDB using Firebase ID token
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = new User({
      uid: userCredential.user.uid,
      username: profileResponse.data.username,
      name: profileResponse.data.name,
      lastname: profileResponse.data.lastname
    });

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
          const profileResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const user = new User({
            uid: firebaseUser.uid,
            username: profileResponse.data.username,
            name: profileResponse.data.name,
            lastname: profileResponse.data.lastname
          });
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
