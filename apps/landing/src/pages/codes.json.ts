import { searchEntries, updatedAt } from "../lib/categories";

export function GET() {
  return new Response(
    JSON.stringify({ updatedAt, categories: searchEntries() }),
    { headers: { "Content-Type": "application/json" } },
  );
}
