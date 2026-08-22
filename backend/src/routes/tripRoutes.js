import express from 'express';
import { createTrip, getTrips, getTripById } from '../controllers/tripController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All trip routes require JWT authentication
router.use(protect);

/**
 * Trip Routes (Base URL: /api/trips)
 */
// POST /api/trips & POST /api/trips/create-trip -> Create a new trip
router.post('/', createTrip);
router.post('/create-trip', createTrip);

// GET /api/trips -> Get all trips for logged-in user
router.get('/', getTrips);

// GET /api/trips/:id -> Get specific trip details by ID
router.get('/:id', getTripById);

export default router;
