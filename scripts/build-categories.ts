#!/usr/bin/env bun
/**
 * One-shot parser for public Netflix category lists.
 * Reads The Streamable compiled table dump and emits data/netflix-categories.json
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SOURCE = process.argv[2];
if (!SOURCE) {
  throw new Error(
    "Usage: bun scripts/build-categories.ts <licensed-source-table.txt>",
  );
}
const OUT = join(import.meta.dir, "../data/netflix-categories.json");

type Category = {
  id: string;
  name: string;
  code: string;
  children?: Category[];
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseCode(raw: string): string | null {
  const match = raw.match(/(\d{2,})/);
  return match ? match[1] : null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

const SKIP_H2 = new Set([
  "how to use category codes",
  "get our streaming newsletter!",
]);

const SKIP_H3 = new Set([
  "movies starring…",
  "movies starring...",
  "movies directed by…",
  "movies directed by...",
  "directv stream cash back",
  "sling tv cash back",
  "hulu live tv cash back",
]);

const SKIP_NAME_PREFIXES = [
  "movies starring ",
  "movies directed by ",
  "movies on blu-ray",
  "movies on imax",
];

const TUDUM_FEATURED: Array<{ name: string; code: string }> = [
  { name: "90-Minute Movies", code: "81466194" },
  { name: "30-Minute Laughs", code: "81602050" },
  { name: "90-Minute Comedies", code: "81466224" },
  { name: "90-Minute Family Movies", code: "81466229" },
  { name: "90-Minute Horror", code: "81466239" },
  { name: "90-Minute Rom-Coms", code: "81466228" },
  { name: "90-Minute Thrillers", code: "81466222" },
  { name: "Binge-Worthy British Crime TV Shows", code: "1192582" },
  { name: "Chosen Family", code: "81231348" },
  { name: "Cyberpunk", code: "1964512" },
  { name: "Dystopian Futures", code: "2299461" },
  { name: "Don't Watch Hungry", code: "3272152" },
  { name: "Family Movie Night", code: "2013975" },
  { name: "Gal-Pal TV Shows", code: "1143288" },
  { name: "High Brow Horror", code: "3261672" },
  { name: "Irreverent TV Comedies", code: "75480" },
  { name: "K-Dramas for Beginners", code: "2953105" },
  { name: "Movies Directed by Women", code: "2974953" },
  { name: "Pop Culture Icons", code: "81278963" },
  { name: "Reluctant Adults", code: "3053870" },
  { name: "Relentless Crime Thrillers", code: "81226732" },
  { name: "Schemers & Scammers", code: "81493295" },
  { name: "Small Town Charm", code: "81615585" },
  { name: "Supernatural Soaps", code: "81238162" },
  { name: "Swipe Right", code: "81582488" },
  { name: "Take a Trip Around the World", code: "81282911" },
  { name: "Team Players", code: "2752022" },
  { name: "Totally Awesome '80s", code: "2314106" },
  { name: "Nostalgic '90s", code: "2691941" },
  { name: "Watch in One Weekend", code: "3182735" },
  { name: "Watch in One Night", code: "3178549" },
  { name: "Gentle British Reality TV", code: "81240711" },
  { name: "Witchcraft & the Dark Arts", code: "81552046" },
  { name: "Action with a Side of Romance", code: "81647318" },
  { name: "Like, Share, Follow", code: "82048914" },
  { name: "Swipe Left", code: "82011890" },
  { name: "Calling All Trainers!", code: "82032188" },
  { name: "Small Town Scares", code: "81496215" },
  { name: "Twisted Christmas", code: "2300975" },
  { name: "Human Connections", code: "81271205" },
  { name: "Short-Ass Movies", code: "81603903" },
  { name: "Six Degrees of Kevin Bacon", code: "81614959" },
  { name: "Spicy Romance", code: "81572628" },
  { name: "Lavish Reality Lifestyles", code: "81418611" },
];

const MAIN_GENRES: Array<{ name: string; code: string }> = [
  { name: "Action & Adventure", code: "1365" },
  { name: "Animation", code: "4698" },
  { name: "Anime", code: "7424" },
  { name: "Children & Family", code: "783" },
  { name: "Classic Movies", code: "31574" },
  { name: "Comedies", code: "6548" },
  { name: "Comic Book & Superhero", code: "10118" },
  { name: "Documentaries", code: "6839" },
  { name: "Dramas", code: "5763" },
  { name: "Horror", code: "8711" },
  { name: "Independent Movies", code: "7077" },
  { name: "Music", code: "1701" },
  { name: "Romantic Movies", code: "8883" },
  { name: "Sci-Fi & Fantasy", code: "1492" },
  { name: "Sports", code: "4370" },
  { name: "Thrillers", code: "8933" },
  { name: "TV Shows", code: "83" },
  { name: "Westerns", code: "7700" },
];

const GROUP_PARENT_CODES: Record<string, { name: string; code: string }> = {
  christmas: { name: "Christmas", code: "1474017" },
  halloween: { name: "Halloween", code: "108663" },
  australian: { name: "Australian", code: "5230" },
  british: { name: "British", code: "10757" },
  chinese: { name: "Chinese", code: "3960" },
  "eastern european": { name: "Eastern European", code: "5254" },
  filipino: { name: "Filipino", code: "6073" },
  foreign: { name: "International Movies", code: "78367" },
  french: { name: "French", code: "5875" },
  german: { name: "German", code: "5880" },
  indian: { name: "Indian", code: "10463" },
  italian: { name: "Italian", code: "8221" },
  japanese: { name: "Japanese", code: "10398" },
  korean: { name: "Korean", code: "5685" },
  "latin american": { name: "Latin American", code: "1613" },
  mexican: { name: "Mexican", code: "5982" },
  polish: { name: "Polish", code: "6299" },
  russian: { name: "Russian", code: "11567" },
  scandinavian: { name: "Scandinavian", code: "9292" },
  spanish: { name: "Spanish", code: "58741" },
  thai: { name: "Thai", code: "10784" },
  "more international": { name: "More International", code: "78367" },
  "african-american": { name: "African-American", code: "4906" },
  "exercise & health": { name: "Exercise & Fitness", code: "3327" },
  "lgbtq+": { name: "LGBTQ+", code: "5977" },
  music: { name: "Music", code: "1701" },
  musicals: { name: "Musicals", code: "13335" },
  religion: { name: "Faith & Spirituality", code: "26835" },
  sports: { name: "Sports", code: "4370" },
  crime: { name: "Crime", code: "5824" },
  "stand-up comedy": { name: "Stand-Up Comedy", code: "11559" },
  teen: { name: "Teen", code: "60951" },
  war: { name: "Military & War", code: "4006" },
  tv: { name: "TV Shows", code: "83" },
};

function shouldSkipName(name: string): boolean {
  const lower = name.toLowerCase();
  return SKIP_NAME_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base || "category";
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function parseTables(
  text: string,
): Map<string, Array<{ name: string; code: string }>> {
  const groups = new Map<string, Array<{ name: string; code: string }>>();
  let h2 = "";
  let h3 = "";

  const lines = text.split(/\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      h2 = decodeHtml(line.slice(3)).toLowerCase();
      h3 = "";
      continue;
    }
    if (line.startsWith("### ")) {
      h3 = decodeHtml(line.slice(4)).toLowerCase();
      continue;
    }
    if (SKIP_H2.has(h2) || SKIP_H3.has(h3)) continue;
    if (line.includes("Genre|Code")) continue;
    if (!line.includes("|")) continue;
    if (line.startsWith("[") || line.startsWith("!") || line.startsWith("http"))
      continue;

    const cells = line
      .split("|")
      .map((part) => decodeHtml(part))
      .filter(Boolean);
    if (cells.length < 2) continue;
    const name = cells[0];
    const codeRaw = cells[cells.length - 1];
    if (!name || name.toLowerCase() === "genre") continue;
    if (shouldSkipName(name)) continue;
    const code = parseCode(codeRaw);
    if (!code) continue;

    const key = h3 || h2 || "misc";
    const list = groups.get(key) ?? [];
    list.push({ name, code });
    groups.set(key, list);
  }
  return groups;
}

function main() {
  const text = readFileSync(SOURCE, "utf8");
  const groups = parseTables(text);

  const usedIds = new Set<string>();
  const usedCodes = new Set<string>();
  const categories: Category[] = [];

  const featuredChildren: Category[] = [];
  for (const item of TUDUM_FEATURED) {
    if (usedCodes.has(item.code)) continue;
    usedCodes.add(item.code);
    featuredChildren.push({
      id: uniqueId(slugify(item.name), usedIds),
      name: item.name,
      code: item.code,
    });
  }
  categories.push({
    id: uniqueId("featured-collections", usedIds),
    name: "Featured Collections",
    code: "1592210",
    children: featuredChildren,
  });

  const mainByCode = new Map(MAIN_GENRES.map((g) => [g.code, g]));
  for (const genre of MAIN_GENRES) {
    if (usedCodes.has(genre.code) && genre.code !== "1592210") {
      // still allow as parent
    }
    usedCodes.add(genre.code);
    categories.push({
      id: uniqueId(slugify(genre.name), usedIds),
      name: genre.name,
      code: genre.code,
      children: [],
    });
  }

  const parentBySlug = new Map(categories.map((c) => [c.id, c]));

  const attachTo = (parentId: string, name: string, code: string) => {
    if (usedCodes.has(code)) return;
    usedCodes.add(code);
    const parent = parentBySlug.get(parentId);
    if (!parent) return;
    parent.children ??= [];
    parent.children.push({
      id: uniqueId(slugify(name), usedIds),
      name,
      code,
    });
  };

  const keywordParents: Array<{ test: RegExp; parentId: string }> = [
    { test: /anime/i, parentId: "anime" },
    {
      test: /action|adventure|martial arts|superhero|spy /i,
      parentId: "action-and-adventure",
    },
    {
      test: /horror|scary|slasher|vampire|zombie|werewolf|scream/i,
      parentId: "horror",
    },
    {
      test: /comed(y|ies)|stand-up|goofy|slapstick|satire|irreverent/i,
      parentId: "comedies",
    },
    { test: /documentar/i, parentId: "documentaries" },
    { test: /drama/i, parentId: "dramas" },
    { test: /romantic|romance|rom-com/i, parentId: "romantic-movies" },
    {
      test: /sci-fi|science fiction|fantasy|cyberpunk|dystopian/i,
      parentId: "sci-fi-and-fantasy",
    },
    {
      test: /sport|baseball|basketball|football|soccer|boxing/i,
      parentId: "sports",
    },
    { test: /thriller|suspense/i, parentId: "thrillers" },
    { test: /classic/i, parentId: "classic-movies" },
    { test: /children|family|kids|for ages/i, parentId: "children-and-family" },
    { test: /western/i, parentId: "westerns" },
    { test: /animation|cartoon/i, parentId: "animation" },
    { test: /\btv\b|series|reality|miniseries/i, parentId: "tv-shows" },
    { test: /music|musical|concert/i, parentId: "music" },
    { test: /independent|indie /i, parentId: "independent-movies" },
    { test: /comic book|superhero/i, parentId: "comic-book-and-superhero" },
  ];

  const international = {
    id: uniqueId("international", usedIds),
    name: "International",
    code: "78367",
    children: [] as Category[],
  };
  usedCodes.add("78367");
  parentBySlug.set(international.id, international);

  const seasonal = {
    id: uniqueId("seasonal", usedIds),
    name: "Seasonal",
    code: "107985",
    children: [] as Category[],
  };
  usedCodes.add("107985");
  parentBySlug.set(seasonal.id, seasonal);

  const niche = {
    id: uniqueId("niche-collections", usedIds),
    name: "Niche Collections",
    code: "1096",
    children: [] as Category[],
  };
  usedCodes.add("1096");
  parentBySlug.set(niche.id, niche);

  const internationalKeys = new Set([
    "australian",
    "british",
    "chinese",
    "eastern european",
    "filipino",
    "foreign",
    "french",
    "german",
    "indian",
    "italian",
    "japanese",
    "korean",
    "latin american",
    "mexican",
    "polish",
    "russian",
    "scandinavian",
    "spanish",
    "thai",
    "more international",
  ]);

  for (const [key, rows] of groups) {
    if (key === "netflix main genre categories") {
      for (const row of rows) {
        if (!mainByCode.has(row.code) && !usedCodes.has(row.code)) {
          usedCodes.add(row.code);
          categories.push({
            id: uniqueId(slugify(row.name), usedIds),
            name: row.name,
            code: row.code,
          });
        }
      }
      continue;
    }

    if (key === "christmas" || key === "halloween") {
      for (const row of rows) attachTo(seasonal.id, row.name, row.code);
      continue;
    }

    if (internationalKeys.has(key)) {
      const meta = GROUP_PARENT_CODES[key];
      const countryId = uniqueId(slugify(meta?.name ?? key), usedIds);
      const country: Category = {
        id: countryId,
        name: meta?.name ?? key,
        code: "",
        children: [],
      };
      const preferred = meta?.code ?? rows[0]?.code;
      country.code =
        preferred && !usedCodes.has(preferred)
          ? preferred
          : (rows.find((row) => !usedCodes.has(row.code))?.code ?? "");
      if (!country.code) continue;
      usedCodes.add(country.code);
      for (const row of rows) {
        if (usedCodes.has(row.code) || row.code === country.code) continue;
        usedCodes.add(row.code);
        country.children?.push({
          id: uniqueId(slugify(row.name), usedIds),
          name: row.name,
          code: row.code,
        });
      }
      if ((country.children?.length ?? 0) > 0) {
        international.children.push(country);
      }
      continue;
    }

    for (const row of rows) {
      const match = keywordParents.find(
        (rule) => rule.test.test(row.name) || rule.test.test(key),
      );
      if (match) {
        attachTo(match.parentId, row.name, row.code);
      } else {
        attachTo(niche.id, row.name, row.code);
      }
    }
  }

  if (seasonal.children.length) categories.push(seasonal);
  if (international.children.length) categories.push(international);
  if (niche.children.length) categories.push(niche);

  for (const cat of categories) {
    if (cat.children && cat.children.length === 0) delete cat.children;
  }

  const payload = {
    schemaVersion: 1,
    updatedAt: "2026-08-15",
    categories,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  const childCount = categories.reduce(
    (sum, c) =>
      sum +
      (c.children?.length ?? 0) +
      (c.children?.reduce((s, ch) => s + (ch.children?.length ?? 0), 0) ?? 0),
    0,
  );
  console.log(
    `Wrote ${categories.length} top-level groups, ~${childCount} nested, ${usedCodes.size} unique codes -> ${OUT}`,
  );
}

main();
