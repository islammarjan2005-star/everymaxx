const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure for web with relative paths
config.transformer = {
  ...config.transformer,
  publicPath: './_expo/static',
};

config.server = {
  ...config.server,
  experimentalImportBundleSupport: false,
};

module.exports = config;
