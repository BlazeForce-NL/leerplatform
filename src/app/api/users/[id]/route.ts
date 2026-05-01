import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

type Params = { params: Promise<{ id: string }> };

const USER_SELECT = { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true, deletedAt: true } as const;

async function resolveUser(id: string) {
  const u = await db.user.findFirst({ where: { id, deletedAt: null }, select: USER_SELECT });
  if (!u) return apiError(404, "Gebruiker niet gevonden", "NOT_FOUND");
  return u;
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const { id } = await params;
  // Users may only view their own profile unless they're an admin.
  if (user.id !== id) {
    const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
    if (denied) return denied;
  }

  try {
    const found = await resolveUser(id);
    if (found instanceof Response) return found;
    return Response.json(found);
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const { id } = await params;
  if (user.id !== id) {
    const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
    if (denied) return denied;
  }

  const body = await req.json().catch(() => null);
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  try {
    const existing = await resolveUser(id);
    if (existing instanceof Response) return existing;
    const updated = await db.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, updatedAt: true },
    });
    return Response.json(updated);
  } catch (e) {
    return serverError(e);
  }
}

// GDPR: recht op vergetelheid — soft-delete
export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const { id } = await params;
  // Users may delete their own account; admins may delete any account.
  if (user.id !== id) {
    const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
    if (denied) return denied;
  }

  try {
    const existing = await resolveUser(id);
    if (existing instanceof Response) return existing;
    await db.user.update({ where: { id }, data: { deletedAt: new Date() } });
    return new Response(null, { status: 204 });
  } catch (e) {
    return serverError(e);
  }
}
