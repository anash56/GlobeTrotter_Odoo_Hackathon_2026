import { createTripService, getUserTripsService, getTripByIdService } from '../services/tripService.js';

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 * @access  Private (Authenticated User)
 */
export const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, cityId, totalBudget } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Trip title is required.' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid start or end date format.' });
    }

    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be before start date.' });
    }

    if (!cityId) {
      return res.status(400).json({ error: 'Destination city is required.' });
    }

    const newTrip = await createTripService({
      userId,
      title,
      description,
      startDate,
      endDate,
      cityId,
      totalBudget,
    });

    return res.status(201).json({
      message: 'Trip created successfully!',
      trip: newTrip,
    });
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create trip.' });
  }
};

/**
 * @desc    Get all trips for logged in user
 * @route   GET /api/trips
 * @access  Private
 */
export const getTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await getUserTripsService(userId);
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    return res.status(500).json({ error: 'Failed to fetch user trips.' });
  }
};

/**
 * @desc    Get trip by ID
 * @route   GET /api/trips/:id
 * @access  Private
 */
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await getTripByIdService(id, userId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or unauthorized.' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    return res.status(500).json({ error: 'Failed to fetch trip details.' });
  }
};
