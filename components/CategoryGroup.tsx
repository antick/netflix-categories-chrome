import { useState } from "react";
import type { Category, FlatCategory, OpenCategoryFn } from "../lib/types";
import { CategoryRow } from "./CategoryRow";

interface CategoryGroupProps {
  category: Category;
  flatById: Map<string, FlatCategory>;
  favorites: Set<string>;
  hidden: Set<string>;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
}

export function CategoryGroup({
  category,
  flatById,
  favorites,
  hidden,
  onOpen,
  onFavorite,
  onHide,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(false);
  const flat = flatById.get(category.id);
  const children = category.children ?? [];

  if (!flat) return null;

  return (
    <section className="px-2">
      <CategoryRow
        category={flat}
        isFavorite={favorites.has(category.id)}
        isHidden={hidden.has(category.id)}
        expandable={children.length > 0}
        expanded={open}
        onToggleExpand={() => setOpen((value) => !value)}
        onOpen={onOpen}
        onFavorite={onFavorite}
        onHide={onHide}
      />
      {open && children.length ? (
        <div className="ml-4 border-l border-[var(--color-line)] pl-1">
          {children.map((child) =>
            child.children?.length ? (
              <CategoryGroup
                key={child.id}
                category={child}
                flatById={flatById}
                favorites={favorites}
                hidden={hidden}
                onOpen={onOpen}
                onFavorite={onFavorite}
                onHide={onHide}
              />
            ) : (
              <CategoryRow
                key={child.id}
                category={flatById.get(child.id)!}
                isFavorite={favorites.has(child.id)}
                isHidden={hidden.has(child.id)}
                onOpen={onOpen}
                onFavorite={onFavorite}
                onHide={onHide}
              />
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
