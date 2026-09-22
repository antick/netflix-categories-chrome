import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PAGE_INTEGRATION_ENABLED } from "../lib/release";

const output = join(import.meta.dir, "../.output/chrome-mv3");
const manifest = JSON.parse(
  await readFile(join(output, "manifest.json"), "utf8"),
);
assert.equal(
  PAGE_INTEGRATION_ENABLED,
  false,
  "Store releases must exclude page integration",
);
assert.equal(manifest.manifest_version, 3);
assert.deepEqual(manifest.permissions, ["storage"]);
for (const key of [
  "host_permissions",
  "optional_permissions",
  "optional_host_permissions",
  "content_scripts",
  "background",
  "web_accessible_resources",
  "externally_connectable",
]) {
  assert.equal(
    manifest[key],
    undefined,
    `Unexpected release capability: ${key}`,
  );
}
const files = await readdir(output, { recursive: true });
assert(
  !files.some((file) =>
    /content-scripts|background\.js|\.map$|(^|\/)\.env|\.pem$|\.key$/.test(
      file,
    ),
  ),
  "Unexpected file in release",
);
const license = await readFile(join(output, "LICENSE.txt"), "utf8");
assert.equal(
  license,
  await readFile(join(import.meta.dir, "../LICENSE"), "utf8"),
);
const notices = await readFile(join(output, "THIRD_PARTY_NOTICES.txt"), "utf8");
for (const name of [
  "react",
  "react-dom",
  "scheduler",
  "lucide-react",
  "@fontsource-variable/figtree",
  "tailwindcss",
  "wxt",
  "@wxt-dev/browser",
]) {
  const pkg = JSON.parse(
    await readFile(
      join(import.meta.dir, "../node_modules", name, "package.json"),
      "utf8",
    ),
  );
  assert(
    notices.includes(`${name} ${pkg.version} (`),
    `Update license notices for ${name}`,
  );
}
assert(
  (await readFile(join(output, "SOURCE.txt"), "utf8")).includes("GPL-3.0-only"),
);
console.log(
  `Release verified: ${files.length} entries, storage-only, no page injection, license notices included.`,
);
