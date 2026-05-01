import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, requireAuth, isAuthUser, serverError } from "@/lib/api";

const CreateSessionSchema = z.object({
  mode: z.enum(["plus", "min", "mix", "tafel", "tafel_specific", "alles"]),
  specificTable: z.number().int().min(1).max(10).optional(),
  timerSetting: z.number().int().min(0).default(0),
  score: z.number().int().min(0),
  correct: z.number().int().min(0),
  total: z.number().int().min(0),
  scores: z.array(z.object({
    category: z.string().min(1),
    score: z.number().int().min(0),
  })).optional(),
});

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  try {
    const sessions = await db.session.findMany({
      where: { userId: user.id },
      include: { scores: true },
      orderBy: { playedAt: "desc" },
      take: 50,
    });
    return Response.json(sessions);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!isAuthUser(user)) return user;

  const body = await req.json().catch(() => null);
  const parsed = CreateSessionSchema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  const { scores, ...sessionData } = parsed.data;
  try {
    const session = await db.session.create({
      data: {
        ...sessionData,
        userId: user.id,
        scores: scores ? { create: scores } : undefined,
      },
      include: { scores: true },
    });
    return Response.json(session, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
