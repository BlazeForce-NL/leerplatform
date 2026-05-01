"use client";

import { useState } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";

export default function StorageDemo() {
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useLocalStorage<string>("leerplatform-user-name", "");

  const handleSave = () => {
    setSavedName(name.trim());
    setName("");
  };

  return (
    <section className="w-full rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Client-side opslag demo</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Deze demo gebruikt `localStorage` veilig vanuit een client component. In Next.js mag je geen browser-only API aanroepen op de server.
      </p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Vul je naam in"
          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-sky-400"
        />
        <button type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Opslaan
        </button>
      </div>
      <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm text-zinc-700 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-200">
        <p className="font-medium text-zinc-950 dark:text-zinc-50">Opgeslagen waarde:</p>
        <p>{savedName || "Nog geen naam opgeslagen."}</p>
      </div>
    </section>
  );
}
