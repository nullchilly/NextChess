/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  trailingSlash: true,
  // output: 'export',
=======
  // trailingSlash: true,
>>>>>>> play-bot-full
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
      },
    ];
  },
};

module.exports = nextConfig;
