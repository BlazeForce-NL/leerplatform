import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";

const UpdateClassSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

type Params = { params: Promise<{ id: string }> };

async function resolveClass(id: string) {
  const klass = await db.class.findFirst({ where: { id, deletedAt: null } });
  if (!klass) return apiError(404, "Klas niet gevonden", "NOT_FOUND");
  return klass;
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN", "TEACHER");
  if (denied) return denied;

  const { id } = await params;
  try {
    const klass = await resolveClass(id);
    if (klass instanceof Response) return klass;
    return Response.json(klass);
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = UpdateClassSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  const { id } = await params;
  try {
    const existing = await resolveClass(id);
    if (existing instanceof Response) return existing;
    const klass = await db.class.update({ where: { id }, data: parsed.data });
    return Response.json(klass);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
  if (denied) return denied;

  const { id } = await params;
  try {
    const existing = await resolveClass(id);
    if (existing instanceof Response) return existing;
    await db.class.update({ where: { id }, data: { deletedAt: new Date() } });
    return new Response(null, { status: 204 });
  } catch (e) {
    return serverError(e);
  }
}
