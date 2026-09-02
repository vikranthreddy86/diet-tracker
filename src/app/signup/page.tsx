import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { LeafIcon } from "@/components/icons";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-white p-8 shadow-2xl shadow-black/40">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-md">
            <LeafIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Start tracking today.</p>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <form action={signUp} className="space-y-4">
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
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-950 px-3 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-900"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-800 hover:text-emerald-900">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
