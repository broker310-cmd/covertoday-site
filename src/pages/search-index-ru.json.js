// Static search index for the Russian site. Separate file from the English
// one on purpose: a visitor fetches only their own language, so neither
// audience pays for the other's index.
import { getCollection } from 'astro:content';
import { buildEntries, POPULAR } from '../data/search-entries.js';

export async function GET() {
  const posts = (await getCollection('blog-ru')).map((p) => ({
    slug: p.slug,
    title: p.data.title,
    description: p.data.description,
    category: p.data.category,
  }));
  const entries = buildEntries('ru', posts);
  const body = { v: 1, lang: 'ru', popular: POPULAR.ru, entries };
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
