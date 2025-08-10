# このアプリを作成した背景

インフルエンサーの方（コンテンツホルダー）の無料配布されるチェックシート特典がPDFで紙に印刷する手順を踏無必要があったので、アプリで手軽にチェックを付けられるようにしたかったため作成しました。

更に、データの集計と分析機能も追加しています。

個人使用のチェックリストなのでサーバとのやり取りは必須ではないため、s3バケットとCloudFrontを使用したホスティングと相性が良いと判断しました。

# 才能発見アプリ

あなたの才能を具体化するチェックリストアプリです。短所を才能として捉え直し、強みを発見することができます。

## 特徴

- **PWA対応**: オフラインでも使用可能、ホーム画面にインストール可能
- **データ永続化**: IndexedDBでローカルにデータを保存
- **フィルター機能**: チェック済み項目の絞り込み表示
- **進捗可視化**: チェック状況と統計情報を一目で確認
- **モバイルファースト**: スマートフォンに最適化されたレスポンシブUI
- **ページネーション**: 大量データも快適に閲覧（横スクロール対応）
- **集計機能**: 進捗状況と最近の活動を詳細表示

## クイックスタート

### 開発環境での実行

```bash
# リポジトリをクローン
git clone https://github.com/your-username/TalentApp.git
cd TalentApp

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを確認できます。

### 主要機能の使い方

1. **チェック機能** (`/`): 短所をチェックして才能を発見
2. **詳細表示** (`/details`): 才能と強みの詳細を確認
3. **集計機能** (`/stats`): 進捗状況と統計を表示

## 技術スタック

- **Frontend**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **PWA**: next-pwa
- **データベース**: IndexedDB (Dexie.js)
- **状態管理**: React Context + useState
- **ホスティング**: AWS S3 + CloudFront
- **CI/CD**: GitHub Actions
- **インフラ**: Terraform (オプション)

## デプロイ

### クイックデプロイ

```bash
# AWS認証設定（初回のみ）
aws configure

# デプロイ設定ファイルを実際の値に更新
# deploy-config.json を編集

# 本番デプロイ実行
npm run deploy:production
```

### 詳細なデプロイ手順

📖 **[DEPLOYMENT.md](./DEPLOYMENT.md)** に包括的なデプロイガイドがあります：

- 🔧 **自動デプロイスクリプト**（推奨）
- 🏗️ **Terraform + インフラ構築**
- 🔄 **GitHub Actions CI/CD**
- 🌍 **カスタムドメイン設定**
- 🔒 **セキュリティ設定**
- 🛠️ **トラブルシューティング**

### 利用可能なコマンド

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run build            # 本番ビルド
npm run lint             # コードチェック

# デプロイ
npm run deploy:production    # 本番デプロイ
npm run deploy:staging      # ステージングデプロイ
npm run build:production    # 本番用ビルド

# インフラ管理（Terraform）
npm run terraform:init      # Terraform初期化
npm run terraform:plan      # 実行計画確認
npm run terraform:apply     # インフラ作成
npm run terraform:destroy   # インフラ削除
```

## 📁 プロジェクト構造

```
TalentApp/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # チェックページ
│   │   ├── details/         # 詳細ページ
│   │   └── stats/           # 集計ページ
│   ├── contexts/            # React Context
│   ├── lib/                 # ユーティリティ
│   └── data/                # 初期データ
├── scripts/                 # デプロイスクリプト
├── infrastructure/          # Terraform設定
├── .github/workflows/       # GitHub Actions
├── deploy-config.json       # デプロイ設定
├── DEPLOYMENT.md           # デプロイガイド
└── AWS_SETUP.md            # AWS設定ガイド
```

## 設定ファイル

### 環境変数

```bash
# .env.example をコピーして設定
cp .env.example .env.local
```

主要な設定項目：
- `AWS_ACCESS_KEY_ID`: AWSアクセスキー
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットキー
- `AWS_DEFAULT_REGION`: AWSリージョン（ap-northeast-1）

### デプロイ設定

`deploy-config.json` で環境別の設定を管理：
- S3バケット名
- CloudFront Distribution ID
- カスタムドメイン
- AWSリージョン

## PWA機能

### オフライン対応
- Service Workerによるキャッシュ
- IndexedDBでのデータ永続化
- ネットワーク切断時も継続利用可能

### インストール
- ホーム画面に追加可能
- ネイティブアプリライクな体験
- プッシュ通知対応（将来実装予定）

## 主要機能

### チェック機能（`/`）
- 200項目の短所チェックリスト
- 10項目/ページのページネーション
- リアルタイム進捗表示
- 自動保存機能

### 詳細表示（`/details`）
- 短所・才能・強みの3段階表示
- チェック済み項目のフィルター
- 色分けされた視覚的デザイン
- アニメーション付きUI

### 集計機能（`/stats`）
- 進捗率の可視化
- 統計カード表示
- 最近の活動履歴
- アクションボタン

## パフォーマンス

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **PWA Score**: 100

### 1. PWA設定の有効化（参考）

本番環境では PWA 機能が自動的に有効化されます。`next.config.js` の設定：

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
