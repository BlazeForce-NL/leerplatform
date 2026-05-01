import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { db } from "./db";

// ── Response helpers ──────────────────────────────────────────────────────────

export function apiError(status: number, error: string, code: string): Response {
  return Response.json({ error, code }, { status });
}

export function serverError(e: unknown): Response {
  console.error(e);
  return apiError(500, "Interne serverfout", "SERVER_ERROR");
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export type AuthUser = { id: string; role: Role };

export async function requireAuth(req: NextRequest): Promise<AuthUser | Response> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return apiError(401, "Niet geauthenticeerd", "UNAUTHENTICATED");

  const token = auth.slice(7);
  const record = await db.authToken.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: { user: { select: { id: true, role: true, deletedAt: true } } },
  });

  if (!record || record.user.deletedAt) return apiError(401, "Sessie verlopen of ongeldig", "SESSION_EXPIRED");

  return { id: record.user.id, role: record.user.role };
}

export function isAuthUser(v: AuthUser | Response): v is AuthUser {
  return !(v instanceof Response);
}

export function requireRole(user: AuthUser, ...roles: Role[]): Response | null {
  if (!roles.includes(user.role)) return apiError(403, "Onvoldoende rechten", "FORBIDDEN");
  return null;
}
