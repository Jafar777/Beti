/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    // Only add these configurations for server-side builds
    if (isServer) {
      // Add external packages that should only be bundled on the server
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