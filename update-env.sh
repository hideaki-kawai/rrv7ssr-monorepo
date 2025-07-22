#!/bin/bash

# 新しいDATABASE_URL（compose.ymlの設定に合わせる）
NEW_DATABASE_URL="DATABASE_URL=postgresql://local_database:local_database@localhost:5434/local_database_dev"

# すべての.envファイルを更新
echo "$NEW_DATABASE_URL" > .env
echo "$NEW_DATABASE_URL" > packages/database/.env
echo "$NEW_DATABASE_URL" > apps/admin/.env
echo "$NEW_DATABASE_URL" > apps/web/.env

echo "すべての.envファイルを更新しました！"