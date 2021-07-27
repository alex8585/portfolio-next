const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.modules = ["./node_modules", "./modules"]
    config.experiments = {
      topLevelAwait: true,
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
