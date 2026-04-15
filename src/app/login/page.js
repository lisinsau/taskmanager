import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="flex w-full max-w-md flex-col items-center gap-6">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-zinc-900">TaskManager</h1>
          <p className="text-lg text-zinc-600">Gérez vos tâches efficacement</p>
        </header>
        <LoginForm />
      </section>
    </main>
  );
}
