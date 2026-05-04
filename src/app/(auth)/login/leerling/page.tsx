"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type State = "idle" | "loading" | "ambiguous" | "error";
type Student = { id: string; name: string };

export default function LeerlingLoginPage() {
  const router = useRouter();
  const [code,      setCode]      = useState("");
  const [firstName, setFirstName] = useState("");
  const [state,     setState]     = useState<State>("idle");
  const [error,     setError]     = useState("");
  const [students,  setStudents]  = useState<Student[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), firstName: firstName.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (data.ambiguous) { setStudents(data.students); setState("ambiguous"); return; }
      if (res.ok)         { router.push("/"); return; }

      setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
      setState("error");
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
      setState("error");
    }
  }

  async function chooseStudent(id: string) {
    setState("loading");
    const res = await fetch("/api/auth/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toUpperCase(), firstName: firstName.trim(), userId: id }),
    });
    if (res.ok) { router.push("/"); return; }
    setError("Er ging iets mis. Probeer het opnieuw.");
    setState("error");
  }

  if (state === "ambiguous") {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl mb-3">🤔</div>
          <p className="font-semibold text-gray-800 mb-1">Wie ben jij?</p>
          <p className="text-sm text-gray-500 mb-4">Er zijn meerdere leerlingen met die naam. Kies jouw naam:</p>
          <div className="flex flex-col gap-2">
            {students.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => chooseStudent(s.id)}
                className="w-full py-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-800 font-semibold text-sm cursor-pointer hover:bg-blue-100"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">🏫</div>
          <h1 className="text-2xl font-bold text-gray-900">Inloggen</h1>
          <p className="text-sm text-gray-500 mt-1">Vul de klascode en jouw naam in</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1">
              Klascode
            </label>
            <input
              id="code"
              type="text"
              required
              maxLength={6}
              autoCapitalize="characters"
              autoComplete="off"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="bijv. GROEP4"
              className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 text-xl font-bold text-center tracking-widest uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
              Jouw voornaam
            </label>
            <input
              id="firstName"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="bijv. Emma"
              className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {(state === "error") && (
            <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full py-3 rounded-full bg-blue-600 text-white text-lg font-bold disabled:opacity-60 cursor-pointer"
          >
            {state === "loading" ? "Even wachten…" : "Spelen! →"}
          </button>
        </form>
      </div>

      <p className="text-center mt-4 text-sm text-gray-500">
        <Link href="/" className="text-blue-600 underline">Terug naar vrij spelen</Link>
      </p>
    </div>
  );
}
