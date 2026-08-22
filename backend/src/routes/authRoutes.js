import express from 'express';
import { login, signup, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/register', register);
router.post('/login', login);

export default router;
