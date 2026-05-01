import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";

const CreateSchoolSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN");
  if (denied) return denied;

  try {
    const schools = await db.school.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
    return Response.json(schools);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN");
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = CreateSchoolSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  try {
    const school = await db.school.create({ data: parsed.data });
    return Response.json(school, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
