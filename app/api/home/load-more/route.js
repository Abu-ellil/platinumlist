import { NextResponse } from 'next/server';
import { scrapePage } from '../../../../utils/scraper.js';

// Add CORS headers for subdomain support
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Custom data extractor that uses Puppeteer to click the load more button
function clickLoadMoreExtractor(content, page, cheerio) {
  return new Promise(async (resolve, reject) => {
    try {
      let capturedResponse = null;
      
      // Set up network request interception to capture the load more response
      await page.setRequestInterception(true);
      
      page.on('request', (req) => {
        req.continue();
      });
      
      page.on('response', async (response) => {
        const url = response.url();
        
        // Look for the AJAX request that contains ?page=
        if (url.includes('platinumlist.net') && url.includes('page=') && 
            response.headers()['content-type']?.includes('application/json')) {
          
          try {
            const responseText = await response.text();
            const jsonData = JSON.parse(responseText);
            
            if (jsonData.html) {
              capturedResponse = jsonData;
              console.log('Captured load more response:', url);
            }
          } catch (error) {
            console.error('Error parsing JSON response:', error);
          }
        }
      });
      
      // Wait for the load more button to be available
      await page.waitForSelector('.show-more-btn', { timeout: 10000 });
      
      // Click the load more button
      await page.click('.show-more-btn');
      
      // Wait a bit for the AJAX request to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (capturedResponse) {
        // Parse the captured HTML response
        const cities = [];
        const seenCities = new Set();
        
        if (capturedResponse.html) {
          let citiesHtml = capturedResponse.html;
          
          // Decode escaped HTML entities if needed
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

          // Replace all occurrences of platinumlist.net with plateniemlist.net
          citiesHtml = citiesHtml.replace(/platinumlist\.net/g, 'plateniemlist.net');
          
          const $$ = cheerio.load(citiesHtml);
          
          // Extract cities from the HTML
          $$('.world-wide-city__card-wrap').each((index, element) => {
            const $city = $$(element);
            
            // Extract city link and get the city ID from URL
            const cityLink = $city.find('.world-wide-city__link').attr('href');
            const cityNameLink = $city.find('.world-wide-city__name').attr('href');
            
            // Extract city ID from URL
            let cityId = '';
            if (cityLink) {
              const slugMatch = cityLink.match(/https?:\/\/([^.]+)\.platinumlist\.net/);
              if (slugMatch) {
                cityId = slugMatch[1];
              }
            }
            
            // Extract image
            const image = $city.find('.world-wide-city__image').attr('src') || 
                          $city.find('.world-wide-city__image').attr('data-src');
            
            // Extract city name
            const cityName = $city.find('.world-wide-city__name').text().trim();
            
            // Extract flag
            const flagImg = $city.find('.world-wide-city__name-flag');
            const flag = flagImg.attr('src');
            const flagAlt = flagImg.attr('alt');
            
            // Extract title from image
            const title = $city.find('.world-wide-city__image').attr('title') || cityName;
            
            // Create unique identifier
            const uniqueKey = cityId || `${cityName}:${cityLink}`;
            
            if (!seenCities.has(uniqueKey) && cityId && cityName && image) {
              seenCities.add(uniqueKey);
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
        }
        
        resolve({
          html: capturedResponse.html,
          cities: cities,
          totalCities: cities.length,
          capturedUrl: capturedResponse.url || 'unknown',
          lastScraped: new Date().toISOString()
        });
        
      } else {
        reject(new Error('No load more response captured'));
      }
      
    } catch (error) {
      reject(error);
    }
  });
}

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '2';
    
    // Configure scraping options to click the load more button
    const scrapingOptions = {
      url: 'https://platinumlist.net/ar',
      cacheKey: `click-load-more-page-${page}`,
      cacheTTL: 10 * 60 * 1000, // 10 minutes cache
      dataExtractor: clickLoadMoreExtractor,
      pageOptions: {
        waitUntil: 'networkidle2',
        timeout: 45000
      }
    };

    console.log('Using Puppeteer to click load more button for page:', page);

    // Use the scraper middleware
    const result = await scrapePage(scrapingOptions);

    if (!result.success) {
      const errorResponse = NextResponse.json({
        success: false,
        error: result.error,
        page: page
      }, { status: 500 });
      
      return addCorsHeaders(errorResponse);
    }

    const response = NextResponse.json({
      success: true,
      data: result.data,
      cached: result.cached,
      cacheAge: result.cacheAge || 0,
      parameters: {
        page,
        method: 'puppeteer-click'
      },
      scrapedAt: new Date().toISOString()
    });
    
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Load more cities API error:', error);
    
    const errorResponse = NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
    
    return addCorsHeaders(errorResponse);
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
} 