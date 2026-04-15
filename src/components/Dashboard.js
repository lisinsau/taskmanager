import React from "react";
import TaskStats from "./TaskStats";
import ProgressBar from "./ProgressBar";

function Dashboard({ tasks }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((task) => task.completed).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="w-full space-y-6" aria-label="Tableau de bord">
      <header className="flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary"
          aria-hidden="true"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          dashboard
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface">
          Tableau de bord
        </h2>
      </header>

      {totalTasks === 0 ? (
        <article className="rounded-xl bg-surface-container-low p-6 text-center">
          <p className="text-on-surface-variant">
            Aucune tâche disponible pour le moment. Ajoutez une tâche pour voir vos statistiques.
          </p>
        </article>
      ) : null}

      <TaskStats tasks={safeTasks} />

      <article className="rounded-xl bg-surface-container-low">
        <ProgressBar percentage={progress} label="Progression globale" />
      </article>
    </section>
  );
}

export default Dashboard;
