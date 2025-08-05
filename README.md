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
  category: string;      // カテゴリ
  shortcoming: string;   // 短所・課題
  talent: string;        // 才能
  strength: string;      // 強み
  checked: boolean;      // チェック状態
  checkedAt?: Date;      // チェック日時
  priority?: 1 | 2 | 3;  // 優先度
  tags?: string[];       // タグ
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
- 🏷️ カテゴリ別フィルター
- ⭐ 優先度フィルター
- 📈 詳細な統計・分析
- 💾 データのエクスポート/インポート
- 🔄 クラウド同期

## ライセンス

MIT License
