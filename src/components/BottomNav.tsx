"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Today",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 3l8 6v10a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1V9l8-6z"
          className={active ? "fill-white" : "fill-none stroke-emerald-600"}
          strokeWidth={active ? 0 : 1.8}
        />
      </svg>
    ),
  },
  {
    href: "/foods",
    label: "Foods",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 6h16M4 12h16M4 18h10"
          className={active ? "stroke-white" : "stroke-emerald-600"}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 18l5-6 4 3 7-9"
          className={active ? "stroke-white" : "stroke-emerald-600"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/trends",
    label: "Trends",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M5 19V10M11 19V5M17 19v-6"
          className={active ? "stroke-white" : "stroke-emerald-600"}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {TABS.map((tab) => {
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
