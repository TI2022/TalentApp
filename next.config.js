// PWA設定（本番用）
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポート設定（本番デプロイ時に有効化）
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: process.env.NODE_ENV === 'production' ? true : false,
  
  // 画像最適化を無効化（静的エクスポート用）
  images: {
    unoptimized: true,
  },
  
  // ベースパス設定（必要に応じて設定）
  // basePath: process.env.NODE_ENV === 'production' ? '/talent-app' : '',
  
  // アセットプレフィックス（CloudFront用）
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-cloudfront-domain.cloudfront.net' : '',
};

// 開発時はPWA無し、本番時はPWA有り
module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
// module.exports = withPWA(nextConfig); // PWA無効化
