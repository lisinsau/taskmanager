// Page d'accueil de TaskManager avec style épuré et centré

export default function Home() {
  return (
    <main className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <section className="flex flex-col items-center justify-center gap-8 bg-white dark:bg-zinc-900 px-8 py-16 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">TaskManager</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">Gérez vos tâches efficacement</p>
        <button
          className="mt-4 px-8 py-3 rounded-full bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Commencer avec TaskManager"
        >
          Commencer
        </button>
      </section>
    </main>
  );
}
