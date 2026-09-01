import Link from "next/link";

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

export default function RangePicker({ days }: { days: number }) {
  return (
    <div className="flex gap-1.5">
      {RANGES.map((r) => (
        <Link
          key={r.days}
          href={`/trends?days=${r.days}`}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            days === r.days
              ? "bg-white text-emerald-700 shadow-sm"
              : "bg-white/15 text-white hover:bg-white/25"
          }`}
        >
          {r.label}
        </Link>
      ))}
    </div>
  );
}
