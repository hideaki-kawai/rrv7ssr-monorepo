# 管理画面アプリケーション

React Router v7を使用した管理画面アプリケーションです。

## 概要

このアプリケーションは管理者向けのダッシュボードとして機能し、ユーザー管理やデータ分析などの機能を提供します。

- **ポート**: 5173
- **URL**: http://localhost:5173

## 主な機能

- ユーザー統計情報の表示
- 管理者権限でのデータアクセス
- Prismaを使用したデータベース連携

## 開発

```bash
# ルートディレクトリから起動
pnpm dev:admin

# このディレクトリから起動
pnpm dev

# ビルド
pnpm build

# 型チェック
pnpm typecheck
```

## ディレクトリ構造

```
admin/
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
// app/routes/users.tsx
import { prisma } from "@rrv7-ssr-monorepo/database";
import type { Route } from "./+types/users";

export async function loader({}: Route.LoaderArgs) {
  const users = await prisma.user.findMany();
  return { users };
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  return (
    <div>
      <h1>ユーザー管理</h1>
      {/* ユーザーリストの表示 */}
    </div>
  );
}
```

### スタイリング

Tailwind CSSが設定済みです。`app/app.css`でグローバルスタイルを管理できます。