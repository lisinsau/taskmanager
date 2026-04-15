// Page d'accueil de TaskManager avec gestion d'état avancée, filtres, recherche, tri, et affichage de TaskList

"use client";

import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import AddTaskForm from "../components/AddTaskForm";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import Dashboard from "../components/Dashboard"; // Import du composant Dashboard
import UserMenu from "../components/UserMenu";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../contexts/AuthContext";
import {
  addTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
} from "../services/taskService";

// Map pour ordonner par priorité ascendante (haute < moyenne < basse)
const PRIORITY_ORDER = { "haute": 0, "moyenne": 1, "basse": 2 };

function getCreatedAtMs(createdAt) {
  if (!createdAt) {
    return 0;
  }

  if (typeof createdAt === "number") {
    return createdAt;
  }

  if (createdAt instanceof Date) {
    return createdAt.getTime();
  }

  if (typeof createdAt.toMillis === "function") {
    return createdAt.toMillis();
  }

  return 0;
}

export default function Home() {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State pour la recherche
  const [searchQuery, setSearchQuery] = useState("");
  // State pour le filtre ("toutes", "actives", "complétées")
  const [filter, setFilter] = useState("toutes");
  // State pour le tri ("priority" ou "date")
  const [sortOrder, setSortOrder] = useState("priority");

  // Handler pour basculer l'état 'completed' d'une tâche
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTasks(
      userId,
      (nextTasks) => {
        setTasks(nextTasks);
        setLoading(false);
      },
      () => {
        setError("Impossible de charger les tâches en temps réel.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleToggle = async (taskId) => {
    if (!userId) {
      return;
    }

    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask) {
      return;
    }

    setError(null);
    try {
      await updateTask(userId, taskId, { completed: !targetTask.completed });
    } catch (updateError) {
      setError(updateError.message || "Impossible de mettre à jour la tâche.");
    }
  };

  // Handler pour supprimer une tâche du tableau
  const handleDelete = async (taskId) => {
    if (!userId) {
      return;
    }

    setError(null);
    try {
      await deleteTask(userId, taskId);
    } catch (deleteError) {
      setError(deleteError.message || "Impossible de supprimer la tâche.");
    }
  };
  
  // Handler pour ajouter une tâche au tableau
  const handleAddTask = async (newTaskData) => {
    if (!userId) {
      return;
    }

    setError(null);
    try {
      await addTask(userId, newTaskData);
    } catch (addError) {
      setError(addError.message || "Impossible d'ajouter la tâche.");
    }
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
        const priorityA = PRIORITY_ORDER[a.priority] ?? Number.MAX_SAFE_INTEGER;
        const priorityB = PRIORITY_ORDER[b.priority] ?? Number.MAX_SAFE_INTEGER;
        return priorityA - priorityB;
      } else if (sortOrder === "date") {
        // Ordonner par date de création croissante (plus récent d'abord)
        return getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt);
      }
      return 0;
    });

  return (
    <AuthGuard>
      <main className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 px-8 max-md:px-4 dark:bg-black">
        <section className="flex flex-col w-full max-w-5xl items-center justify-center gap-8 dark:bg-zinc-900 px-8 max-md:px-0 py-16 rounded-2xl">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">TaskManager</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">Gérez vos tâches efficacement</p>

          {/* Tableau de bord au-dessus de la barre de recherche */}
          <Dashboard tasks={tasks} />

          {loading ? (
            <p className="text-sm font-medium text-zinc-600">Chargement...</p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="w-full rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

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
          
          <AddTaskForm onAddTask={handleAddTask} />

          {/* Affichage du composant TaskList avec les handlers et les tâches filtrées */}
          {!loading ? (
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ) : null}
          
        </section>
      </main>
    </AuthGuard>
  );
}
