// Cross-links between related products (internal linking for SEO).
export const relatedMap = {
  'auto-insurance': ['rideshare-insurance', 'sr22-insurance', 'commercial-truck-insurance'],
  'commercial-truck-insurance': ['cargo-insurance', 'household-goods-movers-insurance', 'business-insurance'],
  'business-insurance': ['general-liability-insurance', 'workers-comp-insurance', 'bop-insurance'],
  'home-insurance': ['auto-insurance', 'business-insurance', 'rideshare-insurance'],
  'rideshare-insurance': ['auto-insurance', 'commercial-truck-insurance', 'business-insurance'],
  'nail-salon-insurance': ['hair-salon-insurance', 'general-liability-insurance', 'workers-comp-insurance'],
  'hair-salon-insurance': ['nail-salon-insurance', 'general-liability-insurance', 'bop-insurance'],
  'general-liability-insurance': ['workers-comp-insurance', 'bop-insurance', 'business-insurance'],
  'workers-comp-insurance': ['general-liability-insurance', 'business-insurance', 'bop-insurance'],
  'cargo-insurance': ['commercial-truck-insurance', 'household-goods-movers-insurance', 'business-insurance'],
  'household-goods-movers-insurance': ['commercial-truck-insurance', 'cargo-insurance', 'workers-comp-insurance'],
  'appliance-repair-insurance': ['hvac-insurance', 'general-liability-insurance', 'workers-comp-insurance'],
  'hvac-insurance': ['appliance-repair-insurance', 'general-liability-insurance', 'workers-comp-insurance'],
  'bop-insurance': ['general-liability-insurance', 'workers-comp-insurance', 'business-insurance'],
};

export const relatedTitle = { en: 'Related coverage', ru: 'Похожие виды страхования', es: 'Coberturas relacionadas' };

export const LABELS = {
  en: {
    'auto-insurance': 'Auto insurance', 'sr22-insurance': 'SR-22 filing', 'commercial-truck-insurance': 'Commercial trucking', 'cargo-insurance': 'Motor truck cargo', 'household-goods-movers-insurance': 'Moving companies', 'business-insurance': 'Business insurance', 'general-liability-insurance': 'General liability', 'workers-comp-insurance': 'Workers’ comp', 'bop-insurance': 'Business Owners Policy', 'nail-salon-insurance': 'Nail salon', 'hair-salon-insurance': 'Hair & beauty salon', 'appliance-repair-insurance': 'Appliance repair', 'hvac-insurance': 'HVAC contractors', 'home-insurance': 'Home insurance', 'rideshare-insurance': 'Rideshare / Uber / TCP',
  },
  ru: {
    'auto-insurance': 'Автострахование', 'sr22-insurance': 'Оформление SR-22', 'commercial-truck-insurance': 'Грузоперевозки и DOT/MC', 'cargo-insurance': 'Груз (Motor Truck Cargo)', 'household-goods-movers-insurance': 'Компании по переезду', 'business-insurance': 'Страхование бизнеса', 'general-liability-insurance': 'Общая ответственность', 'workers-comp-insurance': 'Компенсация работникам', 'bop-insurance': 'Business Owners Policy', 'nail-salon-insurance': 'Ногтевой салон', 'hair-salon-insurance': 'Салон красоты', 'appliance-repair-insurance': 'Ремонт техники', 'hvac-insurance': 'HVAC-подрядчики', 'home-insurance': 'Страхование жилья', 'rideshare-insurance': 'Uber / Lyft / TCP',
  },
  es: {
    'auto-insurance': 'Seguro de auto', 'sr22-insurance': 'Trámite de SR-22', 'commercial-truck-insurance': 'Camiones y DOT/MC', 'cargo-insurance': 'Carga (Motor Truck Cargo)', 'household-goods-movers-insurance': 'Compañías de mudanzas', 'business-insurance': 'Seguro de negocios', 'general-liability-insurance': 'Responsabilidad general', 'workers-comp-insurance': 'Compensación laboral', 'bop-insurance': 'Business Owners Policy', 'nail-salon-insurance': 'Salón de uñas', 'hair-salon-insurance': 'Salón de belleza', 'appliance-repair-insurance': 'Reparación de electrodomésticos', 'hvac-insurance': 'Contratistas HVAC', 'home-insurance': 'Seguro de vivienda', 'rideshare-insurance': 'Uber / Lyft / TCP',
  },
};
