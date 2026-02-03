import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { getCache } from './cache.js';

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

// Get cache instance with scraper-specific options
const cache = getCache({
  dbPath: './data/scraper_cache.db',
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 1000,
  tableName: 'scraper_cache',
  infiniteCache: true
});

/**
 * Puppeteer scraper middleware with persistent caching
 * @param {Object} options - Configuration options
 * @param {string} options.url - URL to scrape
 * @param {string} options.cacheKey - Unique cache key (optional)
 * @param {number} options.cacheTTL - Cache time-to-live in ms (optional)
 * @param {Function} options.dataExtractor - Function to extract data from page (optional)
 * @param {Object} options.puppeteerOptions - Custom Puppeteer launch options (optional)
 * @param {Object} options.pageOptions - Custom page options (optional)
 * @param {boolean} options.disableCache - Disable caching for this request (optional)
 * @returns {Promise<Object>} - Scraped data
 */
export async function scrapePage(options = {}) {
  const {
    url,
    cacheKey = url,
    cacheTTL,
    dataExtractor = defaultDataExtractor,
    puppeteerOptions = {},
    pageOptions = {},
    disableCache = false
  } = options;

  // Check cache first (unless disabled)
  if (!disableCache && cacheKey) {
    try {
      const cachedResult = await cache.get(cacheKey);
      if (cachedResult) {
        console.log(`Cache hit for: ${cacheKey} (needs refresh: ${cachedResult.needsRefresh})`);
        
        // If cache doesn't need refresh, return cached data
        if (!cachedResult.needsRefresh) {
          return {
            success: true,
            data: cachedResult.data.data,
            cached: true,
            fresh: true,
            cacheAge: cachedResult.age,
            url: url
          };
        }
        
        // Cache needs refresh - we'll try to fetch fresh data
        // But if that fails, we'll return the cached data as fallback
        console.log(`Cache expired for: ${cacheKey}, attempting refresh...`);
      }
    } catch (error) {
      console.warn('Cache get error:', error.message);
    }
  }

  let browser = null;

  try {
    console.log(`Scraping: ${url}`);

    const isVercel = process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL;

    // Handle Vercel environment
    if (isVercel) {
      console.log('Running on Vercel, checking for remote browser or chromium...');
      
      // If a remote browser URL is provided, use it
      if (process.env.BROWSER_WSE_ENDPOINT) {
        console.log('Connecting to remote browser...');
        browser = await puppeteer.connect({
          browserWSEndpoint: process.env.BROWSER_WSE_ENDPOINT,
        });
      } else {
        // Use @sparticuz/chromium for Vercel
        console.log('Using @sparticuz/chromium for Vercel...');
        const chromium = (await import('@sparticuz/chromium')).default;
        
        const defaultPuppeteerOptions = {
          headless: chromium.headless,
          args: [
            ...chromium.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
          ],
          executablePath: await chromium.executablePath(),
          ...puppeteerOptions
        };

        browser = await puppeteer.launch(defaultPuppeteerOptions);
      }
    } else {
      // Find chromium path on Linux
      let linuxChromiumPath = '/usr/bin/chromium-browser';
      if (process.platform === 'linux') {
        const fs = await import('fs');
        if (!fs.existsSync(linuxChromiumPath)) {
          linuxChromiumPath = '/usr/bin/chromium';
        }
      }

      // Default Puppeteer options optimized for Linux and bypassing detection
      const defaultPuppeteerOptions = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-blink-features=AutomationControlled',
          '--window-size=1920,1080'
        ],
        executablePath: process.platform === 'linux' ? linuxChromiumPath : undefined,
        ...puppeteerOptions
      };

      browser = await puppeteer.launch(defaultPuppeteerOptions);
    }
    const page = await browser.newPage();

    // Default page options
    const defaultPageOptions = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      timeout: 90000, // Increased timeout for VPS
      waitUntil: 'networkidle2', // Wait for network to be idle
      ...pageOptions
    };

    // Set user agent and viewport
    await page.setUserAgent(defaultPageOptions.userAgent);
    await page.setViewport(defaultPageOptions.viewport);

    let content;

    if (pageOptions.rawContent) {
      // Get raw HTTP response body when rawContent is true
      console.log('Getting raw HTTP response...');
      
      await page.setRequestInterception(true);
      
      const responsePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for raw response'));
        }, defaultPageOptions.timeout);
        
        page.on('response', async (response) => {
          if (response.url() === url && response.status() === 200) {
            try {
              clearTimeout(timeout);
              let rawBody = await response.text();
              console.log('Got raw response body, length:', rawBody.length);
              
              // Parse JSON if enabled
              if (pageOptions.parseJson) {
                try {
                  console.log('Parsing JSON response...');
                  rawBody = JSON.parse(rawBody);
                  console.log('JSON parsed successfully');
                } catch (jsonError) {
                  console.error('Failed to parse JSON:', jsonError.message);
                  // Keep as string if JSON parsing fails
                }
              }
              
              resolve(rawBody);
            } catch (e) {
              reject(e);
            }
          }
        });
        
        page.on('request', (request) => {
          request.continue();
        });
      });

      // Navigate and wait for raw response
      await page.goto(url, {
        waitUntil: defaultPageOptions.waitUntil,
        timeout: defaultPageOptions.timeout
      });

      content = await responsePromise;
      
    } else {
      // Normal navigation for rendered content
      await page.goto(url, {
        waitUntil: defaultPageOptions.waitUntil,
        timeout: defaultPageOptions.timeout
      });

      // Wait for specific selector if provided, otherwise wait for body
      const selectorToWait = pageOptions.waitForSelector || (!pageOptions.ignoreBody ? 'body' : null);
      const waitTimeout = pageOptions.waitForSelectorTimeout || 10000;
      
      if (selectorToWait) {
        console.log(`Waiting for selector: ${selectorToWait}`);
        await page.waitForSelector(selectorToWait, { timeout: waitTimeout });
      }
      
      // Wait for custom function if provided
      if (pageOptions.waitForFunction) {
        const functionTimeout = pageOptions.waitForFunctionTimeout || 10000;
        console.log(`Waiting for function condition...`);
        await page.waitForFunction(pageOptions.waitForFunction, { timeout: functionTimeout });
        console.log(`Function condition met.`);
      }
      
      // Additional wait time after conditions are met
      if (pageOptions.additionalWaitTime) {
        console.log(`Additional wait: ${pageOptions.additionalWaitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, pageOptions.additionalWaitTime));
      }
      
      // Get rendered page content
      content = await page.content();
    }

    // Extract data using the provided function or default
    const extractedData = pageOptions.rawContent ? content : await dataExtractor(content, page, cheerio);

    // Cache the result if caching is enabled
    if (!disableCache && cacheKey) {
      try {
        const cacheData = {
          data: extractedData,
          timestamp: Date.now(),
          url: url
        };
        
        await cache.set(cacheKey, cacheData, cacheTTL);
        await cache.markAsFresh(cacheKey, cacheTTL);
        console.log(`Cached fresh result for: ${cacheKey}`);
      } catch (error) {
        console.warn('Cache set error:', error.message);
      }
    }

    return {
      success: true,
      data: extractedData,
      cached: false,
      fresh: true,
      url: url
    };

  } catch (error) {
    console.error('Scraping error:', error);

    // If scraping failed and we have cached data, return stale cached data
    if (!disableCache && cacheKey) {
      try {
        const cachedResult = await cache.get(cacheKey);
        if (cachedResult) {
          // Mark cache as stale since fresh fetch failed
          await cache.markAsStale(cacheKey);
          console.log(`Scraping failed, returning stale cached data for: ${cacheKey}`);
          
          return {
            success: true,
            data: cachedResult.data.data,
            cached: true,
            fresh: false,
            stale: true,
            cacheAge: cachedResult.age,
            scrapingError: error.message,
            url: url
          };
        }
      } catch (cacheError) {
        console.warn('Failed to retrieve cached data after scraping error:', cacheError.message);
      }
    }

    return {
      success: false,
      error: error.message,
      url: url
    };

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Default data extractor function
 * @param {string} content - HTML content
 * @param {Object} page - Puppeteer page object
 * @param {Object} cheerio - Cheerio instance
 * @returns {Object} - Extracted data
 */
function defaultDataExtractor(content, page, cheerio) {
  const $ = cheerio.load(content);

  return {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    keywords: $('meta[name="keywords"]').attr('content') || '',
    ogTitle: $('meta[property="og:title"]').attr('content') || '',
    ogDescription: $('meta[property="og:description"]').attr('content') || '',
    ogImage: $('meta[property="og:image"]').attr('content') || '',
    h1: $('h1').first().text().trim(),
    h2: $('h2').map((i, el) => $(el).text().trim()).get(),
    links: $('a').map((i, el) => ({
      text: $(el).text().trim(),
      href: $(el).attr('href')
    })).get().filter(link => link.text && link.href)
  };
}

/**
 * Clear cache manually
 */
export async function clearCache() {
  try {
    await cache.clear();
    console.log('Cache cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    return await cache.getStats();
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return {
      error: error.message
    };
  }
}

/**
 * Initialize cache manually (optional - cache auto-initializes)
 */
export async function initializeCache() {
  try {
    await cache.init();
    console.log('Cache initialized manually');
    return true;
  } catch (error) {
    console.error('Failed to initialize cache:', error);
    return false;
  }
}

/**
 * Close cache connection (for cleanup)
 */
export async function closeCache() {
  try {
    await cache.close();
    console.log('Cache connection closed');
    return true;
  } catch (error) {
    console.error('Failed to close cache:', error);
    return false;
  }
}
