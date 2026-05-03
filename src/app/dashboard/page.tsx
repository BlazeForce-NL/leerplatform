import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const store = await cookies();
  const token = store.get("session")?.value;

  if (!token) redirect("/login");

  const record = await db.authToken.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: { user: { select: { name: true, role: true, email: true } } },
  });

  if (!record || record.user === null) redirect("/login");

  const { user } = record;

  return (
    <div className="min-h-dvh bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 bg-white cursor-pointer hover:bg-gray-50"
            >
              Uitloggen
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <p className="text-sm text-gray-500 mb-1">Ingelogd als</p>
          <p className="text-lg font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            {user.role}
          </span>
        </div>

        <p className="text-sm text-gray-400 text-center">
          Klassen en leerlingenbeheer volgt in EP-05.
        </p>
      </div>
    </div>
  );
}
