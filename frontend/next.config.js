import path from "path";
import webpack from "webpack";

export default {
    async headers() {
      return [
        {
          // Match all request paths 
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=36000, immutable',
            },
          ],
        }
      ];
    },
  webpack: (config, { isServer }) => {
    // Add alias for @ when importing
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
