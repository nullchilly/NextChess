/** @type {import('next').NextConfig} */
const nextConfig = {
  // trailingSlash: true,
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`
      },
      {
        source: '/socket.io',
        destination: `${process.env.BACKEND_URL}/socket.io/`,
       }
    ];
  },
  images: {
    domains: ['www.chesskid.com'],
  },
};

module.exports = nextConfig;
