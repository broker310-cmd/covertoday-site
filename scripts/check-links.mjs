// Link integrity check — run after EVERY build, before EVERY deploy.
// Usage: node scripts/check-links.mjs   (exit 1 = DO NOT DEPLOY)
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';
const PLACEHOLDERS = /example\.com|placeholder|your-?domain|lorem/i;
const htmlFiles = [];
(function walk(d){ for (const f of readdirSync(d)) { const p = join(d, f);
  statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && htmlFiles.push(p); } })(DIST);

let errors = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  for (const m of html.matchAll(/href="([^"#?]+)[^"]*"/g)) {
    const href = m[1];
    if (PLACEHOLDERS.test(href)) { console.error(`PLACEHOLDER LINK ${href} in ${file}`); errors++; continue; }
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (/\.(css|js|svg|png|jpg|ico|xml|webmanifest|pdf)$/.test(href)) {
      if (!existsSync(join(DIST, href))) { console.error(`MISSING ASSET ${href} in ${file}`); errors++; }
      continue;
    }
    if (!existsSync(join(DIST, href, 'index.html')) && !existsSync(join(DIST, href + '.html'))) {
      console.error(`BROKEN INTERNAL LINK ${href} in ${file}`); errors++;
    }
  }
}
console.log(`Checked ${htmlFiles.length} pages.`);
if (errors) { console.error(`${errors} problem(s) — DO NOT DEPLOY.`); process.exit(1); }
console.log('All internal links OK. Reminder: embedded GHL forms/widgets have their OWN links — curl the widget URL and grep for example.com separately.');
