import path from "path";
import webpack from "webpack";

export default {
  babel: {
    presets: [
      [
        "next/babel",
        {
          "preset-env": {},
          "transform-runtime": {},
          "styled-jsx": {},
          "class-properties": {},
        },
      ],
    ],
    plugins: ["styled-jsx/babel"],
  },
  webpack: (config, { isServer }) => {
    // Add alias for @
    config.resolve.alias["@"] = path.resolve();

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
