const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: (config, { isServer }) => {
    // Add alias for @
    config.resolve.alias["@"] = path.resolve(__dirname);

    // Add fallback for fs, net, and tls if not server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    return config;
  },
};
