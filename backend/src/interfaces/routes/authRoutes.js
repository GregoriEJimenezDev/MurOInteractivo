import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository.js';
import { verifyFirebaseToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Dependency Injection: Instantiate concrete Repository and inject into Controller
const userRepository = new MongoUserRepository();
const authController = new AuthController(userRepository);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyFirebaseToken, authController.getProfile);

export default router;
