import prisma from '../config/prisma.js';

/**
 * Create trip service
 */
export const createTripService = async ({ userId, title, description, startDate, endDate, cityId, totalBudget }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const city = await prisma.city.findUnique({
    where: { id: cityId },
  });

  if (!city) {
    throw new Error('Selected destination city was not found.');
  }

  const diffTime = Math.abs(end - start);
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const calculatedBudget = totalBudget && !isNaN(parseFloat(totalBudget))
    ? parseFloat(totalBudget)
    : durationDays * (city.avgDailyCost || 100);

  return await prisma.trip.create({
    data: {
      userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      startDate: start,
      endDate: end,
      totalBudget: calculatedBudget,
      coverPhotoUrl: city.imageUrl,
      stops: {
        create: [
          {
            cityId: city.id,
            sequenceOrder: 1,
            startDate: start,
            endDate: end,
            notes: `Initial destination stop for ${city.name}`,
          },
        ],
      },
    },
    include: {
      stops: {
        include: {
          city: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

/**
 * Get trips for logged in user
 */
export const getUserTripsService = async (userId) => {
  return await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      stops: {
        include: {
          city: true,
        },
      },
    },
  });
};

/**
 * Get single trip by ID for user
 */
export const getTripByIdService = async (id, userId) => {
  return await prisma.trip.findFirst({
    where: { id, userId },
    include: {
      stops: {
        include: {
          city: {
            include: {
              activities: true,
            },
          },
          activities: {
            include: {
              activity: true,
            },
          },
        },
      },
    },
  });
};
