import express from 'express';
import { getCities, getCityById } from '../controllers/cityController.js';

const router = express.Router();

/**
 * City Routes (Base URL: /api/cities)
 */
// GET /api/cities & GET /api/cities/search -> List or search destination cities
router.get('/', getCities);
router.get('/search', getCities);

// GET /api/cities/:id -> Get single city details by ID
router.get('/:id', getCityById);

export default router;
