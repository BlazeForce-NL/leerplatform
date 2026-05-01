import NumberblocksGame from "../components/NumberblocksGame";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-10 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-5xl space-y-10 rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
        <section className="space-y-6">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-800 dark:bg-sky-950/20 dark:text-sky-200">
              Leerplatform integratie
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Numberblocks spel met `localStorage`
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Deze pagina toont de Vite-react gamecode in jullie Next.js-app. Opslag gebeurt client-side met `localStorage`, zonder `window.storage`.
            </p>
          </div>
        </section>

        <NumberblocksGame />
      </main>
    </div>
  );
}
