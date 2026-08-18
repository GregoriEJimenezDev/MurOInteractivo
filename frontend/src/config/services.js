import { hasConfig } from './firebase.js';
import { FirebaseAuthService } from '../infrastructure/services/FirebaseAuthService.js';
import { MockAuthService } from '../infrastructure/services/MockAuthService.js';
import { ApiPostService } from '../infrastructure/services/ApiPostService.js';

/**
 * Service Registry / Dependency Injector.
 * SOLID Principle: DIP - Centralized configuration that binds abstract interfaces to concrete implementations.
 * Swaps to MockAuthService if Firebase environment parameters are not configured.
 */
export const authService = hasConfig ? new FirebaseAuthService() : new MockAuthService();
export const postService = new ApiPostService();
