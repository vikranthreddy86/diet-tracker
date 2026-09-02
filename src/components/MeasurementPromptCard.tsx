import Link from "next/link";
import { RulerIcon } from "./icons";

export default function MeasurementPromptCard() {
  return (
    <Link
      href="/progress"
      className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 hover:border-violet-200"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <RulerIcon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-slate-900">Sunday check-in</h2>
        <p className="text-xs text-slate-500">Time to log this week&apos;s body measurements.</p>
      </div>
      <span className="shrink-0 text-violet-400">→</span>
    </Link>
  );
}
