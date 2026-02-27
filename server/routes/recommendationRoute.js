const express = require('express');
const router = express.Router();
const { recommend, track } = require('../controllers/recommendationController');
const { recommendationValidators, handleValidationErrors } = require('../validators');

// POST /api/ai/recommend
router.post('/recommend', recommendationValidators.recommend, handleValidationErrors, recommend);
// POST /api/ai/recommend/track
router.post('/recommend/track', recommendationValidators.track, handleValidationErrors, track);

module.exports = router;