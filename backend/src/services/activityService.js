import prisma from '../config/prisma.js';

/**
 * Fetch activities with optional query, category, cityId, minCost, maxCost, and sorting
 */
export const fetchActivities = async ({ q, category, cityId, minCost, maxCost, sortBy }) => {
  const where = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { category: { contains: q } },
      { city: { name: { contains: q } } },
      { city: { country: { contains: q } } },
    ];
  }

  if (category && category !== 'All') {
    where.category = { equals: category };
  }

  if (cityId) {
    where.cityId = cityId;
  }

  if (minCost !== undefined || maxCost !== undefined) {
    where.estimatedCost = {};
    if (minCost !== undefined) where.estimatedCost.gte = parseFloat(minCost);
    if (maxCost !== undefined) where.estimatedCost.lte = parseFloat(maxCost);
  }

  let orderBy = { name: 'asc' };
  if (sortBy === 'cost-asc') {
    orderBy = { estimatedCost: 'asc' };
  } else if (sortBy === 'cost-desc') {
    orderBy = { estimatedCost: 'desc' };
  } else if (sortBy === 'duration-asc') {
    orderBy = { durationHours: 'asc' };
  } else if (sortBy === 'duration-desc') {
    orderBy = { durationHours: 'desc' };
  }

  return await prisma.activity.findMany({
    where,
    orderBy,
    include: {
      city: {
        select: {
          id: true,
          name: true,
          country: true,
          region: true,
          imageUrl: true,
        },
      },
    },
  });
};

/**
 * Fetch single activity by ID with city info
 */
export const fetchActivityById = async (id) => {
  return await prisma.activity.findUnique({
    where: { id },
    include: {
      city: true,
    },
  });
};
