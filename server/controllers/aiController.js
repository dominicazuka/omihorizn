
const AIService = require('../services/AIService');
const { checkAndIncrement } = require('../services/featureUsageService');

/**
 * Controller layer for AI-related endpoints.  Business logic lives in
 * services/AIService; the controller simply extracts request data and
 * formats HTTP responses.
 */

const generateEmbedding = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    // count feature usage if user is authenticated
    if (req.user) {
      await checkAndIncrement(req.user._id, 'AI Embedding');
    }
    const embedding = await AIService.generateEmbedding(text);
    res.json({ success: true, embedding });
  } catch (err) {
    next(err);
  }
};

const generateText = async (req, res, next) => {
  try {
    const { prompt, options } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }
    if (req.user) {
      await checkAndIncrement(req.user._id, 'AI Text Generation');
    }
    const output = await AIService.generateText(prompt, options || {});
    res.json({ success: true, output });
  } catch (err) {
    next(err);
  }
};

const vectorSearch = async (req, res, next) => {
  try {
    const { modelName, queryEmbedding, filter, k } = req.body;
    if (!modelName || !queryEmbedding) {
      return res.status(400).json({ success: false, message: 'modelName and queryEmbedding are required' });
    }
    if (req.user) {
      await checkAndIncrement(req.user._id, 'AI Vector Search');
    }
    const results = await AIService.vectorSearch(modelName, queryEmbedding, filter || {}, k || 10);
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateEmbedding,
  generateText,
  vectorSearch,
};
