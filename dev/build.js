// Inlines the logic and seed data into one self-contained dist/index.html.
const fs = require("fs");
const path = require("path");
const src = (f) => fs.readFileSync(path.join(__dirname, "src", f), "utf8");
const seed = JSON.stringify(JSON.parse(src("seed.json")));
const html = src("index.html")
  .replace("/*__LOGIC__*/", () => src("logic.js").replace(/<\/script/gi, "<\\/script"))
  .replace("/*__SEED__*/", () => seed.replace(/</g, "\\u003c"));
// The site is served by GitHub Pages from the repository root, one level up from dev/.
const OUT = path.join(__dirname, "..");
fs.writeFileSync(path.join(OUT, "index.html"), html);
// Copy static assets (preview image, icons, manifest) next to index.html.
const pub = path.join(__dirname, "src", "public");
if (fs.existsSync(pub)) for (const f of fs.readdirSync(pub)) fs.copyFileSync(path.join(pub, f), path.join(OUT, f));
console.log("Built index.html (" + Math.round(html.length / 1024) + " KB)");
