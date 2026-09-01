export const NAV_TABS = [
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
