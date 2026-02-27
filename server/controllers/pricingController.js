// controller now uses pricingService for business logic
const pricingService = require('../services/pricingService');

/**
 * Get all active pricing plans
 * GET /api/pricing/plans
 * Public endpoint (no auth required)
 */
const getAllPricingPlans = async (req, res) => {
  try {
    const plans = await pricingService.fetchAllPlans();
    if (!plans || plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No pricing plans available'
      });
    }
    res.status(200).json({ success: true, data: plans, count: plans.length });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing plans',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get specific pricing plan by tier
 * GET /api/pricing/plans/:tier
 * Public endpoint (no auth required)
 */
const getPricingPlanByTier = async (req, res) => {
  try {
    const { tier } = req.params;

    // Validate tier
    try {
      const plan = await pricingService.fetchPlanByTier(tier);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: `Pricing plan for tier '${tier}' not found`
        });
      }
      res.status(200).json({ success: true, data: plan });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get add-ons for a specific tier
 * GET /api/pricing/plans/:tier/addons
 * Public endpoint (no auth required)
 */
const getAddOnsByTier = async (req, res) => {
  try {
    const { tier } = req.params;

    // Validate tier
    try {
      const addOns = await pricingService.fetchAddOnsForTier(tier);
      res.status(200).json({ success: true, data: addOns, count: addOns.length });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching add-ons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// --------- Admin-only endpoints ----------

/**
 * Create or update a pricing plan. Admin only.
 */
const upsertPricingPlan = async (req, res) => {
  try {
    const planData = req.body;
    const plan = await pricingService.createOrUpdatePlan(planData);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error('Error upserting pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating pricing plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a pricing plan by tier. Admin only.
 */
const deletePricingPlan = async (req, res) => {
  try {
    const { tier } = req.params;
    await pricingService.deletePlanByTier(tier);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pricing plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllPricingPlans,
  getPricingPlanByTier,
  getAddOnsByTier,
  upsertPricingPlan,
  deletePricingPlan,
};
