// Assembles the publishable site into ./site (run after `npm run build:all`).
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";

const out = "site";
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/dist`, { recursive: true });

const files = [
  ["verbs_v1.0.html", "index.html"],
  ["comparison.html", "comparison.html"],
  ["styles.css", "styles.css"],
  ["fonts.css", "fonts.css"],
  ["dist/main.js", "dist/main.js"],
  ["dist/comparison.js", "dist/comparison.js"],
];
for (const [from, to] of files) {
  if (!existsSync(from)) throw new Error(`Missing ${from}. Run "npm run build:all" first.`);
  cpSync(from, `${out}/${to}`);
}
cpSync("fonts", `${out}/fonts`, { recursive: true });
console.log(`Site ready in ./${out}`);
