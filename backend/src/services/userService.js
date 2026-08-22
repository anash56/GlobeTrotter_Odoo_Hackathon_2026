import prisma from '../config/prisma.js';

/**
 * Get profile data and trip metrics for authenticated user
 */
export const getUserProfileDataService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    throw error;
  }

  // Fetch user's trips for calculating profile metrics
  const trips = await prisma.trip.findMany({
    where: { userId },
    include: {
      stops: {
        include: {
          city: true,
        },
      },
    },
    orderBy: { startDate: 'asc' },
  });

  const now = new Date();

  const upcomingTrips = trips.filter((t) => new Date(t.endDate) >= now);
  const previousTrips = trips.filter((t) => new Date(t.endDate) < now);

  // Calculate unique visited cities
  const uniqueCities = new Set();
  trips.forEach((t) => {
    t.stops.forEach((s) => {
      if (s.city?.name) {
        uniqueCities.add(s.city.name);
      }
    });
  });

  return {
    user,
    stats: {
      totalTrips: trips.length,
      upcomingTripsCount: upcomingTrips.length,
      previousTripsCount: previousTrips.length,
      destinationsVisited: uniqueCities.size,
    },
    upcomingTrips,
    previousTrips,
  };
};

/**
 * Update authenticated user's profile (name & avatarUrl)
 */
export const updateUserProfileDataService = async (userId, data) => {
  const { name, avatarUrl } = data;

  if (name !== undefined && (!name || !name.trim())) {
    const error = new Error('Name cannot be empty.');
    error.statusCode = 400;
    throw error;
  }

  let updatePayload = {};

  if (name !== undefined) updatePayload.name = name.trim();
  if (avatarUrl !== undefined) updatePayload.avatarUrl = avatarUrl ? avatarUrl.trim() : null;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatePayload,
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
