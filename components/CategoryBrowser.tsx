import { useMemo, useState } from "react";
import {
  getAllCategories,
  getCategoryById,
  getVisibleTree,
} from "../lib/categories";
import { searchCategories } from "../lib/category-search";
import { openNetflixCategory } from "../lib/navigation";
import type {
  ExtensionPreferences,
  FlatCategory,
  OpenCategoryFn,
} from "../lib/types";
import { CategoryList } from "./CategoryList";
import { CategoryRow } from "./CategoryRow";
import { EmptySection } from "./EmptySection";
import { EmptyState } from "./EmptyState";
import { FavoritesSection } from "./FavoritesSection";
import { HiddenSection } from "./HiddenSection";
import { type LibraryTab, LibraryTabs } from "./LibraryTabs";
import { RecentSection } from "./RecentSection";
import { SearchInput } from "./SearchInput";

interface CategoryBrowserProps {
  prefs: ExtensionPreferences;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  onUnhide: (id: string) => void;
  onRestoreHidden: () => void;
  onUnmarkEmpty: (id: string) => void;
  onClearEmpty: () => void;
  onClearRecent: () => void;
  onOpened: (id: string) => void;
  compact?: boolean;
}

export function CategoryBrowser({
  prefs,
  onFavorite,
  onHide,
  onUnhide,
  onRestoreHidden,
  onUnmarkEmpty,
  onClearEmpty,
  onClearRecent,
  onOpened,
  compact = false,
}: CategoryBrowserProps) {
  const [query, setQuery] = useState("");
  const [includeHidden, setIncludeHidden] = useState(false);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<LibraryTab>("all");

  const flatById = useMemo(
    () => new Map(getAllCategories().map((item) => [item.id, item])),
    [],
  );
  const favorites = useMemo(() => new Set(prefs.favorites), [prefs.favorites]);
  const hidden = useMemo(
    () => new Set(prefs.hiddenCategories),
    [prefs.hiddenCategories],
  );
  const empty = useMemo(
    () => new Set(prefs.emptyCategories),
    [prefs.emptyCategories],
  );
  const visibleTree = useMemo(
    () => getVisibleTree(prefs.hiddenCategories, prefs.emptyCategories),
    [prefs.hiddenCategories, prefs.emptyCategories],
  );

  const favoriteItems = useMemo(
    () =>
      prefs.favorites
        .map((id) => flatById.get(id))
        .filter((item): item is FlatCategory => Boolean(item))
        .filter((item) => !empty.has(item.id)),
    [flatById, prefs.favorites, empty],
  );
  const recentItems = useMemo(
    () =>
      prefs.recentCategories
        .map((id) => flatById.get(id))
        .filter((item): item is FlatCategory => Boolean(item))
        .filter((item) => !empty.has(item.id)),
    [flatById, prefs.recentCategories, empty],
  );
  const hiddenItems = useMemo(
    () =>
      prefs.hiddenCategories
        .map((id) => flatById.get(id))
        .filter((item): item is FlatCategory => Boolean(item))
        .filter((item) => !empty.has(item.id)),
    [flatById, prefs.hiddenCategories, empty],
  );
  const emptyItems = useMemo(
    () =>
      prefs.emptyCategories
        .map((id) => flatById.get(id))
        .filter((item): item is FlatCategory => Boolean(item)),
    [flatById, prefs.emptyCategories],
  );

  const results = useMemo(
    () =>
      searchCategories(query, {
        includeHidden: includeHidden || tab === "hidden" || tab === "empty",
        hiddenIds: prefs.hiddenCategories,
        emptyIds: prefs.emptyCategories,
        includeEmpty: tab === "empty",
        emptyOnly: tab === "empty",
      }),
    [query, includeHidden, tab, prefs.hiddenCategories, prefs.emptyCategories],
  );

  const open: OpenCategoryFn = async (id, behavior) => {
    const category = getCategoryById(id);
    if (!category) return;
    await openNetflixCategory(category.code, behavior);
    await onOpened(id);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      if (event.key === "Escape") setQuery("");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = results[selected] ?? results[0];
      if (hit) void open(hit.category.id, "reuse-current-tab");
    } else if (event.key === "Escape") {
      event.preventDefault();
      setQuery("");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <LibraryTabs
        value={tab}
        onChange={setTab}
        counts={{
          favorites: favoriteItems.length,
          recent: recentItems.length,
          hidden: hiddenItems.length,
          empty: emptyItems.length,
        }}
      />
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          setSelected(0);
        }}
        onKeyDown={onSearchKeyDown}
      />
      <label className="mt-2 flex items-center gap-2 px-4 text-xs text-[var(--color-muted)]">
        <input
          type="checkbox"
          checked={includeHidden}
          onChange={(event) => setIncludeHidden(event.target.checked)}
          className="accent-[var(--color-accent)]"
        />
        Include hidden
      </label>
      {compact ? null : (
        <p className="mt-1 px-4 text-[11px] leading-4 text-[var(--color-muted)]">
          Empty Netflix pages are regional. Opening one moves it to Empty.
          Restore it if titles show up later.
        </p>
      )}
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        {query.trim() ? (
          results.length ? (
            results.map((hit, index) => (
              <div key={hit.category.id} className="px-2">
                <CategoryRow
                  category={hit.category}
                  isFavorite={favorites.has(hit.category.id)}
                  isHidden={hidden.has(hit.category.id)}
                  selected={index === selected}
                  onOpen={open}
                  onFavorite={onFavorite}
                  onHide={onHide}
                  onUnhide={onUnhide}
                />
              </div>
            ))
          ) : (
            <EmptyState
              title="No matches"
              body="Try a category name or numeric genre code."
            />
          )
        ) : tab === "favorites" ? (
          <FavoritesSection
            items={favoriteItems}
            favorites={favorites}
            hidden={hidden}
            onOpen={open}
            onFavorite={onFavorite}
            onHide={onHide}
            showTitle={false}
          />
        ) : tab === "recent" ? (
          <RecentSection
            items={recentItems}
            favorites={favorites}
            hidden={hidden}
            onOpen={open}
            onFavorite={onFavorite}
            onHide={onHide}
            onClear={onClearRecent}
            showTitle={false}
          />
        ) : tab === "hidden" ? (
          <HiddenSection
            items={hiddenItems}
            favorites={favorites}
            hidden={hidden}
            onOpen={open}
            onFavorite={onFavorite}
            onHide={onHide}
            onUnhide={onUnhide}
            onRestoreAll={onRestoreHidden}
            showTitle={false}
          />
        ) : tab === "empty" ? (
          <EmptySection
            items={emptyItems}
            favorites={favorites}
            hidden={hidden}
            onOpen={open}
            onFavorite={onFavorite}
            onHide={onHide}
            onUnmarkEmpty={onUnmarkEmpty}
            onClearEmpty={onClearEmpty}
            showTitle={false}
          />
        ) : (
          <section className="px-2">
            <CategoryList
              tree={visibleTree}
              flatById={flatById}
              favorites={favorites}
              hidden={hidden}
              onOpen={open}
              onFavorite={onFavorite}
              onHide={onHide}
            />
          </section>
        )}
      </div>
    </div>
  );
}
