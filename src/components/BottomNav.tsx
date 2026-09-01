"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS } from "./navTabs";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-emerald-100 bg-white/90 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {NAV_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                active ? "text-emerald-700" : "text-slate-400 hover:text-emerald-600"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  active ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm shadow-emerald-200" : ""
                }`}
              >
                {tab.icon(active)}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
