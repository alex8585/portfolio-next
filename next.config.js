const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
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
  images: {
    domains: ["[2a00:bc00:8800:9c37:168c:4be0:44e0:bbdd]"],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
