// E-E-A-T author identity for articles.
//
// Google's YMYL guidance and every major answer engine (ChatGPT, Perplexity,
// Gemini, Copilot) weight *who wrote this and are they qualified*. Insurance is
// YMYL — an unsigned article by an anonymous site is weak evidence. A named,
// licensed author with a verifiable licence number is strong evidence.
//
// Only the AGENCY licence number is published here (#0K77310) — it is already
// public in the site topbar and on the CA DOI lookup. Personal/producer licence
// numbers stay in the vault.

export const ARTICLE_AUTHOR = {
  name: 'Giorgi Nazarov',
  role: 'Licensed insurance broker, founder of CoverToday Insurance Agency',
  roleRu: 'лицензированный страховой брокер, основатель CoverToday Insurance Agency',
  license: 'CA DOI License #0K77310',
  licenseRu: 'лицензия CA DOI #0K77310',
  url: 'https://covertoday.com/about',
  knowsLanguage: ['en', 'ru'],
};

export const ORG = {
  '@type': 'InsuranceAgency',
  name: 'CoverToday Insurance Agency',
  url: 'https://covertoday.com',
  telephone: '+1-310-299-5555',
  email: 'info@covertoday.com',
  logo: 'https://covertoday.com/og.png',
};

// BlogPosting + author + publisher, per article. Passed straight to JSON-LD.
export const articleSchema = (post, url, lang = 'en') => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.description,
  datePublished: post.data.date,
  dateModified: post.data.date,
  inLanguage: lang,
  mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  url,
  author: {
    '@type': 'Person',
    name: ARTICLE_AUTHOR.name,
    jobTitle: ARTICLE_AUTHOR.role,
    identifier: ARTICLE_AUTHOR.license,
    url: ARTICLE_AUTHOR.url,
    knowsLanguage: ARTICLE_AUTHOR.knowsLanguage,
    worksFor: ORG,
  },
  publisher: ORG,
  ...(post.data.category ? { articleSection: post.data.category } : {}),
});
