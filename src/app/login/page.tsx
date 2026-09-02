import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { LeafIcon } from "@/components/icons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-white p-8 shadow-2xl shadow-black/40">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-md">
            <LeafIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Track your food, weight, and progress.</p>
        </div>

        {message && (
          <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">{message}</p>
        )}
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <form action={signIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-950 px-3 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-900"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-800 hover:text-emerald-900">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
