"use client";

import React, { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskItem from "./TaskItem";
import TaskStats from "./TaskStats";
function MemberChip({ member, isOwner, canRemove, onRemove }) {
  const memberId = typeof member === "string" ? member : member?.id;
  const memberLabel =
    typeof member === "string" ? member : member?.email || member?.id || "Membre";

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <span className="text-sm text-zinc-800">
        {memberLabel}
        {isOwner ? (
          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            Propriétaire
          </span>
        ) : null}
      </span>

      {canRemove ? (
        <button
          type="button"
          onClick={() => onRemove(memberId)}
          className="rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label={`Retirer ${memberLabel}`}
        >
          Retirer
        </button>
      ) : null}
    </li>
  );
}

export default function SharedListView({
  list,
  tasks,
  currentUserId,
  members,
  onAddMember,
  onRemoveMember,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
}) {
  const [email, setEmail] = useState("");

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeMembers = Array.isArray(members)
    ? members
    : Array.isArray(list?.members)
      ? list.members
      : [];
  const isOwner = list?.ownerId === currentUserId;

  const handleAddMember = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return;
    }

    onAddMember?.(trimmedEmail);
    setEmail("");
  };

  return (
    <section className="w-full space-y-6" aria-label="Détails de la liste partagée">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-zinc-900">{list?.name || "Liste partagée"}</h2>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Retour
        </button>
      </header>
      <article className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <TaskStats tasks={tasks} /></article>
      <article className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            group
          </span>
          <h3 className="text-xl font-semibold tracking-tight text-on-surface">
            Membres
          </h3>
        </div>

        <ul className="space-y-2" aria-label="Liste des membres">
          {safeMembers.length === 0 ? (
            <li className="rounded-lg bg-white px-3 py-2 text-sm text-zinc-600">
              Aucun membre pour le moment.
            </li>
          ) : (
            safeMembers.map((member) => {
              const memberId = typeof member === "string" ? member : member?.id;
              return (
                <MemberChip
                  key={memberId || String(member)}
                  member={member}
                  isOwner={memberId === list?.ownerId}
                  canRemove={isOwner && memberId !== list?.ownerId}
                  onRemove={onRemoveMember}
                />
              );
            })
          )}
        </ul>

        <form onSubmit={handleAddMember} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="member-email" className="sr-only">
            Adresse e-mail du membre à ajouter
          </label>
          <input
            id="member-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@exemple.com"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Ajouter un membre
          </button>
        </form>
      </article>

      <article className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            folder_shared
          </span>
          <h3 className="text-xl font-semibold tracking-tight text-on-surface">
            Tâches partagées
          </h3>
        </div>

        <AddTaskForm onAddTask={onAddTask} />

        <div className="space-y-3" aria-label="Liste des tâches partagées">
          {safeTasks.length === 0 ? (
            <p className="rounded-lg bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-600">
              Aucune tâche partagée pour le moment.
            </p>
          ) : (
            safeTasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                priority={task.priority}
                completed={task.completed}
                metaText={`Ajoutée par : ${
                  task.addedByEmail || task.addedBy || "Utilisateur inconnu"
                }`}
                onToggle={() =>
                  onUpdateTask?.(task.id, { completed: !Boolean(task.completed) })
                }
                onEdit={(_, edits) => onUpdateTask?.(task.id, edits)}
                onDelete={() => onDeleteTask?.(task.id)}
              />
            ))
          )}
        </div>
      </article>
    </section>
  );
}
