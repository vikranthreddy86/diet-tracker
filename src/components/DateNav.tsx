"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DateNav({
  date,
  prevDate,
  nextDate,
  isToday,
  todayDate,
}: {
  date: string;
  prevDate: string;
  nextDate: string;
  isToday: boolean;
  todayDate: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        href={`/?date=${prevDate}`}
        aria-label="Previous day"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={date}
          max={todayDate}
          onChange={(e) => {
            if (e.target.value) router.push(`/?date=${e.target.value}`);
          }}
          className="rounded-full border border-white/30 bg-white/10 px-2 py-1 text-xs font-medium text-white [color-scheme:dark]"
        />
        {!isToday && (
          <Link
            href="/"
            className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/30"
          >
            Today
          </Link>
        )}
      </div>

      {isToday ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-white/30">
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <Link
          href={`/?date=${nextDate}`}
          aria-label="Next day"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
