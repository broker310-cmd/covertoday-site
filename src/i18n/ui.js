// UI / chrome strings + nav, per locale
export const UI = {
  en: {
    nav: [
      { label: 'Auto', href: '/auto-insurance' },
      { label: 'SR-22', href: '/sr22-insurance' },
      { label: 'Trucking / DOT-MC', href: '/commercial-truck-insurance' },
      { label: 'Business', href: '/business-insurance' },
      { label: 'Resources', href: '/resources' },
      { label: 'Contact', href: '/contact' },
    ],
    getQuote: 'Get Quote',
    getFreeQuote: 'Get a free quote',
    callNow: 'Call (310) 299-5555',
    textUs: 'Text us',
    call: 'Call',
    text: 'Text',
    topbar: 'DOI License #0K77310 · Licensed CA broker since 2013 · Serving CA, TX, IL, AZ, NV, NC, WA',
    ctaTitle: 'Talk to a licensed agent today',
    ctaSub: 'Russian-speaking · English · Español. No pressure, no spam — just your best rate.',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy',
    howItWorks: 'How it works',
    faq: 'FAQ',
    commonQuestions: 'Common questions',
    whyCoverToday: 'Why CoverToday',
    simpleProcess: 'Simple process',
  },
  ru: {
    nav: [
      { label: 'Авто', href: '/ru/auto-insurance' },
      { label: 'SR-22', href: '/ru/sr22-insurance' },
      { label: 'Грузовики / DOT-MC', href: '/ru/commercial-truck-insurance' },
      { label: 'Бизнес', href: '/ru/business-insurance' },
      { label: 'Ресурсы', href: '/ru/resources' },
      { label: 'Контакт', href: '/ru/contact' },
    ],
    getQuote: 'Расчёт',
    getFreeQuote: 'Получить расчёт',
    callNow: 'Звонок (310) 299-5555',
    textUs: 'Написать SMS',
    call: 'Звонок',
    text: 'SMS',
    topbar: 'Лицензия #0K77310 · Лицензированный брокер с 2013 · Работаем в CA, TX, IL, AZ, NV, NC, WA',
    ctaTitle: 'Поговорите с лицензированным агентом',
    ctaSub: 'Говорим по-русски · English · Español. Без давления и спама — только лучшая цена.',
    footerContact: 'Контакт',
    footerPrivacy: 'Конфиденциальность',
    howItWorks: 'Как это работает',
    faq: 'Вопросы и ответы',
    commonQuestions: 'Частые вопросы',
    whyCoverToday: 'Почему CoverToday',
    simpleProcess: 'Простой процесс',
  },
  es: {
    nav: [
      { label: 'Auto', href: '/es/auto-insurance' },
      { label: 'SR-22', href: '/es/sr22-insurance' },
      { label: 'Camiones / DOT-MC', href: '/es/commercial-truck-insurance' },
      { label: 'Negocios', href: '/es/business-insurance' },
      { label: 'Recursos', href: '/es/resources' },
      { label: 'Contacto', href: '/es/contact' },
    ],
    getQuote: 'Cotizar',
    getFreeQuote: 'Cotización gratis',
    callNow: 'Llamar (310) 299-5555',
    textUs: 'Envíe SMS',
    call: 'Llamar',
    text: 'SMS',
    topbar: 'Licencia #0K77310 · Corredor con licencia en CA desde 2013 · Servimos CA, TX, IL, AZ, NV, NC, WA',
    ctaTitle: 'Hable hoy con un agente con licencia',
    ctaSub: 'Hablamos español · Русский · English. Sin presión ni spam — solo su mejor tarifa.',
    footerContact: 'Contacto',
    footerPrivacy: 'Privacidad',
    howItWorks: 'Cómo funciona',
    faq: 'Preguntas frecuentes',
    commonQuestions: 'Preguntas frecuentes',
    whyCoverToday: 'Por qué CoverToday',
    simpleProcess: 'Proceso simple',
  },
};

export function localeFromPath(pathname) {
  if (pathname === '/ru' || pathname.startsWith('/ru/')) return 'ru';
  if (pathname === '/es' || pathname.startsWith('/es/')) return 'es';
  return 'en';
}

// base path without locale prefix, normalized (no trailing slash except root)
export function basePath(pathname) {
  let p = pathname.replace(/\/(ru|es)(?=\/|$)/, '');
  if (p.length > 1) p = p.replace(/\/$/, '');
  return p === '' ? '/' : p;
}
