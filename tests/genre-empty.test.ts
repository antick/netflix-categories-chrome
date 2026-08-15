import { describe, expect, test } from "bun:test";
import { parseHTML } from "linkedom";
import {
  classifyGenrePage,
  extractGenreCodeFromPath,
} from "../lib/genre-empty";

function parse(html: string): Document {
  return parseHTML(`<!DOCTYPE html><html><body>${html}</body></html>`).document;
}

describe("genre empty detection", () => {
  test("extracts genre codes from browse paths", () => {
    expect(extractGenreCodeFromPath("/browse/genre/1365")).toBe("1365");
    expect(extractGenreCodeFromPath("/browse")).toBeNull();
    expect(extractGenreCodeFromPath("/watch/123")).toBeNull();
  });

  test("treats no-titles copy as empty", () => {
    const doc = parse("<main><p>No matching titles found.</p></main>");
    expect(classifyGenrePage(doc, "/browse/genre/9999")).toBe("empty");
  });

  test("treats titles as ready even if empty copy is leftover", () => {
    const doc = parse(
      '<main><p>No titles found</p><a href="/watch/810">Show</a></main>',
    );
    expect(classifyGenrePage(doc, "/browse/genre/1365")).toBe("ready");
  });

  test("waits while a genre page is still loading", () => {
    const doc = parse("<main><p>Loading</p></main>");
    expect(classifyGenrePage(doc, "/browse/genre/1365")).toBe("loading");
  });

  test("does not classify non-genre pages", () => {
    const doc = parse("<main><p>No titles found</p></main>");
    expect(classifyGenrePage(doc, "/browse")).toBe("loading");
  });
});
