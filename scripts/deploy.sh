#!/bin/bash

# 才能発見アプリ AWS S3 + CloudFront デプロイスクリプト
# 使用方法: ./scripts/deploy.sh [environment]
# 例: ./scripts/deploy.sh production

set -e

# 環境設定
ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 色付きログ関数
log_info() {
    echo -e "\033[32m[INFO]\033[0m $1"
}

log_warn() {
    echo -e "\033[33m[WARN]\033[0m $1"
}

log_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# 設定ファイルの読み込み
if [ ! -f "deploy-config.json" ]; then
    log_error "deploy-config.json が見つかりません。設定ファイルを作成してください。"
    exit 1
fi

# AWS設定の確認
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI がインストールされていません。"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS認証が設定されていません。aws configure を実行してください。"
    exit 1
fi

log_info "=== 才能発見アプリ デプロイ開始 ==="
log_info "環境: $ENVIRONMENT"
log_info "タイムスタンプ: $TIMESTAMP"

# 1. 依存関係のインストール
log_info "1. 依存関係をインストール中..."
npm ci

# 2. ビルド前の準備
log_info "2. ビルド前の準備..."
rm -rf .next out

# 3. 本番ビルド
log_info "3. 本番ビルドを実行中..."
NODE_ENV=production npm run build

# 4. 静的ファイルの確認
if [ ! -d "out" ]; then
    log_error "静的ファイルの生成に失敗しました。"
    exit 1
fi

log_info "静的ファイル生成完了: $(find out -type f | wc -l) ファイル"

# 5. S3バケット設定の読み込み
S3_BUCKET=$(jq -r ".environments.$ENVIRONMENT.s3Bucket" deploy-config.json)
CLOUDFRONT_DISTRIBUTION_ID=$(jq -r ".environments.$ENVIRONMENT.cloudfrontDistributionId" deploy-config.json)
AWS_REGION=$(jq -r ".environments.$ENVIRONMENT.awsRegion" deploy-config.json)

if [ "$S3_BUCKET" = "null" ] || [ "$S3_BUCKET" = "" ]; then
    log_error "S3バケット名が設定されていません。"
    exit 1
fi

log_info "S3バケット: $S3_BUCKET"
log_info "リージョン: $AWS_REGION"

# 6. S3への同期
log_info "4. S3バケットに同期中..."
aws s3 sync out/ s3://$S3_BUCKET \
    --region $AWS_REGION \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "sw.js" \
    --exclude "workbox-*.js"

# HTMLファイルは短いキャッシュ期間
aws s3 sync out/ s3://$S3_BUCKET \
    --region $AWS_REGION \
    --include "*.html" \
    --cache-control "public, max-age=0, must-revalidate"

# Service Workerは常に最新版を取得
aws s3 sync out/ s3://$S3_BUCKET \
    --region $AWS_REGION \
    --include "sw.js" \
    --include "workbox-*.js" \
    --cache-control "public, max-age=0, no-cache, no-store, must-revalidate"

log_info "S3同期完了"

# 7. CloudFrontキャッシュの無効化
if [ "$CLOUDFRONT_DISTRIBUTION_ID" != "null" ] && [ "$CLOUDFRONT_DISTRIBUTION_ID" != "" ]; then
    log_info "5. CloudFrontキャッシュを無効化中..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    log_info "無効化ID: $INVALIDATION_ID"
    log_info "無効化の完了を待機中..."
    
    aws cloudfront wait invalidation-completed \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --id $INVALIDATION_ID
    
    log_info "CloudFrontキャッシュ無効化完了"
else
    log_warn "CloudFront Distribution IDが設定されていません。手動でキャッシュを無効化してください。"
fi

# 8. デプロイ完了
CLOUDFRONT_DOMAIN=$(jq -r ".environments.$ENVIRONMENT.domain" deploy-config.json)
if [ "$CLOUDFRONT_DOMAIN" != "null" ] && [ "$CLOUDFRONT_DOMAIN" != "" ]; then
    log_info "=== デプロイ完了 ==="
    log_info "URL: https://$CLOUDFRONT_DOMAIN"
    log_info "PWA機能が有効になっています。"
else
    log_info "=== デプロイ完了 ==="
    log_info "S3バケット: $S3_BUCKET"
fi

log_info "デプロイ時刻: $(date)"
