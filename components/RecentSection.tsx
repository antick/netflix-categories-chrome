import { History } from "lucide-react";
import type { FlatCategory, OpenCategoryFn } from "../lib/types";
import { CategoryRow } from "./CategoryRow";
import { EmptyState } from "./EmptyState";

interface RecentSectionProps {
  items: FlatCategory[];
  favorites: Set<string>;
  hidden: Set<string>;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  onClear: () => void;
  showTitle?: boolean;
}

export function RecentSection({
  items,
  favorites,
  hidden,
  onOpen,
  onFavorite,
  onHide,
  onClear,
  showTitle = true,
}: RecentSectionProps) {
  return (
    <section className="px-2">
      <div className="flex items-center justify-between px-2 pt-3 pb-1">
        {showTitle ? (
          <h2 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
            <History className="size-3.5" /> Recent
          </h2>
        ) : (
          <span />
        )}
        {items.length ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            Clear
          </button>
        ) : null}
      </div>
      {items.length ? (
        items.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            isFavorite={favorites.has(category.id)}
            isHidden={hidden.has(category.id)}
            onOpen={onOpen}
            onFavorite={onFavorite}
            onHide={onHide}
          />
        ))
      ) : (
        <EmptyState
          title="No recent categories"
          body="Categories you open with this extension appear here."
        />
      )}
    </section>
  );
}
