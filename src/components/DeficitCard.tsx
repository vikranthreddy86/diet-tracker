import { WatchIcon, DumbbellIcon } from "./icons";

function recoveryColor(score: number) {
  if (score >= 67) return { text: "text-emerald-600", ring: "border-emerald-400" };
  if (score >= 34) return { text: "text-amber-500", ring: "border-amber-400" };
  return { text: "text-rose-500", ring: "border-rose-400" };
}

export default function DeficitCard({
  burned,
  consumed,
  recoveryScore,
  hrvMs,
  restingHeartRate,
  strain,
  sleepPerformancePct,
  sleepMinutes,
  workoutSummary,
}: {
  burned: number;
  consumed: number;
  recoveryScore?: number | null;
  hrvMs?: number | null;
  restingHeartRate?: number | null;
  strain?: number | null;
  sleepPerformancePct?: number | null;
  sleepMinutes?: number | null;
  workoutSummary?: string | null;
}) {
  const deficit = Math.round(burned - consumed);
  const isDeficit = deficit >= 0;
  const recovery = recoveryScore != null ? recoveryColor(recoveryScore) : null;

  return (
    <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-md shadow-stone-900/5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <WatchIcon className="h-4 w-4 text-emerald-800" /> Whoop today
        </h2>
        {strain != null && (
          <span className="text-xs text-slate-400">Strain {strain.toFixed(1)}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {recovery && (
          <div className={`rounded-xl border-2 ${recovery.ring} bg-white p-2.5 text-center`}>
            <div className={`text-lg font-bold ${recovery.text}`}>
              {Math.round(recoveryScore!)}%
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400">Recovery</div>
            {(hrvMs != null || restingHeartRate != null) && (
              <div className="mt-0.5 text-[10px] text-slate-400">
                {hrvMs != null && `HRV ${Math.round(hrvMs)}`}
                {hrvMs != null && restingHeartRate != null && " · "}
                {restingHeartRate != null && `RHR ${Math.round(restingHeartRate)}`}
              </div>
            )}
          </div>
        )}

        {sleepPerformancePct != null && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-2.5 text-center">
            <div className="text-lg font-bold text-indigo-600">
              {Math.round(sleepPerformancePct)}%
            </div>
            <div className="text-[10px] uppercase tracking-wide text-indigo-400">Sleep</div>
            {sleepMinutes != null && (
              <div className="mt-0.5 text-[10px] text-indigo-400">
                {Math.floor(sleepMinutes / 60)}h {Math.round(sleepMinutes % 60)}m
              </div>
            )}
          </div>
        )}

        <div
          className={`rounded-xl p-2.5 text-center text-white ${
            isDeficit ? "bg-gradient-to-br from-emerald-800 to-emerald-950" : "bg-gradient-to-br from-amber-500 to-orange-500"
          }`}
        >
          <div className="text-lg font-bold">{Math.abs(deficit)}</div>
          <div className="text-[10px] uppercase tracking-wide opacity-80">
            {isDeficit ? "Deficit" : "Surplus"}
          </div>
          <div className="mt-0.5 text-[10px] opacity-80">kcal</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Burned <span className="font-semibold text-slate-800">{Math.round(burned)}</span> kcal
        </span>
        <span>
          Consumed <span className="font-semibold text-slate-800">{Math.round(consumed)}</span>{" "}
          kcal
        </span>
      </div>

      {workoutSummary && (
        <p className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
          <DumbbellIcon className="h-3.5 w-3.5 text-slate-400" /> {workoutSummary}
        </p>
      )}
    </section>
  );
}
