const express = require('express');
const router = express.Router();
const { generatePrep, generateAnswers, saveFeedback } = require('../controllers/interviewController');
const { interviewValidators, handleValidationErrors } = require('../validators');

// POST /api/ai/interview
router.post('/interview', interviewValidators.generate, handleValidationErrors, generatePrep);
// POST /api/ai/interview/answers
router.post('/interview/answers', interviewValidators.answers, handleValidationErrors, generateAnswers);
// POST /api/ai/interview/feedback
router.post('/interview/feedback', interviewValidators.feedback, handleValidationErrors, saveFeedback);

module.exports = router;