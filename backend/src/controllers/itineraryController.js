import {
  getItineraryService,
  createStopService,
  updateStopService,
  deleteStopService,
  reorderStopsService,
  createActivityService,
  updateActivityService,
  deleteActivityService,
  reorderActivitiesService,
} from '../services/itineraryService.js';

/**
 * @desc    Get trip itinerary details
 * @route   GET /api/trips/:id/itinerary
 * @access  Private (Authenticated User - Trip Owner)
 */
export const getItinerary = async (req, res) => {
  try {
    const { id: tripId } = req.params;
    const userId = req.user.id;

    const itinerary = await getItineraryService(tripId, userId);
    return res.status(200).json(itinerary);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to fetch itinerary.' });
  }
};

/**
 * @desc    Create a new stop (destination section) in trip
 * @route   POST /api/trips/:id/stops
 * @access  Private
 */
export const createStop = async (req, res) => {
  try {
    const { id: tripId } = req.params;
    const userId = req.user.id;

    const newStop = await createStopService(tripId, userId, req.body);
    return res.status(201).json({
      message: 'Itinerary stop created successfully.',
      stop: newStop,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to create stop.' });
  }
};

/**
 * @desc    Update a trip stop
 * @route   PATCH /api/trips/:id/stops/:stopId
 * @access  Private
 */
export const updateStop = async (req, res) => {
  try {
    const { id: tripId, stopId } = req.params;
    const userId = req.user.id;

    const updatedStop = await updateStopService(tripId, stopId, userId, req.body);
    return res.status(200).json({
      message: 'Itinerary stop updated successfully.',
      stop: updatedStop,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to update stop.' });
  }
};

/**
 * @desc    Delete a trip stop
 * @route   DELETE /api/trips/:id/stops/:stopId
 * @access  Private
 */
export const deleteStop = async (req, res) => {
  try {
    const { id: tripId, stopId } = req.params;
    const userId = req.user.id;

    const result = await deleteStopService(tripId, stopId, userId);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to delete stop.' });
  }
};

/**
 * @desc    Reorder trip stops
 * @route   PATCH /api/trips/:id/stops/reorder
 * @access  Private
 */
export const reorderStops = async (req, res) => {
  try {
    const { id: tripId } = req.params;
    const userId = req.user.id;
    const { stopIds } = req.body;

    const stops = await reorderStopsService(tripId, userId, stopIds);
    return res.status(200).json({
      message: 'Stops reordered successfully.',
      stops,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to reorder stops.' });
  }
};

/**
 * @desc    Create a new activity inside a stop
 * @route   POST /api/trips/:id/stops/:stopId/activities
 * @access  Private
 */
export const createActivity = async (req, res) => {
  try {
    const { id: tripId, stopId } = req.params;
    const userId = req.user.id;

    const newActivity = await createActivityService(tripId, stopId, userId, req.body);
    return res.status(201).json({
      message: 'Itinerary activity added successfully.',
      activity: newActivity,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to add activity.' });
  }
};

/**
 * @desc    Update an activity inside a stop
 * @route   PATCH /api/trips/:id/stops/:stopId/activities/:activityId
 * @access  Private
 */
export const updateActivity = async (req, res) => {
  try {
    const { id: tripId, stopId, activityId } = req.params;
    const userId = req.user.id;

    const updatedActivity = await updateActivityService(tripId, stopId, activityId, userId, req.body);
    return res.status(200).json({
      message: 'Itinerary activity updated successfully.',
      activity: updatedActivity,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to update activity.' });
  }
};

/**
 * @desc    Delete an activity from a stop
 * @route   DELETE /api/trips/:id/stops/:stopId/activities/:activityId
 * @access  Private
 */
export const deleteActivity = async (req, res) => {
  try {
    const { id: tripId, stopId, activityId } = req.params;
    const userId = req.user.id;

    const result = await deleteActivityService(tripId, stopId, activityId, userId);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to delete activity.' });
  }
};

/**
 * @desc    Reorder activities inside a stop
 * @route   PATCH /api/trips/:id/stops/:stopId/activities/reorder
 * @access  Private
 */
export const reorderActivities = async (req, res) => {
  try {
    const { id: tripId, stopId } = req.params;
    const userId = req.user.id;
    const { activityIds } = req.body;

    const activities = await reorderActivitiesService(tripId, stopId, userId, activityIds);
    return res.status(200).json({
      message: 'Activities reordered successfully.',
      activities,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to reorder activities.' });
  }
};
