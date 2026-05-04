import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, serverError } from "@/lib/api";
import { createSession } from "@/lib/session";

const Schema = z.object({
  code:      z.string().length(6),
  firstName: z.string().min(1).max(50),
  userId:    z.string().optional(), // voor disambiguatie bij dubbele naam
});

const STUDENT_SESSION_MS = 8 * 60 * 60 * 1000; // 8 uur (schooldag)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return apiError(400, "Vul een geldige code en naam in", "VALIDATION_ERROR");

  const { code, firstName, userId } = parsed.data;

  try {
    const klas = await db.class.findFirst({
      where: { code: code.toUpperCase(), deletedAt: null },
      select: { id: true, name: true },
    });

    if (!klas) return apiError(404, "Deze klascode bestaat niet. Vraag je juf of meester om de code.", "CLASS_NOT_FOUND");

    const members = await db.classMembership.findMany({
      where: { classId: klas.id },
      include: { user: { select: { id: true, name: true, deletedAt: true } } },
    });

    const normalise = (s: string) => s.trim().toLowerCase();
    const needle = normalise(firstName);
    const matches = members
      .filter(m => !m.user.deletedAt)
      .filter(m => normalise(m.user.name).startsWith(needle + " ") || normalise(m.user.name) === needle);

    if (matches.length === 0) {
      return apiError(404, "Jouw naam staat niet in deze klas. Klopt de spelling?", "STUDENT_NOT_FOUND");
    }

    if (matches.length > 1 && !userId) {
      return Response.json({
        ambiguous: true,
        students: matches.map(m => ({ id: m.user.id, name: m.user.name })),
      }, { status: 200 });
    }

    const chosen = userId
      ? matches.find(m => m.user.id === userId)
      : matches[0];

    if (!chosen) return apiError(404, "Leerling niet gevonden", "STUDENT_NOT_FOUND");

    await createSession(chosen.user.id, STUDENT_SESSION_MS);
    return Response.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
