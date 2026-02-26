/**
 * MongoDB Transactions & Concurrency Control
 * Ensures data consistency with atomic operations
 */

const mongoose = require('mongoose');

/**
 * Execute transaction with multiple operations
 * @param {Function} callback - Async function with session parameter
 */
const executeTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Atomic find and update
 * Prevents race conditions in read-check-update pattern
 */
const atomicUpdate = async (Model, filter, update, options = {}) => {
  try {
    const result = await Model.findOneAndUpdate(filter, update, {
      new: true,
      lean: true,
      ...options,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Atomic increment
 * Safely increment numeric fields
 */
const atomicIncrement = async (Model, filter, fieldName, incrementBy = 1) => {
  try {
    const result = await Model.findOneAndUpdate(
      filter,
      {
        $inc: { [fieldName]: incrementBy },
      },
      { new: true, lean: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Check feature usage limit atomically
 * Verifies and increments usage in single operation
 */
const checkAndIncrementUsage = async (UsageModel, userId, featureId, limit) => {
  try {
    const result = await UsageModel.findOneAndUpdate(
      {
        userId,
        featureId,
        usageCount: { $lt: limit }, // Atomic check
      },
      {
        $inc: { usageCount: 1 },
        lastUsedAt: new Date(),
      },
      { new: true }
    );

    if (!result) {
      return {
        allowed: false,
        reason: 'Usage limit exceeded',
      };
    }

    return {
      allowed: true,
      currentUsage: result.usageCount,
      limit,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Duplicate key check
 * Safely check for existing resources before creation
 */
const ensureUnique = async (Model, filter, errorMessage) => {
  try {
    const existing = await Model.findOne(filter);
    if (existing) {
      const error = new Error(errorMessage);
      error.statusCode = 409;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Session-aware create
 * Create document within transaction session
 */
const createWithSession = async (Model, data, session) => {
  try {
    const doc = await Model.create([data], { session });
    return doc[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  executeTransaction,
  atomicUpdate,
  atomicIncrement,
  checkAndIncrementUsage,
  ensureUnique,
  createWithSession,
};
