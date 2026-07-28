// PARTNER INSTANT-QUOTE / BUY-ONLINE LINKS — single source of truth.
//
// A service page opts in by setting  buyOnline: '<key>'  in its data file.
// Both templates (src/pages/[service].astro and src/pages/[lang]/[service].astro)
// resolve the key here, so the copy lives in ONE place per partner, per language.
//
// IMPORTANT — the outbound URL is NOT written into the service pages. Every page
// links to an internal /go/<key> hop (src/pages/go/<key>.astro) which redirects.
// Reasons: (1) the partner's producer/tracking parameters stay out of 22 pages of
// public HTML, (2) when a partner link changes we edit ONE file, (3) the hop page
// is noindex so it never competes in search, (4) it gives us a clean event to
// track clicks on later.
//
// To change where a partner link points: edit `href` below AND the matching
// src/pages/go/<key>.astro. Nothing else needs to change.

export const PARTNERS = {
  'event-helper': {
    href: 'https://www.theeventhelper.com#Z6ZsyK',
    go: '/go/event-helper',
    en: {
      heroBtn: 'Buy online',
      eyebrow: 'Two ways to get covered',
      title: 'Work with an agent, or buy your event policy online',
      agentTitle: 'Talk to a licensed agent',
      agentBody: 'Best when the venue’s requirements are unusual, alcohol is being served and you need host liquor liability, the guest count is large, or you’re a vendor who needs coverage across several dates. We read the venue’s certificate request, match the policy to it, and issue the COI with them named as additional insured.',
      onlineTitle: 'Buy online in minutes',
      onlineBody: 'For a straightforward one-day event, our online partner The Event Helper lets you complete the application, pay, and download your certificate yourself — any hour, any day. You add your venue as additional insured during checkout. Eligibility and availability depend on your event type, state and the venue’s requirements.',
      btn: 'Buy online now →',
      note: 'The Event Helper is one of several partners CoverToday works with, and we may earn a commission on policies purchased through this link. Buying online means you skip our review — call us first if you want us to compare it against the other carriers we represent. Independent broker — coverage, eligibility, price and availability vary by carrier and policy and may not be available to everyone. (310) 299-5555 · covertoday.com/quote',
    },
    ru: {
      heroBtn: 'Купить онлайн',
      eyebrow: 'Два способа оформить',
      title: 'Через агента или онлайн — как вам удобнее',
      agentTitle: 'Поговорить с лицензированным агентом',
      agentBody: 'Подходит, когда у площадки нестандартные требования, подаётся алкоголь и нужна host liquor liability, гостей много, или вы вендор и нужно покрытие на несколько дат. Мы прочитаем запрос площадки на сертификат, подберём полис под него и выпустим COI с площадкой как additional insured.',
      onlineTitle: 'Купить онлайн за несколько минут',
      onlineBody: 'Для обычного однодневного мероприятия наш онлайн-партнёр The Event Helper позволяет заполнить заявку, оплатить и скачать сертификат самостоятельно — в любое время суток. Площадку как additional insured вы добавляете прямо при оформлении. Сайт партнёра на английском языке. Право на покрытие и доступность зависят от типа мероприятия, штата и требований площадки.',
      btn: 'Купить онлайн →',
      note: 'The Event Helper — один из партнёров, с которыми работает CoverToday; мы можем получить комиссию за полисы, оформленные по этой ссылке. Оформляя онлайн, вы пропускаете нашу проверку — позвоните нам, если хотите, чтобы мы сравнили это с другими компаниями, которые мы представляем. Независимый брокер — покрытие, право на него, цена и доступность зависят от компании и полиса и доступны не всем. (310) 299-5555 · covertoday.com/ru/quote',
    },
  },

  // Coterie — instant GL / Professional Liability / BOP for small business.
  // A-rated admitted paper, all 50 states. Guideline limits (verify with Coterie
  // before quoting them as fact): ≤50 employees, ≤$10M revenue, one location per
  // policy; contractors ≤15 employees and ≤$5M revenue. Some classes are ineligible.
  coterie: {
    href: 'https://app.coterieinsurance.com/quote?p=info%40insuranceunivision.com',
    go: '/go/coterie',
    en: {
      heroBtn: 'Quote online',
      eyebrow: 'Two ways to get covered',
      title: 'Let us shop it — or start your quote online right now',
      agentTitle: 'Let us shop it for you (usually worth the call)',
      agentBody: 'Coterie is one of 40+ carriers we work with. When we run your business past several of them at once we can compare what each will actually offer — and that often turns up a better fit, especially if you’ve had a prior claim, run more than one location, or need endorsements specific to your trade. One call, no obligation, and we handle the certificates afterwards.',
      onlineTitle: 'Or quote and buy online in minutes',
      onlineBody: 'Our partner Coterie writes general liability, professional liability and Business Owners Policies for most small business classes in all 50 states, on A-rated admitted paper. Answer a few questions, see a bindable price, and download your certificate yourself. Built for businesses under 50 employees and under $10M revenue at a single location — contractors up to 15 employees. Some classes and loss histories aren’t eligible.',
      btn: 'Start online quote →',
      note: 'Coterie is one of several carriers CoverToday works with, and we may earn a commission on policies placed through this link. Buying online means you skip our review — call us first if you want us to compare it against the other carriers we represent. Independent broker — coverage, eligibility, price and availability vary by carrier and policy and may not be available to everyone. (310) 299-5555 · covertoday.com/quote',
    },
    ru: {
      heroBtn: 'Расчёт онлайн',
      eyebrow: 'Два способа оформить',
      title: 'Доверьте подбор нам — или начните расчёт онлайн прямо сейчас',
      agentTitle: 'Дайте нам подобрать (чаще всего звонок себя окупает)',
      agentBody: 'Coterie — одна из 40+ компаний, с которыми мы работаем. Когда мы прогоняем ваш бизнес сразу через несколько, видно, что реально предложит каждая — и нередко находится более подходящий вариант, особенно если были убытки, у вас больше одной локации или нужны специфические для вашей деятельности эндорсменты. Один звонок, без обязательств, сертификаты потом оформляем мы.',
      onlineTitle: 'Или рассчитать и купить онлайн за несколько минут',
      onlineBody: 'Наш партнёр Coterie оформляет general liability, professional liability и Business Owners Policy для большинства классов малого бизнеса во всех 50 штатах, на бумаге admitted-компаний с рейтингом A. Отвечаете на несколько вопросов, видите цену, оформляете и скачиваете сертификат сами. Рассчитано на бизнес до 50 сотрудников и до $10M выручки в одной локации; для подрядчиков — до 15 сотрудников. Часть классов и история убытков могут не подойти. Сайт партнёра на английском языке.',
      btn: 'Начать расчёт онлайн →',
      note: 'Coterie — одна из нескольких компаний, с которыми работает CoverToday; мы можем получить комиссию за полисы, оформленные по этой ссылке. Оформляя онлайн, вы пропускаете нашу проверку — позвоните, если хотите, чтобы мы сравнили это с другими компаниями, которые мы представляем. Независимый брокер — покрытие, право на него, цена и доступность зависят от компании и полиса и доступны не всем. (310) 299-5555 · covertoday.com/ru/quote',
    },
  },
};

export const partnerFor = (key, lang) => {
  if (!key) return null;
  const p = PARTNERS[key];
  if (!p) throw new Error(`partners.js: unknown buyOnline key "${key}"`);
  const copy = p[lang] || p.en;
  return { ...copy, href: p.go, external: p.href };
};
