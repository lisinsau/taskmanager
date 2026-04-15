"use client";

import { useState } from "react";

export default function CreateListForm({ onCreateList }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Le nom de la liste est obligatoire.");
      return;
    }

    setLoading(true);
    try {
      await onCreateList?.(trimmedName);
      setName("");
    } catch (createError) {
      setError(createError?.message || "Impossible de créer la liste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:flex-row">
      <label htmlFor="list-name" className="sr-only">
        Nom de la liste
      </label>
      <input
        id="list-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nom de la liste"
        className="flex-1 rounded-lg border border-zinc-300 px-4 py-2"
        aria-invalid={Boolean(error)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Création..." : "Créer"}
      </button>

      {error ? (
        <p role="alert" className="w-full text-sm text-red-600 sm:basis-full">
          {error}
        </p>
      ) : null}
    </form>
  );
}
