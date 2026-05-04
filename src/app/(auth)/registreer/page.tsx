"use client";

import { useState } from "react";
import Link from "next/link";

type State = "idle" | "loading" | "sent" | "error";

export default function RegistreerPage() {
  const [form,  setForm]  = useState({ schoolName: "", name: "", email: "" });
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  function update(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setState("sent"); return; }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
      setState("error");
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
      setState("error");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">School aanmelden</h1>
        <p className="text-sm text-gray-500 mb-6">Maak een account aan voor jouw school</p>

        {state === "sent" ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-gray-800 mb-1">Account aangemaakt!</p>
            <p className="text-sm text-gray-500">
              We stuurden een inloglink naar <strong>{form.email}</strong>.
              Klik op de link om direct in te loggen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { id: "schoolName", label: "Naam van de school", placeholder: "Basisschool De Zon",  key: "schoolName" },
              { id: "name",       label: "Jouw naam",           placeholder: "Jan de Vries",         key: "name"       },
              { id: "email",      label: "E-mailadres",          placeholder: "jan@school.nl",        key: "email"      },
            ].map(f => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.key === "email" ? "email" : "text"}
                  required
                  value={form[f.key as keyof typeof form]}
                  onChange={update(f.key as keyof typeof form)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {(state === "error") && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm disabled:opacity-60 cursor-pointer"
            >
              {state === "loading" ? "Bezig…" : "Account aanmaken →"}
            </button>
          </form>
        )}
      </div>

      <p className="text-center mt-4 text-sm text-gray-500">
        Al een account?{" "}
        <Link href="/login" className="text-blue-600 underline">Inloggen</Link>
      </p>
    </div>
  );
}
