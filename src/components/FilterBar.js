"use client";

import React from "react";

const FILTERS = [
  { key: "toutes", label: "Toutes" },
  { key: "actives", label: "Actives" },
  { key: "complétées", label: "Complétées" },
];

function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filtres des tâches"
    >
      {FILTERS.map((filter) => {
        const isActive = currentFilter === filter.key;

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onFilterChange(filter.key)}
            aria-pressed={isActive}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isActive
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
