import dataset from "../data/netflix-categories.json";
import type { Category, CategoryDataset, FlatCategory } from "./types";

const data = dataset as CategoryDataset;

function flatten(
  categories: Category[],
  parent?: Category,
  depth = 0,
): FlatCategory[] {
  const rows: FlatCategory[] = [];
  for (const category of categories) {
    rows.push({
      id: category.id,
      name: category.name,
      code: category.code,
      parentId: parent?.id,
      parentName: parent?.name,
      childIds: category.children?.map((child) => child.id) ?? [],
      depth,
    });
    if (category.children?.length) {
      rows.push(...flatten(category.children, category, depth + 1));
    }
  }
  return rows;
}

const allFlat = flatten(data.categories);
const byId = new Map(allFlat.map((item) => [item.id, item]));

export function getDataset(): CategoryDataset {
  return data;
}

export function getCategoryTree(): Category[] {
  return data.categories;
}

export function getAllCategories(): FlatCategory[] {
  return allFlat;
}

export function getCategoryById(id: string): FlatCategory | undefined {
  return byId.get(id);
}

export function getCategoryByCode(code: string): FlatCategory | undefined {
  return allFlat.find((item) => item.code === code);
}

export function getDescendantIds(id: string): string[] {
  const category = byId.get(id);
  if (!category) return [];
  const ids: string[] = [];
  const stack = [...category.childIds];
  while (stack.length) {
    const childId = stack.pop();
    if (!childId) continue;
    ids.push(childId);
    const child = byId.get(childId);
    if (child) stack.push(...child.childIds);
  }
  return ids;
}

export function isAncestorHidden(id: string, hidden: Set<string>): boolean {
  let current = byId.get(id);
  while (current?.parentId) {
    if (hidden.has(current.parentId)) return true;
    current = byId.get(current.parentId);
  }
  return false;
}

export function getVisibleCategories(hiddenIds: string[]): FlatCategory[] {
  const hidden = new Set(hiddenIds);
  return allFlat.filter(
    (item) => !hidden.has(item.id) && !isAncestorHidden(item.id, hidden),
  );
}

export function getHiddenCategories(hiddenIds: string[]): FlatCategory[] {
  return hiddenIds
    .map((id) => byId.get(id))
    .filter((item): item is FlatCategory => Boolean(item));
}

export function getFavoriteCategories(favoriteIds: string[]): FlatCategory[] {
  return favoriteIds
    .map((id) => byId.get(id))
    .filter((item): item is FlatCategory => Boolean(item));
}

export function getRecentCategories(recentIds: string[]): FlatCategory[] {
  return recentIds
    .map((id) => byId.get(id))
    .filter((item): item is FlatCategory => Boolean(item));
}

export function getVisibleTree(
  hiddenIds: string[],
  emptyIds: string[] = [],
): Category[] {
  const hidden = new Set(hiddenIds);
  const empty = new Set(emptyIds);

  const filterTree = (categories: Category[]): Category[] => {
    const visible: Category[] = [];
    for (const category of categories) {
      if (hidden.has(category.id)) continue;
      const children = category.children
        ? filterTree(category.children)
        : undefined;
      if (empty.has(category.id)) {
        if (children?.length) visible.push(...children);
        continue;
      }
      visible.push(children ? { ...category, children } : category);
    }
    return visible;
  };

  return filterTree(data.categories);
}
