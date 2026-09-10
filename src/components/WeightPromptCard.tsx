import { logWeight } from "@/lib/actions/progress";
import { inputClass } from "@/lib/ui";
import { ScaleIcon } from "./icons";
import ScaleConnectButton from "./ScaleConnectButton";

export default function WeightPromptCard({
  date,
  heightCm,
  ageYears,
  sex,
}: {
  date: string;
  heightCm: number | null;
  ageYears: number | null;
  sex: string | null;
}) {
  return (
    <section className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <ScaleIcon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Log today&apos;s weight</h2>
          <p className="text-xs text-slate-500">Best done first thing in the morning.</p>
        </div>
      </div>
      <form action={logWeight} className="mt-3 flex items-center gap-2">
        <input type="hidden" name="date" value={date} />
        <input
          name="weightKg"
          type="number"
          step="0.1"
          min="1"
          placeholder="kg"
          required
          autoFocus
          className={`${inputClass} bg-white`}
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Log
        </button>
      </form>
      <div className="mt-3">
        <ScaleConnectButton date={date} heightCm={heightCm} ageYears={ageYears} sex={sex} />
      </div>
    </section>
  );
}
