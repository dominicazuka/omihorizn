
/**
 * sopService.js
 * Handles business logic for Statement of Purpose (SOP) generation using AI.
 *
 * Details such as prompt construction, user data extraction, and document
 * persistence belong here.  Controllers simply call these methods and return
 * the results.
 */

const AIService = require('./AIService');
const Document = require('../models/Document');

/**
 * Generate a new SOP text given user context.
 * @param {Object} params - contains university, program, userDocs, and other fields
 * @returns {Promise<Object>} generated document record
 */
const generateSop = async (params) => {

  const { university, program, userProfile, tone } = params;

  // Build prompt from inputs - simplistic example
  const prompt = `Write a statement of purpose for applying to ${program} at ${university}. "${userProfile}"`;

  const text = await AIService.generateText(prompt, { tone });

  // persist in Document collection
  const doc = await Document.create({
    type: 'sop',
    content: text,
    metadata: {
      university,
      program,
      userProfile,
      tone,
    },
  });

  return doc;
};

/**
 * Regenerate an existing SOP with new options (tone/word count/etc.)
 */
const regenerateSop = async (docId, options) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error('Document not found');
  const prompt = `Re-generate SOP: ${doc.content}`;
  const newText = await AIService.generateText(prompt, options);
  doc.content = newText;
  doc.metadata = { ...doc.metadata, regeneratedAt: new Date(), options };
  await doc.save();
  return doc;
};

/**
 * Score a SOP for quality/plagiarism using simple heuristics
 */
const scoreSop = async (text) => {
  // simple quality score: based on word count (desired range 400-800 words)
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  let score = 50;
  if (words >= 400 && words <= 800) score = 90;
  else if (words < 400) score = 50 + (words / 400) * 40;
  else score = 90 - ((words - 800) / 400) * 40;
  score = Math.max(0, Math.min(100, score));

  // plagiarism check: see if identical text already exists
  const exists = await Document.exists({ content: text });
  const plagiarism = !!exists;

  // option: compute similarity against nearest document (not required now)
  return { score, plagiarism };
};

module.exports = {
  generateSop,
  regenerateSop,
  scoreSop,
};
module.exports = {
  generateSop,
};
