// SEARCH SYNONYMS — the part that makes site search actually work.
//
// Titles alone do not match how people search for insurance. Nobody types
// "professional liability insurance"; they type "E&O", "eo", "malpractice".
// Nobody types "household goods movers"; they type "movers" or "грузчики".
// Every term below is a hand-written alias that routes a real-world query to
// the right page. This file, not the ranking algorithm, is what makes the
// search feel smart — when a query returns nothing, the fix is almost always
// a new alias HERE, not a change to ct-search.js.
//
// TWO RULES:
//  1. Cross-language aliases are deliberate. A Russian-speaking contractor
//     searches for "general liability" in English on the RU site, because
//     that is the term on the certificate his GC is demanding. So the RU
//     lists carry English industry terms, and the EN lists carry the
//     transliterations our clients actually type ("avtostrahovka", "gruz").
//  2. Common misspellings are listed explicitly. The fuzzy matcher in
//     ct-search.js handles ~1-2 character slips on its own, but consistently
//     wrong spellings ("liabilty", "workmans comp", "страховка" vs
//     "строховка") are cheaper and more reliable to just list.
//
// Maintenance: GA4 → the `search_no_results` event lists every query that
// found nothing. That report is the to-do list for this file.

export const SERVICE_SYNONYMS = {
  'auto-insurance': {
    en: 'car insurance auto car vehicle automobile full coverage liability only minimum coverage 30/60/15 driver drivers license dmv cheap car insurance new driver foreign license international license teen driver non owner comprehensive collision uninsured motorist',
    ru: 'автострахование автостраховка страховка на машину авто машина автомобиль полное покрытие полная страховка минимальная страховка ответственность водитель права дмв дешёвая страховка новый водитель иностранные права avtostrahovka avto mashina car insurance full coverage',
  },
  'commercial-truck-insurance': {
    en: 'trucking insurance truck semi big rig 18 wheeler tractor trailer dot mc number motor carrier owner operator primary liability physical damage bobtail non trucking liability occupational accident fmcsa authority new authority reefer flatbed dry van',
    ru: 'страховка на грузовик грузоперевозки трак тракинг фура дальнобой полуприцеп тягач дот мс номер моторкэрриер владелец оператор оунер оператор основная ответственность физический ущерб бобтейл авторити новая авторити truck dot mc trucking gruz',
  },
  'business-insurance': {
    en: 'business insurance commercial insurance small business company shop store llc corporation startup storefront office insurance business owner',
    ru: 'страхование бизнеса бизнес страховка коммерческая страховка малый бизнес компания магазин ооо лкк офис предприниматель business commercial',
  },
  'home-insurance': {
    en: 'home insurance homeowners house ho3 dwelling fire zone wildfire brush fire fair plan california fair plan high risk home condo renters insurance landlord rental property earthquake flood mortgage requirement',
    ru: 'страховка дома страхование жилья дом квартира жильё домовладелец пожар пожароопасная зона фаер план кондо аренда арендатор съём землетрясение наводнение ипотека home homeowners fair plan',
  },
  'rideshare-insurance': {
    en: 'rideshare uber lyft doordash door dash instacart grubhub postmates amazon flex delivery driver gig driver tnc food delivery app driver period 1 period 2',
    ru: 'райдшер убер уберт лифт доордаш инстакарт доставка курьер гиг такси приложение доставка еды uber lyft doordash delivery',
  },
  'uber-black-tcp-insurance': {
    en: 'uber black tcp livery black car limo limousine chauffeur town car cpuc charter party carrier suv service airport transfer',
    ru: 'убер блэк тсп лимузин лимо чёрная машина шофёр водитель с машиной чартер трансфер аэропорт uber black tcp limo livery',
  },
  'nail-salon-insurance': {
    en: 'nail salon nails manicure pedicure nail tech nail technician spa beauty salon acrylic gel lash tech waxing esthetician malpractice',
    ru: 'маникюр педикюр ногти нейл салон мастер маникюра спа салон красоты наращивание гель лак ресницы восковая депиляция косметолог nail salon manicure',
  },
  'hair-salon-insurance': {
    en: 'hair salon barber barbershop stylist hairdresser beauty salon cosmetology blow dry color chemical treatment booth rental suite renter lash brow microblading',
    ru: 'парикмахерская барбершоп барбер стилист парикмахер салон красоты косметология окрашивание химия аренда кресла ресницы брови микроблейдинг hair salon barber stylist',
  },
  'general-liability-insurance': {
    en: 'general liability gl cgl gen liability liability insurance 1m 1 million certificate of insurance coi additional insured contractor insurance slip and fall third party bodily injury property damage landlord requirement contract requirement liabilty liablity',
    ru: 'общая ответственность гражданская ответственность генеральная ответственность страховка ответственности сертификат страхования коi дополнительно застрахованный подрядчик контрактор миллион требование арендодателя general liability gl coi certificate additional insured',
  },
  'professional-liability-insurance': {
    en: 'professional liability e&o eo errors and omissions malpractice consultant insurance agent realtor real estate accountant bookkeeper it consultant negligence advice liability tech e&o',
    ru: 'профессиональная ответственность ошибки и упущения ео малпрактис консультант агент риэлтор бухгалтер айти халатность professional liability e&o errors omissions',
  },
  'workers-comp-insurance': {
    en: 'workers comp workers compensation work comp workmans comp workman comp wc employees payroll injured worker on the job injury employee insurance state fund pay as you go sb 216 contractor requirement ghost policy',
    ru: 'компенсация работникам воркерс комп страховка на работников рабочие сотрудники травма на работе зарплата фонд подрядчик workers comp workers compensation payroll employees',
  },
  'cargo-insurance': {
    en: 'cargo insurance motor truck cargo mtc freight insurance load insurance reefer breakdown cargo limit shipper requirement broker requirement theft in transit refrigerated cargo',
    ru: 'карго страховка карго груз грузовая страховка страховка груза рефрижератор лимит карго требование брокера кража груза cargo mtc freight load',
  },
  'household-goods-movers-insurance': {
    en: 'movers insurance moving company mover relocation household goods hhg bhgs mtr permit cal-t cargo for movers packing storage local moving long distance moving',
    ru: 'страховка для грузчиков переезд переезды грузчики мувер мувинг компания перевозка вещей упаковка хранение разрешение movers moving company hhg mtr',
  },
  'amazon-trucking-insurance': {
    en: 'amazon insurance amazon relay relay dsp delivery service partner box truck amazon freight amazon load amazon carrier amazon requirements',
    ru: 'амазон страховка амазон релэй релей дсп партнёр доставки бокс трак амазон грузы требования амазон amazon relay dsp box truck',
  },
  'cargo-van-sprinter-insurance': {
    en: 'sprinter insurance cargo van van insurance transit promaster hotshot expedite expediter courier van box van small fleet van last mile',
    ru: 'спринтер страховка вана ван фургон каргован транзит промастер хотшот экспедит курьер малый флот sprinter cargo van hotshot',
  },
  'intermodal-drayage-insurance': {
    en: 'drayage insurance intermodal port trucking container chassis uiia port of la long beach rail yard terminal container hauling',
    ru: 'драйдж интермодал порт контейнер шасси порт лос анджелес лонг бич терминал контейнерные перевозки drayage intermodal port container chassis uiia',
  },
  'appliance-repair-insurance': {
    en: 'appliance repair insurance appliance technician handyman installer repair business refrigerator washer dryer repair service tech in home service',
    ru: 'ремонт техники страховка мастера мастер техник хендимен установщик ремонт холодильников стиральных машин сервис на дому appliance repair handyman technician',
  },
  'hvac-insurance': {
    en: 'hvac insurance heating cooling air conditioning ac contractor furnace ductwork refrigeration mechanical contractor hvac contractor installer ac repair',
    ru: 'хвак страховка отопление кондиционеры вентиляция кондиционер печь воздуховоды холодильное оборудование механик подрядчик hvac heating cooling air conditioning',
  },
  'bop-insurance': {
    en: 'bop business owners policy business owner policy package policy gl plus property combined policy small business package property and liability',
    ru: 'боп полис владельца бизнеса пакетный полис пакет для бизнеса ответственность плюс имущество комплексная страховка bop business owners policy package',
  },
  'surety-bond-insurance': {
    en: 'surety bond bond bonds license bond contractor bond cslb bond freight broker bond bmc-84 notary bond permit bond performance bond dmv bond bonded 25000 bond 75000 bond',
    ru: 'бонд бонды поручительство лицензионный бонд бонд подрядчика бонд фрахтового брокера нотариальный бонд разрешительный бонд гарантия surety bond cslb bmc-84 license bond',
  },
  'sr22-insurance': {
    en: 'sr22 sr-22 sr 22 sr22 filing dui dwi suspended license license suspension reinstatement dmv filing high risk driver fr44 non owner sr22 proof of insurance certificate of financial responsibility',
    ru: 'ср22 ср-22 ср 22 подача ср22 дюи вождение в нетрезвом лишение прав приостановка прав восстановление прав дмв высокий риск без машины подтверждение страховки sr22 sr-22 dui dmv filing',
  },
  'event-insurance': {
    en: 'event insurance special event wedding insurance venue requirement one day insurance party insurance liquor liability host liquor vendor insurance festival conference birthday quinceanera',
    ru: 'страховка мероприятия ивент свадьба банкет площадка требование площадки на один день вечеринка алкоголь фестиваль конференция день рождения event insurance wedding venue one day',
  },
  'motorcycle-rv-insurance': {
    en: 'motorcycle insurance moto bike rv insurance motorhome camper travel trailer fifth wheel boat insurance watercraft jet ski atv utv scooter classic car',
    ru: 'мотоцикл мото байк страховка мотоцикла дом на колёсах кемпер прицеп трейлер лодка гидроцикл квадроцикл скутер motorcycle rv boat trailer atv',
  },
};

// Non-service destinations: tools, hubs and conversion pages. Same idea —
// route the query someone actually types to the page that answers it.
export const PAGE_SYNONYMS = {
  '/quote': {
    en: 'quote get a quote free quote price cost how much rate estimate apply online application sign up buy insurance',
    ru: 'квота получить квоту заявка цена стоимость сколько стоит расчёт оформить купить страховку подать заявку quote price cost',
  },
  '/contact': {
    en: 'contact contact us phone number call us address office location hours agent talk to someone email support',
    ru: 'контакты связаться телефон номер позвонить адрес офис часы работы агент написать поддержка contact phone address',
  },
  '/about': {
    en: 'about about us who we are our agency team licensed states license number npn history broker independent',
    ru: 'о нас о компании кто мы агентство команда лицензия штаты номер лицензии история брокер about us licensed states',
  },
  '/faq': {
    en: 'faq questions frequently asked questions help answers how does it work common questions',
    ru: 'вопросы частые вопросы часто задаваемые вопросы помощь ответы как это работает faq questions help',
  },
  '/resources': {
    en: 'resources guides articles blog learn read guide how to library',
    ru: 'ресурсы гиды статьи блог руководства читать библиотека resources guides articles blog',
  },
  '/dmv-practice-test': {
    en: 'dmv practice test permit test written test driving test dmv questions learners permit driving exam free practice test road signs test california dmv test',
    ru: 'пдд тест дмв пробный тест теория экзамен на права письменный тест вопросы дмв учебные права дорожные знаки dmv practice test permit',
  },
  '/car-accident-checklist': {
    en: 'car accident accident checklist what to do after an accident crash collision claim police report exchange information hit and run',
    ru: 'дтп авария что делать после аварии столкновение клейм полиция обмен данными скрылся с места car accident checklist claim',
  },
  '/insurance-savings': {
    en: 'save money savings discount cheaper insurance lower my rate reduce premium tips how to save discounts bundle',
    ru: 'экономия сэкономить скидка дешевле снизить платёж уменьшить премию советы скидки savings discount cheaper lower rate',
  },
  '/fight-traffic-ticket': {
    en: 'traffic ticket fight a ticket speeding ticket citation traffic school points dismiss ticket court red light camera',
    ru: 'штраф оспорить штраф превышение скорости квитанция трафик скул баллы суд камера на светофоре traffic ticket citation',
  },
  '/start-trucking-company': {
    en: 'start a trucking company new authority mc number dot number ucr boc-3 ifta start trucking business owner operator setup how to start trucking',
    ru: 'открыть транспортную компанию новая авторити мс номер дот номер юсиар бок-3 ифта начать бизнес грузоперевозки start trucking new authority mc dot',
  },
  '/privacy-policy': {
    en: 'privacy policy privacy data personal information how you use my data opt out',
    ru: 'политика конфиденциальности конфиденциальность данные личная информация отписаться privacy policy data',
  },
  '/sms-terms': {
    en: 'sms terms text message terms messaging terms stop texts unsubscribe opt out message rates',
    ru: 'условия смс смс сообщения текстовые сообщения отписаться стоп отказ sms terms text messages opt out',
  },
};

// Russian names for the places we have landing pages for. The state and city
// records themselves carry English names (they drive the English URLs and the
// schema), so without this a Russian visitor typing "техас" or "Лос-Анджелес"
// matches nothing at all — the single most likely dead-end query on the RU
// site. Latin spellings are included because people switch keyboard layouts
// mid-sentence more often than you would expect.
export const PLACE_RU = {
  'california': 'калифорния калифорнии калифорнию kaliforniya',
  'texas': 'техас техасе техасас tehas texas',
  'illinois': 'иллинойс иллинойсе illinois',
  'arizona': 'аризона аризоне arizona',
  'nevada': 'невада неваде nevada',
  'north-carolina': 'северная каролина северной каролине',
  'colorado': 'колорадо colorado',
  'ohio': 'огайо ohio',
  'south-carolina': 'южная каролина южной каролине',
  'los-angeles': 'лос-анджелес лос анджелес анджелес ла los angeles',
  'sacramento': 'сакраменто sacramento',
  'chicago': 'чикаго chicago',
  'las-vegas': 'лас-вегас лас вегас вегас las vegas',
  'phoenix': 'финикс феникс phoenix',
  'houston': 'хьюстон хустон houston',
  'dallas': 'даллас dallas',
  'charlotte': 'шарлотт шарлотта charlotte',
};
