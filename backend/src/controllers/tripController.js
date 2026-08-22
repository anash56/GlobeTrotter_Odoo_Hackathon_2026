import prisma from '../config/prisma.js';

/**
 * @desc    Get authenticated user's trips
 * @route   GET /api/trips
 * @access  Private
 */
export const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    let trips = [];
    try {
      trips = await prisma.trip.findMany({
        where: { userId },
        include: {
          stops: {
            include: {
              city: true,
            },
            orderBy: {
              sequenceOrder: 'asc',
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
      });
    } catch (dbErr) {
      console.warn('Prisma query error fetching user trips:', dbErr.message);
    }

    return res.status(200).json({
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return res.status(500).json({ error: 'Failed to retrieve trips.' });
  }
};

/**
 * @desc    Create a new trip for authenticated user
 * @route   POST /api/trips
 * @access  Private
 */
export const createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, startDate, endDate, totalBudget, coverPhotoUrl } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, start date, and end date are required.' });
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        title: title.trim(),
        description: description ? description.trim() : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalBudget: totalBudget ? parseFloat(totalBudget) : 0.0,
        coverPhotoUrl: coverPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      },
    });

    return res.status(201).json({
      message: 'Trip created successfully!',
      trip,
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({ error: 'Failed to create trip.' });
  }
};
