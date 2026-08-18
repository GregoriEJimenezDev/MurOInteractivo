/**
 * Interface contract for Auth Service on the frontend.
 * SOLID Principle: DIP - ViewModels depend on this interface, allowing us 
 * to swap between the real Firebase service and a Mock service.
 */
export class IAuthService {
  async register(email, password, name, lastname, username) {
    throw new Error('Method register() not implemented');
  }

  async login(email, password) {
    throw new Error('Method login() not implemented');
  }

  async logout() {
    throw new Error('Method logout() not implemented');
  }

  async getCurrentUser() {
    throw new Error('Method getCurrentUser() not implemented');
  }

  async updateUserProfile(userId, data) {
    throw new Error('Method updateUserProfile() not implemented');
  }

  async sendVerificationEmail(user) {
    throw new Error('Method sendVerificationEmail() not implemented');
  }

  async checkEmailVerified() {
    throw new Error('Method checkEmailVerified() not implemented');
  }

  onAuthStateChanged(callback) {
    throw new Error('Method onAuthStateChanged() not implemented');
  }
}
