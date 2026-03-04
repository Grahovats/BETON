import { Router } from 'express';
import { login, me, onlyFansLogin, register } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/onlyfans-login', onlyFansLogin);
authRoutes.get('/me', authMiddleware, me);
