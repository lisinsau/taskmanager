"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);

    try {
      await signOut();
      router.push("/login");
    } catch (signOutError) {
      setError(
        signOutError?.message || "Impossible de vous déconnecter pour le moment."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="w-full rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-700">
          Connecté(e) :{" "}
          <span className="font-semibold text-zinc-900">{user.email}</span>
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Déconnexion..." : "Se déconnecter"}
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
