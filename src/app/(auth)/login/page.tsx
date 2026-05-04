"use client";

import { useState } from "react";
import Link from "next/link";

const ERROR_MSG: Record<string, string> = {
  expired:      "De inloglink is verlopen. Vraag een nieuwe aan.",
  missing_token: "Ongeldige link. Vraag een nieuwe inloglink aan.",
  not_found:    "Geen account gevonden met dit e-mailadres.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const [email, setEmail]   = useState("");
  const [state, setState]   = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [params, setParams] = useState<Record<string, string>>({});

  // Resolve searchParams on mount
  useState(() => { searchParams.then(setParams); });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const errorKey = params.error;

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Inloggen</h1>
        <p className="text-sm text-gray-500 mb-6">Voor leerkrachten en schoolbeheerders</p>

        {errorKey && ERROR_MSG[errorKey] && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {ERROR_MSG[errorKey]}
          </div>
        )}

        {state === "sent" ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📬</div>
            <p className="font-semibold text-gray-800 mb-1">Controleer je e-mail</p>
            <p className="text-sm text-gray-500">
              We stuurden een inloglink naar <strong>{email}</strong>.
              De link is 15 minuten geldig.
            </p>
            <button
              type="button"
              className="mt-4 text-sm text-blue-600 underline cursor-pointer"
              onClick={() => setState("idle")}
            >
              Ander e-mailadres gebruiken
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jouw@school.nl"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-red-600">Er ging iets mis. Probeer het opnieuw.</p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm disabled:opacity-60 cursor-pointer"
            >
              {state === "loading" ? "Versturen…" : "Stuur inloglink →"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-1 text-sm text-gray-500">
        <span>
          Leerling?{" "}
          <Link href="/login/leerling" className="text-blue-600 underline">Inloggen met klascode</Link>
        </span>
        <span>
          Nog geen account?{" "}
          <Link href="/registreer" className="text-blue-600 underline">School aanmelden</Link>
        </span>
        <span>
          <Link href="/" className="text-gray-400 underline">Direct spelen zonder account</Link>
        </span>
      </div>
    </div>
  );
}
