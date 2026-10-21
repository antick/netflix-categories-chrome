import { site } from "../lib/site";

const paths = ["", "/codes", "/privacy"];

export function GET() {
  const urls = paths
    .map((path) => `<url><loc>${site.url}${path}</loc></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
