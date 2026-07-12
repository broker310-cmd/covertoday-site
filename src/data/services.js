// BARREL — one file per page lives in ./services/<slug>.js
// Add a page: create ./services/<new-slug>.js (export default {...}) and add its
// slug to SERVICE_SLUGS below (this also controls order). Then run: npm run verify
const modules = import.meta.glob('./services/*.js', { eager: true });

export const SERVICE_SLUGS = [
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

export const services = SERVICE_SLUGS.map(slug => {
  const m = modules[`./services/${slug}.js`];
  if (!m) throw new Error(`services.js: no data file for slug "${slug}" (src/data/services/${slug}.js)`);
  return m.default;
});
