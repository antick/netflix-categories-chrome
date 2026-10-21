import { EyeOff } from "lucide-react";
import type { FlatCategory, OpenCategoryFn } from "../lib/types";
import { CategoryRow } from "./CategoryRow";
import { EmptyState } from "./EmptyState";

interface HiddenSectionProps {
  items: FlatCategory[];
  favorites: Set<string>;
  hidden: Set<string>;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  onUnhide: (id: string) => void;
  onRestoreAll: () => void;
  showTitle?: boolean;
}

export function HiddenSection({
  items,
  favorites,
  hidden,
  onOpen,
  onFavorite,
  onHide,
  onUnhide,
  onRestoreAll,
  showTitle = true,
}: HiddenSectionProps) {
  return (
    <section className="px-2 pb-4">
      <div className="flex items-center justify-between px-2 pt-3 pb-1">
        {showTitle ? (
          <h2 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
            <EyeOff className="size-3.5" /> Hidden ({items.length})
          </h2>
        ) : (
          <span />
        )}
        {items.length ? (
          <button
            type="button"
            onClick={onRestoreAll}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            Restore all
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
            onUnhide={onUnhide}
          />
        ))
      ) : (
        <EmptyState
          title="Nothing hidden"
          body="Hide categories you do not want in the main list."
        />
      )}
    </section>
  );
}
