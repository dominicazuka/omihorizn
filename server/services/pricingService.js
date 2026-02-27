const PricingPlan = require('../models/PricingPlan');

/**
 * Business logic related to pricing plans.
 * The controller should remain thin and delegate to this service.
 */

/**
 * Fetch all active pricing plans sorted by tier.
 * @returns {Promise<Array>} array of plan docs
 */
const fetchAllPlans = async () => {
  return PricingPlan.find({ active: true }).sort({ tier: 1 }).lean();
};

/**
 * Fetch a single plan by tier
 * @param {string} tier - free|premium|professional
 */
const fetchPlanByTier = async (tier) => {
  if (!['free', 'premium', 'professional'].includes(tier)) {
    throw new Error('Invalid pricing tier');
  }
  return PricingPlan.findOne({ tier, active: true }).lean();
};

/**
 * Fetch add-ons array for a given tier
 * @param {string} tier
 */
const fetchAddOnsForTier = async (tier) => {
  const plan = await fetchPlanByTier(tier);
  return plan ? plan.addOns || [] : [];
};

/**
 * Create a new plan or update existing one by tier.
 * @param {Object} planData - must include `tier` field
 */
const createOrUpdatePlan = async (planData) => {
  if (!planData || !planData.tier) {
    throw new Error('Tier is required to create or update plan');
  }
  // upsert based on unique tier
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const plan = await PricingPlan.findOneAndUpdate({ tier: planData.tier }, planData, options).lean();
  return plan;
};

/**
 * Delete a pricing plan by its tier string.
 * @param {string} tier
 */
const deletePlanByTier = async (tier) => {
  if (!['free', 'premium', 'professional'].includes(tier)) {
    throw new Error('Invalid tier for deletion');
  }
  await PricingPlan.deleteOne({ tier });
};

module.exports = {
  fetchAllPlans,
  fetchPlanByTier,
  fetchAddOnsForTier
  , createOrUpdatePlan, deletePlanByTier
};