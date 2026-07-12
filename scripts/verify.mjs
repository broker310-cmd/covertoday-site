// Integrity check for CoverToday service pages. Run before EVERY deploy.
//   npm run verify        (data/source checks; also dist checks if dist/ exists)
//   npm run check         (build + verify + check-links = full pre-deploy gate)
// Exit 1 = DO NOT DEPLOY. Catches the "a new chat accidentally broke/disconnected
// a page" class of mistakes: missing EN/RU twin, dangling nav/related/sitemap link,
// missing sitemap entry, a deleted legal (A2P) invariant, or a corrupt page file.
import { readFileSync, readdirSync, existsSync } from 'fs';
const R = 'src', root = '.';
let errors = 0, warns = 0;
const err = (m) => { console.error('  ✗ ' + m); errors++; };
const warn = (m) => { console.warn('  ! ' + m); warns++; };
const read = (p) => readFileSync(p, 'utf-8');
const slugsFromDir = (d) => readdirSync(d).filter(f => f.endsWith('.js')).map(f => f.replace(/\.js$/, ''));
const arrFromBarrel = (file, name) => {
  const m = read(file).match(new RegExp(name + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'));
  return m ? JSON.parse(m[1]) : null;
};

console.log('\n== 1. EN page files ↔ SERVICE_SLUGS ==');
const enFiles = slugsFromDir(`${R}/data/services`).sort();
const enList = (arrFromBarrel(`${R}/data/services.js`, 'SERVICE_SLUGS') || []).slice().sort();
const enListRaw = arrFromBarrel(`${R}/data/services.js`, 'SERVICE_SLUGS') || [];
for (const s of enList) if (!enFiles.includes(s)) err(`SERVICE_SLUGS lists "${s}" but src/data/services/${s}.js is missing`);
for (const s of enFiles) if (!enList.includes(s)) err(`src/data/services/${s}.js exists but "${s}" is not in SERVICE_SLUGS (page won't render)`);
console.log(`  ${enFiles.length} EN files, ${enList.length} listed`);

console.log('== 2. RU page files ↔ RU_SERVICE_SLUGS ==');
const ruFiles = slugsFromDir(`${R}/i18n/services-ru`).sort();
const ruList = (arrFromBarrel(`${R}/i18n/content-services.js`, 'RU_SERVICE_SLUGS') || []).slice().sort();
for (const s of ruList) if (!ruFiles.includes(s)) err(`RU_SERVICE_SLUGS lists "${s}" but src/i18n/services-ru/${s}.js is missing`);
for (const s of ruFiles) if (!ruList.includes(s)) err(`src/i18n/services-ru/${s}.js exists but "${s}" is not in RU_SERVICE_SLUGS`);
console.log(`  ${ruFiles.length} RU files, ${ruList.length} listed`);

console.log('== 3. EN ↔ RU twin parity (no page ships in only one language) ==');
for (const s of enFiles) if (!ruFiles.includes(s)) err(`"${s}" has an EN page but NO Russian twin (src/i18n/services-ru/${s}.js)`);
for (const s of ruFiles) if (!enFiles.includes(s)) err(`"${s}" has a RU page but NO English twin (src/data/services/${s}.js)`);

console.log('== 4. Each page file is valid + has required SEO/schema fields ==');
const validate = (dir, slugs, lang) => {
  for (const s of slugs) {
    const p = `${dir}/${s}.js`;
    let obj;
    try { obj = JSON.parse(read(p).replace(/^export default\s*/, '').replace(/;\s*$/, '')); }
    catch (e) { err(`${lang} ${s}: file is not valid (JSON.parse failed: ${e.message})`); continue; }
    if (obj.slug !== s) err(`${lang} ${s}: internal slug "${obj.slug}" ≠ filename`);
    for (const f of ['h1', 'sub', 'metaTitle', 'metaDesc']) if (!obj[f]) err(`${lang} ${s}: missing "${f}"`);
    if (!Array.isArray(obj.faqs) || obj.faqs.length === 0) err(`${lang} ${s}: no faqs[] → FAQPage schema would be empty`);
    for (const f of ['covers', 'steps']) if (!Array.isArray(obj[f]) || !obj[f].length) warn(`${lang} ${s}: missing/empty "${f}"`);
  }
};
validate(`${R}/data/services`, enFiles, 'EN');
validate(`${R}/i18n/services-ru`, ruFiles, 'RU');

console.log('== 5. Nav links (ui.js) all point to real pages ==');
const nav = read(`${R}/i18n/ui.js`);
for (const m of nav.matchAll(/href:\s*'([^']+)'/g)) {
  const href = m[1];
  if (href.startsWith('/es/') || href === '/es') continue; // ES nav is intentional; /es/* 307-redirects (frozen, not a real page)
  const seg = href.replace(/^\/ru\//, '').replace(/^\//, '');
  if (seg.endsWith('-insurance') && !enFiles.includes(seg)) err(`nav links to /${seg} but no such page exists`);
}

console.log('== 6. related.js links all resolve + have labels ==');
const rel = read(`${R}/data/related.js`);
const relMap = arrFromBarrelObj(rel, 'relatedMap');
function arrFromBarrelObj(txt, name) {
  const m = txt.match(new RegExp('export const ' + name + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\});'));
  return m ? eval('(' + m[1] + ')') : {};
}
for (const [k, v] of Object.entries(relMap)) {
  if (!enFiles.includes(k)) err(`related.js has key "${k}" with no page`);
  for (const t of v) if (!enFiles.includes(t)) err(`related.js: "${k}" → "${t}" but "${t}" has no page`);
}
const labels = arrFromBarrelObj(rel, 'LABELS');
for (const s of enFiles) {
  if (!labels.en || !labels.en[s]) err(`related.js LABELS.en missing "${s}" (related block would show no label)`);
  if (!labels.ru || !labels.ru[s]) err(`related.js LABELS.ru missing "${s}"`);
}

console.log('== 7. sitemap.xml has every page (EN + RU) and no dead service URLs ==');
const sm = read('public/sitemap.xml');
for (const s of enFiles) {
  if (!sm.includes(`covertoday.com/${s}`)) err(`sitemap.xml missing EN URL for "${s}"`);
  if (!sm.includes(`covertoday.com/ru/${s}`)) err(`sitemap.xml missing RU URL for "${s}"`);
}
for (const m of sm.matchAll(/covertoday\.com\/(?:ru\/)?([a-z0-9-]+-insurance)\b/g))
  if (!enFiles.includes(m[1])) err(`sitemap.xml has URL for "${m[1]}" which has no page (dead entry)`);

console.log('== 8. Legal / A2P invariants still present (never delete these) ==');
const must = (file, str, why) => { if (!existsSync(file)) return err(`${file} is MISSING (${why})`);
  if (!read(file).includes(str)) err(`${file} no longer contains required text: "${str.slice(0,60)}…" (${why})`); };
must(`${R}/pages/privacy-policy.astro`, 'No mobile information will be shared with third parties or affiliates for marketing', 'A2P no-share clause');
must(`${R}/pages/quote.astro`, 'consent is not a condition of purchase', 'A2P consent-not-required disclosure');
must(`${R}/pages/quote.astro`, 'unchecked by default', 'A2P unchecked-by-default disclosure');
must(`${R}/pages/[lang]/quote.astro`, 'name="sms_consent"', 'RU SMS consent checkbox');
if (existsSync(`${R}/pages/[lang]/quote.astro`)) {
  const q = read(`${R}/pages/[lang]/quote.astro`);
  const tag = q.match(/<input[^>]*name="sms_consent"[^>]*>/);
  if (tag && /\bchecked\b/.test(tag[0])) err('RU sms_consent checkbox is pre-CHECKED — must be unchecked by default (A2P)');
}
for (const f of ['sms-terms.astro', 'privacy-policy.astro']) if (!existsSync(`${R}/pages/${f}`)) err(`src/pages/${f} missing`);

console.log('== 9. /es still redirects (no Spanish pages served) ==');
if (!read('vercel.json').includes('/es/:path*')) err('vercel.json lost the /es/:path* redirect');

console.log('== 10. Built output (dist) spot-check ==');
if (existsSync('dist')) {
  for (const s of enFiles) {
    const en = `dist/${s}/index.html`, ru = `dist/ru/${s}/index.html`;
    if (!existsSync(en)) { err(`dist missing ${en}`); continue; }
    const h = read(en);
    if (!/hreflang="en"/.test(h) || !/hreflang="ru"/.test(h)) err(`${en}: missing hreflang en/ru`);
    if (!h.includes('"@type":"FAQPage"') && !h.includes('"@type": "FAQPage"')) err(`${en}: no FAQPage schema`);
    if (!/ask-ai|Ask our AI|Ask AI/i.test(h)) err(`${en}: no "Ask our AI" button`);
    if (!existsSync(ru)) err(`dist missing ${ru}`);
    else if (!/<html[^>]*lang="ru"/.test(read(ru))) err(`${ru}: <html> not lang="ru"`);
  }
  console.log(`  checked ${enFiles.length} pages × 2 langs in dist/`);
} else {
  console.log('  (dist/ not built — run `npm run check` for the full gate incl. this section)');
}

console.log(`\n${errors ? '✗' : '✓'} verify: ${errors} error(s), ${warns} warning(s).`);
if (errors) { console.error('DO NOT DEPLOY — fix the errors above.'); process.exit(1); }
console.log('All integrity checks passed.\n');
