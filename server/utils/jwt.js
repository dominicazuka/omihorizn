/**
 * JWT Token Utilities
 * Handles token generation and verification
 */

const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role, subscriptionTier) => {
  return jwt.sign(
    {
      userId,
      role,
      subscriptionTier,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    }
  );
};

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

const generateTokenPair = (userId, role, subscriptionTier) => {
  return {
    accessToken: generateAccessToken(userId, role, subscriptionTier),
    refreshToken: generateRefreshToken(userId),
  };
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken,
  decodeToken,
};
