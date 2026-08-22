import { fetchCities, fetchCityById } from '../services/cityService.js';

/**
 * @desc    Get all cities or search/filter cities
 * @route   GET /api/cities
 * @access  Public
 */
export const getCities = async (req, res) => {
  try {
    const { q, popular, region, costIndex, sortBy } = req.query;
    const cities = await fetchCities(q, popular, region, costIndex, sortBy);
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Get cities error:', error);
    return res.status(500).json({ error: 'Failed to fetch cities.' });
  }
};

/**
 * @desc    Get single city by ID
 * @route   GET /api/cities/:id
 * @access  Public
 */
export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await fetchCityById(id);

    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }

    return res.status(200).json(city);
  } catch (error) {
    console.error('Get city error:', error);
    return res.status(500).json({ error: 'Failed to fetch city details.' });
  }
};
