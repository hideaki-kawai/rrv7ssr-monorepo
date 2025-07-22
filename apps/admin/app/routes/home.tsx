import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { prisma } from "@rrv7-ssr-monorepo/database";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Admin Dashboard - React Router v7" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  try {
    // Prismaを使ったサンプル: ユーザー数を取得
    const userCount = await prisma.user.count();
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    return {
      stats: {
        totalUsers: userCount,
        adminUsers: adminCount,
        generalUsers: userCount - adminCount,
      },
      error: null,
    };
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      stats: {
        totalUsers: 0,
        adminUsers: 0,
        generalUsers: 0,
      },
      error:
        "データベースに接続できません。環境変数DATABASE_URLを確認してください。",
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { stats, error } = loaderData;

  return (
    <div>
      <Welcome />
      <div
        style={{
          margin: "2rem",
          padding: "2rem",
          border: "1px solid #ccc",
          marginTop: "2rem",
        }}
      >
        <h2>Database Stats (Admin)</h2>
        {error ? (
          <div style={{ color: "red", padding: "1rem", background: "#fee" }}>
            <p>{error}</p>
            <p style={{ fontSize: "0.9em", marginTop: "0.5rem" }}>
              サンプルのDATABASE_URLが設定されています。実際のPostgreSQLデータベースのURLに変更してください。
            </p>
          </div>
        ) : (
          <ul>
            <li>Total Users: {stats.totalUsers}</li>
            <li>Admin Users: {stats.adminUsers}</li>
            <li>General Users: {stats.generalUsers}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
