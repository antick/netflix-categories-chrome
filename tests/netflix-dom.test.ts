import { describe, expect, test } from "bun:test";
import { parseHTML } from "linkedom";
import {
  findNetflixNavigationAnchor,
  hasCurrentHeaderControl,
  hasInjectedButton,
  hideForeignCategoryLabels,
  isNavLabel,
  normalizeLabel,
  placeCategoriesButton,
  removeInjectedHeaderUi,
  shouldMountOnPath,
} from "../lib/netflix-dom";

function parse(html: string): Document {
  return parseHTML(`<!DOCTYPE html><html><body>${html}</body></html>`).document;
}

describe("netflix DOM adapter", () => {
  test("normalizes labels and matches current Netflix nav copy", () => {
    expect(normalizeLabel("  New\u00a0& Popular ")).toBe("new & popular");
    expect(isNavLabel("Shows")).toBe(true);
    expect(isNavLabel("Browse by Languages")).toBe(true);
    expect(isNavLabel("Kids")).toBe(false);
  });

  test("skips player and account paths", () => {
    expect(shouldMountOnPath("/browse")).toBe(true);
    expect(shouldMountOnPath("/watch/123")).toBe(false);
    expect(shouldMountOnPath("/login")).toBe(false);
  });

  test("finds the 2026 header cluster beside the logo when links are not exposed", () => {
    const doc = parse(`
      <div class="header-row">
        <a aria-label="Netflix" href="https://www.netflix.com/"><svg></svg></a>
        <div class="nav-cluster">Home Shows Movies Games New & Popular My List Browse by Languages</div>
        <button>Search</button>
      </div>
    `);
    const nav = findNetflixNavigationAnchor(doc, "/browse");
    expect(nav?.className).toBe("nav-cluster");

    const item = doc.createElement("div");
    item.setAttribute("data-nc-categories-button", "true");
    item.textContent = "Categories";
    placeCategoriesButton(nav as HTMLElement, item);

    const row = doc.querySelector(".header-row");
    const labels = [...(row?.children ?? [])].map(
      (el) =>
        el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 20),
    );
    expect(labels).toEqual([
      "Netflix",
      "Home Shows Movies Ga",
      "Categories",
      "Search",
    ]);
  });

  test("places Categories before Search even when the nav cluster has no light-DOM text", () => {
    const doc = parse(`
      <div class="header-row">
        <a aria-label="Netflix" href="https://www.netflix.com/"><svg></svg></a>
        <div class="nav-cluster"></div>
        <button aria-label="Search">Search</button>
      </div>
    `);
    const nav = findNetflixNavigationAnchor(doc, "/browse");
    expect(nav?.className).toBe("nav-cluster");

    const item = doc.createElement("div");
    item.setAttribute("data-nc-categories-button", "true");
    item.textContent = "Categories";
    placeCategoriesButton(nav as HTMLElement, item);

    const row = [...(doc.querySelector(".header-row")?.children ?? [])].map(
      (el) => el.getAttribute("aria-label") || el.textContent?.trim(),
    );
    expect(row).toEqual(["Netflix", "", "Categories", "Search"]);
  });

  test("places Categories before a nested Search control", () => {
    const doc = parse(`
      <div class="header">
        <div class="left">
          <a aria-label="Netflix" href="https://www.netflix.com/"><svg></svg></a>
          <div class="nav-cluster">Home Shows Movies</div>
        </div>
        <div class="right">
          <button>Search</button>
        </div>
      </div>
    `);
    const nav = findNetflixNavigationAnchor(doc, "/browse");
    const item = doc.createElement("div");
    item.setAttribute("data-nc-categories-button", "true");
    item.textContent = "Categories";
    placeCategoriesButton(nav as HTMLElement, item);
    const right = [...(doc.querySelector(".right")?.children ?? [])].map((el) =>
      el.textContent?.trim(),
    );
    expect(right).toEqual(["Categories", "Search"]);
  });

  test("ignores a generic empty header nav", () => {
    const doc = parse(`
      <header><nav aria-label="hidden"></nav></header>
      <footer><a href="/browse">Home</a></footer>
    `);
    expect(findNetflixNavigationAnchor(doc, "/browse")).toBeNull();
  });

  test("detects an already injected button", () => {
    const doc = parse(`<div data-nc-categories-button="true">Categories</div>`);
    expect(hasInjectedButton(doc)).toBe(true);
  });

  test("does not treat the overlay host as the header button", () => {
    const doc = parse(`<netflix-categories-menu></netflix-categories-menu>`);
    expect(hasInjectedButton(doc)).toBe(false);
  });

  test("removes a stale Categories control and overlay host", () => {
    const doc = parse(`
      <div data-nc-categories-button="true">Categories</div>
      <netflix-categories-menu></netflix-categories-menu>
    `);
    removeInjectedHeaderUi(doc);
    expect(hasInjectedButton(doc)).toBe(false);
    expect(doc.querySelector("netflix-categories-menu")).toBeNull();
  });

  test("hides a foreign Categories label without touching our control", () => {
    const doc = parse(`
      <div class="header-row">
        <span>Categories</span>
        <div data-nc-categories-button="true"><button>Hidden Categories</button></div>
        <button>Search</button>
      </div>
    `);
    hideForeignCategoryLabels(doc);
    const foreign = doc.querySelector("[data-nc-foreign-categories]");
    expect(foreign?.textContent?.trim()).toBe("Categories");
    expect((foreign as HTMLElement).style.display).toBe("none");
    expect(hasCurrentHeaderControl(doc)).toBe(true);
  });
});
