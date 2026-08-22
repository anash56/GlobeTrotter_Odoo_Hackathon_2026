import express from 'express';
import {
  getCommunityPosts,
  createCommunityPost,
  deleteCommunityPost,
  toggleLikePost,
  getPostComments,
  addPostComment,
} from '../controllers/communityController.js';
import { protect, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/community/posts -> Public/Optional Auth feed
router.get('/posts', optionalProtect, getCommunityPosts);

// POST /api/community/posts -> Create new post (Protected)
router.post('/posts', protect, createCommunityPost);

// DELETE /api/community/posts/:id -> Delete post (Protected)
router.delete('/posts/:id', protect, deleteCommunityPost);

// POST /api/community/posts/:id/like -> Toggle post like (Protected)
router.post('/posts/:id/like', protect, toggleLikePost);

// GET /api/community/posts/:id/comments -> Get comments (Public)
router.get('/posts/:id/comments', getPostComments);

// POST /api/community/posts/:id/comments -> Add comment (Protected)
router.post('/posts/:id/comments', protect, addPostComment);

export default router;
