import { type Category, dataset } from "@netflix-categories/data";

export type { Category };

// [name, code, group name], kept compact because it ships as /codes.json.
export type SearchEntry = [name: string, code: string, group: string];

export const groups = dataset.categories;
export const updatedAt = dataset.updatedAt;

function count(categories: Category[]): number {
  return categories.reduce(
    (total, category) => total + 1 + count(category.children ?? []),
    0,
  );
}

export const totalCategories = count(groups);

export function countInGroup(group: Category): number {
  return count([group]);
}

export function searchEntries(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const visit = (category: Category, group: string) => {
    entries.push([category.name, category.code, group]);
    for (const child of category.children ?? []) visit(child, group);
  };
  for (const group of groups) visit(group, group.name);
  return entries;
}

export function netflixUrl(code: string): string {
  return `https://www.netflix.com/browse/genre/${code}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

// Hand-picked rows for the hero board. Codes are checked against the dataset
// at build time so a data update can never show a stale code.
const boardNames = [
  "Campy Zombie Movies",
  "Witchcraft & the Dark Arts",
  "Feel-good Spy Movies",
  "Mind-bending Action & Adventure",
  "90-Minute Horror",
  "Quirky Adventures",
  "Cyberpunk",
  "Goofy Zombie Movies",
  "Pop Culture Icons",
  "Steamy Action & Adventure",
];

export function boardRows(): { name: string; code: string }[] {
  const byName = new Map(searchEntries().map(([name, code]) => [name, code]));
  return boardNames.map((name) => {
    const code = byName.get(name);
    if (!code)
      throw new Error(`Hero board genre is not in the dataset: ${name}`);
    return { name, code };
  });
}
