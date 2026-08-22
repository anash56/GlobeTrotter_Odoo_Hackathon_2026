import prisma from '../config/prisma.js';

/**
 * Fetch cities with optional search query and popularity filter
 */
export const fetchCities = async (q, popular) => {
  const whereClause = q
    ? {
        OR: [
          { name: { contains: q } },
          { country: { contains: q } },
          { region: { contains: q } },
        ],
      }
    : {};

  return await prisma.city.findMany({
    where: whereClause,
    orderBy: popular === 'true' ? { popularityScore: 'desc' } : { name: 'asc' },
    include: {
      _count: {
        select: { activities: true },
      },
    },
  });
};

/**
 * Fetch single city by ID with activities
 */
export const fetchCityById = async (id) => {
  return await prisma.city.findUnique({
    where: { id },
    include: {
      activities: true,
    },
  });
};
