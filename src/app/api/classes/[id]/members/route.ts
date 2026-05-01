import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";

const AddMemberSchema = z.object({
  userId: z.string().min(1),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN", "TEACHER");
  if (denied) return denied;

  const { id: classId } = await params;
  try {
    const klass = await db.class.findFirst({ where: { id: classId, deletedAt: null } });
    if (!klass) return apiError(404, "Klas niet gevonden", "NOT_FOUND");

    const members = await db.classMembership.findMany({
      where: { classId },
      include: { user: { select: { id: true, name: true, role: true, deletedAt: true } } },
    });
    return Response.json(members.filter(m => !m.user.deletedAt));
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN", "TEACHER");
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = AddMemberSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  const { id: classId } = await params;
  try {
    const klass = await db.class.findFirst({ where: { id: classId, deletedAt: null } });
    if (!klass) return apiError(404, "Klas niet gevonden", "NOT_FOUND");

    const membership = await db.classMembership.upsert({
      where: { classId_userId: { classId, userId: parsed.data.userId } },
      create: { classId, userId: parsed.data.userId },
      update: {},
    });
    return Response.json(membership, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
