import React from "react";
import TaskItem from "./TaskItem";

function TaskList ({ tasks, onToggle, onDelete }) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            task_alt
          </span>
          <h3 className="text-xl font-semibold tracking-tight text-on-surface">
            Active Tasks
          </h3>
        </div>
        <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
          {tasks.length} Pending
        </span>
      </div>
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-surface-container-low rounded-xl">
            <h3 className="text-xl font-semibold text-on-surface mb-2">
              Aucune tâche pour le moment
            </h3>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.completed}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TaskList;