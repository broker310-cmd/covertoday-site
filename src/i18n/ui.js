// UI / chrome strings + nav, per locale
export const UI = {
  en: {
    nav: [
      { label: 'Auto', href: '/auto-insurance', children: [
        { label: 'Auto insurance', href: '/auto-insurance' },
        { label: 'SR-22 filing', href: '/sr22-insurance' },
        { label: 'Rideshare / Uber / TCP', href: '/rideshare-insurance' },
      ] },
      { label: 'Business', href: '/business-insurance', children: [
        { label: 'Business insurance', href: '/business-insurance' },
        { label: 'General liability', href: '/general-liability-insurance' },
        { label: 'Workers’ comp', href: '/workers-comp-insurance' },
        { label: 'Business Owners Policy', href: '/bop-insurance' },
        { label: 'Surety & license bonds', href: '/surety-bond-insurance' },
      ] },
      { label: 'Trucking', href: '/commercial-truck-insurance', children: [
        { label: 'Commercial trucking / DOT-MC', href: '/commercial-truck-insurance' },
        { label: 'Motor truck cargo', href: '/cargo-insurance' },
        { label: 'Amazon trucking', href: '/amazon-trucking-insurance' },
        { label: 'Cargo van & Sprinter', href: '/cargo-van-sprinter-insurance' },
        { label: 'Intermodal / drayage', href: '/intermodal-drayage-insurance' },
        { label: 'Moving companies', href: '/household-goods-movers-insurance' },
      ] },
      { label: 'Trades', href: '/nail-salon-insurance', children: [
        { label: 'Nail salon', href: '/nail-salon-insurance' },
        { label: 'Hair & beauty salon', href: '/hair-salon-insurance' },
        { label: 'Appliance repair', href: '/appliance-repair-insurance' },
        { label: 'HVAC contractors', href: '/hvac-insurance' },
      ] },
      { label: 'Personal', href: '/home-insurance', children: [
        { label: 'Home & high-risk home', href: '/home-insurance' },
        { label: 'Motorcycle, RV & boat', href: '/motorcycle-rv-insurance' },
        { label: 'Event insurance', href: '/event-insurance' },
      ] },
      { label: 'Resources', href: '/resources', children: [
        { label: 'Guides & articles', href: '/resources' },
        { label: 'DMV practice test — free', href: '/dmv-practice-test' },
        { label: 'Car accident checklist', href: '/car-accident-checklist' },
        { label: 'Save on car insurance', href: '/insurance-savings' },
        { label: 'Fight a traffic ticket', href: '/fight-traffic-ticket' },
        { label: 'Start a trucking company', href: '/start-trucking-company' },
        { label: 'FAQ — instant answers', href: '/faq' },
      ] },
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
    ctaSub: 'Russian-speaking · English. No pressure, no spam — just your best rate.',
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
      { label: 'Авто', href: '/ru/auto-insurance', children: [
        { label: 'Автострахование', href: '/ru/auto-insurance' },
        { label: 'Оформление SR-22', href: '/ru/sr22-insurance' },
        { label: 'Uber / Lyft / TCP', href: '/ru/rideshare-insurance' },
      ] },
      { label: 'Бизнес', href: '/ru/business-insurance', children: [
        { label: 'Страхование бизнеса', href: '/ru/business-insurance' },
        { label: 'Общая ответственность', href: '/ru/general-liability-insurance' },
        { label: 'Компенсация работникам', href: '/ru/workers-comp-insurance' },
        { label: 'Business Owners Policy', href: '/ru/bop-insurance' },
        { label: 'Поручительские бонды', href: '/ru/surety-bond-insurance' },
      ] },
      { label: 'Грузовики', href: '/ru/commercial-truck-insurance', children: [
        { label: 'Грузовики / DOT-MC', href: '/ru/commercial-truck-insurance' },
        { label: 'Груз (Motor Truck Cargo)', href: '/ru/cargo-insurance' },
        { label: 'Amazon-перевозки', href: '/ru/amazon-trucking-insurance' },
        { label: 'Cargo van и Sprinter', href: '/ru/cargo-van-sprinter-insurance' },
        { label: 'Intermodal / drayage', href: '/ru/intermodal-drayage-insurance' },
        { label: 'Компании по переезду', href: '/ru/household-goods-movers-insurance' },
      ] },
      { label: 'Сервис', href: '/ru/nail-salon-insurance', children: [
        { label: 'Ногтевой салон', href: '/ru/nail-salon-insurance' },
        { label: 'Салон красоты', href: '/ru/hair-salon-insurance' },
        { label: 'Ремонт техники', href: '/ru/appliance-repair-insurance' },
        { label: 'HVAC-подрядчики', href: '/ru/hvac-insurance' },
      ] },
      { label: 'Личное', href: '/ru/home-insurance', children: [
        { label: 'Дом и зона пожаров', href: '/ru/home-insurance' },
        { label: 'Мотоцикл, RV и лодка', href: '/ru/motorcycle-rv-insurance' },
        { label: 'Страховка мероприятия', href: '/ru/event-insurance' },
      ] },
      { label: 'Ресурсы', href: '/ru/resources', children: [
        { label: 'Гайды и статьи', href: '/ru/resources' },
        { label: 'Тест DMV — бесплатно', href: '/ru/dmv-practice-test' },
        { label: 'Что делать при ДТП', href: '/ru/car-accident-checklist' },
        { label: 'Экономия на страховке', href: '/ru/insurance-savings' },
        { label: 'Как оспорить штраф', href: '/ru/fight-traffic-ticket' },
        { label: 'Открыть транспортную компанию', href: '/ru/start-trucking-company' },
        { label: 'Вопросы и ответы — FAQ', href: '/ru/faq' },
      ] },
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
    ctaSub: 'Говорим по-русски · English. Без давления и спама — только лучшая цена.',
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
      { label: 'Auto', href: '/es/auto-insurance', children: [
        { label: 'Seguro de auto', href: '/es/auto-insurance' },
        { label: 'Trámite de SR-22', href: '/es/sr22-insurance' },
        { label: 'Uber / Lyft / TCP', href: '/es/rideshare-insurance' },
      ] },
      { label: 'Negocios', href: '/es/business-insurance', children: [
        { label: 'Seguro de negocios', href: '/es/business-insurance' },
        { label: 'Responsabilidad general', href: '/es/general-liability-insurance' },
        { label: 'Compensación laboral', href: '/es/workers-comp-insurance' },
        { label: 'Business Owners Policy', href: '/es/bop-insurance' },
        { label: 'Fianzas de garantía', href: '/es/surety-bond-insurance' },
      ] },
      { label: 'Camiones', href: '/es/commercial-truck-insurance', children: [
        { label: 'Camiones / DOT-MC', href: '/es/commercial-truck-insurance' },
        { label: 'Carga (Motor Truck Cargo)', href: '/es/cargo-insurance' },
        { label: 'Compañías de mudanzas', href: '/es/household-goods-movers-insurance' },
      ] },
      { label: 'Oficios', href: '/es/nail-salon-insurance', children: [
        { label: 'Salón de uñas', href: '/es/nail-salon-insurance' },
        { label: 'Salón de belleza', href: '/es/hair-salon-insurance' },
        { label: 'Reparación de electrodomésticos', href: '/es/appliance-repair-insurance' },
        { label: 'Contratistas HVAC', href: '/es/hvac-insurance' },
      ] },
      { label: 'Personal', href: '/es/home-insurance', children: [
        { label: 'Vivienda y zona de incendios', href: '/es/home-insurance' },
        { label: 'Motocicleta, RV y bote', href: '/es/motorcycle-rv-insurance' },
        { label: 'Seguro de evento', href: '/es/event-insurance' },
      ] },
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
