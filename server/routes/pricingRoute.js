const express = require('express');
const router = express.Router();
const {
  getAllPricingPlans,
  getPricingPlanByTier,
  getAddOnsByTier,
  upsertPricingPlan,
  deletePricingPlan,
} = require('../controllers/pricingController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { pricingValidators, handleValidationErrors } = require('../validators');


/**
 * Public Pricing Routes
 * These endpoints are PUBLIC (no authentication required)
 * Frontend calls these to fetch dynamic pricing data
 */

/**
 * GET /api/pricing/plans
 * Fetch all active pricing plans
 * Returns: Array of pricing tiers with prices, features, add-ons
 * Used by: PricingPage.web.tsx on component mount
 */
router.get('/plans', getAllPricingPlans);

/**
 * GET /api/pricing/plans/:tier
 * Fetch specific pricing plan by tier (free, premium, professional)
 * Params: tier (free | premium | professional)
 * Returns: Single pricing plan object
 * Used by: Component detail views or admin comparisons
 */
router.get('/plans/:tier', getPricingPlanByTier);

/**
 * GET /api/pricing/plans/:tier/addons
 * Fetch add-ons available for a specific pricing tier
 * Params: tier (free | premium | professional)
 * Returns: Array of add-on objects {id, name, description, price}
 * Used by: Add-on selection components
 */
router.get('/plans/:tier/addons', getAddOnsByTier);

// --------------------------------------------------
// Admin-only pricing management routes
// --------------------------------------------------
// These routes require a valid JWT and "admin" role.
router.use(authenticateToken);
router.use(requireRole('admin'));

// create or update a plan
router.post('/plans', pricingValidators.upsertPlan, handleValidationErrors, upsertPricingPlan);
router.put('/plans/:tier', pricingValidators.upsertPlan, handleValidationErrors, upsertPricingPlan);
// delete a plan
router.delete('/plans/:tier', deletePricingPlan);

module.exports = router;
