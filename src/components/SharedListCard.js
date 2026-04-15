import React from "react";

export default function SharedListCard({ list, currentUserId, onOpen, onDelete }) {
  const safeList = list ?? {};
  const members = Array.isArray(safeList.members) ? safeList.members : [];
  const tasks = Array.isArray(safeList.tasks) ? safeList.tasks : [];
  const isOwner = safeList.ownerId === currentUserId;

  const totalTasks =
    typeof safeList.totalTasks === "number" ? safeList.totalTasks : tasks.length;
  const completedTasks =
    typeof safeList.completedTasks === "number"
      ? safeList.completedTasks
      : tasks.filter((task) => task?.completed).length;

  return (
    <article
      className="w-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
      aria-label={`Liste partagée ${safeList.name ?? ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900">
          {safeList.name || "Liste sans nom"}
        </h3>
        {isOwner ? (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Propriétaire
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <div className="rounded-lg bg-zinc-50 px-3 py-2">
          <dt className="font-medium text-zinc-600">Membres</dt>
          <dd className="text-zinc-900">{members.length}</dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2">
          <dt className="font-medium text-zinc-600">Tâches</dt>
          <dd className="text-zinc-900">
            {completedTasks}/{totalTasks} complétées
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onOpen?.(safeList)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label={`Ouvrir la liste ${safeList.name ?? ""}`}
        >
          Ouvrir
        </button>

        {isOwner ? (
          <button
            type="button"
            onClick={() => onDelete?.(safeList)}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            aria-label={`Supprimer la liste ${safeList.name ?? ""}`}
          >
            Supprimer
          </button>
        ) : null}
      </div>
    </article>
  );
}
