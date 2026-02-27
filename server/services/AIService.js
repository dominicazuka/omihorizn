
/**
 * AIService
 * Encapsulates all interactions with the Genkit AI library and provides a
 * simple interface for the rest of the application.
 *
 * This service is intentionally lightweight; controllers should call the
 * methods defined here and avoid embedding any business logic related to AI
 * in the controller layer. Caching, retries, and error handling live inside
 * the service so that the rest of the app can treat it as a black box.
 */

const crypto = require('crypto');
const { cacheGet, cacheSet } = require('./redis');
const { GoogleGenAI } = require('@genkit-ai/google-genai');
const mongoose = require('mongoose');

let genkitClient = null;

// helper to hash long texts for cache keys
const _hash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

// simple in-memory counters for rate limiting (more sophisticated tiered
// limits should use Redis; migrate when more precision required)
const _callCounters = {};

// Helper to perform an API call with a basic retry/backoff strategy
const _withRetry = async (fn, retries = 3, delay = 500) => {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt++ >= retries) throw err;
      await new Promise((r) => setTimeout(r, delay * Math.pow(2, attempt)));
    }
  }
};

/**
 * Initialize the Genkit client if not already done.
 * Reads API key from GENKIT_API_KEY environment variable.
 */
const initGenkit = () => {
  if (!genkitClient) {
    const apiKey = process.env.GENKIT_API_KEY;
    if (!apiKey) {
      throw new Error('GENKIT_API_KEY is not set');
    }
    genkitClient = new GoogleGenAI({ apiKey });
  }
  return genkitClient;
};

/**
 * Generate an embedding vector for the provided input text.
 * Results are cached in Redis for 30 days to reduce API usage.
 * @param {string} text
 * @returns {Promise<Array<number>>} 768‑dimensional embedding
 */
const generateEmbedding = async (text) => {
  const cacheKey = `embedding:${_hash(text)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return cached;
  }

  const client = initGenkit();
  try {
    const resp = await client.embeddings.create({
      model: 'text-embedding-004',
      input: text,
    });

    const embedding = resp.data?.[0]?.embedding;
    if (!embedding) {
      throw new Error('Failed to generate embedding');
    }
    await cacheSet(cacheKey, embedding, 30 * 24 * 3600); // 30 days
    return embedding;
  } catch (err) {
    // log and provide graceful fallback (empty vector)
    console.error('[AIService] embedding error', err);
    // fallback to a zero-vector of length 768 (safe for similarity operations)
    const fallback = Array(768).fill(0);
    await cacheSet(cacheKey, fallback, 60); // short TTL
    return fallback;
  }

  await cacheSet(cacheKey, embedding, 30 * 24 * 3600); // 30 days
  return embedding;
};

/**
 * Generate text from a prompt using the configured generation model.
 * Caches results for one week.
 * @param {string} prompt
 * @param {Object} [options]
 * @returns {Promise<string>} generated text
 */
const generateText = async (prompt, options = {}) => {
  // options may include tone, max_tokens, temperature, etc.
  const cacheKey = `generation:${_hash(prompt + JSON.stringify(options))}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const client = initGenkit();
  try {
    const resp = await _withRetry(() =>
      client.responses.create({
        model: process.env.GENKIT_TEXT_MODEL || 'gemini-2.0-flash',
        input: prompt,
        ...options,
      })
    );

    const text = resp.output?.[0]?.content || '';
    await cacheSet(cacheKey, text, 7 * 24 * 3600); // 7 days
    return text;
  } catch (err) {
    // log failure for monitoring
    console.error('[AIService] text generation failed', err);
    // simple graceful degradation: return a static template
    const fallback =
      'The AI service is currently unavailable. Please try again later or use one of the built-in templates.';
    await cacheSet(cacheKey, fallback, 3600); // cache fallback for an hour
    return fallback;
  }
};

/**
 * Perform a vector search on a specified collection using the built‑in
 * MongoDB Atlas vector search index. Results are cached for 24 hours.
 *
 * @param {string} modelName  - the Mongoose model name (e.g. 'University')
 * @param {Array<number>} queryEmbedding
 * @param {Object} [filter]  - plain object of fields to filter on
 * @param {number} [k=10]    - number of nearest neighbours to return
 */
const vectorSearch = async (modelName, queryEmbedding, filter = {}, k = 10) => {
  const cacheKey = `vector:${modelName}:${_hash(JSON.stringify(queryEmbedding))}:${_hash(JSON.stringify(filter))}:${k}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const Model = mongoose.model(modelName);
  if (!Model) throw new Error(`Model ${modelName} not registered`);

  // determine index name convention used earlier in Milestone notes
  const indexName = `${modelName.toLowerCase()}_embedding_index`;

  const pipeline = [
    {
      $search: {
        index: indexName,
        knnBeta: {
          vector: queryEmbedding,
          path: 'embedding',
          k,
        },
        ...(Object.keys(filter).length ? { filter: { $and: Object.entries(filter).map(([k, v]) => ({ [k]: v })) } } : {}),
      },
    },
    { $limit: k },
  ];

  const results = await Model.aggregate(pipeline).exec();
  await cacheSet(cacheKey, results, 24 * 3600); // 24 hours
  return results;
};

module.exports = {
  initGenkit,
  generateEmbedding,
  generateText,
  vectorSearch,
};
