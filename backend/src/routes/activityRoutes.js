import express from 'express';
import { getActivities, getActivityById } from '../controllers/activityController.js';

const router = express.Router();

/**
 * Activity Routes (Base URL: /api/activities)
 */
// GET /api/activities & GET /api/activities/search -> List or search activities
router.get('/', getActivities);
router.get('/search', getActivities);

// GET /api/activities/:id -> Get single activity details by ID
router.get('/:id', getActivityById);

export default router;
