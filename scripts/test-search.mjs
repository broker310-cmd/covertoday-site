// RELEVANCE REGRESSION TEST for site search.
//   node scripts/test-search.mjs      (exit 1 = DO NOT DEPLOY)
//
// Loads the REAL public/ct-search.js against the REAL built index in dist/ and
// asserts that a battery of queries people actually type still lands on the
// right page. Structural checks (verify.mjs) prove the index is well-formed;
// this proves it is USEFUL — a synonym deleted by accident, or a ranking tweak
// that quietly buries the service pages under state pages, fails here and
// nowhere else.
//
// Every case below is a query shape we expect from real visitors:
// abbreviations (gl, e&o, coi), misspellings (liebility, workmans),
// partial words mid-type (general lie), cross-language (English terms typed
// on the Russian site), and place-qualified queries (trucking texas).
//
// Adding a case: put the query and the slug it must reach. Keep it honest —
// only assert what you would actually want a customer to land on.
import { readFileSync, existsSync } from 'fs';

if (!existsSync('dist/search-index-en.json')) {
  console.error('dist/ not built — run `astro build` first.');
  process.exit(1);
}

const SRC = readFileSync('public/ct-search.js', 'utf-8');

function makeEngine(lang) {
  const listeners = [];
  const win = {};
  const doc = {
    documentElement: { lang, classList: { add() {}, remove() {}, contains: () => false, toggle() {} } },
    addEventListener: (t, f) => listeners.push([t, f]),
    getElementById: () => null,
    createElement: () => ({ setAttribute() {}, appendChild() {}, classList: { add() {}, remove() {}, toggle() {} }, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, style: {} }),
    body: { appendChild() {} },
    head: { appendChild() {} },
    activeElement: null,
  };
  win.document = doc;
  win.location = { pathname: '/', search: '', href: '' };
  win.sessionStorage = { getItem: () => null, setItem() {} };
  win.fetch = (url) => {
    const p = 'dist' + url;
    if (!existsSync(p)) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(readFileSync(p, 'utf-8')) });
  };
  win.dataLayer = [];
  win.window = win;
  const fn = new Function('window', 'document', 'fetch', 'sessionStorage', 'location', 'setTimeout', 'clearTimeout', 'URLSearchParams', SRC);
  fn(win, doc, win.fetch, win.sessionStorage, win.location, setTimeout, clearTimeout, URLSearchParams);
  return win.CTSearch;
}

// [query, expected url (or array of acceptable urls), max acceptable position]
const EN = [
  ['general lie', '/general-liability-insurance', 1],          // mid-type, the brief's own example
  ['general liebility', '/general-liability-insurance', 1],    // misspelling
  ['liabilty insurance', '/general-liability-insurance', 3],
  ['gl', '/general-liability-insurance', 2],
  ['coi', '/general-liability-insurance', 2],
  ['certificate of insurance', '/general-liability-insurance', 2],
  ['e&o', '/professional-liability-insurance', 2],
  ['eo insurance', '/professional-liability-insurance', 3],
  ['errors and omissions', '/professional-liability-insurance', 2],
  ['workmans comp', '/workers-comp-insurance', 2],
  ['workers compensation', '/workers-comp-insurance', 1],
  ['sr22', '/sr22-insurance', 1],
  ['sr 22', '/sr22-insurance', 2],
  ['dui', '/sr22-insurance', 2],
  ['suspended license', '/sr22-insurance', 2],
  ['uber', '/rideshare-insurance', 2],
  ['doordash', '/rideshare-insurance', 2],
  ['movers', '/household-goods-movers-insurance', 2],
  ['moving company', '/household-goods-movers-insurance', 2],
  ['nail salon', '/nail-salon-insurance', 1],
  ['barber', '/hair-salon-insurance', 2],
  ['hvac', '/hvac-insurance', 1],
  ['amazon relay', '/amazon-trucking-insurance', 1],
  ['sprinter van', '/cargo-van-sprinter-insurance', 1],
  ['drayage', '/intermodal-drayage-insurance', 1],
  ['bond', '/surety-bond-insurance', 2],
  ['cslb bond', '/surety-bond-insurance', 1],
  ['wildfire', '/home-insurance', 2],
  ['fair plan', '/home-insurance', 2],
  ['boat', '/motorcycle-rv-insurance', 2],
  ['wedding', '/event-insurance', 2],
  ['bop', '/bop-insurance', 1],
  ['car insurance', '/auto-insurance', 2],
  ['dmv test', '/dmv-practice-test', 2],
  ['permit test', '/dmv-practice-test', 2],
  ['how much does it cost', '/quote', 3],
  ['phone number', '/contact', 3],
  ['traffic ticket', '/fight-traffic-ticket', 2],
  ['start trucking company', '/start-trucking-company', 2],
  // place-qualified: the state page must WIN over the national page here
  ['trucking insurance texas', '/texas/commercial-truck-insurance', 2],
  ['sr22 nevada', '/nevada/sr22-insurance', 2],
  ['auto insurance chicago', '/chicago/auto-insurance', 3],
];

const RU = [
  ['автостраховка', '/ru/auto-insurance', 2],
  ['страховка на машину', '/ru/auto-insurance', 2],
  ['грузоперевозки', '/ru/commercial-truck-insurance', 2],
  ['грузчики', '/ru/household-goods-movers-insurance', 2],
  ['переезд', '/ru/household-goods-movers-insurance', 2],
  ['ср22', '/ru/sr22-insurance', 2],
  ['sr22', '/ru/sr22-insurance', 2],
  ['маникюр', '/ru/nail-salon-insurance', 1],
  ['парикмахерская', '/ru/hair-salon-insurance', 2],
  ['general liability', '/ru/general-liability-insurance', 2],   // English term on the RU site
  ['workers comp', '/ru/workers-comp-insurance', 2],
  ['пдд', '/ru/dmv-practice-test', 2],
  ['экзамен на права', '/ru/dmv-practice-test', 3],
  ['пожар дом', '/ru/home-insurance', 2],
  ['убер', '/ru/rideshare-insurance', 2],
  ['бонд', '/ru/surety-bond-insurance', 2],
  ['сколько стоит', '/ru/quote', 3],
  ['грузоперевозки техас', '/ru/texas/commercial-truck-insurance', 2],
];

let fails = 0, ran = 0;

async function run(lang, cases) {
  const S = makeEngine(lang);
  await S.load();
  console.log(`\n── ${lang.toUpperCase()} ──`);
  for (const [q, want, maxPos] of cases) {
    ran++;
    const res = S._search(q, 10);
    const urls = res.map((r) => r.e.u);
    const pos = urls.indexOf(want) + 1;
    const ok = pos > 0 && pos <= maxPos;
    if (!ok) {
      fails++;
      console.log(`  ✗ "${q}"`);
      console.log(`      want ${want} in top ${maxPos}, got: ${urls.slice(0, 4).join(', ') || '(nothing)'}`);
    } else if (process.env.VERBOSE) {
      console.log(`  ✓ "${q}" → #${pos} ${want}`);
    }
  }
  console.log(`  ${cases.length} queries checked`);
}

// Guard the demotion rule: a generic query must not fill up with the ~60
// generated location pages. This is the failure mode that makes a site search
// feel broken even when every individual match is technically correct.
async function guardStateFlood() {
  const S = makeEngine('en');
  await S.load();
  for (const q of ['insurance', 'auto insurance', 'business insurance', 'truck']) {
    ran++;
    const res = S._search(q, 8);
    const n = res.filter((r) => r.e.y === 'state').length;
    if (n > 2) { fails++; console.log(`  ✗ "${q}" returned ${n} state pages (cap is 2) — generic queries would look like spam`); }
    // Whichever location pages do show should be the home market, not an
    // arbitrary state that happened to sort first.
    const st = res.filter((r) => r.e.y === 'state');
    if (st.length && !st.some((r) => r.e.h)) { fails++; console.log(`  ✗ "${q}" showed only non-CA location pages: ${st.map((r) => r.e.u).join(', ')}`); }
    if (!res.length) { fails++; console.log(`  ✗ "${q}" returned nothing`); }
  }
  console.log('  state-flood guard checked');
}

// A query that legitimately matches nothing must return nothing, not noise.
// If the fuzzy tolerance is ever loosened too far this is what catches it.
async function guardNoise() {
  const S = makeEngine('en');
  await S.load();
  for (const q of ['zzzzqqqq', 'xylophone lessons', 'cryptocurrency mining rig']) {
    ran++;
    const res = S._search(q, 8);
    if (res.length) { fails++; console.log(`  ✗ "${q}" should match nothing, got ${res.map((r) => r.e.u).slice(0, 3).join(', ')}`); }
  }
  console.log('  noise guard checked');
}

await run('en', EN);
await run('ru', RU);
console.log('\n── guards ──');
await guardStateFlood();
await guardNoise();

console.log(`\n${fails ? '✗' : '✓'} search relevance: ${ran - fails}/${ran} passed.`);
if (fails) { console.error('DO NOT DEPLOY — fix the synonyms in src/data/search-synonyms.js or the ranking in public/ct-search.js.'); process.exit(1); }
console.log('Search relevance OK.\n');
