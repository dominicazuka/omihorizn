
/**
 * letterService.js
 * Handles generation of motivation letters and cover letters.
 * Mirrors SOP service but may apply different prompt templates.
 */

const AIService = require('./AIService');
const Document = require('../models/Document');

/**
 * Generate motivation or cover letter based on type
 * @param {Object} params { type: 'motivation'|'cover', university, program, userProfile, tone }
 */
const generateLetter = async (params) => {
  const { type, university, program, userProfile, tone } = params;
  const subject = type === 'cover' ? 'cover letter' : 'motivation letter';

  const prompt = `Write a ${subject} for applying to ${program} at ${university}. User info: ${userProfile}`;
  const text = await AIService.generateText(prompt, { tone });

  const doc = await Document.create({
    type,
    content: text,
    metadata: { university, program, userProfile, tone },
  });

  return doc;
};

const regenerateLetter = async (docId, options) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error('Document not found');
  const prompt = `Regenerate letter: ${doc.content}`;
  const newText = await AIService.generateText(prompt, options);
  doc.content = newText;
  doc.metadata = { ...doc.metadata, regeneratedAt: new Date(), options };
  await doc.save();
  return doc;
};

module.exports = {
  generateLetter,
  regenerateLetter,
};