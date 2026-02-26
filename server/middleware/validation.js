/**
 * Input Validation Middleware
 * Validates request data using express-validator
 */

const { validationResult, body, param, query } = require('express-validator');

// Centralized error formatter
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Common validators
const validateEmail = () =>
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address');

const validatePassword = () =>
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and numbers');

const validateObjectId = (fieldName) =>
  param(fieldName)
    .isMongoId()
    .withMessage(`Invalid ${fieldName}`);

const validatePhoneNumber = () =>
  body('phone')
    .optional()
    .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Invalid phone number format');

module.exports = {
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateObjectId,
  validatePhoneNumber,
  body,
  param,
  query,
};
