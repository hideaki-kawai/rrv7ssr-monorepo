# React Router v7 SSRモノレポリポジトリ

React Router v7のSSRモードを使用した複数アプリケーションのモノレポリポジトリテンプレートです。

## 🚀 特徴

- **React Router v7** - SSRフレームワーク
- **pnpm + Turbo** - 高速なパッケージ管理とビルドシステム
- **TypeScript** - 型安全な開発環境
- **Prisma** - ORM
- **共通パッケージ** - アプリケーション間でコードを共有
- **GitHub Actions** - CI/CD

## 📁 プロジェクト構成

```
rrv7-ssr-monorepo/
├── apps/                   # アプリケーション
│   ├── admin/             # 管理画面アプリケーション (port: 5173)
│   └── web/               # ユーザー向けWebアプリケーション (port: 5174)
├── packages/              # 共有パッケージ
│   └── database/          # Prismaを使用したデータベースパッケージ
├── .github/workflows/     # GitHub Actions設定
├── turbo.json            # Turbo設定
├── pnpm-workspace.yaml   # pnpmワークスペース設定
└── tsconfig.json         # 共通TypeScript設定
```

## 🛠️ はじめに

### 前提条件

- Node.js v23.9.0以上
- pnpm v9.7.0以上

### セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd rrv7-ssr-monorepo
```

2. 依存関係をインストール
```bash
npm i
pnpm install
```

3. 環境変数を設定

### 方法1: Dockerを使用する場合（推奨）
```bash
# PostgreSQLをDockerで起動
docker compose up -d

# すべての.envファイルのDATABASE_URLを更新（スクリプトを使用）
./update-env.sh
```

### 方法2: 手動で設定する場合
```bash
# すべての必要な場所に.envファイルを作成
echo "DATABASE_URL=postgresql://user:password@localhost:5432/mydb" > .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/mydb" > packages/database/.env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/mydb" > apps/admin/.env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/mydb" > apps/web/.env
```

> **注意**: 
> - React Router v7のSSRモードでは、各アプリケーションディレクトリに.envファイルが必要です
> - Prismaはpackages/databaseディレクトリから実行されるため、そのディレクトリにも.envファイルが必要です
> - DATABASE_URLを変更する場合は、すべての.envファイルを更新してください（update-env.shスクリプトを使用すると便利です）

4. Prismaクライアントを生成
```bash
pnpm db:generate
```

5. データベースのスキーマを適用
```bash
pnpm db:push
```

6. 開発サーバーを起動
```bash
# 必ずDockerでPostgreSQLを起動してから実行
docker compose up -d

# 開発サーバーを起動
pnpm dev
```

## 📝 開発コマンド

### 開発を始める前に

**重要**: 開発サーバーを起動する前に、必ずDockerでPostgreSQLを起動してください：

```bash
docker compose up -d
```

### 全体操作

```bash
# すべてのアプリケーションを同時に起動
pnpm dev

# すべてのアプリケーションをビルド
pnpm build

# 型チェック
pnpm typecheck

# リント（設定されている場合）
pnpm lint
```

### 個別アプリケーション操作

```bash
# 管理画面のみ起動 (http://localhost:5173)
pnpm dev:admin

# Webアプリケーションのみ起動 (http://localhost:5174)
pnpm dev:web

# 個別ビルド
pnpm build:admin
pnpm build:web
```

### データベース操作

```bash
# PostgreSQLの起動/停止
docker compose up -d    # 起動
docker compose down     # 停止

# Prismaクライアントの生成
pnpm db:generate

# データベーススキーマの適用
pnpm db:push

# マイグレーションの実行
pnpm db:migrate

# Prisma Studioの起動（データベースGUI）
pnpm db:studio
```

## 📦 パッケージ管理

### 新しいパッケージの追加

```bash
# ワークスペースルートに追加
pnpm add -w <package-name>

# 開発依存関係として追加
pnpm add -D -w <package-name>

# 特定のアプリケーション/パッケージに追加
pnpm add <package-name> --filter @rrv7-ssr-monorepo/admin
pnpm add <package-name> --filter @rrv7-ssr-monorepo/web
pnpm add <package-name> --filter @rrv7-ssr-monorepo/database
```

### パッケージの削除

```bash
# 特定のアプリケーションから削除
pnpm remove <package-name> --filter @rrv7-ssr-monorepo/admin
```

## 🔄 Prismaを使用したデータアクセス

各アプリケーションでPrismaを使用する例：

```typescript
// apps/admin/app/routes/users.tsx
import { prisma } from "@rrv7-ssr-monorepo/database";
import type { Route } from "./+types/users";

export async function loader({}: Route.LoaderArgs) {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  
  return { users };
}
```

## 🏗️ 新しいアプリケーションの追加

1. `apps/`ディレクトリに新しいReact Routerアプリケーションを作成
```bash
cd apps
npx create-react-router@latest my-app
```

2. package.jsonのnameを統一規則に従って変更
```json
{
  "name": "@rrv7-ssr-monorepo/my-app"
}
```

3. tsconfig.jsonでルートの設定を継承
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    // アプリケーション固有の設定
  }
}
```

4. 必要に応じて共有パッケージを追加
```bash
pnpm add @rrv7-ssr-monorepo/database --filter @rrv7-ssr-monorepo/my-app
```

## 🚢 デプロイ

GitHub Actionsを使用したCI/CDパイプラインが設定されています。mainブランチへのプッシュで自動的にビルドとテストが実行されます。

## 📚 詳細ドキュメント

- [管理画面アプリケーション](./apps/admin/README.md)
- [Webアプリケーション](./apps/web/README.md)
- [データベースパッケージ](./packages/database/README.md)

## 📄 ライセンス

ISC