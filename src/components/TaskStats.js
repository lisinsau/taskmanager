import React from "react";

function TaskStats({ tasks }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((task) => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="space-y-4" aria-label="Statistiques des tâches">
      <div className="flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary"
          aria-hidden="true"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          analytics
        </span>
        <h3 className="text-xl font-semibold tracking-tight text-on-surface">
          Statistiques
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl bg-white p-4">
          <p className="text-sm text-on-surface-variant">Total</p>
          <p className="text-2xl font-bold text-on-surface">{totalTasks}</p>
        </article>

        <article className="rounded-xl bg-white p-4">
          <p className="text-sm text-on-surface-variant">Complétées</p>
          <p className="text-2xl font-bold text-on-surface">{completedTasks}</p>
        </article>

        <article className="rounded-xl bg-white p-4">
          <p className="text-sm text-on-surface-variant">Actives</p>
          <p className="text-2xl font-bold text-on-surface">{activeTasks}</p>
        </article>

        <article className="rounded-xl bg-white p-4">
          <p className="text-sm text-on-surface-variant">Progression</p>
          <p className="text-2xl font-bold text-on-surface">{progress}%</p>
        </article>
      </div>
    </section>
  );
}

export default TaskStats;
