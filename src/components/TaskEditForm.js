import React, { useState } from "react";

const PRIORITY_OPTIONS = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "basse", label: "Basse" },
];

function TaskEditForm({ title, priority, onSave, onCancel }) {
  const [editedTitle, setEditedTitle] = useState(title || "");
  const [editedPriority, setEditedPriority] = useState(priority || "moyenne");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = editedTitle.trim();
    
    // Vérifier si au moins un champ a été modifié
    if (!trimmedTitle) {
      return;
    }

    // Vérifier s'il y a des changements
    const hasChanges =
      trimmedTitle !== (title || "") || editedPriority !== (priority || "");

    if (hasChanges) {
      onSave({
        title: trimmedTitle,
        priority: editedPriority,
      });
    } else {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4"
    >
      <div className="space-y-2">
        <label htmlFor="task-title" className="block text-sm font-semibold text-zinc-900">
          Titre de la tâche
        </label>
        <input
          id="task-title"
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Entrez le titre de la tâche"
          maxLength="150"
          className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="task-priority" className="block text-sm font-semibold text-zinc-900">
          Priorité
        </label>
        <select
          id="task-priority"
          value={editedPriority}
          onChange={(e) => setEditedPriority(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Sauvegarder
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default TaskEditForm;
