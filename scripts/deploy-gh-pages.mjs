// Build statis lalu terbitkan folder out/ ke branch gh-pages (GitHub Pages).
// Jalankan: npm run deploy
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const read = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const remote = read("git remote get-url origin");
const repoName = remote.replace(/\.git$/, "").split("/").pop();
const basePath = `/${repoName}`;

console.log(`\n▶ Build statis dengan BASE_PATH=${basePath}\n`);
run("npx next build", { env: { ...process.env, BASE_PATH: basePath } });

// Tanpa .nojekyll, GitHub Pages mengabaikan folder _next/.
writeFileSync("out/.nojekyll", "");

console.log("\n▶ Menerbitkan out/ ke branch gh-pages\n");
const name = read("git config user.name");
const email = read("git config user.email");
const git = (args) => run(`git -c user.name="${name}" -c user.email="${email}" ${args}`, { cwd: "out" });
git("init -q -b gh-pages");
git("add -A");
git('commit -q -m "deploy: situs statis"');
git(`push -q -f ${remote} gh-pages`);

console.log(`\n✓ Selesai. Situs: https://${remote.split("/").at(-2)}.github.io${basePath}/\n`);
