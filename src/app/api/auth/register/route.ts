import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, serverError } from "@/lib/api";
import { sendMagicLink } from "@/lib/email";

const Schema = z.object({
  schoolName: z.string().min(2).max(100),
  name:       z.string().min(2).max(100),
  email:      z.string().email(),
});

const EXPIRES_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return apiError(400, "Ongeldige invoer", "VALIDATION_ERROR");

  const { schoolName, name, email } = parsed.data;

  try {
    const exists = await db.user.findFirst({ where: { email, deletedAt: null } });
    if (exists) return apiError(409, "Er bestaat al een account met dit e-mailadres", "EMAIL_TAKEN");

    const user = await db.user.create({
      data: {
        email, name, role: "SCHOOL_ADMIN",
        schoolAdmins: {
          create: {
            school: { create: { name: schoolName } },
          },
        },
      },
      select: { id: true },
    });

    // Stuur direct een magic link zodat de beheerder meteen kan inloggen
    await db.verificationToken.deleteMany({ where: { identifier: email } });
    const record = await db.verificationToken.create({
      data: { identifier: email, expiresAt: new Date(Date.now() + EXPIRES_MS) },
      select: { token: true },
    });

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    await sendMagicLink({ to: email, name, magicLink: `${base}/api/auth/verify?token=${record.token}` });

    return Response.json({ ok: true, userId: user.id }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
