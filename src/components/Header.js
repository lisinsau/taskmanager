import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          TaskManager
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-6 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="hover:text-blue-600 dark:hover:text-blue-400">
                Mes taches
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
