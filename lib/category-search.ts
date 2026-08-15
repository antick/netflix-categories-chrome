import {
  getAllCategories,
  getCategoryById,
  isAncestorHidden,
} from "./categories";
import type { SearchHit } from "./types";

export interface SearchOptions {
  includeHidden?: boolean;
  hiddenIds?: string[];
  limit?: number;
}

export function searchCategories(
  query: string,
  options: SearchOptions = {},
): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const needle = trimmed.toLowerCase();
  const hidden = new Set(options.hiddenIds ?? []);
  const includeHidden = options.includeHidden ?? false;
  const limit = options.limit ?? 50;
  const results: SearchHit[] = [];

  for (const category of getAllCategories()) {
    const explicitlyHidden = hidden.has(category.id);
    const ancestorHidden = isAncestorHidden(category.id, hidden);
    if (!includeHidden && (explicitlyHidden || ancestorHidden)) continue;

    let reason: SearchHit["reason"] | null = null;
    if (category.code.includes(needle.replace(/\s/g, ""))) reason = "code";
    else if (category.name.toLowerCase().includes(needle)) reason = "name";
    else if (category.parentName?.toLowerCase().includes(needle))
      reason = "parent";

    if (!reason) continue;
    results.push({ category, reason });
    if (results.length >= limit) break;
  }

  return results;
}

export function getParentContext(id: string): string | undefined {
  return getCategoryById(id)?.parentName;
}
