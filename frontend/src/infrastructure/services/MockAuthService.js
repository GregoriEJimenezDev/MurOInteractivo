import { IAuthService } from '../../domain/services/IAuthService.js';
import { User } from '../../domain/entities/User.js';

/**
 * Mock implementation of AuthService.
 * SOLID Principle: LSP - Can be substituted in place of IAuthService for local testing.
 */
export class MockAuthService extends IAuthService {
  constructor() {
    super();
    this.listeners = [];
    this.currentUser = null;
    this.token = null;

    // Load active session from storage if it exists
    const savedSession = localStorage.getItem('mock_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        this.currentUser = new User(parsed.user);
        this.token = parsed.token;
      } catch (e) {
        localStorage.removeItem('mock_session');
      }
    }
  }

  async register(username, password, name, lastname) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const lowerUsername = username.toLowerCase();

    if (users.find((u) => u.username === lowerUsername)) {
      throw new Error('Username is already taken.');
    }

    const newUser = {
      uid: `mock-uid-${lowerUsername}`,
      username: lowerUsername,
      name,
      lastname,
      password // Simulated cleartext check
    };

    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));
    return { message: 'User successfully registered in mock database.' };
  }

  async login(username, password) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const lowerUsername = username.toLowerCase();
    const userMatch = users.find(
      (u) => u.username === lowerUsername && u.password === password
    );

    if (!userMatch) {
      throw new Error('Invalid credentials (mock auth).');
    }

    const user = new User({
      uid: userMatch.uid,
      username: userMatch.username,
      name: userMatch.name,
      lastname: userMatch.lastname
    });

    // Generate mock token that matches backend mock token verification pattern
    const token = `mock-token-${lowerUsername}`;
    this.currentUser = user;
    this.token = token;

    localStorage.setItem('mock_session', JSON.stringify({ user, token }));
    this._notifyListeners();

    return { user, token };
  }

  async logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('mock_session');
    this._notifyListeners();
  }

  async getCurrentUser() {
    return this.currentUser;
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Fire initial state immediately
    callback(this.currentUser, this.token);
    
    // Return cleanup unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  _notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentUser, this.token));
  }
}
