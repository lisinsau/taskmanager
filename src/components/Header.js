"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

export default function Header() {
  const pathname = usePathname();
  const isTasksPage = pathname === "/";
  const isSharedPage = pathname?.startsWith("/shared");

  const getLinkClassName = (isActive) =>
    `rounded-md px-3 py-1.5 transition ${
      isActive
        ? "bg-blue-100 text-blue-700"
        : "text-zinc-700 hover:text-blue-600 hover:bg-zinc-100"
    }`;

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-zinc-900">
          TaskManager
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-2 text-sm font-medium">
            <li>
              <Link href="/" className={getLinkClassName(isTasksPage)} aria-current={isTasksPage ? "page" : undefined}>
                Mes tâches
              </Link>
            </li>
            <li>
              <Link
                href="/shared"
                className={getLinkClassName(isSharedPage)}
                aria-current={isSharedPage ? "page" : undefined}
              >
                Listes partagées
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto">
          <UserMenu compact />
        </div>
      </div>
    </header>
  );
}
