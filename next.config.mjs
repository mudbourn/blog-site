/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "save.mudbourn.info"
      },
      {
        protocol: "https",
        hostname: "music.mudbourn.info"
      }
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false,
            titleProp: true
          }
        }
      ]
    })

    return config
  }
}

export default nextConfig
