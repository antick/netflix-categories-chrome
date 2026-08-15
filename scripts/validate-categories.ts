import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Category, CategoryDataset } from "../lib/types";

const CODE_PATTERN = /^\d{2,}$/;
const ROOT = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(ROOT, "../data/netflix-categories.json");

function fail(message: string): never {
  console.error(`Category validation failed: ${message}`);
  process.exit(1);
}

function walk(
  categories: Category[],
  visit: (category: Category, parent?: Category) => void,
  parent?: Category,
) {
  for (const category of categories) {
    visit(category, parent);
    if (category.children) walk(category.children, visit, category);
  }
}

function isCategory(value: unknown): value is Category {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.code === "string"
  );
}

const raw = readFileSync(DATA_PATH, "utf8");
let data: CategoryDataset;
try {
  data = JSON.parse(raw) as CategoryDataset;
} catch {
  fail("netflix-categories.json is not valid JSON");
}

if (data.schemaVersion !== 1)
  fail(`unsupported schemaVersion: ${String(data.schemaVersion)}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt ?? ""))
  fail("updatedAt must be YYYY-MM-DD");
if (!Array.isArray(data.categories) || data.categories.length === 0)
  fail("categories must be a non-empty array");

const ids = new Set<string>();
const codes = new Set<string>();
const records = new Set<string>();
let count = 0;

walk(data.categories, (category, parent) => {
  count += 1;
  if (!isCategory(category)) fail("invalid category object shape");
  if (!category.id.trim()) fail("empty id");
  if (!category.name.trim()) fail("empty name");
  if (!category.code.trim()) fail(`empty code for ${category.id}`);
  if (!CODE_PATTERN.test(category.code))
    fail(`malformed code "${category.code}" on ${category.id}`);
  if (ids.has(category.id)) fail(`duplicate id: ${category.id}`);
  ids.add(category.id);
  if (codes.has(category.code))
    fail(`duplicate code: ${category.code} (${category.id})`);
  codes.add(category.code);

  const recordKey = `${category.name.toLowerCase()}::${category.code}`;
  if (records.has(recordKey))
    fail(`duplicate category record: ${category.name} (${category.code})`);
  records.add(recordKey);

  if (category.children !== undefined) {
    if (!Array.isArray(category.children))
      fail(`invalid children array on ${category.id}`);
    const childIds = new Set<string>();
    for (const child of category.children) {
      if (!isCategory(child)) fail(`invalid child of ${category.id}`);
      if (childIds.has(child.id))
        fail(`duplicate child ${child.id} under ${category.id}`);
      childIds.add(child.id);
    }
  }

  if (parent && category.id === parent.id)
    fail(`category ${category.id} nested under itself`);
});

if (count < 100) fail(`dataset is too small to ship (${count} categories)`);

console.log(
  `Validated ${count} categories across ${data.categories.length} top-level groups.`,
);
