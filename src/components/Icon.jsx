const paths = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  chart: <path d="M3 3v18h18M8 16v-4M13 16V8M18 16v-7" />,
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18M16 15h2M6 6l9-3v3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  edit: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM14 6l4 4" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 5 5 10-10" />,
  alert: <path d="M12 3 22 20H2L12 3ZM12 10v4M12 17h.01" />,
  undo: <path d="m9 14-5-5 5-5M4 9h10a6 6 0 0 1 0 12h-3" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  food: <path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M17 3c-2 2-3 5-3 8h3v10" />,
  transport: (
    <>
      <rect x="4" y="4" width="16" height="13" rx="3" />
      <path d="M4 11h16M8 17v3M16 17v3M8 14h.01M16 14h.01" />
    </>
  ),
  home: <path d="m3 11 9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  bag: <path d="M5 8h14l-1 13H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2" />,
  heart: <path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" />,
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  banknote: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  dots: <path d="M6 12h.01M12 12h.01M18 12h.01" strokeWidth="3" />,
  bank: <path d="m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />,
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
  savings: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default Icon;
