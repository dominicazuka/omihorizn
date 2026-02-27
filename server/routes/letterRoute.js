const express = require('express');
const router = express.Router();
const { generateLetter, regenerate } = require('../controllers/letterController');
const { letterValidators, handleValidationErrors } = require('../validators');

// POST /api/ai/letter
router.post('/letter', letterValidators.generate, handleValidationErrors, generateLetter);
// POST /api/ai/letter/regenerate
router.post('/letter/regenerate', letterValidators.regenerate, handleValidationErrors, regenerate);

module.exports = router;