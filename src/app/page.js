// Page d'accueil de TaskManager avec gestion d'état, affichage de TaskList et handlers

"use client";

import React, { useState } from "react";
import TaskList from "../components/TaskList";

// Données de test pour les tâches initiales
const initialTasks = [
  {
    id: 1,
    title: "Préparer la réunion",
    description: "Créer l'ordre du jour et partager avec l'équipe.",
    priority: "haute",
    completed: false,
  },
  {
    id: 2,
    title: "Acheter des fournitures",
    description: "Cartouches d'encre pour l'imprimante.",
    priority: "moyenne",
    completed: false,
  },
  {
    id: 3,
    title: "Lire la documentation",
    description: "Parcourir la doc Next.js & Tailwind.",
    priority: "basse",
    completed: true,
  },
];

export default function Home() {
  // State local des tâches
  const [tasks, setTasks] = useState(initialTasks);

  // Handler pour basculer l'état 'completed' d'une tâche
  const handleToggle = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handler pour supprimer une tâche du tableau
  const handleDelete = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <main className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 px-8 dark:bg-black">
      <section className="flex flex-col w-full max-w-5xl items-center justify-center gap-8 dark:bg-zinc-900 px-8 py-16 rounded-2xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">TaskManager</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">Gérez vos tâches efficacement</p>
        {/* Affichage du composant TaskList avec les handlers et tasks */}
        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        <button
          className="mt-4 px-8 py-3 rounded-full bg-blue-600 text-white text-base font-semibold text-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Commencer avec TaskManager"
        >
          Commencer
        </button>
      </section>
    </main>
  );
}
