export const NAV_TABS = [
  {
    href: "/",
    label: "Today",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 3l8 6v10a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1V9l8-6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "/foods",
    label: "Foods",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 6h16M4 12h16M4 18h10"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 18l5-6 4 3 7-9"
          stroke="currentColor"
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
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M5 19V10M11 19V5M17 19v-6"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];
