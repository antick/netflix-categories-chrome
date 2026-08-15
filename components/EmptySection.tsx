import { CircleOff } from "lucide-react";
import type { FlatCategory, OpenCategoryFn } from "../lib/types";
import { CategoryRow } from "./CategoryRow";
import { EmptyState } from "./EmptyState";

interface EmptySectionProps {
  items: FlatCategory[];
  favorites: Set<string>;
  hidden: Set<string>;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  onUnmarkEmpty: (id: string) => void;
  onClearEmpty: () => void;
  showTitle?: boolean;
}

export function EmptySection({
  items,
  favorites,
  hidden,
  onOpen,
  onFavorite,
  onHide,
  onUnmarkEmpty,
  onClearEmpty,
  showTitle = true,
}: EmptySectionProps) {
  return (
    <section className="px-2 pb-4">
      <div className="flex items-center justify-between px-2 pt-3 pb-1">
        {showTitle ? (
          <h2 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
            <CircleOff className="size-3.5" /> Empty ({items.length})
          </h2>
        ) : (
          <span />
        )}
        {items.length ? (
          <button
            type="button"
            onClick={onClearEmpty}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            Restore all
          </button>
        ) : null}
      </div>
      {items.length ? (
        items.map((category) => (
          <div key={category.id}>
            <CategoryRow
              category={category}
              isFavorite={favorites.has(category.id)}
              isHidden={hidden.has(category.id)}
              onOpen={onOpen}
              onFavorite={onFavorite}
              onHide={onHide}
            />
            <div className="flex justify-end px-2 pb-1">
              <button
                type="button"
                onClick={() => onUnmarkEmpty(category.id)}
                className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
              >
                Restore to list
              </button>
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          title="No empty categories yet"
          body="Open a genre that has no titles in your country and it moves here."
        />
      )}
    </section>
  );
}
