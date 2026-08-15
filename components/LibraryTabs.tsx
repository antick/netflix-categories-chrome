export const LIBRARY_TABS = [
  "all",
  "favorites",
  "recent",
  "hidden",
  "empty",
] as const;

export type LibraryTab = (typeof LIBRARY_TABS)[number];

const LABELS: Record<LibraryTab, string> = {
  all: "All",
  favorites: "Fav",
  recent: "Recent",
  hidden: "Hidden",
  empty: "Empty",
};

const ARIA_LABELS: Record<LibraryTab, string> = {
  all: "All categories",
  favorites: "Favorites",
  recent: "Recent",
  hidden: "Hidden",
  empty: "Empty",
};

interface LibraryTabsProps {
  value: LibraryTab;
  onChange: (tab: LibraryTab) => void;
  counts?: Partial<Record<LibraryTab, number>>;
}

export function LibraryTabs({ value, onChange, counts }: LibraryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Category lists"
      className="mx-3 mt-3 flex gap-1 rounded-xl bg-[var(--color-panel)] p-1"
    >
      {LIBRARY_TABS.map((tab) => {
        const selected = value === tab;
        const count = tab === "all" ? undefined : counts?.[tab];
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-label={ARIA_LABELS[tab]}
            aria-selected={selected}
            onClick={() => onChange(tab)}
            className={`flex flex-1 items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-semibold tracking-wide uppercase focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none ${
              selected
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {LABELS[tab]}
            {typeof count === "number" ? (
              <span
                className={`tabular-nums ${selected ? "text-white/80" : ""}`}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
