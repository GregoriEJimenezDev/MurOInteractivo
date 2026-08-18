import firebaseAdminInstance from '../../config/firebase.js';
import { User } from '../../domain/entities/User.js';

/**
 * Controller to manage Authentication operations.
 * SOLID Principle: SRP - Handles requests for account creation and session profiles.
 * SOLID Principle: DIP - Depends on the abstraction IUserRepository injected at construction.
 */
export class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  register = async (req, res) => {
    const { username, password, name, lastname } = req.body;

    if (!username || !password || !name || !lastname) {
      return res.status(400).json({ error: 'All fields are required (username, password, name, lastname).' });
    }

    try {
      // 1. Check if username is already registered in local MongoDB
      const existingUser = await this.userRepository.findByUsername(username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken.' });
      }

      // Initialize Firebase Admin Singleton
      firebaseAdminInstance.initialize();

      // 2. Register user in Firebase Authentication
      // Map username to a virtual email domain to work nicely with Firebase Auth requirements
      const virtualEmail = `${username.toLowerCase()}@murointeractivo.local`;
      const firebaseUser = await firebaseAdminInstance.auth.createUser({
        email: virtualEmail,
        password: password,
        displayName: `${name} ${lastname}`
      });

      // 3. Save profile metadata to MongoDB
      const newUser = new User({
        uid: firebaseUser.uid,
        username: username.toLowerCase(),
        name,
        lastname
      });

      const savedUser = await this.userRepository.save(newUser);

      return res.status(201).json({
        message: 'User successfully registered.',
        user: {
          uid: savedUser.uid,
          username: savedUser.username,
          name: savedUser.name,
          lastname: savedUser.lastname
        }
      });
    } catch (error) {
      console.error('Registration controller error:', error);
      return res.status(500).json({ error: error.message || 'Registration failed.' });
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await this.userRepository.findByUid(req.user.uid);
      if (!user) {
        return res.status(404).json({ error: 'User profile not found.' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}
