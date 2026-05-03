import { deleteSession } from "@/lib/session";
import { serverError } from "@/lib/api";

export async function POST() {
  try {
    await deleteSession();
    return Response.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
