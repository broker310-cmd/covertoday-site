// City landing pages for Russian-speaking hubs (rendered by src/pages/[state]/[niche].astro).
export const cities = [
  { slug: 'los-angeles', name: 'Los Angeles', abbr: 'CA',
    community: 'Los Angeles is home to the largest Russian-speaking community on the West Coast — concentrated in West Hollywood, the San Fernando Valley, Sherman Oaks, Studio City and Hollywood. Our agents serve LA’s Russian, Ukrainian and Armenian families and business owners in their own language.',
    niches: ['nail-salon-insurance', 'auto-insurance', 'sr22-insurance'] },
  { slug: 'sacramento', name: 'Sacramento', abbr: 'CA',
    community: 'Sacramento has one of the largest Slavic (Russian and Ukrainian) communities in the United States — across Citrus Heights, North Highlands, Antelope, Fair Oaks, Carmichael and Rancho Cordova. We’re the Russian-speaking broker for the region’s drivers, owner-operators and salon owners.',
    niches: ['commercial-truck-insurance', 'nail-salon-insurance', 'auto-insurance'] },
  { slug: 'seattle', name: 'Seattle', abbr: 'WA',
    community: 'The Seattle area — Renton, Kent, Bellevue and Lynnwood, plus Spokane statewide — has a large Russian, Ukrainian and Slavic community. We serve Washington’s Russian-speaking owner-operators, contractors and families.',
    niches: ['commercial-truck-insurance', 'general-liability-insurance', 'auto-insurance'] },
  { slug: 'chicago', name: 'Chicago', abbr: 'IL',
    community: 'Chicago is home to the largest Russian-speaking community in the Midwest — in West Rogers Park, Skokie, Buffalo Grove, Northbrook and Wheeling. Our agents serve Chicagoland’s Russian-speaking drivers and business owners.',
    niches: ['auto-insurance', 'sr22-insurance', 'general-liability-insurance'] },
];

export const cityNiches = {
  'nail-salon-insurance': {
    label: 'Nail salon insurance', product: '/nail-salon-insurance',
    h1: (c) => `Nail salon insurance in ${c} — Russian-speaking broker.`,
    sub: (c) => `General liability, product liability, a BOP and workers’ comp for ${c} nail salons and techs — with a same-day certificate for your landlord. Мы говорим по-русски.`,
    body: (c) => `Whether you own a salon or rent a booth in ${c}, your lease likely requires $1M/$2M general liability with the landlord named as additional insured, and California requires workers’ comp once you employ technicians. We package general, professional and product liability, a BOP for your space and equipment, and workers’ comp — then issue the certificate the same day, in English or Russian.`,
    steps: [ { t: 'Tell us about your salon', d: 'Chairs, technicians, services and lease requirements.' }, { t: 'We build the package', d: 'GL, professional & product liability, BOP and workers’ comp.' }, { t: 'Same-day COI', d: 'Landlord added as additional insured and certificate issued fast.' } ] },
  'auto-insurance': {
    label: 'Auto insurance', product: '/auto-insurance',
    h1: (c) => `Auto insurance in ${c} — Russian-speaking agents.`,
    sub: (c) => `Full coverage, liability, SR-22, foreign-license and high-risk drivers in ${c}. We compare 40+ carriers and bind same-day. Мы говорим по-русски.`,
    body: (c) => `As an independent broker we shop 40+ carriers for ${c} drivers — including DUI history, lapses, foreign licenses and new drivers — and usually beat what a single captive carrier can offer. We explain your options in English or Russian and send your ID cards the moment you bind.`,
    steps: [ { t: 'Tell us about you', d: '2 minutes, in English or Russian.' }, { t: 'We shop 40+ carriers', d: 'We find the lowest rate for your profile.' }, { t: 'Bind same-day', d: 'Drive away covered, ID cards sent immediately.' } ] },
  'sr22-insurance': {
    label: 'SR-22 insurance', product: '/sr22-insurance',
    h1: (c) => `SR-22 insurance in ${c} — filed the same day.`,
    sub: (c) => `Same-day SR-22 filing for ${c} drivers after a DUI, suspension or lapse. We compare 40+ carriers for your lowest rate. Non-owner SR-22 available. Мы говорим по-русски.`,
    body: (c) => `An SR-22 is a certificate your insurer files with the state to prove the required liability coverage — usually after a DUI, lapse or suspension. For ${c} drivers we handle the policy and the filing together, file the same day, and compare 40+ carriers (including high-risk specialists) so you’re back on the road for less.`,
    steps: [ { t: 'Call or get a quote', d: 'Tell us why you need the SR-22 — 2 minutes.' }, { t: 'We find your best rate', d: 'We compare 40+ carriers, including high-risk specialists.' }, { t: 'We file same-day', d: 'Your SR-22 is filed and you’re back on the road.' } ] },
  'commercial-truck-insurance': {
    label: 'Commercial truck insurance', product: '/commercial-truck-insurance',
    h1: (c) => `Commercial truck & DOT/MC insurance in ${c}.`,
    sub: (c) => `Owner-operators, new DOT/MC authority, cargo and fleets based in ${c}. Fast federal filings and same-day COIs. Мы говорим по-русски.`,
    body: (c) => `New authority is hard to place, and ${c} is home to many Russian-speaking owner-operators. We know which carriers price new DOT/MC reasonably, handle your federal filings, add cargo and trailer-interchange, and issue COIs the same day so you never miss a load — all explained in English or Russian.`,
    steps: [ { t: 'Send your operation details', d: 'Authority status, units, radius, commodities.' }, { t: 'We match the right carriers', d: 'Trucking-specialist markets for new & seasoned authority.' }, { t: 'Filings & COIs same-day', d: 'We handle DOT/MC filings and certificates fast.' } ] },
  'general-liability-insurance': {
    label: 'General liability insurance', product: '/general-liability-insurance',
    h1: (c) => `General liability insurance in ${c} — COI today.`,
    sub: (c) => `The $1M policy ${c} clients, landlords and general contractors require — with a same-day certificate and additional insured. Мы говорим по-русски.`,
    body: (c) => `Most ${c} contracts and landlords require a $1M general liability policy and a certificate of insurance before you can start. We place GL for contractors, trades and small businesses across many carriers, add additional insured, and issue the COI the same day — in English or Russian.`,
    steps: [ { t: 'Tell us about your work', d: 'Trade or business type, revenue and contract requirements.' }, { t: 'We shop carriers', d: 'We find the right GL limits and price for your class of work.' }, { t: 'Same-day COI', d: 'Additional insured added and certificate issued fast.' } ] },
};
