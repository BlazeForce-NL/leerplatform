import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { serverError } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return redirect("/login?error=missing_token");

  try {
    const record = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expiresAt < new Date()) {
      await db.verificationToken.deleteMany({ where: { token } }).catch(() => {});
      return redirect("/login?error=expired");
    }

    const user = await db.user.findFirst({
      where: { email: record.identifier, deletedAt: null },
      select: { id: true },
    });

    if (!user) return redirect("/login?error=not_found");

    // Token verbruikt — verwijder het
    await db.verificationToken.delete({ where: { token } });

    await createSession(user.id);
    return redirect("/dashboard");
  } catch (e) {
    return serverError(e);
  }
}

function redirect(path: string) {
  return Response.redirect(
    new URL(path, process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
    302,
  );
}
