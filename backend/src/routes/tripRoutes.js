import express from 'express';
import { createTrip, getTrips, getTripById } from '../controllers/tripController.js';
import {
  getItinerary,
  createStop,
  updateStop,
  deleteStop,
  reorderStops,
  createActivity,
  updateActivity,
  deleteActivity,
  reorderActivities,
} from '../controllers/itineraryController.js';
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

// GET /api/trips/:id/itinerary -> Fetch complete trip itinerary
router.get('/:id/itinerary', getItinerary);

// Trip Stops Endpoints
router.post('/:id/stops', createStop);
router.patch('/:id/stops/reorder', reorderStops);
router.patch('/:id/stops/:stopId', updateStop);
router.delete('/:id/stops/:stopId', deleteStop);

// Trip Activities Endpoints
router.post('/:id/stops/:stopId/activities', createActivity);
router.patch('/:id/stops/:stopId/activities/reorder', reorderActivities);
router.patch('/:id/stops/:stopId/activities/:activityId', updateActivity);
router.delete('/:id/stops/:stopId/activities/:activityId', deleteActivity);

export default router;
