import { scrapePage } from './scraper.js';
import { getDatabase } from './database.js';

const db = getDatabase();

// Custom data extractor for city events
function cityEventsExtractor(content, page, cheerio) {
  const $ = cheerio.load(content);
  
  // Extract section information
  const sectionTitle = $('.section__title a').first().text().trim();
  const sectionLink = $('.section__title a').first().attr('href');
  
  // Extract events from carousel items
  const events = [];
  const seenEvents = new Set(); // Track unique events to prevent duplicates
  
  $('.carousel-item--event').each((index, element) => {
    const $event = $(element);
    
    // Extract event ID from data attributes or href
    const eventLink = $event.find('.carousel-item__title').attr('href') || 
                     $event.find('.picture-container').attr('href');
    
    let eventId = '';
    if (eventLink) {
      // Try to extract ID from URL
      const idMatch = eventLink.match(/\/(\d+)\//);
      if (idMatch) {
        eventId = idMatch[1];
      }
    }
    
    // Extract GA4 data for additional info
    const ga4Data = $event.find('[data-ga4-click-item]').attr('data-ga4-click-item');
    let hierarchy = '';
    let gaId = '';
    
    if (ga4Data) {
      try {
        const gaObj = JSON.parse(ga4Data);
        hierarchy = gaObj.hierarchy || '';
        gaId = gaObj.id || '';
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    
    // Use GA4 ID if no URL ID found
    if (!eventId && gaId) {
      eventId = gaId.toString();
    }
    
    // Extract title
    const title = $event.find('.carousel-item__title').text().trim();
    
    // Create unique identifier for deduplication
    let uniqueKey = '';
    if (eventId) {
      uniqueKey = `id:${eventId}`;
    } else if (gaId) {
      uniqueKey = `ga:${gaId}`;
    } else if (title && eventLink) {
      uniqueKey = `title:${title}:href:${eventLink}`;
    } else {
      return;
    }
    
    if (seenEvents.has(uniqueKey)) {
      return;
    }
    seenEvents.add(uniqueKey);
    
    const priceText = $event.find('.price:not(.price--accelerator-crossed-price)').last().text().trim();
    const crossedPrice = $event.find('.price--accelerator-crossed-price').text().trim();
    
    const accelerator = $event.find('.carousel-item__accelerator').text().trim() ||
                       $event.find('.accelerator').text().trim();
    
    let acceleratorType = null;
    const acceleratorClass = $event.find('.carousel-item__accelerator, .accelerator').attr('class');
    if (acceleratorClass) {
      const typeMatch = acceleratorClass.match(/accelerator-([^\s]+)/);
      if (typeMatch) {
        acceleratorType = typeMatch[1];
      }
    }
    
    const discount = $event.find('.extended-accelerate__discount').text().trim();
    const date = $event.find('.date, .carousel-item__bottom .date').text().trim();
    const rating = $event.find('.carousel-item__rating').text().trim();
    const label = $event.find('.carousel-item__label .image-label').text().trim();
    
    const imageUrl = $event.find('img').attr('src') || $event.find('img').attr('data-src');
    const imageFull = $event.find('source[media="(min-width: 414px)"]').attr('srcset') || 
                     $event.find('source[media="(min-width: 414px)"]').attr('data-srcset');
    const mobileThumb = $event.find('source[media="(max-width: 414px)"]').attr('srcset') || 
                       $event.find('source[media="(max-width: 414px)"]').attr('data-srcset');
    
    const alt = $event.find('img').attr('alt') || title;
    
    if (title && eventLink && (eventId || gaId) && !imageUrl?.includes('data:image/svg+xml')) {
      events.push({
        id: eventId || gaId,
        title: title,
        price: priceText,
        crossedPrice: crossedPrice || null,
        date: date,
        label: label || null,
        rating: rating || null,
        accelerator: accelerator || null,
        acceleratorType: acceleratorType,
        discount: discount || null,
        href: eventLink.replace('platinumlist.net/ar', 'plateniemlist.net'),
        imageUrl: imageUrl,
        imageFull: imageFull || imageUrl,
        mobileThumb: mobileThumb || imageUrl,
        hierarchy: hierarchy,
        alt: alt
      });
    }
  });

  // Extract nearby cities
  const nearbyCities = [];
  const seenCities = new Set();
  
  $('.carousel-item--city').each((index, element) => {
    const $city = $(element);
    const cityName = $city.find('.carousel-item__title').text().trim();
    const cityHref = $city.find('.picture-container').attr('href') || 
                    $city.find('.carousel-item__title').attr('href');
    
    const dataSrc = $city.find('img').attr('data-src');
    const src = $city.find('img').attr('src');
    
    let imageUrl = dataSrc;
    if (!imageUrl || imageUrl.includes('data:image/svg+xml')) {
      imageUrl = src;
    }
    if (imageUrl && imageUrl.includes('data:image/svg+xml') && dataSrc) {
      imageUrl = dataSrc;
    }
    
    const alt = $city.find('img').attr('alt') || cityName;
    
    let citySlug = '';
    if (cityHref) {
      const slugMatch = cityHref.match(/https?:\/\/([^.]+)\.platinumlist\.net/);
      if (slugMatch) {
        citySlug = slugMatch[1];
      }
    }
    
    const uniqueKey = citySlug || `${cityName}:${cityHref}`;
    
    if (seenCities.has(uniqueKey)) {
      return;
    }
    seenCities.add(uniqueKey);
    
    if (cityName && cityHref && imageUrl) {
      nearbyCities.push({
        id: index + 1,
        name: cityName,
        href: cityHref,
        imageUrl: imageUrl,
        alt: alt,
        slug: citySlug
      });
    }
  });

  // Extract hero slider banners
  const sliderBanners = [];
  $('.hero-slider .hero-slider__item').each((index, element) => {
    const $item = $(element);
    const $link = $item.find('a');
    const href = $link.attr('href');
    
    const $img = $item.find('img');
    const imageUrl = $img.attr('src') || $img.attr('data-src');
    const mobileImageUrl = $item.find('source[media="(max-width: 768px)"]').attr('srcset') || 
                          $item.find('source[media="(max-width: 768px)"]').attr('data-srcset');
    
    const title = $img.attr('alt') || '';
    
    if (imageUrl) {
      sliderBanners.push({
        id: index + 1,
        title: title,
        href: href || '#',
        imageUrl: imageUrl,
        mobileImageUrl: mobileImageUrl || imageUrl
      });
    }
  });

  // Extract header navigation
  const headerNavigation = {
    mainLinks: [],
    dropdowns: {}
  };
  
  $('.main-header-links__item').each((index, element) => {
    const $item = $(element);
    const $link = $item.find('.main-header-links__link').first();
    
    const linkText = $link.text().trim();
    const href = $link.attr('href');
    const dropdownTarget = $link.attr('data-dropdown-target');
    
    if (linkText) {
      headerNavigation.mainLinks.push({
        id: index + 1,
        text: linkText,
        href: href !== 'javascript:void(0)' ? href : null,
        hasDropdown: !!dropdownTarget,
        dropdownTarget: dropdownTarget || null
      });
    }
  });
  
  $('.main-header-links__dropdown').each((index, element) => {
    const $dropdown = $(element);
    const dropdownType = $dropdown.attr('data-dropdown-content');
    
    if (dropdownType) {
      const categories = [];
      const topEvents = [];
      
      $dropdown.find('.main-header-links__dropdown-item').each((catIndex, catElement) => {
        const $catItem = $(catElement);
        const $catLink = $catItem.find('.main-header-links__dropdown-link');
        
        const catText = $catLink.text().trim();
        const catHref = $catLink.attr('href');
        const isTopLevel = $catLink.hasClass('main-header-links__dropdown-link--top');
        const isAllLink = $catLink.hasClass('main-header-links__dropdown-link--all');
        
        if (catText && catHref !== 'javascript:void(0)') {
          categories.push({
            id: catIndex + 1,
            text: catText,
            href: catHref,
            isTopLevel: isTopLevel,
            isAllLink: isAllLink,
            hasBorder: $catItem.hasClass('border-bottom') || $catItem.hasClass('border-top')
          });
        }
      });
      
      $dropdown.find('.main-header-top-event').each((eventIndex, eventElement) => {
        const $event = $(eventElement);
        const $eventLink = $event.find('.main-header-top-event__name');
        const eventTitle = $eventLink.text().trim();
        const eventHref = $eventLink.attr('href');
        const eventDate = $event.find('.main-header-top-event__date').text().trim();
        const eventPrice = $event.find('.main-header-top-event__price').text().trim();
        const $eventImg = $event.find('.main-header-top-event__image img');
        const eventImage = $eventImg.attr('src');
        const eventAlt = $eventImg.attr('alt');
        
        if (eventTitle && eventHref) {
          topEvents.push({
            id: eventIndex + 1,
            title: eventTitle,
            href: eventHref,
            date: eventDate,
            price: eventPrice,
            imageUrl: eventImage,
            alt: eventAlt
          });
        }
      });
      
      headerNavigation.dropdowns[dropdownType] = {
        categories: categories,
        topEvents: topEvents,
        title: dropdownType === 'events' ? 'أبرز الفعاليات' : 'أبرز الفعاليات والأنشطة الترفيهية'
      };
    }
  });

  const currentCityName = $('.main-header__city .main-header__city-name').text().trim() || 
                         $('.main-header__city-name').text().trim() || 
                         'المدينة';

  return {
    title: $('title').text().trim(),
    currentCityName: currentCityName,
    sectionTitle: sectionTitle || 'أبرز الفعاليات',
    sectionLink: sectionLink,
    events: events,
    totalEvents: events.length,
    nearbyCities: nearbyCities,
    totalNearbyCities: nearbyCities.length,
    sliderBanners: sliderBanners,
    totalSliderBanners: sliderBanners.length,
    headerNavigation: headerNavigation,
    lastScraped: new Date().toISOString()
  };
}

export async function getCityData(slug) {
  try {
    // Initialize database
    await db.init();
    
    // Check if we have manual events for this city
    const manualEvents = await db.getEventsByCity(slug);
    
    // Convert manual events to the same format as scraped events
    const formattedManualEvents = manualEvents.map(event => ({
      id: `manual_${event.id}`,
      title: event.title,
      price: event.price || '',
      crossedPrice: event.crossed_price || null,
      date: event.date || '',
      label: event.label || null,
      rating: event.rating || null,
      accelerator: event.accelerator || null,
      acceleratorType: event.accelerator_type,
      discount: event.discount || null,
      href: event.href || event.external_url || `/${slug}/event-tickets/${event.slug}`,
      imageUrl: event.image_url || '/images/default-event.jpg',
      imageFull: event.image_full || event.image_url || '/images/default-event.jpg',
      mobileThumb: event.mobile_thumb || event.image_url || '/images/default-event.jpg',
      hierarchy: event.category || '',
      alt: event.alt || event.title,
      isManual: true,
      priority: event.priority || 0,
      venue: event.venue,
      address: event.address,
      startTime: event.start_time,
      endTime: event.end_time,
      description: event.description,
      tags: event.tags ? JSON.parse(event.tags) : [],
      metadata: event.metadata ? JSON.parse(event.metadata) : {},
      slug: event.slug
    }));

    // Configure scraping options
    const scrapingOptions = {
      url: `https://${slug}.platinumlist.net/ar`,
      cacheKey: `city-events-${slug}`, // Unique cache key for this city
      cacheTTL: 10 * 60 * 1000, // 10 minutes cache
      dataExtractor: cityEventsExtractor
    };

    // Use the scraper middleware
    const result = await scrapePage(scrapingOptions);

    if (!result.success) {
      if (formattedManualEvents.length > 0) {
        return {
          success: true,
          data: {
            title: `${slug} - Platinum List`,
            currentCityName: slug,
            sectionTitle: 'أبرز الفعاليات',
            sectionLink: null,
            events: formattedManualEvents,
            totalEvents: formattedManualEvents.length,
            nearbyCities: [],
            totalNearbyCities: 0,
            sliderBanners: [],
            totalSliderBanners: 0,
            headerNavigation: { mainLinks: [], dropdowns: {} },
            lastScraped: new Date().toISOString(),
            isHybrid: true,
            manualEventsOnly: true
          },
          cached: false,
          cacheAge: 0,
          slug: slug,
          scrapedAt: new Date().toISOString()
        };
      }

      return {
        success: false,
        error: result.error,
        slug: slug
      };
    }

    const combinedEvents = [
      ...formattedManualEvents.sort((a, b) => (b.priority || 0) - (a.priority || 0)),
      ...result.data.events
    ];

    const uniqueEvents = [];
    const seenTitles = new Set();
    
    for (const event of combinedEvents) {
      const titleKey = event.title.toLowerCase().trim();
      if (!seenTitles.has(titleKey)) {
        seenTitles.add(titleKey);
        uniqueEvents.push(event);
      }
    }

    const hybridData = {
      ...result.data,
      events: uniqueEvents,
      totalEvents: uniqueEvents.length,
      manualEventsCount: formattedManualEvents.length,
      scrapedEventsCount: result.data.events.length,
      isHybrid: formattedManualEvents.length > 0,
      lastScraped: new Date().toISOString()
    };

    return {
      success: true,
      data: hybridData,
      cached: result.cached,
      cacheAge: result.cacheAge || 0,
      slug: slug,
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('getCityData error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
