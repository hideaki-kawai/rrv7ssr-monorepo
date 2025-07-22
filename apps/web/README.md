# Webアプリケーション

React Router v7を使用したユーザー向けWebアプリケーションです。

## 概要

このアプリケーションはエンドユーザー向けのWebサービスとして機能し、ユーザー登録、プロフィール管理などの機能を提供します。

- **ポート**: 5174
- **URL**: http://localhost:5174

## 主な機能

- 最新ユーザーの表示
- ユーザープロフィール機能
- Prismaを使用したデータベース連携

## 開発

```bash
# ルートディレクトリから起動
pnpm dev:web

# このディレクトリから起動
pnpm dev

# ビルド
pnpm build

# 型チェック
pnpm typecheck
```

## ディレクトリ構造

```
web/
├── app/
│   ├── routes/      # ルート定義
│   ├── components/  # 共通コンポーネント
│   ├── root.tsx     # アプリケーションルート
│   └── routes.ts    # ルート設定
├── public/          # 静的ファイル
└── build/           # ビルド出力（gitignore）
```

## カスタマイズ

### 新しいルートの追加

`app/routes/`ディレクトリに新しいファイルを作成：

```typescript
// app/routes/profile.tsx
import { prisma } from "@rrv7-ssr-monorepo/database";
import type { Route } from "./+types/profile";

export async function loader({ params }: Route.LoaderArgs) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId }
  });
  return { user };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return (
    <div>
      <h1>{user?.name || "Anonymous"}のプロフィール</h1>
      {/* プロフィール情報の表示 */}
    </div>
  );
}
```

### APIルートの作成

React Router v7ではAPIルートも簡単に作成できます：

```typescript
// app/routes/api.users.ts
import { prisma } from "@rrv7-ssr-monorepo/database";
import type { Route } from "./+types/api.users";

export async function loader({}: Route.LoaderArgs) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true }
  });
  return Response.json({ users });
}
```

### スタイリング

Tailwind CSSが設定済みです。`app/app.css`でグローバルスタイルを管理できます。