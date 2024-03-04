const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // add below lines for disable caching in product runing.
  runtimeCaching: [],
  publicExcludes: ["!**/*"], // like this
  buildExcludes: [() => true],
  fallbacks: false,
  cacheStartUrl: false,
});

const nextConfig = withPWA({
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unityvo.com",
      },
      {
        protocol: "https",
        hostname: "mofid-images.s3.ir-thr-at1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "s3.nl-ams.scw.cloud,images.mofidapp.com",
      },
      {
        protocol: "https",
        hostname: "unityvo.s3.nl-ams.scw.cloud",
      },
      {
        protocol: "https",
        hostname: "images.hnaya.ir",
      },
      {
        protocol: "https",
        hostname: "hanayatest.s3.ir-thr-at1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "hnaya.s3.ir-thr-at1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "hnayaimages.s3.ir-tbz-sh1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "hnaya.images.ir",
      },
    ],
  },
  experimental: { scrollRestoration: true },
});

module.exports = nextConfig;
