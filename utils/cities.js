/**
 * Saudi Cities Configuration
 * Complete list of all major Saudi cities with their slugs, names, and metadata
 */

export const SAUDI_CITIES = [
  // Major Cities
  { slug: 'riyadh', name_ar: 'الرياض', name_en: 'Riyadh', region: 'الرياض', population: 7676654, is_major: true },
  { slug: 'jeddah', name_ar: 'جدة', name_en: 'Jeddah', region: 'مكة المكرمة', population: 4697000, is_major: true },
  { slug: 'mecca', name_ar: 'مكة المكرمة', name_en: 'Mecca', region: 'مكة المكرمة', population: 2427924, is_major: true },
  { slug: 'medina', name_ar: 'المدينة المنورة', name_en: 'Medina', region: 'المدينة المنورة', population: 1488782, is_major: true },
  { slug: 'dammam', name_ar: 'الدمام', name_en: 'Dammam', region: 'الشرقية', population: 1532300, is_major: true },
  { slug: 'khobar', name_ar: 'الخبر', name_en: 'Khobar', region: 'الشرقية', population: 709000, is_major: true },
  
  // Regional Centers
  { slug: 'taif', name_ar: 'الطائف', name_en: 'Taif', region: 'مكة المكرمة', population: 688693, is_major: false },
  { slug: 'tabuk', name_ar: 'تبوك', name_en: 'Tabuk', region: 'تبوك', population: 569797, is_major: false },
  { slug: 'buraidah', name_ar: 'بريدة', name_en: 'Buraidah', region: 'القصيم', population: 614093, is_major: false },
  { slug: 'khamis-mushait', name_ar: 'خميس مشيط', name_en: 'Khamis Mushait', region: 'عسير', population: 515271, is_major: false },
  { slug: 'hail', name_ar: 'حائل', name_en: 'Hail', region: 'حائل', population: 498575, is_major: false },
  { slug: 'hofuf', name_ar: 'الهفوف', name_en: 'Hofuf', region: 'الشرقية', population: 490871, is_major: false },
  { slug: 'mubarraz', name_ar: 'المبرز', name_en: 'Mubarraz', region: 'الشرقية', population: 349287, is_major: false },
  { slug: 'najran', name_ar: 'نجران', name_en: 'Najran', region: 'نجران', population: 381431, is_major: false },
  { slug: 'jazan', name_ar: 'جازان', name_en: 'Jazan', region: 'جازان', population: 319119, is_major: false },
  { slug: 'yanbu', name_ar: 'ينبع', name_en: 'Yanbu', region: 'المدينة المنورة', population: 267005, is_major: false },
  { slug: 'abha', name_ar: 'أبها', name_en: 'Abha', region: 'عسير', population: 250000, is_major: false },
  
  // Other Important Cities
  { slug: 'qatif', name_ar: 'القطيف', name_en: 'Qatif', region: 'الشرقية', population: 524182, is_major: false },
  { slug: 'jubail', name_ar: 'الجبيل', name_en: 'Jubail', region: 'الشرقية', population: 474679, is_major: false },
  { slug: 'arar', name_ar: 'عرعر', name_en: 'Arar', region: 'الحدود الشمالية', population: 191000, is_major: false },
  { slug: 'sakaka', name_ar: 'سكاكا', name_en: 'Sakaka', region: 'الجوف', population: 202219, is_major: false },
  { slug: 'al-bahah', name_ar: 'الباحة', name_en: 'Al Bahah', region: 'الباحة', population: 109000, is_major: false },
  { slug: 'qurayyat', name_ar: 'القريات', name_en: 'Qurayyat', region: 'الجوف', population: 147550, is_major: false },
  { slug: 'bisha', name_ar: 'بيشة', name_en: 'Bisha', region: 'عسير', population: 205346, is_major: false },
  { slug: 'dhahran', name_ar: 'الظهران', name_en: 'Dhahran', region: 'الشرقية', population: 143936, is_major: false },
  
  // Additional Cities
  { slug: 'al-majmaah', name_ar: 'المجمعة', name_en: 'Al Majmaah', region: 'الرياض', population: 97349, is_major: false },
  { slug: 'hafr-al-batin', name_ar: 'حفر الباطن', name_en: 'Hafr Al Batin', region: 'الشرقية', population: 271642, is_major: false },
  { slug: 'unaizah', name_ar: 'عنيزة', name_en: 'Unaizah', region: 'القصيم', population: 185000, is_major: false },
  { slug: 'al-rass', name_ar: 'الرس', name_en: 'Al Rass', region: 'القصيم', population: 146611, is_major: false },
  { slug: 'al-qunfudhah', name_ar: 'القنفذة', name_en: 'Al Qunfudhah', region: 'مكة المكرمة', population: 139727, is_major: false },
  { slug: 'al-kharj', name_ar: 'الخرج', name_en: 'Al Kharj', region: 'الرياض', population: 135676, is_major: false },
  { slug: 'rabigh', name_ar: 'رابغ', name_en: 'Rabigh', region: 'مكة المكرمة', population: 120000, is_major: false },
  { slug: 'al-jubail', name_ar: 'الجبيل الصناعية', name_en: 'Al Jubail Industrial', region: 'الشرقية', population: 474679, is_major: false },
  { slug: 'al-dawadmi', name_ar: 'الدوادمي', name_en: 'Al Dawadmi', region: 'الرياض', population: 71126, is_major: false },
  { slug: 'al-zulfi', name_ar: 'الزلفي', name_en: 'Al Zulfi', region: 'الرياض', population: 65000, is_major: false },
  
  // Specialized Cities
  { slug: 'king-abdullah-economic-city', name_ar: 'مدينة الملك عبدالله الاقتصادية', name_en: 'King Abdullah Economic City', region: 'مكة المكرمة', population: 15000, is_major: false },
  { slug: 'neom', name_ar: 'نيوم', name_en: 'NEOM', region: 'تبوك', population: 0, is_major: false, is_future: true },
  { slug: 'al-ula', name_ar: 'العلا', name_en: 'Al Ula', region: 'المدينة المنورة', population: 17000, is_major: false },
  { slug: 'al-wajh', name_ar: 'الوجه', name_en: 'Al Wajh', region: 'تبوك', population: 50000, is_major: false }
];

/**
 * Get all cities
 */
export function getAllCities() {
  return SAUDI_CITIES;
}

/**
 * Get major cities only
 */
export function getMajorCities() {
  return SAUDI_CITIES.filter(city => city.is_major);
}

/**
 * Get cities by region
 */
export function getCitiesByRegion(region) {
  return SAUDI_CITIES.filter(city => city.region === region);
}

/**
 * Get city by slug
 */
export function getCityBySlug(slug) {
  return SAUDI_CITIES.find(city => city.slug === slug);
}

/**
 * Get all regions
 */
export function getAllRegions() {
  const regions = [...new Set(SAUDI_CITIES.map(city => city.region))];
  return regions.sort();
}

/**
 * Search cities by name (Arabic or English)
 */
export function searchCities(query) {
  const lowercaseQuery = query.toLowerCase();
  return SAUDI_CITIES.filter(city => 
    city.name_ar.includes(query) || 
    city.name_en.toLowerCase().includes(lowercaseQuery) ||
    city.slug.includes(lowercaseQuery)
  );
}

/**
 * Get cities with population above threshold
 */
export function getCitiesByPopulation(minPopulation = 100000) {
  return SAUDI_CITIES.filter(city => city.population >= minPopulation)
    .sort((a, b) => b.population - a.population);
}

/**
 * Validate city slug
 */
export function isValidCitySlug(slug) {
  return SAUDI_CITIES.some(city => city.slug === slug);
}

/**
 * Get city display name in Arabic
 */
export function getCityDisplayName(slug, language = 'ar') {
  const city = getCityBySlug(slug);
  if (!city) return slug;
  return language === 'en' ? city.name_en : city.name_ar;
}

/**
 * Get random cities for testing/demo
 */
export function getRandomCities(count = 5) {
  const shuffled = [...SAUDI_CITIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 