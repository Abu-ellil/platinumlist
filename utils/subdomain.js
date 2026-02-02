/**
 * Subdomain/City utilities for Next.js
 */

/**
 * Extract city from subdomain in client-side
 * @returns {string|null} - The city name or null
 */
export function getCityFromSubdomain() {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  return extractCityFromHostname(hostname);
}

/**
 * Extract city from hostname
 * @param {string} hostname - The hostname (e.g., 'cairo.platinumlist.net')
 * @returns {string|null} - The city name or null
 */
export function extractCityFromHostname(hostname) {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];
  
  // Split by dots
  const parts = cleanHostname.split('.');
  
  // For development (localhost), return null
  if (parts.length < 3 || cleanHostname.includes('localhost')) {
    return null;
  }
  
  // Don't treat 'www' as a city
  const subdomain = parts[0];
  if (subdomain === 'www') {
    return null;
  }
  
  return subdomain;
}

/**
 * Extract city from Next.js headers (server-side)
 * @param {Object} headers - Next.js headers object
 * @returns {string|null} - The city name or null
 */
export function getCityFromHeaders(headers) {
  // First try custom header set by nginx
  const cityHeader = headers.get('x-city-subdomain');
  if (cityHeader) {
    return cityHeader;
  }
  
  // Extract from host header
  const hostname = headers.get('host');
  if (hostname) {
    return extractCityFromHostname(hostname);
  }
  
  return null;
}

/**
 * Get city information from request (works in middleware/API routes)
 * @param {Request} request - The Next.js request object
 * @returns {Object} - City information
 */
export function getCityFromRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const city = extractCityFromHostname(hostname);
  
  return {
    city,
    hostname,
    isSubdomain: !!city,
    fullUrl: request.url
  };
}

/**
 * Normalize city name (convert to lowercase, handle special chars)
 * @param {string} city - Raw city name
 * @returns {string} - Normalized city name
 */
export function normalizeCityName(city) {
  if (!city) return '';
  
  return city
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a city name is valid
 * @param {string} city - City name to validate
 * @returns {boolean} - Whether the city name is valid
 */
export function isValidCityName(city) {
  if (!city) return false;
  
  // Basic validation - adjust rules as needed
  return (
    city.length >= 2 &&
    city.length <= 50 &&
    /^[a-z0-9-]+$/.test(city) &&
    !city.startsWith('-') &&
    !city.endsWith('-')
  );
}

/**
 * Get city data for SSR/SSG (use in page components)
 * @param {Object} context - Next.js page context (getServerSideProps, etc.)
 * @returns {Object} - City information
 */
export function getCityFromContext(context) {
  // From dynamic route parameter
  const cityFromParams = context.params?.city;
  
  // From request headers (if available)
  const cityFromHeaders = context.req ? 
    getCityFromHeaders(context.req.headers) : null;
  
  const city = cityFromParams || cityFromHeaders;
  
  return {
    city: city ? normalizeCityName(city) : null,
    isSubdomain: !!cityFromHeaders,
    isDirectRoute: !!cityFromParams && !cityFromHeaders
  };
}

// Export constants
export const CITY_CONFIG = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  ALLOWED_CHARS: /^[a-z0-9-]+$/,
  RESERVED_NAMES: ['www', 'api', 'admin', 'cdn', 'static', 'assets']
};

/**
 * Check if city name is reserved
 * @param {string} city - City name
 * @returns {boolean} - Whether the city name is reserved
 */
export function isReservedCityName(city) {
  return CITY_CONFIG.RESERVED_NAMES.includes(city?.toLowerCase());
} 