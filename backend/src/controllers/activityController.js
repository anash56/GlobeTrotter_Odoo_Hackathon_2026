import { fetchActivities, fetchActivityById } from '../services/activityService.js';

/**
 * @desc    Get all activities or search/filter activities
 * @route   GET /api/activities
 * @access  Public
 */
export const getActivities = async (req, res) => {
  try {
    const { q, category, cityId, minCost, maxCost, sortBy } = req.query;
    const activities = await fetchActivities({ q, category, cityId, minCost, maxCost, sortBy });
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    return res.status(500).json({ error: 'Failed to fetch activities.' });
  }
};

/**
 * @desc    Get single activity by ID
 * @route   GET /api/activities/:id
 * @access  Public
 */
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await fetchActivityById(id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    return res.status(200).json(activity);
  } catch (error) {
    console.error('Get activity error:', error);
    return res.status(500).json({ error: 'Failed to fetch activity details.' });
  }
};
