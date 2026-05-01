import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";

const UpdateSchoolSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

type Params = { params: Promise<{ id: string }> };

async function resolveSchool(id: string) {
  const school = await db.school.findFirst({ where: { id, deletedAt: null } });
  if (!school) return apiError(404, "School niet gevonden", "NOT_FOUND");
  return school;
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
  if (denied) return denied;

  const { id } = await params;
  try {
    const school = await resolveSchool(id);
    if (school instanceof Response) return school;
    return Response.json(school);
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
  const parsed = UpdateSchoolSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  const { id } = await params;
  try {
    const existing = await resolveSchool(id);
    if (existing instanceof Response) return existing;
    const school = await db.school.update({ where: { id }, data: parsed.data });
    return Response.json(school);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN");
  if (denied) return denied;

  const { id } = await params;
  try {
    const existing = await resolveSchool(id);
    if (existing instanceof Response) return existing;
    // Soft-delete
    await db.school.update({ where: { id }, data: { deletedAt: new Date() } });
    return new Response(null, { status: 204 });
  } catch (e) {
    return serverError(e);
  }
}
