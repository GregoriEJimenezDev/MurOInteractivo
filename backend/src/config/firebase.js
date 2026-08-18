import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Singleton class to manage Firebase Admin initialization.
 * SOLID Principle: SRP - Single Responsibility for initializing Firebase and retrieving Auth service.
 * Design Pattern: Singleton - Prevents duplicate initialization errors in Firebase Admin.
 */
class FirebaseAdmin {
  constructor() {
    if (FirebaseAdmin.instance) {
      return FirebaseAdmin.instance;
    }

    this.app = null;
    this.auth = null;
    this.isMocked = false;
    this.mockUsers = new Map();
    FirebaseAdmin.instance = this;
    Object.freeze(this);
  }

  initialize() {
    if (this.app) {
      return this.app;
    }

    // Check if Firebase admin app is already initialized externally
    if (admin.apps.length > 0) {
      this.app = admin.apps[0];
      this.auth = admin.auth(this.app);
      return this.app;
    }

    const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
    let credential;

    if (fs.existsSync(serviceAccountPath)) {
      console.log('Initializing Firebase Admin using local service account JSON.');
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else if (
      process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_PROJECT_ID !== 'your-project-id'
    ) {
      console.log('Initializing Firebase Admin using environment variables.');
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      });
    } else {
      console.warn('WARNING: Firebase configurations not set. Bootstrapping with Developer Authentication Mock.');
      this.isMocked = true;
      this.auth = this._getAuthMock();
      return null;
    }

    try {
      this.app = admin.initializeApp({
        credential,
      });
      this.auth = admin.auth(this.app);
      this.isMocked = false;
      console.log('Firebase Admin successfully initialized.');
      return this.app;
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error.message);
      throw error;
    }
  }

  /**
   * Helper to return simulated Authentication client for developer testing.
   * Promotes ease of testing and offline development.
   */
  _getAuthMock() {
    return {
      verifyIdToken: async (token) => {
        if (token && token.startsWith('mock-token-')) {
          const username = token.replace('mock-token-', '');
          return {
            uid: `mock-uid-${username}`,
            email: `${username}@murointeractivo.local`,
            firebase: { sign_in_provider: 'password' }
          };
        }
        throw new Error('Invalid authentication token (mock authentication failure)');
      },
      createUser: async (userProperties) => {
        const username = userProperties.email.split('@')[0];
        console.log(`[MOCK] Created Firebase User for: ${username}`);
        this.mockUsers.set(username, { ...userProperties, uid: `mock-uid-${username}` });
        return {
          uid: `mock-uid-${username}`,
          email: userProperties.email,
          displayName: userProperties.displayName,
        };
      },
      signIn: async (email, password) => {
        const username = email.split('@')[0];
        const user = this.mockUsers.get(username);
        if (!user || user.password !== password) {
          throw new Error('Invalid username or password.');
        }
        return { uid: user.uid, email, token: `mock-token-${username}` };
      }
    };
  }
}

const firebaseAdminInstance = new FirebaseAdmin();
export default firebaseAdminInstance;
