"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SignupForm() {
  const { user, loading: authLoading, signUp, error: authError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const errorMessage = localError || authError;
  const hasError = Boolean(errorMessage);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password);
      router.push("/");
    } catch (error) {
      setLocalError(
        error?.message || "Impossible de créer le compte pour le moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      {hasError ? (
        <p
          id="signup-form-error"
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-email"
            className="text-sm font-medium text-zinc-800"
          >
            Adresse e-mail
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-invalid={hasError}
            aria-describedby={hasError ? "signup-form-error" : undefined}
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password"
            className="text-sm font-medium text-zinc-800"
          >
            Mot de passe
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Créez un mot de passe"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-invalid={hasError}
            aria-describedby={hasError ? "signup-form-error" : undefined}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-confirm-password"
            className="text-sm font-medium text-zinc-800"
          >
            Confirmation du mot de passe
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirmez votre mot de passe"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-invalid={hasError}
            aria-describedby={hasError ? "signup-form-error" : undefined}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          prefetch={false}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </section>
  );
}
