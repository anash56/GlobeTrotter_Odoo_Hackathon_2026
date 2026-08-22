import express from 'express';
import { getUserTrips, createTrip } from '../controllers/tripController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserTrips);
router.post('/', createTrip);

export default router;
