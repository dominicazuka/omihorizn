
const express = require('express');
const router = express.Router();
// many AI endpoints should be available to both guests and logged in users;
// optionalAuth populates req.user when a valid token is provided but does not
// reject unauthenticated requests.
const { optionalAuth } = require('../middleware/auth');

// apply optional auth to all AI routes so controllers can track usage
router.use(optionalAuth);
const aiController = require('../controllers/aiController');

// Note: validators for these endpoints can be added to /validators when
// the payload formats are finalized. At the moment they are lightweight.

router.post('/embedding', aiController.generateEmbedding);
router.post('/generate-text', aiController.generateText);
router.post('/vector-search', aiController.vectorSearch);

// AI feature subroutes
router.use('/sop', require('./sopRoute'));
router.use('/letter', require('./letterRoute'));
router.use('/interview', require('./interviewRoute'));
router.use('/recommend', require('./recommendationRoute'));

module.exports = router;
