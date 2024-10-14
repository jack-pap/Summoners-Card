/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/champion-icons/:path*",
        destination: "/api/champion-icons/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
