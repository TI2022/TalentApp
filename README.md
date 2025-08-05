# 才能発見アプリ

あなたの才能を具体化するチェックリストアプリです。短所を才能として捉え直し、強みを発見することができます。

## 特徴

- 📱 **PWA対応**: オフラインでも使用可能、インストール可能
- 💾 **データ永続化**: IndexedDBでローカルにデータを保存
- 🔍 **検索・フィルター機能**: 才能を効率的に探索
- 📊 **進捗可視化**: チェック状況を一目で確認
- 📱 **モバイルファースト**: スマートフォンに最適化されたUI

## 技術スタック

- **Frontend**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **PWA**: next-pwa
- **データベース**: IndexedDB (Dexie.js)
- **状態管理**: React Context + useState
- **ホスティング**: AWS S3 + CloudFront (予定)

## 本番環境へのデプロイ手順

### 1. PWA設定の有効化

本番環境では PWA 機能を有効化します。`next.config.js` を以下のように修正してください：

```javascript
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
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);
```

### 2. 静的サイトのビルド

```bash
npm run build
```

これにより `out` フォルダに静的サイトが生成されます。

### 3. AWS S3 + CloudFront でのホスティング

#### S3 バケットの作成・設定

1. AWS S3 で新しいバケットを作成
2. 静的ウェブサイトホスティングを有効化
3. インデックスドキュメント: `index.html`
4. エラードキュメント: `404.html`

#### ファイルのアップロード

```bash
# AWS CLI を使用してファイルをアップロード
aws s3 sync out/ s3://your-bucket-name --delete

# PWA ファイルの適切な Content-Type を設定
aws s3 cp out/manifest.json s3://your-bucket-name/manifest.json --content-type="application/json"
aws s3 cp out/sw.js s3://your-bucket-name/sw.js --content-type="application/javascript"
```

#### CloudFront ディストリビューションの設定

1. CloudFront で新しいディストリビューションを作成
2. オリジンドメイン: S3 バケットのウェブサイトエンドポイント
3. デフォルトルートオブジェクト: `index.html`
4. カスタムエラーページ:
   - HTTP エラーコード: 403, 404
   - エラーキャッシング最小 TTL: 10
   - カスタマイズしたエラーレスポンス: Yes
   - レスポンスページパス: `/index.html`
   - HTTP レスポンスコード: 200

#### PWA 用ヘッダーの設定

CloudFront で以下のヘッダーを設定：

```
Cache-Control: no-cache, no-store, must-revalidate (sw.js 用)
Content-Type: application/json (manifest.json 用)
```

### 4. HTTPS の設定

1. AWS Certificate Manager で SSL 証明書を取得
2. CloudFront ディストリビューションに証明書を適用
3. HTTP から HTTPS へのリダイレクトを設定

### 5. カスタムドメインの設定（オプション）

1. Route 53 でドメインを管理
2. CloudFront ディストリビューションにカスタムドメインを設定
3. DNS レコードを更新

### 6. デプロイスクリプト（推奨）

`package.json` にデプロイスクリプトを追加：

```json
{
  "scripts": {
    "deploy": "npm run build && aws s3 sync out/ s3://your-bucket-name --delete && aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'"
  }
}
```

### 7. 環境変数の設定

本番環境用の環境変数を設定：

```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 8. PWA の動作確認

- ブラウザの開発者ツールで Service Worker が登録されていることを確認
- オフライン状態でアプリが動作することを確認
- モバイルデバイスで「ホーム画面に追加」が表示されることを確認

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 静的エクスポート
npm run export
```

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メインページ
│   └── globals.css     # グローバルスタイル
├── components/         # 再利用可能なコンポーネント
├── contexts/          # React Context
│   └── TalentContext.tsx
├── data/              # 静的データ
│   └── initialTalents.ts
├── lib/               # ユーティリティ・サービス
│   └── db.ts          # IndexedDB設定
└── types/             # TypeScript型定義
    └── talent.ts
```

## データ構造

```typescript
interface TalentItem {
  id: number;
  shortcoming: string;   // 短所・課題
  talent: string;        // 才能
  strength: string;      // 強み
  checked: boolean;      // チェック状態
  checkedAt?: Date;      // チェック日時
}
```

## 機能

### 基本機能
- ✅ 才能チェックリスト表示
- ✅ チェック状態の保存・復元
- ✅ 検索機能
- ✅ フィルター機能（チェック済み/未チェック）
- ✅ 進捗表示

### 今後の拡張予定
- 📈 詳細な統計・分析
- 💾 データのエクスポート/インポート
- 🔄 クラウド同期

## ライセンス

MIT License
