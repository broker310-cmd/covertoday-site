// Licensed states → used to generate /[state]/[niche] landing pages
export const states = [
  { slug: 'california', name: 'California', abbr: 'CA' },
  { slug: 'texas', name: 'Texas', abbr: 'TX' },
  { slug: 'illinois', name: 'Illinois', abbr: 'IL' },
  { slug: 'arizona', name: 'Arizona', abbr: 'AZ' },
  { slug: 'nevada', name: 'Nevada', abbr: 'NV' },
  { slug: 'north-carolina', name: 'North Carolina', abbr: 'NC' },
  { slug: 'washington', name: 'Washington', abbr: 'WA' },
];

// Niches that get a dedicated page per state
export const stateNiches = [
  {
    slug: 'sr22-insurance',
    label: 'SR-22 Insurance',
    h1: (st) => `SR-22 insurance in ${st} — filed today.`,
    sub: (st) => `Same-day SR-22 filing with the ${st} DMV/state. We compare 40+ carriers to get ${st} drivers back on the road for less. DUI & suspended-license OK.`,
    body: (st) => `An SR-22 is a certificate your insurer files with the state to prove you carry ${st}'s required liability coverage — usually after a DUI, a lapse, or a suspension. We handle the filing and the policy together so you're compliant the same day in ${st}.`,
    steps: [
      { t: 'Call or get a quote', d: 'Tell us why you need the SR-22 — 2 minutes.' },
      { t: 'We find your best rate', d: 'We compare 40+ carriers, including high-risk specialists.' },
      { t: 'We file same-day', d: 'Your SR-22 is filed and you’re back on the road.' },
    ],
  },
  {
    slug: 'auto-insurance',
    label: 'Auto Insurance',
    h1: (st) => `Auto insurance in ${st} — compare 40+ carriers.`,
    sub: (st) => `Full coverage, liability, SR-22 and high-risk drivers in ${st}. One call, every option compared, bound same-day.`,
    body: (st) => `As an independent broker we shop 40+ carriers for ${st} drivers — including DUI history, lapses, foreign licenses and new drivers — and usually beat what a single captive carrier can offer.`,
    steps: [
      { t: 'Tell us about you', d: '2 minutes, in English or Russian.' },
      { t: 'We shop 40+ carriers', d: 'We find the lowest rate available for your profile.' },
      { t: 'Bind same-day', d: 'Drive away covered, ID cards sent immediately.' },
    ],
  },
  {
    slug: 'commercial-truck-insurance',
    label: 'Commercial Truck Insurance',
    h1: (st) => `Commercial truck & DOT/MC insurance in ${st}.`,
    sub: (st) => `Owner-operators, new DOT/MC authority, long-haul and cargo based in ${st}. Fast filings and same-day COIs.`,
    body: (st) => `New authority is hard to place. We know which carriers price new ${st} DOT/MC reasonably, handle your federal filings, add cargo and trailer-interchange, and issue COIs same-day so you never miss a load.`,
    steps: [
      { t: 'Send your operation details', d: 'Authority, units, radius, commodities.' },
      { t: 'We match the right carriers', d: 'Trucking-specialist markets for new & seasoned authority.' },
      { t: 'Filings & COIs same-day', d: 'We handle DOT/MC filings and certificates fast.' },
    ],
  },
  {
    slug: 'business-insurance',
    label: 'Business Insurance',
    h1: (st) => `Business insurance in ${st} — GL, WC, BOP.`,
    sub: (st) => `General liability, workers’ comp, BOP and commercial auto for ${st} businesses — with same-day certificates of insurance.`,
    body: (st) => `Most ${st} clients and landlords require $1M general liability and a COI before you start. We set up the right coverage and issue certificates (with additional insured) the same day so deals don’t stall.`,
    steps: [
      { t: 'Tell us about your business', d: 'Industry, payroll, vehicles, contract requirements.' },
      { t: 'We build the program', d: 'GL, WC, BOP, commercial auto — shopped across carriers.' },
      { t: 'Get your COI same-day', d: 'Additional insured added, certificate issued fast.' },
    ],
  },
];
