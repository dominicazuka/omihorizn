// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable platform-specific file resolution (.native.tsx, .web.js, etc)
config.resolver.sourceExts = [
  'native.tsx',
  'native.ts',
  'native.jsx',
  'native.js',
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
];

// Ensure we don't accidentally try to load .web files in Metro (they're for webpack only)
config.resolver.blockList = [
  /\.web\.js$/,
  /\.web\.tsx?$/,
];

module.exports = config;
