module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dgalywyr863hv.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'dgtzuqphqg23d.cloudfront.net',
      },
    ],
  },
};
