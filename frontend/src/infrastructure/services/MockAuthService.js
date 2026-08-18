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

  async register(email, password, name, lastname, username) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const lowerUsername = (username || email.split('@')[0]).toLowerCase();
    const lowerEmail = email.toLowerCase();

    if (users.find((u) => u.username === lowerUsername || u.email === lowerEmail)) {
      throw new Error('El nombre de usuario o correo ya está en uso.');
    }

    const newUser = {
      uid: `mock-uid-${lowerUsername}`,
      username: lowerUsername,
      email: lowerEmail,
      name,
      lastname,
      avatarId: null,
      bio: '',
      emailVerified: false,
      verificationSent: true,
      password // Simulated cleartext check
    };

    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));

    // In mock mode, DON'T auto-login. User must verify email first.
    return {
      user: new User({
        uid: newUser.uid,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        lastname: newUser.lastname
      }),
      emailVerified: false
    };
  }

  async login(emailOrUsername, password) {
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const lowerInput = emailOrUsername.toLowerCase();

    // Try matching by email first, then by username
    // Also handle legacy accounts that may not have an email field
    let userMatch = users.find(
      (u) => u.email === lowerInput && u.password === password
    );

    if (!userMatch) {
      userMatch = users.find(
        (u) => u.username === lowerInput && u.password === password
      );
    }

    // If input looks like an email and no match found, try extracting the username part
    if (!userMatch && lowerInput.includes('@')) {
      const usernamePart = lowerInput.split('@')[0];
      userMatch = users.find(
        (u) => u.username === usernamePart && u.password === password
      );
    }

    if (!userMatch) {
      throw new Error('Credenciales inválidas. Revisa tu correo y contraseña.');
    }

    // Check email verification
    if (userMatch.emailVerified === false) {
      throw new Error('Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }

    const user = new User({
      uid: userMatch.uid,
      username: userMatch.username,
      email: userMatch.email,
      name: userMatch.name,
      lastname: userMatch.lastname,
      avatarId: userMatch.avatarId || null,
      bio: userMatch.bio || ''
    });

    const token = `mock-token-${userMatch.username}`;
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

  async sendVerificationEmail() {
    // In mock mode, we just simulate sending the email.
    // The verification token is stored so the user can "click the link".
    if (!this.currentUser) {
      throw new Error('No hay un usuario autenticado.');
    }
    const token = `mock-verify-${this.currentUser.uid}`;
    localStorage.setItem('mock_pending_verification', JSON.stringify({
      uid: this.currentUser.uid,
      email: this.currentUser.email,
      token
    }));
    console.log(`[Mock] Email de verificación enviado a ${this.currentUser.email}. Token: ${token}`);
  }

  async verifyEmail(token) {
    // In mock mode, verify the token and mark user as verified
    const pending = JSON.parse(localStorage.getItem('mock_pending_verification') || 'null');
    if (!pending || pending.token !== token) {
      throw new Error('Token de verificación inválido o expirado.');
    }

    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const idx = users.findIndex((u) => u.uid === pending.uid);
    if (idx !== -1) {
      users[idx].emailVerified = true;
      localStorage.setItem('mock_users', JSON.stringify(users));
    }

    localStorage.removeItem('mock_pending_verification');

    // If this user is the current session, update it
    if (this.currentUser && this.currentUser.uid === pending.uid) {
      this._notifyListeners();
    }

    return true;
  }

  async checkEmailVerified() {
    if (!this.currentUser) return false;
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const user = users.find((u) => u.uid === this.currentUser.uid);
    return user?.emailVerified === true;
  }

  /**
   * Returns the pending verification token for the given email (mock only).
   * Used by the VerifyEmail page to simulate clicking the email link.
   */
  getPendingVerificationToken(email) {
    const pending = JSON.parse(localStorage.getItem('mock_pending_verification') || 'null');
    if (pending && pending.email === email.toLowerCase()) {
      return pending.token;
    }
    return null;
  }

  async getCurrentUser() {
    return this.currentUser;
  }

  async updateUserProfile(userId, data) {
    if (!this.currentUser || this.currentUser.uid !== userId) {
      throw new Error('No active mock session matches the given user id.');
    }

    // Update the user object
    this.currentUser = new User({ ...this.currentUser, ...data });

    // Also update the stored users list so changes persist across sessions
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const idx = users.findIndex((u) => u.uid === userId);
    if (idx !== -1) {
      if (data.avatarId !== undefined) users[idx].avatarId = data.avatarId;
      if (data.bio !== undefined) users[idx].bio = data.bio;
      localStorage.setItem('mock_users', JSON.stringify(users));
    }

    localStorage.setItem(
      'mock_session',
      JSON.stringify({ user: this.currentUser, token: this.token })
    );
    this._notifyListeners();
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
