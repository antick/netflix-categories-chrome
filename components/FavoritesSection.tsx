import { Star } from "lucide-react";
import type { FlatCategory, OpenCategoryFn } from "../lib/types";
import { CategoryRow } from "./CategoryRow";
import { EmptyState } from "./EmptyState";

interface FavoritesSectionProps {
  items: FlatCategory[];
  favorites: Set<string>;
  hidden: Set<string>;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  showTitle?: boolean;
}

export function FavoritesSection({
  items,
  favorites,
  hidden,
  onOpen,
  onFavorite,
  onHide,
  showTitle = true,
}: FavoritesSectionProps) {
  return (
    <section className="px-2">
      {showTitle ? (
        <h2 className="flex items-center gap-2 px-2 pt-3 pb-1 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
          <Star className="size-3.5" /> Favorites
        </h2>
      ) : null}
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
          title="No favorites yet"
          body="Star a category to pin it here."
        />
      )}
    </section>
  );
}
