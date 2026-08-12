// SEARCH INDEX BUILDER — runs at BUILD time only. Never ships to the browser.
//
// Produces the entry list that becomes /search-index-en.json and
// /search-index-ru.json. It reads the SAME modules the pages themselves are
// built from (services barrels, states, cities, blog collections, nav labels),
// so the index cannot drift from the site: add a page, it is searchable on the
// next build with no second place to update. That is the whole design goal —
// verify.mjs step 11 then proves every indexed URL actually got built.
//
// Keys are one letter to keep the shipped JSON small; see ct-search.js.
//   t = title   u = url   d = description   k = keywords   y = type   c = category badge

import { services as enServices, SERVICE_SLUGS } from './services.js';
import { services as i18nServices, niches } from '../i18n/content-services.js';
import { states, stateNiches } from './states.js';
import { cities, cityNiches, cityNichesI18n } from './cities.js';
import { UI } from '../i18n/ui.js';
import { SERVICE_SYNONYMS, PAGE_SYNONYMS, PLACE_RU } from './search-synonyms.js';

const clip = (s, n = 130) => {
  if (!s) return '';
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1).replace(/[\s,;:.—-]+\S*$/, '') + '…';
};

// Curated display labels. The nav already holds a hand-written short label for
// every service in both languages ("General liability", not "General liability
// insurance — $1M coverage, COI today."), so reuse it rather than inventing a
// second naming scheme that would drift. Falls back to the h1's first clause.
function navLabels(lang) {
  const map = {};
  for (const item of UI[lang]?.nav || []) {
    for (const c of item.children || []) {
      const seg = c.href.replace(/^\/(ru|es)\//, '/').replace(/^\//, '');
      if (seg.endsWith('-insurance')) map[seg] = c.label;
    }
    const seg = item.href.replace(/^\/(ru|es)\//, '/').replace(/^\//, '');
    if (seg.endsWith('-insurance') && !map[seg]) map[seg] = item.label;
  }
  return map;
}

const titleFromH1 = (h1) => String(h1 || '').split(/\s+[—–|·]\s+/)[0].replace(/[.,;:]\s*$/, '').trim();

const prefix = (lang) => (lang === 'en' ? '' : '/' + lang);

// Category badge shown on each result row, so a result reads as
// "Workers' comp · Business" rather than an unlabelled link.
const CATS = {
  en: { service: 'Coverage', guide: 'Guide', tool: 'Tool', page: 'Page', state: 'By state' },
  ru: { service: 'Страховка', guide: 'Статья', tool: 'Инструмент', page: 'Страница', state: 'По штатам' },
};

const STATIC_PAGES = {
  en: [
    { u: '/quote', t: 'Get a free quote', d: 'Tell us what you need and a licensed agent gets back to you — English or Russian.', y: 'tool' },
    { u: '/contact', t: 'Contact us', d: 'Call, text or email a licensed agent. Los Angeles office, Mon–Fri 9–5 Pacific.', y: 'page' },
    { u: '/about', t: 'About CoverToday', d: 'Independent bilingual brokerage in Los Angeles, licensed since 2013.', y: 'page' },
    { u: '/faq', t: 'FAQ — instant answers', d: 'The questions we get asked most, answered in plain English.', y: 'page' },
    { u: '/resources', t: 'Guides & articles', d: 'Plain-language guides to coverage, claims, the DMV and running a business.', y: 'page' },
    { u: '/dmv-practice-test', t: 'DMV practice test — free', d: 'Free California DMV written-test practice questions with instant answers.', y: 'tool' },
    { u: '/car-accident-checklist', t: 'Car accident checklist', d: 'Exactly what to do, and in what order, in the minutes after a crash.', y: 'tool' },
    { u: '/insurance-savings', t: 'Save on car insurance', d: 'Practical ways to lower an auto premium without gutting the coverage.', y: 'tool' },
    { u: '/fight-traffic-ticket', t: 'Fight a traffic ticket', d: 'Your options after a citation in California, and what each one costs you.', y: 'tool' },
    { u: '/start-trucking-company', t: 'Start a trucking company', d: 'Authority, MC and DOT numbers, BOC-3, UCR and the insurance each one needs.', y: 'tool' },
    { u: '/privacy-policy', t: 'Privacy policy', d: 'How we handle your information.', y: 'page' },
    { u: '/sms-terms', t: 'SMS terms', d: 'Terms for text messages from CoverToday.', y: 'page' },
  ],
  ru: [
    { u: '/quote', t: 'Получить бесплатный расчёт', d: 'Расскажите, что нужно — лицензированный агент свяжется с вами. По-русски или по-английски.', y: 'tool' },
    { u: '/contact', t: 'Контакты', d: 'Позвоните, напишите или отправьте email. Офис в Лос-Анджелесе, пн–пт 9–17.', y: 'page' },
    { u: '/about', t: 'О нас', d: 'Независимое двуязычное агентство в Лос-Анджелесе, лицензия с 2013 года.', y: 'page' },
    { u: '/faq', t: 'Частые вопросы', d: 'Ответы на вопросы, которые нам задают чаще всего.', y: 'page' },
    { u: '/resources', t: 'Гиды и статьи', d: 'Понятные разборы: покрытие, страховые случаи, DMV и бизнес.', y: 'page' },
    { u: '/dmv-practice-test', t: 'Пробный тест DMV — бесплатно', d: 'Бесплатные вопросы письменного экзамена DMV Калифорнии с ответами.', y: 'tool' },
    { u: '/car-accident-checklist', t: 'Чек-лист при ДТП', d: 'Что делать и в каком порядке в первые минуты после аварии.', y: 'tool' },
    { u: '/insurance-savings', t: 'Как сэкономить на автостраховке', d: 'Рабочие способы снизить платёж, не теряя защиты.', y: 'tool' },
    { u: '/fight-traffic-ticket', t: 'Как оспорить штраф', d: 'Варианты после квитанции в Калифорнии и чего каждый стоит.', y: 'tool' },
    { u: '/start-trucking-company', t: 'Как открыть транспортную компанию', d: 'Авторити, MC и DOT номера, BOC-3, UCR — и какая страховка нужна на каждом шаге.', y: 'tool' },
    { u: '/privacy-policy', t: 'Политика конфиденциальности', d: 'Как мы обращаемся с вашими данными.', y: 'page' },
    { u: '/sms-terms', t: 'Условия SMS', d: 'Условия текстовых сообщений от CoverToday.', y: 'page' },
  ],
};

export function buildEntries(lang, blogPosts = []) {
  const out = [];
  const p = prefix(lang);
  const cat = CATS[lang] || CATS.en;
  const labels = navLabels(lang);

  // 1. Service pages — the money pages, highest intrinsic weight.
  const list = lang === 'en' ? enServices : (i18nServices[lang] || []);
  const bySlug = {};
  for (const s of list) bySlug[s.slug] = s;
  for (const slug of SERVICE_SLUGS) {
    const s = bySlug[slug];
    if (!s) continue;
    const syn = SERVICE_SYNONYMS[slug] || {};
    out.push({
      t: labels[slug] || titleFromH1(s.h1),
      u: `${p}/${slug}`,
      d: clip(s.sub),
      k: [syn[lang] || '', lang !== 'en' ? syn.en || '' : '', slug.replace(/-/g, ' ')].join(' ').trim(),
      y: 'service',
      c: cat.service,
    });
  }

  // 2. Guides / blog articles.
  for (const post of blogPosts) {
    out.push({
      t: post.title,
      u: `${p}/resources/${post.slug}`,
      d: clip(post.description),
      k: [post.category || '', post.slug.replace(/-/g, ' ')].join(' '),
      y: 'guide',
      c: post.category || cat.guide,
    });
  }

  // 3. Tools, hubs and conversion pages.
  for (const pg of STATIC_PAGES[lang] || STATIC_PAGES.en) {
    const syn = PAGE_SYNONYMS[pg.u] || {};
    out.push({
      t: pg.t,
      u: `${p}${pg.u}`,
      d: pg.d,
      k: [syn[lang] || '', lang !== 'en' ? syn.en || '' : ''].join(' ').trim(),
      y: pg.y,
      c: pg.y === 'tool' ? cat.tool : cat.page,
    });
  }

  // 4. State + city landing pages.
  //    These are formulaic and there are ~60 of them, so ct-search.js scores
  //    them down and caps how many can appear at once. They must still be in
  //    the index: "trucking insurance texas" is a real query, and without
  //    these entries it would land on the generic national page instead of
  //    the Texas one.
  const stateSyn = (slug) => (SERVICE_SYNONYMS[slug]?.[lang] || SERVICE_SYNONYMS[slug]?.en || '');
  // `p` = the place names for this entry, kept as their own field. ct-search.js
  // unions every `p` into a lookup so it can tell "trucking texas" (a query
  // that NAMES a place, and should surface the Texas page) from plain
  // "trucking" (which should not be buried under nine state variants).
  const placeKey = (slug) => [slug.replace(/-/g, ' '), lang === 'ru' ? (PLACE_RU[slug] || '') : ''].join(' ').trim();
  // `h` = home market. California is where most of the book sits, so when a
  // generic query like "sr22" has to pick which location pages to show, CA
  // should win the tie instead of whichever state happened to sort first.
  // (Before this, "sr22" surfaced Ohio, Texas and Nevada — all correct, all
  // arbitrary, and none of them where most visitors actually are.)
  const nicheList = lang === 'en' ? stateNiches : (niches[lang] || []);
  for (const st of states) {
    const place = `${st.name} ${st.abbr} ${placeKey(st.slug)}`;
    for (const n of nicheList) {
      const e = {
        t: lang === 'en' ? `${n.label} in ${st.name}` : `${n.label} — ${st.name}`,
        u: `${p}/${st.slug}/${n.slug}`,
        d: clip(n.sub(st.name), 110),
        k: `${place} ${stateSyn(n.slug)}`,
        p: place,
        y: 'state',
        c: `${cat.state} · ${st.abbr}`,
      };
      if (st.abbr === 'CA') e.h = 1;
      out.push(e);
    }
  }
  for (const c of cities) {
    const place = `${c.name} ${c.abbr} ${placeKey(c.slug)}`;
    for (const slug of c.niches) {
      const n = lang === 'en' ? cityNiches[slug] : (cityNichesI18n[lang] || {})[slug];
      if (!n) continue;
      const e = {
        t: lang === 'en' ? `${n.label} in ${c.name}` : `${n.label} — ${c.name}`,
        u: `${p}/${c.slug}/${slug}`,
        d: clip(n.sub(c.name), 110),
        k: `${place} ${stateSyn(slug)}`,
        p: place,
        y: 'state',
        c: `${cat.state} · ${c.name}`,
      };
      if (c.abbr === 'CA') e.h = 1;
      out.push(e);
    }
  }

  return out;
}

// Shown when the search panel is open but empty — turns a blank box into a
// menu instead of a dead end, and costs nothing extra to ship.
export const POPULAR = {
  en: ['auto-insurance', 'sr22-insurance', 'general-liability-insurance', 'commercial-truck-insurance', 'workers-comp-insurance', 'home-insurance'],
  ru: ['auto-insurance', 'sr22-insurance', 'commercial-truck-insurance', 'general-liability-insurance', 'nail-salon-insurance', 'home-insurance'],
};
