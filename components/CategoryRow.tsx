import {
  AppWindow,
  ChevronDown,
  ChevronRight,
  Copy,
  EyeOff,
  MoreHorizontal,
  SquareArrowOutUpRight,
  Star,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { getNetflixCategoryUrl } from "../lib/netflix-url";
import type { FlatCategory, OpenCategoryFn } from "../lib/types";

interface CategoryRowProps {
  category: FlatCategory;
  isFavorite: boolean;
  isHidden: boolean;
  selected?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  onUnhide?: (id: string) => void;
}

export function CategoryRow({
  category,
  isFavorite,
  isHidden,
  selected = false,
  expandable = false,
  expanded = false,
  onToggleExpand,
  onOpen,
  onFavorite,
  onHide,
  onUnhide,
}: CategoryRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setMenuOpen(false);
  };

  const identity = (
    <>
      {expandable ? (
        expanded ? (
          <ChevronDown className="size-4 shrink-0 text-[var(--color-muted)]" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-[var(--color-muted)]" />
        )
      ) : (
        <span className="w-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans text-sm font-medium text-[var(--color-text)]">
          {category.name}
        </span>
        <span className="flex items-center gap-2 font-sans text-xs text-[var(--color-muted)]">
          <span className="font-mono tabular-nums">{category.code}</span>
          {category.parentName ? (
            <span className="truncate">{category.parentName}</span>
          ) : null}
          {isHidden ? (
            <span className="rounded bg-[var(--color-line)] px-1.5 py-0.5 text-[10px] tracking-wide uppercase">
              Hidden
            </span>
          ) : null}
        </span>
      </span>
    </>
  );

  return (
    <div
      className={`group flex items-center gap-0.5 rounded-lg px-1 py-1.5 ${selected ? "bg-[var(--color-panel)]" : "hover:bg-[var(--color-panel)]"}`}
    >
      {expandable ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name}`}
          title={expanded ? "Collapse" : "Expand"}
          onClick={onToggleExpand}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 text-left focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
        >
          {identity}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1">
          {identity}
        </div>
      )}
      <button
        type="button"
        aria-label={`Open ${category.name} in this tab`}
        title="Open in this tab"
        onClick={() => onOpen(category.id, "reuse-current-tab")}
        className="rounded-md p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
      >
        <AppWindow className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`Open ${category.name} in a new tab`}
        title="Open in a new tab"
        onClick={() => onOpen(category.id, "new-tab")}
        className="rounded-md p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
      >
        <SquareArrowOutUpRight className="size-4" />
      </button>
      <button
        type="button"
        aria-label={
          isFavorite
            ? `Remove ${category.name} from favorites`
            : `Favorite ${category.name}`
        }
        title={isFavorite ? "Remove favorite" : "Favorite"}
        onClick={() => onFavorite(category.id)}
        className="rounded-md p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
      >
        <Star
          className={`size-4 ${isFavorite ? "fill-current text-[var(--color-accent-soft)]" : ""}`}
        />
      </button>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label={`More actions for ${category.name}`}
          title="More"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
        >
          <MoreHorizontal className="size-4" />
        </button>
        {menuOpen ? (
          <div
            id={menuId}
            role="menu"
            className="absolute top-8 right-0 z-20 min-w-40 rounded-lg border border-[var(--color-line)] bg-[var(--color-ink-soft)] py-1 shadow-xl"
          >
            {isHidden && onUnhide ? (
              <MenuItem
                onClick={() => {
                  onUnhide(category.id);
                  setMenuOpen(false);
                }}
              >
                Unhide
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  onHide(category.id);
                  setMenuOpen(false);
                }}
              >
                <EyeOff className="size-3.5" /> Hide
              </MenuItem>
            )}
            <MenuItem onClick={() => copy(category.code)}>
              <Copy className="size-3.5" /> Copy code
            </MenuItem>
            <MenuItem
              onClick={() => copy(getNetflixCategoryUrl(category.code))}
            >
              <Copy className="size-3.5" /> Copy URL
            </MenuItem>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-left font-sans text-sm text-[var(--color-text)] hover:bg-[var(--color-panel)]"
    >
      {children}
    </button>
  );
}
