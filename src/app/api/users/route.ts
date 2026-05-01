import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, requireRole, serverError } from "@/lib/api";
import type { Role } from "@prisma/client";

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  role: z.enum(["PLATFORM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"] as const),
  passwordHash: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN");
  if (denied) return denied;

  try {
    const users = await db.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    return Response.json(users);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const denied = requireRole(user, "PLATFORM_ADMIN", "SCHOOL_ADMIN");
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  // SCHOOL_ADMIN may only create TEACHER and STUDENT accounts.
  if (user.role === "SCHOOL_ADMIN" && !["TEACHER", "STUDENT"].includes(parsed.data.role as Role)) {
    return apiError(403, "Onvoldoende rechten voor dit rol-type", "FORBIDDEN");
  }

  try {
    const created = await db.user.create({
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return Response.json(created, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
