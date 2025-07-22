import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { prisma } from "@rrv7-ssr-monorepo/database";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Web Application" },
    { name: "description", content: "Web Application - React Router v7" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  try {
    // Prismaを使ったサンプル: 最新のユーザー5件を取得
    const recentUsers = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return {
      recentUsers,
      error: null,
    };
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      recentUsers: [],
      error:
        "データベースに接続できません。環境変数DATABASE_URLを確認してください。",
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { recentUsers, error } = loaderData;

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
        <h2>Recent Users (Web)</h2>
        {error ? (
          <div style={{ color: "red", padding: "1rem", background: "#fee" }}>
            <p>{error}</p>
            <p style={{ fontSize: "0.9em", marginTop: "0.5rem" }}>
              サンプルのDATABASE_URLが設定されています。実際のPostgreSQLデータベースのURLに変更してください。
            </p>
          </div>
        ) : recentUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul>
            {recentUsers.map((user) => (
              <li key={user.id}>
                {user.name || "Anonymous"} ({user.email}) - Joined:{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
