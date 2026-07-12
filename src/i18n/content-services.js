// BARREL — RU service pages live one-per-file in ./services-ru/<slug>.js
// ES is frozen in ./services-es.js (we do NOT add ES). niches is in ./niches.js.
// Add a RU page: create ./services-ru/<new-slug>.js and add its slug to RU_SERVICE_SLUGS.
const ruModules = import.meta.glob('./services-ru/*.js', { eager: true });
import es from './services-es.js';

export const RU_SERVICE_SLUGS = [
  "auto-insurance",
  "commercial-truck-insurance",
  "business-insurance",
  "home-insurance",
  "rideshare-insurance",
  "nail-salon-insurance",
  "hair-salon-insurance",
  "general-liability-insurance",
  "workers-comp-insurance",
  "cargo-insurance",
  "household-goods-movers-insurance",
  "amazon-trucking-insurance",
  "cargo-van-sprinter-insurance",
  "intermodal-drayage-insurance",
  "appliance-repair-insurance",
  "hvac-insurance",
  "bop-insurance",
  "surety-bond-insurance",
  "sr22-insurance",
  "event-insurance",
  "motorcycle-rv-insurance"
];

const ru = RU_SERVICE_SLUGS.map(slug => {
  const m = ruModules[`./services-ru/${slug}.js`];
  if (!m) throw new Error(`content-services.js: no RU data file for slug "${slug}"`);
  return m.default;
});

export const services = { ru, es };
export { niches } from './niches.js';
