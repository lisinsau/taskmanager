"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const { user, loading: authLoading, signIn, signInWithGoogle, error: authError } =
    useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      router.push("/");
    } catch (error) {
      setLocalError(
        error?.message || "Impossible de se connecter pour le moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      setLocalError(
        error?.message || "Impossible de se connecter avec Google."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      {hasError ? (
        <p
          id="login-form-error"
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-sm font-medium text-zinc-800">
            Adresse e-mail
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-invalid={hasError}
            aria-describedby={hasError ? "login-form-error" : undefined}
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-zinc-800"
          >
            Mot de passe
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Entrez votre mot de passe"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-invalid={hasError}
            aria-describedby={hasError ? "login-form-error" : undefined}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Se connecter avec Google
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600">
        Pas encore de compte ?{" "}
        <Link
          href="/signup"
          prefetch={false}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          S&apos;inscrire
        </Link>
      </p>
    </section>
  );
}
