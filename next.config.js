const path = require("path");

module.exports = {
  experimental: {
    serverComponentsExternalPackages: ["knex"],
  },
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

    return config;
  },
};
