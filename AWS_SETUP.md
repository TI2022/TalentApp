# AWS設定ガイド

## 必要なAWS情報の設定場所

### 1. ローカル環境での設定

#### A. AWS CLIの設定（推奨）
```bash
# AWS CLIをインストール
brew install awscli  # macOS
# または
pip install awscli

# AWS認証情報を設定
aws configure
```

設定する項目：
- **AWS Access Key ID**: あなたのアクセスキーID
- **AWS Secret Access Key**: あなたのシークレットアクセスキー  
- **Default region name**: `ap-northeast-1` (東京リージョン)
- **Default output format**: `json`

#### B. 環境変数での設定（代替方法）
`.env.local` ファイルを作成：
```bash
cp .env.example .env.local
```

`.env.local` に実際の値を設定：
```
AWS_ACCESS_KEY_ID=AKIA...（あなたのアクセスキーID）
AWS_SECRET_ACCESS_KEY=...（あなたのシークレットアクセスキー）
AWS_DEFAULT_REGION=ap-northeast-1
```

### 2. デプロイ設定ファイルの更新

`deploy-config.json` を編集して実際の値に変更：

```json
{
  "environments": {
    "production": {
      "s3Bucket": "your-unique-bucket-name-prod",
      "cloudfrontDistributionId": "（後でTerraformで作成される）",
      "domain": "your-domain.com",
      "awsRegion": "ap-northeast-1"
    }
  }
}
```

### 3. GitHub Actions用の設定（CI/CD）

GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定：

**Repository secrets:**
- `AWS_ACCESS_KEY_ID`: あなたのアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: あなたのシークレットアクセスキー
- `AWS_REGION`: `ap-northeast-1`

### 4. Terraform用の設定

Terraformでインフラを作成する場合：

```bash
# Terraformディレクトリに移動
cd infrastructure

# 変数ファイルを作成
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` に実際の値を設定：
```hcl
project_name = "talent-discovery-app"
environment  = "production"
domain_name  = "your-domain.com"  # オプション
```

## AWS IAMユーザーの作成

デプロイに必要な権限を持つIAMユーザーを作成：

### 必要な権限：
- `AmazonS3FullAccess`
- `CloudFrontFullAccess`
- `AWSCertificateManagerFullAccess` (カスタムドメイン使用時)
- `Route53FullAccess` (カスタムドメイン使用時)

### IAMポリシー例（最小権限）：
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::talent-app-*",
                "arn:aws:s3:::talent-app-*/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "acm:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## セキュリティ注意事項

1. **`.env.local` をGitに含めない**（`.gitignore`に追加済み）
2. **本番環境では最小権限の原則**を適用
3. **アクセスキーの定期的なローテーション**
4. **GitHub Secretsの使用**でCI/CDの安全性を確保

## デプロイ手順

1. AWS認証情報を設定
2. `deploy-config.json` を実際の値に更新
3. インフラ作成（Terraform使用）：
   ```bash
   npm run terraform:init
   npm run terraform:plan
   npm run terraform:apply
   ```
4. デプロイ実行：
   ```bash
   npm run deploy:production
   ```

## トラブルシューティング

### よくあるエラー：
- **認証エラー**: AWS認証情報を確認
- **権限エラー**: IAMユーザーの権限を確認
- **バケット名重複**: S3バケット名を変更

### 確認コマンド：
```bash
# AWS認証状態の確認
aws sts get-caller-identity

# S3バケット一覧
aws s3 ls

# CloudFront一覧
aws cloudfront list-distributions
```
