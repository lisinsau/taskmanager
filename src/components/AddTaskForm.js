"use client";

import React, { useState } from "react";

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("moyenne");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask({
      title: trimmedTitle,
      priority,
    });

    setTitle("");
    setPriority("moyenne");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
      <label htmlFor="task-title" className="sr-only">
        Titre de la tâche
      </label>
      <input
        id="task-title"
        type="text"
        placeholder="Titre de la tâche"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-lg border px-4 py-2"
        required
      />
      <label htmlFor="task-priority" className="sr-only">
        Priorité de la tâche
      </label>
      <select
        id="task-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-lg border px-4 py-2"
      >
        <option value="haute">Haute</option>
        <option value="moyenne">Moyenne</option>
        <option value="basse">Basse</option>
      </select>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700"
      >
        Ajouter
      </button>
    </form>
  );
}