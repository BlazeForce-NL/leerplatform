import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE = "session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dagen

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_MS);
  const record = await db.authToken.create({
    data: { userId, expiresAt },
    select: { token: true },
  });
  const store = await cookies();
  store.set(COOKIE, record.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    await db.authToken.deleteMany({ where: { token } }).catch(() => {});
    store.delete(COOKIE);
  }
}
