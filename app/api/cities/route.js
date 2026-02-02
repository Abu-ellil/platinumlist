import { NextResponse } from 'next/server';
import { scrapePage } from '../../../utils/scraper.js';

// Add CORS headers for subdomain support
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Custom data extractor for cities page
function citiesDataExtractor(content, page, cheerio) {
  let citiesHtml = '';
  let jsonData = null;
  
  // If content is already a JSON object (from parseJson: true), use it directly
  if (typeof content === 'object' && content !== null) {
    console.log('Content is already parsed JSON object');
    jsonData = content;
    citiesHtml = jsonData.html || '';
  } else {
    // Fallback: content is string, try to parse from HTML
    console.log('Content is string, parsing from HTML...');
    const $ = cheerio.load(content);
    
    try {
      const preContent = $('pre').text();
      if (preContent) {
        jsonData = JSON.parse(preContent);
        citiesHtml = jsonData.html || '';
      }
    } catch (error) {
      console.error('Error parsing JSON from HTML:', error);
      citiesHtml = '';
    }
  }
  
  // Decode escaped HTML entities if needed
  if (citiesHtml && typeof citiesHtml === 'string') {
    citiesHtml = citiesHtml
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => String.fromCharCode(parseInt(code, 16)))
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');

    // Replace all occurrences of platinumlist.net with plateniemlist.net throughout the entire HTML
    citiesHtml = citiesHtml.replace(/platinumlist\.net/g, 'plateniemlist.net');
  }
  
  // Parse the decoded HTML to extract individual cities
  const cities = [];
  const seenCities = new Set();
  
  if (citiesHtml) {
    const $$ = cheerio.load(citiesHtml);
    
    // Look for city items in the decoded HTML
    $$('.city-switcher__city-list li').each((index, element) => {
      const $city = $$(element);
      
      // Extract city name from the link text
      const cityLink = $city.find('a.city-switcher__city-name');
      const cityName = cityLink.text().trim();
      const cityHref = cityLink.attr('href');
      
      // Extract city slug from URL
      let citySlug = '';
      if (cityHref) {
        const slugMatch = cityHref.match(/https?:\/\/([^.]+)\.platinumlist\.net/);
        if (slugMatch) {
          citySlug = slugMatch[1];
        }
      }
      
      // Create unique identifier
      const uniqueKey = citySlug || `${cityName}:${cityHref}`;
      
      if (!seenCities.has(uniqueKey) && cityName && cityHref) {
        seenCities.add(uniqueKey);
        cities.push({
          id: index + 1,
          name: cityName,
          slug: citySlug,
          href: cityHref
        });
      }
    });
  }
  
  return {
    html: citiesHtml,
    cities: cities,
    totalCities: cities.length,
    lastScraped: new Date().toISOString()
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('city') || 'riyadh';
    
    // Configure scraping options
    const scrapingOptions = {
      url: `https://${citySlug}.platinumlist.net/ar/city`,
      cacheKey: `cities-data-${citySlug}`, // Unique cache key for this city's cities page
      cacheTTL: 15 * 60 * 1000, // 15 minutes cache (cities change less frequently)
      dataExtractor: citiesDataExtractor,
      pageOptions: {
        waitUntil: 'domcontentloaded', // Faster for JSON responses
        timeout: 30000,
        rawContent: true,
        parseJson: true // Parse the JSON response automatically
      }
    };

    console.log('Scraping cities with options:', scrapingOptions);

    // Use the scraper middleware
    const result = await scrapePage(scrapingOptions);

    if (!result.success) {
      const errorResponse = NextResponse.json({
        success: false,
        error: result.error,
        data: { html: '' },
        citySlug: citySlug
      }, { status: 500 });
      
      return addCorsHeaders(errorResponse);
    }

    const response = NextResponse.json({
      success: true,
      data: result.data,
      cached: result.cached,
      cacheAge: result.cacheAge || 0,
      citySlug: citySlug,
      scrapedAt: new Date().toISOString()
    });
    
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Cities API error:', error);
    
    const errorResponse = NextResponse.json({
      success: false,
      error: error.message,
      data: { html: '' }
    }, { status: 500 });
    
    return addCorsHeaders(errorResponse);
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
} 