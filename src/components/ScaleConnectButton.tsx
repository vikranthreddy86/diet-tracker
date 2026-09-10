"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { connectScale, isWebBluetoothSupported, type ScaleStatus } from "@/lib/bleScale";
import { logWeight } from "@/lib/actions/progress";
import { updateBodyProfile } from "@/lib/actions/settings";
import { inputClass } from "@/lib/ui";
import { BluetoothIcon } from "./icons";

const STATUS_LABEL: Record<ScaleStatus["phase"], string> = {
  requesting: "Choose your scale from the Bluetooth list…",
  connecting: "Connecting…",
  waiting: "Connected. Step on the scale…",
  "step-on": "Step on the scale…",
  measuring: "Reading weight…",
  done: "Captured!",
  error: "Error",
};

export default function ScaleConnectButton({
  date,
  heightCm,
  ageYears,
}: {
  date: string;
  heightCm: number | null;
  ageYears: number | null;
}) {
  const [status, setStatus] = useState<ScaleStatus | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!isWebBluetoothSupported()) return null;

  if (!heightCm || !ageYears) {
    return (
      <form action={updateBodyProfile} className="flex flex-wrap items-end gap-2 rounded-xl border border-sky-100 bg-sky-50 p-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Height (cm)</label>
          <input name="heightCm" type="number" min="100" max="220" required className={inputClass} />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Age</label>
          <input name="ageYears" type="number" min="1" max="120" required className={inputClass} />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-sky-700 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-800"
        >
          Save
        </button>
        <p className="basis-full text-[11px] text-slate-400">
          One-time setup so your Dr. Trust scale knows who&apos;s stepping on it.
        </p>
      </form>
    );
  }

  const busy = pending || (status !== null && status.phase !== "done" && status.phase !== "error");

  const handleConnect = () => {
    setStatus({ phase: "requesting" });
    connectScale({ heightCm, ageYears }, setStatus)
      .then((weightKg) => {
        const fd = new FormData();
        fd.set("date", date);
        fd.set("weightKg", weightKg.toFixed(1));
        startTransition(async () => {
          await logWeight(fd);
          router.refresh();
        });
      })
      .catch(() => {
        // status already carries the error message via onStatus
      });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleConnect}
        disabled={busy}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
      >
        <BluetoothIcon className="h-3.5 w-3.5" />
        Connect Dr. Trust scale
      </button>
      {status && (
        <p className={`text-[11px] ${status.phase === "error" ? "text-rose-500" : "text-slate-400"}`}>
          {status.phase === "measuring"
            ? `Reading… ${status.weightKg.toFixed(1)} kg`
            : status.phase === "done"
              ? `Logged ${status.weightKg.toFixed(1)} kg`
              : status.phase === "error"
                ? status.message
                : STATUS_LABEL[status.phase]}
        </p>
      )}
    </div>
  );
}
