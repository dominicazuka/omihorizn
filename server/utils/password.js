/**
 * Password Utilities
 * Handles password hashing and comparison
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Failed to compare passwords');
  }
};

const isPasswordStrong = (password) => {
  // Minimum 8 chars, uppercase, lowercase, number, special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

module.exports = {
  hashPassword,
  comparePassword,
  isPasswordStrong,
};
