import { syncWhoopNow, disconnectWhoop } from "@/lib/actions/whoop";
import TrendChart from "./TrendChart";
import { WatchIcon } from "./icons";

type Connection = { connectedAt: Date; lastSyncedAt: Date | null } | null;
type EnergyPoint = { date: string; caloriesBurned: number };

function timeAgo(date: Date) {
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function WhoopSection({
  connection,
  energy,
  notice,
}: {
  connection: Connection;
  energy: EnergyPoint[];
  notice?: { type: "connected" | "error"; message?: string };
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-md shadow-stone-900/5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <WatchIcon className="h-4 w-4 text-emerald-800" /> Whoop
        </h2>
        {connection && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
            Connected
          </span>
        )}
      </div>

      {notice?.type === "connected" && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Whoop connected and synced.
        </p>
      )}
      {notice?.type === "error" && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Couldn&apos;t connect Whoop ({notice.message ?? "unknown error"}). Try again.
        </p>
      )}

      {!connection ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">
            Connect your Whoop account to pull daily calories burned directly via the Whoop API —
            no file uploads needed. Used to show your calorie deficit each day.
          </p>
          <a
            href="/api/whoop/connect"
            className="inline-block rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900"
          >
            Connect Whoop
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Last synced{" "}
            {connection.lastSyncedAt ? timeAgo(connection.lastSyncedAt) : "never"}
          </p>

          <TrendChart
            data={energy.map((e) => ({ date: e.date, value: Math.round(e.caloriesBurned) }))}
            unit="kcal"
            color="#f97316"
          />

          <div className="flex gap-2">
            <form action={syncWhoopNow}>
              <button
                type="submit"
                className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
              >
                Sync now
              </button>
            </form>
            <form action={disconnectWhoop}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-500"
              >
                Disconnect
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
