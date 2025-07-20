/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        'mongodb-memory-server',
        'mongodb-memory-server-core',
        'agent-base',
        'https-proxy-agent'
      );
    }
    return config;
  },
};