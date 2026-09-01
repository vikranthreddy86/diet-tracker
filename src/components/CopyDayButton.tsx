"use client";

import { useState } from "react";
import type { DailyTotals } from "@/lib/data/food";

type Entry = {
  servingMultiplier: number;
  food: { name: string; calories: number };
};

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function buildSummaryText(dateLabel: string, totals: DailyTotals, entries: Entry[]) {
  const lines = [
    dateLabel,
    "",
    `Calories: ${round(totals.calories)} kcal`,
    `Protein: ${round(totals.proteinG)} g`,
    `Carbs: ${round(totals.carbsG)} g`,
    `Fat: ${round(totals.fatG)} g`,
    `Fiber: ${round(totals.fiberG)} g`,
    `Sodium: ${Math.round(totals.sodiumMg)} mg`,
    `Calcium: ${Math.round(totals.calciumMg)} mg`,
    `Potassium: ${Math.round(totals.potassiumMg)} mg`,
    `Magnesium: ${Math.round(totals.magnesiumMg)} mg`,
  ];

  if (entries.length > 0) {
    lines.push("", "Food logged:");
    for (const e of entries) {
      const cal = Math.round(e.food.calories * e.servingMultiplier);
      const qty = e.servingMultiplier !== 1 ? ` × ${e.servingMultiplier}` : "";
      lines.push(`- ${e.food.name}${qty} — ${cal} kcal`);
    }
  }

  return lines.join("\n");
}

export default function CopyDayButton({
  dateLabel,
  totals,
  entries,
}: {
  dateLabel: string;
  totals: DailyTotals;
  entries: Entry[];
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildSummaryText(dateLabel, totals, entries);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/25"
    >
      {copied ? (
        "Copied!"
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
            <rect
              x="8"
              y="8"
              width="12"
              height="12"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
            <path
              d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
