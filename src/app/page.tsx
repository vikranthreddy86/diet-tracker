import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Today</h1>
        <form action={signOut}>
          <button type="submit" className="text-sm text-neutral-500 underline">
            Sign out
          </button>
        </form>
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        Signed in as <span className="font-medium text-neutral-900">{user?.email}</span>.
        <p className="mt-2">
          Auth and the database are wired up. Food logging, the daily summary cards, and
          history come next.
        </p>
      </div>
    </div>
  );
}
