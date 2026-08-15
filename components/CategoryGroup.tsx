import { ChevronDown, ChevronRight } from "lucide-react";
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
      <div className="flex items-center">
        {children.length ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${category.name}`}
            onClick={() => setOpen((value) => !value)}
            className="rounded-md p-1 text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            {open ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}
        <div className="min-w-0 flex-1">
          <CategoryRow
            category={flat}
            isFavorite={favorites.has(category.id)}
            isHidden={hidden.has(category.id)}
            onOpen={onOpen}
            onFavorite={onFavorite}
            onHide={onHide}
          />
        </div>
      </div>
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
