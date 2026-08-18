/**
 * Interface contract for Auth Service on the frontend.
 * SOLID Principle: DIP - ViewModels depend on this interface, allowing us 
 * to swap between the real Firebase service and a Mock service.
 */
export class IAuthService {
  async register(username, password, name, lastname) {
    throw new Error('Method register() not implemented');
  }

  async login(username, password) {
    throw new Error('Method login() not implemented');
  }

  async logout() {
    throw new Error('Method logout() not implemented');
  }

  async getCurrentUser() {
    throw new Error('Method getCurrentUser() not implemented');
  }

  onAuthStateChanged(callback) {
    throw new Error('Method onAuthStateChanged() not implemented');
  }
}
