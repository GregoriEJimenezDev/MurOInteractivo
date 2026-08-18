import { IAuthService } from '../../domain/services/IAuthService.js';
import { auth, db } from '../../config/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '../../domain/entities/User.js';

/**
 * Concrete implementation of AuthService using the Firebase Client SDK.
 * User profiles live in the Firestore "users" collection, keyed by the Auth uid.
 * SOLID Principle: SRP - Strictly focuses on Firebase Auth and Firestore profile reads.
 */
export class FirebaseAuthService extends IAuthService {
  async register(email, password, name, lastname, username) {
    if (!auth || !db) {
      throw new Error('Firebase Authentication is not configured.');
    }

    // Step 1: Create the account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Step 2: Send email verification
    await sendEmailVerification(userCredential.user);

    // Step 3: Persist the profile in Firestore using the generated uid
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      lastname,
      username,
      emailVerified: false,
      createdAt: serverTimestamp()
    });

    return {
      user: new User({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username,
        name,
        lastname
      }),
      emailVerified: userCredential.user.emailVerified
    };
  }

  async login(email, password) {
    if (!auth) {
      throw new Error('Firebase Authentication is not configured.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error('Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }

    const token = await userCredential.user.getIdToken();
    const user = await this._buildUserFromAuth(userCredential.user);

    return { user, token };
  }

  async logout() {
    if (!auth) return;
    await signOut(auth);
  }

  async sendVerificationEmail() {
    if (!auth || !auth.currentUser) {
      throw new Error('No hay un usuario autenticado para enviar el correo de verificación.');
    }
    await sendEmailVerification(auth.currentUser);
  }

  async checkEmailVerified() {
    if (!auth || !auth.currentUser) return false;
    // Reload user to get latest emailVerified status
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
  }

  async getCurrentUser() {
    if (!auth || !auth.currentUser) return null;
    return this._buildUserFromAuth(auth.currentUser);
  }

  /**
   * Persists profile changes (avatarId and/or bio) into the Firestore
   * "users" document of the given uid. Only whitelisted fields are written.
   */
  async updateUserProfile(userId, data) {
    if (!db) {
      throw new Error('Firebase Authentication is not configured.');
    }
    if (!userId) {
      throw new Error('A user id is required to update the profile.');
    }

    // Whitelist: only editable profile fields are allowed through.
    const profileData = {};
    if (data?.avatarId !== undefined) profileData.avatarId = data.avatarId;
    if (data?.bio !== undefined) profileData.bio = data.bio;

    if (Object.keys(profileData).length === 0) {
      throw new Error('No valid profile fields were provided.');
    }

    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  }

  onAuthStateChanged(callback) {
    if (!auth) {
      // Fire callback with null if Firebase is unavailable
      callback(null, null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null, null);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const user = await this._buildUserFromAuth(firebaseUser);
        callback(user, token);
      } catch (error) {
        console.error('Auth state sync error:', error.message);
        // Degraded session: emit auth-only data so the user is not kicked out
        callback(this._buildFallbackUser(firebaseUser), null);
      }
    });
  }

  /**
   * Combines Firebase Auth data (uid, email) with the Firestore profile
   * (name, lastname, username) into a single unified User entity.
   */
  async _buildUserFromAuth(firebaseUser) {
    const profile = await this._fetchUserProfile(firebaseUser.uid);

    // Precaution: the Auth account exists but the Firestore document is missing
    if (!profile) {
      console.warn(`No Firestore profile found for uid "${firebaseUser.uid}". Using fallback data.`);
      return this._buildFallbackUser(firebaseUser);
    }

    return new User({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: profile.username,
      name: profile.name,
      lastname: profile.lastname,
      avatarId: profile.avatarId ?? null,
      bio: profile.bio ?? ''
    });
  }

  async _fetchUserProfile(uid) {
    if (!db) return null;
    const snapshot = await getDoc(doc(db, 'users', uid));
    return snapshot.exists() ? snapshot.data() : null;
  }

  _buildFallbackUser(firebaseUser) {
    return new User({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.email?.split('@')[0] || 'usuario',
      name: '',
      lastname: ''
    });
  }
}
