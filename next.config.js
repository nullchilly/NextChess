/** @type {import('next').NextConfig} */
const nextConfig = {
  // trailingSlash: true,
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`
      },
    ];
  },
};

module.exports = nextConfig;
