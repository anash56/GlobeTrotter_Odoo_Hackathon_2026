import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All user profile routes require JWT authentication
router.use(protect);

/**
 * User Profile Routes (Base URL: /api/users)
 */
router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);

export default router;
