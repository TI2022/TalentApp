# 才能発見アプリ 本番デプロイガイド
## 概要

このガイドでは、才能発見PWAアプリを本番環境にセキュアにデプロイする手順を説明します。

## 前提条件

- Node.js 18.x 以上
- npm または yarn
- AWS CLI
- Terraform（オプション、インフラ自動構築用）
- jq（JSONパーサー）

## デプロイ方法の選択

### 方法1: 自動デプロイスクリプト（推奨）
- 既存のAWSリソースを使用
- 設定ファイルベースの管理
- 簡単で迅速

### 方法2: Terraform + 自動デプロイ
- インフラをコードで管理
- 再現可能な環境構築
- 本格的な運用に適している

### 方法3: GitHub Actions（CI/CD）
- コードプッシュで自動デプロイ
- チーム開発に最適
- 継続的デプロイメント

---

## 方法1: 自動デプロイスクリプト

### ステップ1: AWS認証設定

#### A. AWS CLIのインストールと設定
```bash
# AWS CLIインストール（macOS）
brew install awscli

# AWS CLIインストール（Linux/Windows）
pip install awscli

# AWS認証情報設定
aws configure
```

入力項目：
- **AWS Access Key ID**: あなたのアクセスキーID
- **AWS Secret Access Key**: あなたのシークレットアクセスキー
- **Default region name**: `ap-northeast-1`
- **Default output format**: `json`

#### B. 認証確認
```bash
aws sts get-caller-identity
```

### ステップ2: 必要なAWSリソースの作成

#### S3バケットの作成
```bash
# 一意なバケット名で作成（例）
aws s3 mb s3://talent-app-prod-20240806 --region ap-northeast-1

# 静的ウェブサイトホスティング有効化
aws s3 website s3://talent-app-prod-20240806 \
  --index-document index.html \
  --error-document 404.html

# パブリック読み取り許可
aws s3api put-bucket-policy \
  --bucket talent-app-prod-20240806 \
  --policy file://bucket-policy.json
```

#### CloudFront Distributionの作成
```bash
# CloudFront Distribution作成（AWS CLIまたはコンソール）
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### ステップ3: 設定ファイルの更新

`deploy-config.json` を実際の値に更新：

```json
{
  "environments": {
    "production": {
      "s3Bucket": "talent-app-prod-20240806",
      "cloudfrontDistributionId": "E1A2B3C4D5E6F7",
      "domain": "talent-app.your-domain.com",
      "awsRegion": "ap-northeast-1"
    }
  }
}
```

### ステップ4: デプロイ実行

```bash
# 依存関係インストール
npm install

# 本番デプロイ実行
npm run deploy:production
```

---

## 方法2: Terraform + 自動デプロイ

### ステップ1: Terraformのインストール

```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### ステップ2: Terraform変数設定

`infrastructure/terraform.tfvars` を作成：

```hcl
project_name = "talent-discovery-app"
environment  = "production"
domain_name  = "talent-app.your-domain.com"  # オプション
```

### ステップ3: インフラ構築

```bash
# Terraformディレクトリに移動
cd infrastructure

# 初期化
terraform init

# プラン確認
terraform plan

# インフラ作成
terraform apply
```

### ステップ4: 出力値を設定ファイルに反映

Terraformの出力値を `deploy-config.json` に設定：

```bash
# 出力値確認
terraform output

# deploy-config.jsonを更新
# s3_bucket_name と cloudfront_distribution_id を設定
```

### ステップ5: デプロイ実行

```bash
# プロジェクトルートに戻る
cd ..

# デプロイ実行
npm run deploy:production
```

---

## 方法3: GitHub Actions（CI/CD）

### ステップ1: GitHubリポジトリ設定

#### Secretsの設定
GitHub リポジトリの `Settings > Secrets and variables > Actions` で以下を設定：

- `AWS_ACCESS_KEY_ID`: あなたのアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: あなたのシークレットアクセスキー
- `AWS_REGION`: `ap-northeast-1`

### ステップ2: デプロイ設定ファイル更新

`deploy-config.json` を実際の値に更新してコミット。

### ステップ3: 自動デプロイ

```bash
# mainブランチにプッシュで自動デプロイ
git add .
git commit -m "Deploy to production"
git push origin main

# 手動デプロイ（GitHub Actions画面から）
# Actions > Deploy to AWS S3 + CloudFront > Run workflow
```

---

## カスタムドメイン設定（オプション）

### ステップ1: SSL証明書取得

```bash
# ACMで証明書リクエスト（us-east-1リージョン必須）
aws acm request-certificate \
  --domain-name talent-app.your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

### ステップ2: DNS検証

AWS Certificate Manager コンソールでDNS検証レコードをドメインのDNS設定に追加。

### ステップ3: CloudFront設定更新

CloudFrontディストリビューションにカスタムドメインとSSL証明書を設定。

### ステップ4: DNS設定

ドメインのDNS設定でCNAMEレコードを追加：
```
talent-app.your-domain.com CNAME d1234567890abc.cloudfront.net
```

---

## 環境別デプロイ

### ステージング環境

```bash
# ステージング用設定でデプロイ
npm run deploy:staging
```

### 本番環境

```bash
# 本番用設定でデプロイ
npm run deploy:production
```

---

## デプロイ後の確認

### 1. ウェブサイト動作確認

```bash
# CloudFrontドメインでアクセス
https://d1234567890abc.cloudfront.net

# カスタムドメインでアクセス（設定済みの場合）
https://talent-app.your-domain.com
```

### 2. PWA機能確認

- ブラウザでアプリを開く
- 「ホーム画面に追加」が表示されることを確認
- オフライン動作を確認

### 3. パフォーマンス確認

- Google PageSpeed Insights でスコア確認
- Chrome DevTools の Lighthouse でPWAスコア確認

---

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. AWS認証エラー
```
Error: The security token included in the request is invalid
```
**解決方法**: AWS認証情報を再設定
```bash
aws configure
```

#### 2. S3バケット名重複エラー
```
Error: BucketAlreadyExists
```
**解決方法**: バケット名を変更（S3バケット名は全世界で一意）

#### 3. CloudFront無効化エラー
```
Error: InvalidDistributionId
```
**解決方法**: `deploy-config.json` のDistribution IDを確認

#### 4. ビルドエラー
```
Error: Command failed: next build
```
**解決方法**: 
```bash
# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
rm -rf .next out
```

### ログ確認

```bash
# AWS CLIのデバッグログ
aws s3 ls --debug

# デプロイスクリプトのログ
./scripts/deploy.sh production 2>&1 | tee deploy.log
```

---

## セキュリティ考慮事項

### 1. IAM権限の最小化

デプロイ用IAMユーザーには必要最小限の権限のみ付与：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::talent-app-*",
                "arn:aws:s3:::talent-app-*/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation"
            ],
            "Resource": "*"
        }
    ]
}
```

### 2. 環境変数の管理

- `.env.local` や `.env.production` はGitにコミットしない
- GitHub Secretsを使用してCI/CDでの認証情報管理
- 本番環境では環境変数でAWS認証情報を設定

### 3. HTTPS強制

CloudFrontで `Viewer Protocol Policy` を `Redirect HTTP to HTTPS` に設定。

---

## 運用・保守

### 定期的なタスク

1. **依存関係の更新**
   ```bash
   npm audit
   npm update
   ```

2. **SSL証明書の更新**
   - ACM証明書は自動更新（DNS検証の場合）
   - 手動更新が必要な場合は事前に通知

3. **ログ監視**
   - CloudFrontアクセスログの確認
   - エラー率の監視

4. **バックアップ**
   - S3バケットのバージョニング有効化
   - 重要な設定ファイルのバックアップ

### コスト最適化

1. **CloudFront価格クラス**
   - `PriceClass_100` (北米・ヨーロッパ) - 最安
   - `PriceClass_200` (北米・ヨーロッパ・アジア) - 推奨
   - `PriceClass_All` (全世界) - 最高性能

2. **S3ストレージクラス**
   - 静的サイトは `Standard` を使用
   - 古いバージョンは `IA` や `Glacier` に移行

---

## サポート

### 公式ドキュメント

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront](https://docs.aws.amazon.com/cloudfront/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

### 問題報告

デプロイに関する問題は、以下の情報と共にIssueを作成してください：

1. 使用したデプロイ方法
2. エラーメッセージの全文
3. 実行したコマンド
4. 環境情報（OS、Node.jsバージョンなど）
