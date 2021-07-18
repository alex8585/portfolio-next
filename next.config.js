const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments = {
      topLevelAwait: true
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)