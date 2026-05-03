import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, serverError } from "@/lib/api";
import { sendMagicLink } from "@/lib/email";

const Schema = z.object({ email: z.string().email() });
const EXPIRES_MS = 15 * 60 * 1000; // 15 minuten

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldig e-mailadres", "VALIDATION_ERROR");

  const { email } = parsed.data;

  try {
    const user = await db.user.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, name: true },
    });

    // Altijd succesvol antwoorden om user-enumeration te voorkomen
    if (!user) return Response.json({ ok: true });

    // Verwijder eventuele oude tokens voor dit adres
    await db.verificationToken.deleteMany({ where: { identifier: email } });

    const record = await db.verificationToken.create({
      data: { identifier: email, expiresAt: new Date(Date.now() + EXPIRES_MS) },
      select: { token: true },
    });

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const magicLink = `${base}/api/auth/verify?token=${record.token}`;

    await sendMagicLink({ to: email, name: user.name, magicLink });
    return Response.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
