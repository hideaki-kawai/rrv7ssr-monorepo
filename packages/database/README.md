# データベースパッケージ

Prismaを使用した共通データベースアクセスレイヤーです。

## 概要

このパッケージは、モノレポ内のすべてのアプリケーションから共通で利用できるデータベースアクセス機能を提供します。

## 主な機能

- Prisma Clientのシングルトンインスタンス
- 型安全なデータベースアクセス
- 共通のデータモデル定義

## セットアップ

### 1. 環境変数の設定

ルートディレクトリと、このディレクトリ（packages/database）の両方に`.env`ファイルを作成：

```bash
# ルートディレクトリの.env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# packages/database/.env（同じ内容）
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

**重要**: 
- Prismaコマンドはこのディレクトリから実行されるため、ここにも.envファイルが必要です
- DATABASE_URLを変更する場合は、両方の.envファイルを更新してください

### 2. Prismaクライアントの生成

```bash
# ルートディレクトリから
pnpm db:generate
```

### 3. データベーススキーマの適用

```bash
# ルートディレクトリから
pnpm db:push

# マイグレーションを使用する場合
pnpm db:migrate
```

## 使用方法

### アプリケーションでの利用

```typescript
import { prisma } from "@rrv7-ssr-monorepo/database";

// ユーザーの取得
const users = await prisma.user.findMany();

// ユーザーの作成
const newUser = await prisma.user.create({
  data: {
    email: "user@example.com",
    password: "hashed-password",
    name: "ユーザー名",
    role: "GENERAL",
  },
});
```

### 利用可能なモデル

#### User (ユーザー)
- `id`: 一意識別子
- `email`: メールアドレス（ユニーク）
- `password`: パスワード（ハッシュ化済み）
- `name`: ユーザー名（オプション）
- `role`: ユーザー権限（ADMIN/GENERAL）
- `isActive`: アクティブフラグ
- `lastLoginAt`: 最終ログイン日時
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

#### RefreshToken (リフレッシュトークン)
- `id`: 一意識別子
- `token`: トークン文字列（ユニーク）
- `userId`: ユーザーID（外部キー）
- `expiresAt`: 有効期限
- `createdAt`: 作成日時

## 開発

### スキーマの変更

1. `prisma/schema.prisma`を編集
2. Prismaクライアントを再生成
```bash
pnpm db:generate
```
3. 変更をデータベースに適用
```bash
pnpm db:push  # 開発環境
# または
pnpm db:migrate  # 本番環境
```

### Prisma Studioの使用

データベースの内容をGUIで確認・編集：

```bash
pnpm db:studio
```

## ベストプラクティス

1. **トランザクション**: 複数の操作をまとめる場合
```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.refreshToken.create({ data: { userId: user.id, ... } });
  return user;
});
```

2. **エラーハンドリング**: Prismaのエラーを適切に処理
```typescript
import { Prisma } from "@rrv7-ssr-monorepo/database";

try {
  await prisma.user.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // ユニーク制約違反
      throw new Error('このメールアドレスは既に使用されています');
    }
  }
  throw error;
}
```

3. **パフォーマンス**: 必要なフィールドのみ取得
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```