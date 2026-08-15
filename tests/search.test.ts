import { describe, expect, test } from "bun:test";
import { getAllCategories } from "../lib/categories";
import { searchCategories } from "../lib/category-search";

describe("search", () => {
  const sample =
    getAllCategories().find((item) => item.parentName) ??
    getAllCategories()[0]!;

  test("matches names case-insensitively", () => {
    const hits = searchCategories(sample.name.slice(0, 4).toUpperCase());
    expect(hits.some((hit) => hit.category.id === sample.id)).toBe(true);
  });

  test("matches codes", () => {
    const hits = searchCategories(sample.code);
    expect(hits[0]?.category.code).toBe(sample.code);
  });

  test("trims queries and returns nothing for blank", () => {
    expect(searchCategories("   ")).toEqual([]);
  });

  test("excludes hidden categories by default", () => {
    const hits = searchCategories(sample.name, { hiddenIds: [sample.id] });
    expect(hits.some((hit) => hit.category.id === sample.id)).toBe(false);
  });

  test("includeHidden returns hidden matches", () => {
    const hits = searchCategories(sample.name, {
      hiddenIds: [sample.id],
      includeHidden: true,
    });
    expect(hits.some((hit) => hit.category.id === sample.id)).toBe(true);
  });

  test("excludes empty categories unless includeEmpty is on", () => {
    const hits = searchCategories(sample.name, { emptyIds: [sample.id] });
    expect(hits.some((hit) => hit.category.id === sample.id)).toBe(false);
    const included = searchCategories(sample.name, {
      emptyIds: [sample.id],
      includeEmpty: true,
    });
    expect(included.some((hit) => hit.category.id === sample.id)).toBe(true);
  });

  test("emptyOnly restricts results to marked empty ids", () => {
    const other =
      getAllCategories().find((item) => item.id !== sample.id) ?? sample;
    const hits = searchCategories(sample.name, {
      emptyIds: [other.id],
      includeEmpty: true,
      emptyOnly: true,
    });
    expect(hits.some((hit) => hit.category.id === sample.id)).toBe(false);
  });

  test("child results include parent context", () => {
    const child = getAllCategories().find((item) => item.parentName);
    if (!child) return;
    const hits = searchCategories(child.name);
    const hit = hits.find((item) => item.category.id === child.id);
    expect(hit?.category.parentName).toBe(child.parentName);
  });
});
