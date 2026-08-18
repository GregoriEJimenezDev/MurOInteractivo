import express from 'express';
import { PostController } from '../controllers/PostController.js';
import { MongoPostRepository } from '../../infrastructure/repositories/MongoPostRepository.js';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository.js';
import { verifyFirebaseToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Dependency Injection: Instantiate concrete repositories and inject them into PostController
const postRepository = new MongoPostRepository();
const userRepository = new MongoUserRepository();
const postController = new PostController(postRepository, userRepository);

router.get('/', postController.getPosts);
router.post('/', verifyFirebaseToken, postController.createPost);

export default router;
