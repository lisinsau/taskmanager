// Page d'accueil de TaskManager avec gestion d'état avancée, filtres, recherche, tri, et affichage de TaskList

"use client";

import React, { useState } from "react";
import TaskList from "../components/TaskList";
import AddTaskForm from "../components/AddTaskForm";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

// Données de test pour les tâches initiales
const initialTasks = [
  {
    id: 1,
    title: "Préparer la réunion",
    description: "Créer l'ordre du jour et partager avec l'équipe.",
    priority: "haute",
    completed: false,
    createdAt: new Date(2023, 9, 10, 8, 30).getTime(),
  },
  {
    id: 2,
    title: "Acheter des fournitures",
    description: "Cartouches d'encre pour l'imprimante.",
    priority: "moyenne",
    completed: false,
    createdAt: new Date(2023, 9, 9, 15, 0).getTime(),
  },
  {
    id: 3,
    title: "Lire la documentation",
    description: "Parcourir la doc Next.js & Tailwind.",
    priority: "basse",
    completed: true,
    createdAt: new Date(2023, 9, 8, 10, 0).getTime(),
  },
];

// Map pour ordonner par priorité ascendante (haute < moyenne < basse)
const PRIORITY_ORDER = { "haute": 0, "moyenne": 1, "basse": 2 };

// Fonction utilitaire pour créer une tâche avec une date de création
function createTask({ title, priority }) {
  return {
    id: crypto.randomUUID(),
    title,
    description: "",
    priority,
    completed: false,
    createdAt: Date.now(),
  };
}

export default function Home() {
  // State local des tâches
  const [tasks, setTasks] = useState(initialTasks);

  // State pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  // State pour le filtre ("toutes", "actives", "complétées")
  const [filter, setFilter] = useState("toutes");
  // State pour le tri ("priority" ou "date")
  const [sortOrder, setSortOrder] = useState("priority");

  // Handler pour basculer l'état 'completed' d'une tâche
  const handleToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handler pour supprimer une tâche du tableau
  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };
  
  // Handler pour ajouter une tâche au tableau
  const handleAddTask = (newTaskData) => {
    const newTask = createTask(newTaskData);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // Handler pour changer la recherche
  const handleSearchChange = (query) => setSearchQuery(query);

  // Handler pour filtrer (toutes/actives/complétées)
  const handleFilterChange = (value) => setFilter(value);

  // Handler pour changer le tri
  const handleSortChange = (e) => setSortOrder(e.target.value);

  // Filtrage des tâches selon la recherche, le filtre et le tri
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    .filter((task) => {
      if (filter === "actives") return !task.completed;
      if (filter === "complétées") return task.completed;
      return true; // "toutes"
    })
    .sort((a, b) => {
      if (sortOrder === "priority") {
        // Ordonner par priorité ascendante ("haute" < "moyenne" < "basse")
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      } else if (sortOrder === "date") {
        // Ordonner par date de création croissante (plus récent d'abord)
        return b.createdAt - a.createdAt;
      }
      return 0;
    });

  return (
    <main className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 px-8 dark:bg-black">
      <section className="flex flex-col w-full max-w-5xl items-center justify-center gap-8 dark:bg-zinc-900 px-8 py-16 rounded-2xl">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">TaskManager</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">Gérez vos tâches efficacement</p>
        <AddTaskForm onAddTask={handleAddTask} />

        {/* Barre de recherche, de filtre et tri - au dessus de la liste */}
        <div className="flex flex-col md:flex-row w-full items-center gap-4 mt-2">
          <div className="w-full md:w-2/4">
            {/* Barre de recherche */}
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center justify-end">
            {/* Barre de filtre */}
            <FilterBar currentFilter={filter} onFilterChange={handleFilterChange} />

            {/* Sélecteur de tri */}
            <label htmlFor="sort-order" className="sr-only">
              Trier par
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={handleSortChange}
              className="rounded-lg border px-4 py-2"
              aria-label="Trier les tâches"
            >
              <option value="priority">Priorité</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
        
        {/* Affichage du composant TaskList avec les handlers et les tâches filtrées */}
        <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />

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
