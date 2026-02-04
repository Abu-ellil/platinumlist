import { NextResponse } from 'next/server';
import { scrapePage } from '../../../utils/scraper.js';

// Custom data extractor for home page cities
function homeCitiesExtractor(content, page, cheerio) {
  const $ = cheerio.load(content);
  
  // Extract cities data from the world-wide-city section
  const cities = [];
  
  $('.world-wide-city__card-wrap').each((index, element) => {
    const $card = $(element);
    
    // Extract city link and get the city ID from URL
    const cityLink = $card.find('.world-wide-city__link').attr('href');
    const cityNameLink = $card.find('.world-wide-city__name').attr('href');
    
    // Extract city ID from the URL (e.g., "cairo" from "https://cairo.platinumlist.net/ar/")
    let cityId = '';
    if (cityLink) {
      const match = cityLink.match(/https?:\/\/([^.]+)\.platinumlist\.net/);
      if (match) {
        cityId = match[1];
      }
    }
    
    // Extract image
    const image = $card.find('.world-wide-city__image').attr('src') || 
                  $card.find('.world-wide-city__image').attr('data-src');
    
    // Extract city name (remove whitespace and newlines)
    const cityName = $card.find('.world-wide-city__name').text().trim();
    
    // Extract flag
    const flagImg = $card.find('.world-wide-city__name-flag');
    const flag = flagImg.attr('src');
    const flagAlt = flagImg.attr('alt');
    
    // Extract title from image
    const title = $card.find('.world-wide-city__image').attr('title') || cityName;
    
    if (cityId && cityName && image) {
      cities.push({
        id: cityId,
        name: cityName,
        href: `https://${cityId}.plateniemlist.net`,
        image: image,
        flag: flag,
        flagAlt: flagAlt,
        title: title,
        originalUrl: cityLink
      });
    }
  });
  
  // Extract "show more" link if available
  const showMoreLink = $('.show-more-btn').attr('href');
  
  return {
    title: $('title').text().trim(),
    sectionTitle: $('.world-wide-city__title').text().trim(),
    cities: cities,
    totalCities: cities.length,
    showMoreLink: showMoreLink,
    lastScraped: new Date().toISOString()
  };
}

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request) {
  try {
    console.log('[API /api/home] Starting request at:', new Date().toISOString());
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const skipCache = searchParams.get('skipCache') === 'true';
    const page = searchParams.get('page') || '1';
    
    // Build URL with page parameter if needed
    let url = 'https://platinumlist.net/ar';
    if (page !== '1') {
      url += `?page=${page}`;
    }
    
    // Configure scraping options
    const scrapingOptions = {
      url: url,
      cacheKey: skipCache ? null : `home-cities-page-${page}`,
      cacheTTL: 30 * 60 * 1000, // 30 minutes cache for home page
      dataExtractor: homeCitiesExtractor,
      pageOptions: {
        timeout: 45000,
        waitUntil: 'networkidle2'
      }
    };

    console.log('[API /api/home] About to call scrapePage for:', url);

    // Use the scraper middleware
    const result = await scrapePage(scrapingOptions);

    console.log('[API /api/home] scrapePage completed. Success:', result.success, 'Cached:', result.cached);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        url: url
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      cached: result.cached,
      cacheAge: result.cacheAge || 0,
      parameters: {
        page,
        skipCache
      },
      scrapedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Home API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
