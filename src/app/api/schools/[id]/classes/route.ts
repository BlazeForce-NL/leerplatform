import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";

const CreateClassSchema = z.object({
  name: z.string().min(1).max(100),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN", "TEACHER");
  if (denied) return denied;

  const { id: schoolId } = await params;
  try {
    const school = await db.school.findFirst({ where: { id: schoolId, deletedAt: null } });
    if (!school) return apiError(404, "School niet gevonden", "NOT_FOUND");

    const classes = await db.class.findMany({
      where: { schoolId, deletedAt: null },
      orderBy: { name: "asc" },
    });
    return Response.json(classes);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = CreateClassSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  const { id: schoolId } = await params;
  try {
    const school = await db.school.findFirst({ where: { id: schoolId, deletedAt: null } });
    if (!school) return apiError(404, "School niet gevonden", "NOT_FOUND");

    const klass = await db.class.create({ data: { name: parsed.data.name, schoolId } });
    return Response.json(klass, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
