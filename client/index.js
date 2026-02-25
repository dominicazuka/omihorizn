/**
 * Root entry point for OmiHorizn
 * This file uses platform-specific resolution:
 * - Native (iOS/Android) loads index.native.tsx via Metro
 * - Web loads index.web.js via webpack
 * 
 * The .native.tsx/.web.js extensions are automatically resolved by Metro/Webpack
 */

// Platform detection - Metro will use index.native.tsx, webpack will use index.web.js
// This file acts as a fallback/reference point
import './index.native';
