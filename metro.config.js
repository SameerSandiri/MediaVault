// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Ensure proper handling of binary files
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;