import prisma from '../config/prisma.js';

/**
 * Helper to verify trip ownership and return trip
 */
export const verifyTripOwnership = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    const error = new Error('Trip not found.');
    error.statusCode = 404;
    throw error;
  }

  if (trip.userId !== userId) {
    const error = new Error('Unauthorized to modify or view this trip itinerary.');
    error.statusCode = 403;
    throw error;
  }

  return trip;
};

/**
 * Helper to verify stop belongs to trip
 */
export const verifyStopOwnership = async (tripId, stopId, userId) => {
  await verifyTripOwnership(tripId, userId);

  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
  });

  if (!stop || stop.tripId !== tripId) {
    const error = new Error('Itinerary stop not found for this trip.');
    error.statusCode = 404;
    throw error;
  }

  return stop;
};

/**
 * Helper to verify activity belongs to stop
 */
export const verifyActivityOwnership = async (tripId, stopId, activityId, userId) => {
  const stop = await verifyStopOwnership(tripId, stopId, userId);

  const activity = await prisma.tripActivity.findUnique({
    where: { id: activityId },
  });

  if (!activity || activity.tripStopId !== stopId) {
    const error = new Error('Itinerary activity not found for this stop.');
    error.statusCode = 404;
    throw error;
  }

  return { stop, activity };
};

/**
 * Get complete trip itinerary with stops, activities, and budget metrics
 */
export const getItineraryService = async (tripId, userId) => {
  const trip = await verifyTripOwnership(tripId, userId);

  const fullTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      stops: {
        orderBy: {
          sequenceOrder: 'asc',
        },
        include: {
          city: {
            include: {
              activities: true,
            },
          },
          activities: {
            orderBy: {
              sequenceOrder: 'asc',
            },
            include: {
              activity: true,
            },
          },
        },
      },
      expenses: true,
    },
  });

  // Calculate budget statistics
  let totalActivityCost = 0;
  if (fullTrip.stops) {
    fullTrip.stops.forEach((stop) => {
      if (stop.activities) {
        stop.activities.forEach((act) => {
          totalActivityCost += act.cost || 0;
        });
      }
    });
  }

  let totalOtherExpenses = 0;
  if (fullTrip.expenses) {
    fullTrip.expenses.forEach((exp) => {
      totalOtherExpenses += exp.amount || 0;
    });
  }

  const totalEstimatedCost = totalActivityCost + totalOtherExpenses;
  const remainingBudget = fullTrip.totalBudget - totalEstimatedCost;

  return {
    ...fullTrip,
    stats: {
      totalActivityCost,
      totalOtherExpenses,
      totalEstimatedCost,
      remainingBudget,
    },
  };
};

/**
 * Add a new stop/destination section to the trip
 */
export const createStopService = async (tripId, userId, data) => {
  const trip = await verifyTripOwnership(tripId, userId);
  const { cityId, startDate, endDate, notes } = data;

  if (!cityId) {
    const error = new Error('Destination city is required for a stop.');
    error.statusCode = 400;
    throw error;
  }

  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) {
    const error = new Error('Selected destination city was not found.');
    error.statusCode = 404;
    throw error;
  }

  const stopStart = new Date(startDate || trip.startDate);
  const stopEnd = new Date(endDate || trip.endDate);

  if (isNaN(stopStart.getTime()) || isNaN(stopEnd.getTime())) {
    const error = new Error('Invalid start or end date format.');
    error.statusCode = 400;
    throw error;
  }

  if (stopEnd < stopStart) {
    const error = new Error('Stop end date cannot be before start date.');
    error.statusCode = 400;
    throw error;
  }

  // Find max sequence order
  const existingStops = await prisma.tripStop.findMany({
    where: { tripId },
    select: { sequenceOrder: true },
  });
  const maxOrder = existingStops.reduce((max, s) => Math.max(max, s.sequenceOrder || 0), 0);

  const newStop = await prisma.tripStop.create({
    data: {
      tripId,
      cityId,
      sequenceOrder: maxOrder + 1,
      startDate: stopStart,
      endDate: stopEnd,
      notes: notes ? notes.trim() : null,
    },
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
  });

  return newStop;
};

/**
 * Update an existing trip stop
 */
export const updateStopService = async (tripId, stopId, userId, data) => {
  const existingStop = await verifyStopOwnership(tripId, stopId, userId);
  const { cityId, startDate, endDate, notes } = data;

  let updateData = {};

  if (cityId) {
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      const error = new Error('Selected destination city not found.');
      error.statusCode = 404;
      throw error;
    }
    updateData.cityId = cityId;
  }

  if (startDate) updateData.startDate = new Date(startDate);
  if (endDate) updateData.endDate = new Date(endDate);
  if (notes !== undefined) updateData.notes = notes ? notes.trim() : null;

  const startToCheck = updateData.startDate || existingStop.startDate;
  const endToCheck = updateData.endDate || existingStop.endDate;

  if (endToCheck < startToCheck) {
    const error = new Error('End date cannot be before start date.');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.tripStop.update({
    where: { id: stopId },
    data: updateData,
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
  });
};

/**
 * Delete a trip stop
 */
export const deleteStopService = async (tripId, stopId, userId) => {
  await verifyStopOwnership(tripId, stopId, userId);

  await prisma.tripStop.delete({
    where: { id: stopId },
  });

  return { message: 'Itinerary stop deleted successfully.' };
};

/**
 * Reorder trip stops
 */
export const reorderStopsService = async (tripId, userId, stopIds) => {
  await verifyTripOwnership(tripId, userId);

  if (!Array.isArray(stopIds) || stopIds.length === 0) {
    const error = new Error('stopIds must be a non-empty array of stop IDs.');
    error.statusCode = 400;
    throw error;
  }

  // Use a transaction for sequence updates
  const updates = stopIds.map((id, index) =>
    prisma.tripStop.update({
      where: { id },
      data: { sequenceOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return await prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { sequenceOrder: 'asc' },
    include: {
      city: true,
      activities: {
        orderBy: { sequenceOrder: 'asc' },
        include: { activity: true },
      },
    },
  });
};

/**
 * Add an activity to a trip stop
 */
export const createActivityService = async (tripId, stopId, userId, data) => {
  const stop = await verifyStopOwnership(tripId, stopId, userId);
  const { activityId, customName, category, scheduledDate, startTime, endTime, cost } = data;

  if (!activityId && (!customName || !customName.trim())) {
    const error = new Error('Either a pre-defined activity or custom activity name is required.');
    error.statusCode = 400;
    throw error;
  }

  const dateToUse = scheduledDate ? new Date(scheduledDate) : new Date(stop.startDate);
  if (isNaN(dateToUse.getTime())) {
    const error = new Error('Invalid scheduled date format.');
    error.statusCode = 400;
    throw error;
  }

  const parsedCost = cost !== undefined && !isNaN(parseFloat(cost)) ? Math.max(0, parseFloat(cost)) : 0;

  // Max order for activities in stop
  const existingActivities = await prisma.tripActivity.findMany({
    where: { tripStopId: stopId },
    select: { sequenceOrder: true },
  });
  const maxOrder = existingActivities.reduce((max, a) => Math.max(max, a.sequenceOrder || 0), 0);

  let predefActivity = null;
  if (activityId) {
    predefActivity = await prisma.activity.findUnique({ where: { id: activityId } });
  }

  const newTripActivity = await prisma.tripActivity.create({
    data: {
      tripStopId: stopId,
      activityId: activityId || null,
      customName: customName ? customName.trim() : (predefActivity ? predefActivity.name : null),
      category: category ? category.trim() : (predefActivity ? predefActivity.category : 'Sightseeing'),
      scheduledDate: dateToUse,
      startTime: startTime || null,
      endTime: endTime || null,
      cost: parsedCost || (predefActivity ? predefActivity.estimatedCost || 0 : 0),
      sequenceOrder: maxOrder + 1,
    },
    include: {
      activity: true,
    },
  });

  return newTripActivity;
};

/**
 * Update a trip activity
 */
export const updateActivityService = async (tripId, stopId, activityId, userId, data) => {
  await verifyActivityOwnership(tripId, stopId, activityId, userId);
  const { customName, category, scheduledDate, startTime, endTime, cost } = data;

  let updateData = {};

  if (customName !== undefined) updateData.customName = customName ? customName.trim() : null;
  if (category !== undefined) updateData.category = category ? category.trim() : 'Sightseeing';
  if (scheduledDate) {
    const dateToUse = new Date(scheduledDate);
    if (isNaN(dateToUse.getTime())) {
      const error = new Error('Invalid scheduled date format.');
      error.statusCode = 400;
      throw error;
    }
    updateData.scheduledDate = dateToUse;
  }
  if (startTime !== undefined) updateData.startTime = startTime || null;
  if (endTime !== undefined) updateData.endTime = endTime || null;
  if (cost !== undefined && !isNaN(parseFloat(cost))) {
    updateData.cost = Math.max(0, parseFloat(cost));
  }

  return await prisma.tripActivity.update({
    where: { id: activityId },
    data: updateData,
    include: {
      activity: true,
    },
  });
};

/**
 * Delete a trip activity
 */
export const deleteActivityService = async (tripId, stopId, activityId, userId) => {
  await verifyActivityOwnership(tripId, stopId, activityId, userId);

  await prisma.tripActivity.delete({
    where: { id: activityId },
  });

  return { message: 'Itinerary activity deleted successfully.' };
};

/**
 * Reorder activities inside a stop
 */
export const reorderActivitiesService = async (tripId, stopId, userId, activityIds) => {
  await verifyStopOwnership(tripId, stopId, userId);

  if (!Array.isArray(activityIds) || activityIds.length === 0) {
    const error = new Error('activityIds must be a non-empty array of activity IDs.');
    error.statusCode = 400;
    throw error;
  }

  const updates = activityIds.map((id, index) =>
    prisma.tripActivity.update({
      where: { id },
      data: { sequenceOrder: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return await prisma.tripActivity.findMany({
    where: { tripStopId: stopId },
    orderBy: { sequenceOrder: 'asc' },
    include: { activity: true },
  });
};
