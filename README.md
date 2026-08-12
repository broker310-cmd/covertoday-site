# CoverToday Insurance — new site (Astro)

Rebuilt with Astro, deployed on Vercel. National, multilingual (EN/RU/ES) insurance brokerage site.

---

## Site search

Header search button (also `/` or ⌘K) → overlay with live suggestions. `/search`
and `/ru/search` are the Enter-key destination, the shareable `?q=` URL and the
no-JS fallback. EN and RU only; ES stays frozen.

**Cost.** Nothing loads on a normal page view — Base.astro carries a ~700-byte
loader that waits for intent. First search downloads the engine plus one
language's index, ~20 KB gzipped total. `npm run check` prints the exact number
and fails the build over 40 KB.

**Where things live**

| File | What it is |
|---|---|
| `src/data/search-synonyms.js` | Aliases people actually type (`e&o`, `workmans comp`, `грузчики`, `техас`). **Start here** — most "search didn't find it" reports are fixed by adding a word here, not by touching the algorithm. |
| `src/data/search-entries.js` | Builds the index from the live page data at build time. Add a page → it is searchable next build. Nothing to register by hand. |
| `src/pages/search-index-{en,ru}.json.js` | The generated indexes. |
| `public/ct-search.js` | Engine + UI. No dependencies. |
| `scripts/test-search.mjs` | 67 relevance assertions. Runs inside `npm run check`. |

**Tuning it with real data.** Every search pushes to the GTM dataLayer:
`search_open`, `search` (GA4's built-in name, so it appears in Site Search
reporting), `search_no_results`, `search_select`. Register `search_term`,
`search_results`, `search_result_url`, `search_result_position`,
`search_result_type`, `search_lang` and `search_surface` as dataLayer variables
in GTM-5D272LH2 and forward them to GA4.

`search_no_results` is the one to read. It is a list, in customers' own words,
of things people expected to find and didn't — either a missing synonym or a
page worth writing.

**Ranking rules that exist for a reason** (all covered by `test-search.mjs`):

- Fuzzy matching compares a query token against the same-length *prefix* of
  indexed tokens, so partial words autocomplete and typos still land. Fuzzy
  hits must share a first letter — without that, "mining" reaches "filing".
- The phrase bonus is scaled by how much of the title the query accounts for.
  Otherwise a long article headline outranks the product page it describes.
- The ~60 generated `/[state]/[niche]` pages are scored down and capped at 2
  results unless the query names a place; California wins ties.
