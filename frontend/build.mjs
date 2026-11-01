import { createHash } from "node:crypto";
import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "dist");
await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, "assets"), { recursive: true });
for (const name of ["index.html", "style.css", "app.js"])
  await cp(resolve(here, name), resolve(out, name));
await cp(resolve(here, "../results/figures"), resolve(out, "assets"), {
  recursive: true,
});
await cp(
  resolve(here, "../reports/Final Report.pdf"),
  resolve(out, "assets/Final Report.pdf"),
);
let html = await readFile(resolve(out, "index.html"), "utf8");
for (const name of ["style.css", "app.js"]) {
  const digest = createHash("sha256")
    .update(await readFile(resolve(out, name)))
    .digest("hex")
    .slice(0, 12);
  html = html.replace(name, `${name}?v=${digest}`);
}
await writeFile(resolve(out, "index.html"), html);
console.log("Built static exhibit in frontend/dist");
