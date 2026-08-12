// Static search index for the English site. Emitted at build time to
// /search-index-en.json and fetched by ct-search.js only when a visitor
// actually opens search — it is never on the critical path of a page load.
// Size is enforced by verify.mjs step 11.
import { getCollection } from 'astro:content';
import { buildEntries, POPULAR } from '../data/search-entries.js';

export async function GET() {
  const posts = (await getCollection('blog')).map((p) => ({
    slug: p.slug,
    title: p.data.title,
    description: p.data.description,
    category: p.data.category,
  }));
  const entries = buildEntries('en', posts);
  const body = { v: 1, lang: 'en', popular: POPULAR.en, entries };
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
