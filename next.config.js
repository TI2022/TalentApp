// PWA設定を一時的に無効化（開発時のService Workerエラー回避）
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
//   runtimeCaching: [
//     {
//       urlPattern: /^https?.*/,
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'offlineCache',
//         expiration: {
//           maxEntries: 200,
//         },
//       },
//     },
//   ],
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 開発時は無効化
  // trailingSlash: true, // 開発時は無効化
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
// module.exports = withPWA(nextConfig); // PWA無効化
