import React from "react";

const PRIORITY_DATA = {
  haute: {
    label: "Haute",
    accentBar: "bg-red-500",
    badge: "bg-red-100 text-red-700 border border-red-200",
  },
  moyenne: {
    label: "Moyenne",
    accentBar: "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  basse: {
    label: "Basse",
    accentBar: "bg-green-300",
    badge: "bg-green-100 text-green-700 border border-green-300",
  },
};

function TaskItem({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
}) {
  
  const data = PRIORITY_DATA[priority] || PRIORITY_DATA.basse;

  return (
    <div
      className={`task-card group relative ${completed ? "bg-blue-50 dark:bg-zinc-800" : "bg-white dark:bg-zinc-800"} p-6 rounded-lg flex items-center gap-6 transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(19,27,46,0.08)]`}
    >
      <div
        className={`absolute left-0 top-1/4 bottom-1/4 w-1 ${data.accentBar} rounded-r-full`}
      ></div>

      <div className="relative flex items-center">
        <input
          aria-checked={completed}
          aria-label={completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
          className={`w-6 h-6 rounded-lg border-2 transition-all appearance-none
            cursor-pointer
            ${completed
              ? "border-blue-600 bg-blue-600"
              : "border-zinc-400 bg-white dark:bg-zinc-900"
            }
            focus:ring-2 focus:ring-blue-400`}
          type="checkbox"
          id={`task-${id}`}
          checked={!!completed}
          onChange={() => onToggle && onToggle(id)}
        />
        {completed && (
          <span className="material-symbols-outlined absolute text-white text-sm pointer-events-none top-1/2 -translate-y-1/2">
            check
          </span>
        )}
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <label
            className={`font-bold text-lg cursor-pointer ${
              completed
                ? "text-zinc-700 line-through"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
            htmlFor={`task-${id}`}
          >
            {title}
          </label>
          <span
            className={
              "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest " +
              data.badge
            }
          >
            {data.label}
          </span>
        </div>
        {description ? (
          <p
            className={`text-sm text-zinc-700 ${
              completed
                ? "line-through"
                : "dark:text-zinc-300"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-pointer max-h-fit aspect-square delete-btn opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-2 text-zinc-400 hover:text-red-600 hover:bg-red-100 max-md:opacity-100 dark:hover:bg-red-900/20 rounded-full"
          aria-label="Supprimer la tâche"
          onClick={() => onDelete && onDelete(id)}
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}

export default TaskItem;