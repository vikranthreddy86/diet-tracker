"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "./navTabs";
import { signOut } from "@/lib/actions/auth";
import { LeafIcon } from "./icons";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-stone-200 bg-white px-3 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950 text-white shadow-sm">
          <LeafIcon className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold text-slate-900">Diet Tracker</span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-900"
                  : "text-slate-500 hover:bg-stone-50 hover:text-slate-900"
              }`}
            >
              {tab.icon()}
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-500"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
