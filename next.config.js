// PWA設定（オフライン対応強化版）
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline.html',
    image: '/icons/offline-image.png',
  },
  runtimeCaching: [
    // HTMLページ（ナビゲーション）
    {
      urlPattern: /^https?.*\.(html)$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24時間
        },
        networkTimeoutSeconds: 3,
      },
    },
    // ページルート（SPA）
    {
      urlPattern: /^https?.*\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        },
        networkTimeoutSeconds: 3,
      },
    },
    // 静的アセット（JS、CSS）
    {
      urlPattern: /^https?.*\.(js|css)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1週間
        },
      },
    },
    // 画像ファイル
    {
      urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
    // その他のリクエスト
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        },
        networkTimeoutSeconds: 3,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境では静的エクスポート（APIルートとは排他的）
  // AI分析機能を使用する場合はこの行をコメントアウトしてください
  output: process.env.DEPLOY_ENVIRONMENT === 'production' ? 'export' : undefined,
  trailingSlash: false,
  
  // 画像最適化設定
  images: {
    unoptimized: process.env.DEPLOY_ENVIRONMENT === 'production',
  },
  
  // 本番環境でのセキュリティヘッダー
  async headers() {
    if (process.env.NODE_ENV !== 'production') return [];
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
  
  // 本番環境用の最適化設定（critters エラー回避のため一時的に無効化）
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // ベースパス設定（CDN使用時）
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // アセットプレフィックス（CloudFront用）
  // assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
};

// 開発時はPWA無し、本番時はPWA有り
module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
// module.exports = withPWA(nextConfig); // PWA無効化
