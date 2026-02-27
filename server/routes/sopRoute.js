const express = require('express');
const router = express.Router();
const { generateSop, regenerate, score } = require('../controllers/sopController');
const { sopValidators, handleValidationErrors } = require('../validators');

// POST /api/ai/sop
router.post('/sop', sopValidators.generate, handleValidationErrors, generateSop);
// POST /api/ai/sop/regenerate
router.post('/sop/regenerate', sopValidators.regenerate, handleValidationErrors, regenerate);
// POST /api/ai/sop/score
router.post('/sop/score', sopValidators.score, handleValidationErrors, score);

module.exports = router;