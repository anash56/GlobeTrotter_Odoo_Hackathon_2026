import prisma from '../config/prisma.js';

/**
 * Fetch cities with search query, region, cost index filter, and popularity/cost sorting
 */
export const fetchCities = async (q, popular, region, costIndex, sortBy) => {
  const whereClause = {};

  if (q) {
    whereClause.OR = [
      { name: { contains: q } },
      { country: { contains: q } },
      { region: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (region && region !== 'All') {
    whereClause.region = { equals: region };
  }

  if (costIndex && costIndex !== 'All') {
    whereClause.costIndex = { equals: costIndex };
  }

  let orderBy = { name: 'asc' };
  if (sortBy === 'popularity' || popular === 'true') {
    orderBy = { popularityScore: 'desc' };
  } else if (sortBy === 'cost-asc') {
    orderBy = { avgDailyCost: 'asc' };
  } else if (sortBy === 'cost-desc') {
    orderBy = { avgDailyCost: 'desc' };
  } else if (sortBy === 'name') {
    orderBy = { name: 'asc' };
  }

  return await prisma.city.findMany({
    where: whereClause,
    orderBy,
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
