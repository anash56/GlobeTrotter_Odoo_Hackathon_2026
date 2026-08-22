import express from 'express';
import { login, signup, register, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
