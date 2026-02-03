import { scrapePage } from './scraper.js';
import { getDatabase } from './database.js';

const db = getDatabase();

// Custom data extractor for detailed event pages
function eventDetailsExtractor(content, page, cheerio) {
  const $ = cheerio.load(content);
  
  // Extract main event container
  const eventContainer = $('.container2.padded.event-item.clearfix');
  
  // Extract basic event info
  const eventId = eventContainer.attr('data-event-item') ? 
    JSON.parse(eventContainer.attr('data-event-item').replace(/&quot;/g, '"')).idEvent : null;
  
  const eventUrl = eventContainer.attr('id');
  
  // Extract title and description
  const title = $('.event-item__name-title').text().trim();
  const teaser = $('.event-item__text-teaser').text().trim();
  
  // Extract location
  const location = $('.event-item__venue-name-text, .location-block__venue-name').first().text().trim();
  const address = $('.location-block__address').text().trim();
  
  // Extract pricing information
  const priceFrom = $('.buy-block__price').first().text().trim();
  const acceleratorText = $('.accelerator-custom-text, .accelerator-best-price').first().text().trim();
  
  // Extract all ticket prices
  const ticketPrices = [];
  $('.prices-block__item').each((i, el) => {
    const $item = $(el);
    ticketPrices.push({
      name: $item.find('.prices-block__name').text().trim(),
      price: $item.find('.prices-block__price').text().trim()
    });
  });
  
  // Extract event date and timing information from buy block summary
  const eventDate = $('.buy-block__date-text').text().trim() || 
                   $('.event-date, .date').first().text().trim();
  
  const doorOpenTime = $('.buy-block__time-text-wrapper').eq(0).find('.buy-block__time-value').text().trim() ||
                      $('.buy-block__time-value').first().text().trim();
  
  const showStartTime = $('.buy-block__time-text-wrapper').eq(1).find('.buy-block__time-value').text().trim() ||
                       $('.buy-block__time-value').last().text().trim();
  
  // Extract specific timing labels
  const doorOpenLabel = $('.buy-block__time-text-wrapper').eq(0).find('.buy-block__time-text').text().trim() ||
                        'تُفتح الأبواب:';
  
  const showStartLabel = $('.buy-block__time-text-wrapper').eq(1).find('.buy-block__time-text').text().trim() ||
                        'يبدأ العرض:';

  // Extract schedule/duration info
  const duration = $('.schedule-block__accordion-subheader span').last().text().trim();
  const scheduleItems = [];
  $('.schedule-block__text').each((i, el) => {
    const $item = $(el);
    const time = $item.find('.schedule-block__time').text().trim();
    const description = $item.find('.schedule-block__point-name').text().trim();
    if (description) {
      scheduleItems.push({
        time: time || null,
        description: description
      });
    }
  });
  
  // Extract gallery images
  const galleryImages = [];
  $('.simple-gallery__container__item').each((i, el) => {
    const $item = $(el);
    const $img = $item.find('img');
    const $picture = $item.find('picture');
    
    let imageSrc = $img.attr('data-src');
    
    if (!imageSrc || imageSrc.includes('data:image/svg')) {
      const $firstSource = $picture.find('source').first();
      const srcset = $firstSource.attr('srcset') || $firstSource.attr('data-srcset');
      if (srcset) {
        imageSrc = srcset.split(',')[0].trim().split(' ')[0];
      }
    }
    
    if (!imageSrc || imageSrc.includes('data:image/svg')) {
      imageSrc = $img.attr('src');
    }
    
    if (imageSrc && !imageSrc.includes('data:image/svg')) {
      galleryImages.push({
        src: imageSrc,
        alt: $img.attr('alt'),
        title: $img.attr('title')
      });
    }
  });
  
  // Extract structured description sections
  const descriptionSections = [];
  $('.description-structured__block').each((i, el) => {
    const $section = $(el);
    const sectionTitle = $section.find('h2').text().trim();
    const sectionContent = $section.find('.description-structured__text--mce').html();
    if (sectionTitle) {
      descriptionSections.push({
        title: sectionTitle,
        content: sectionContent
      });
    }
  });
  
  // Extract main description
  const mainDescription = $('.description-structured__text--overview').html();
  
  // Extract buy button info
  const buyButton = $('.buy-block__btn').first();
  const buyButtonUrl = buyButton.attr('href');
  const buyButtonText = buyButton.find('.buy-block__btn-text').text().trim() || buyButton.text().trim();
  
  // Extract GA4 tracking data from buy button
  let ga4Data = null;
  try {
    const ga4Attr = buyButton.attr('data-ga4-click-item');
    if (ga4Attr) {
      ga4Data = JSON.parse(ga4Attr.replace(/&quot;/g, '"'));
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  // Extract WebEngage tracking data
  let webengageData = null;
  try {
    const webengageAttr = buyButton.attr('data-webengage-click');
    if (webengageAttr) {
      webengageData = JSON.parse(webengageAttr.replace(/&quot;/g, '"'));
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  // Extract event slider images and videos from promo section
  const sliderImages = [];
  const seenMedia = new Set();

  const getSourceUrl = ($source) => {
    try {
      if (!$source || $source.length === 0) return null;
      const srcset = $source.attr('data-srcset') || $source.attr('srcset');
      if (srcset && !srcset.includes('data:image/svg')) {
        const url = srcset.split(',')[0].trim().split(' ')[0];
        return (url && !url.startsWith('data:image/svg')) ? url : null;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const getImageUrlFromPicture = ($picture) => {
    try {
      if (!$picture || $picture.length === 0) return null;
      
      const $img = $picture.find('img').first();
      const $sources = $picture.find('source');
      
      let desktopUrl = null;
      let mobileUrl = null;
      
      $sources.each((idx, source) => {
        try {
          const $source = $(source);
          const media = $source.attr('media');
          const url = getSourceUrl($source);
          
          if (url) {
            if (media && media.includes('min-width: 767px')) {
              desktopUrl = desktopUrl || url;
            } else if (media && media.includes('max-width: 767px')) {
              mobileUrl = mobileUrl || url;
            }
          }
        } catch (error) {
        }
      });
      
      const dataSrc = $img.attr('data-src');
      const src = $img.attr('src');
      
      const imageUrl = desktopUrl || dataSrc || src;
      if (imageUrl && !imageUrl.includes('data:image/svg')) {
        return {
          desktop: imageUrl,
          mobile: mobileUrl || imageUrl
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const sliderSelectors = [
    '.slick-track .full-width-slider-item',
    '.main-slider__items-container .slick-track .full-width-slider-item',
    '.image-slider-container .full-width-slider-item',
    '.main-slider .full-width-slider-item',
    '.event-item__promo-media .full-width-slider-item'
  ];
  
  let $sliderItems = $();
  
  for (const selector of sliderSelectors) {
    try {
      $sliderItems = $(selector);
      if ($sliderItems.length > 0) {
        break;
      }
    } catch (error) {
    }
  }
  
  $sliderItems.each((i, el) => {
    try {
      const $item = $(el);
      
      if ($item.hasClass('slick-cloned')) {
        return;
      }

      const isVideo = $item.find('.embedded-video').length > 0 || 
                     $item.find('[data-full-width-slider-embedded-video]').length > 0;
      
      let videoUrl = null;
      let imageUrl = null;
      let mobileThumb = null;
      let alt = '';

      try {
        const $img = $item.find('img').first();
        alt = $img.attr('alt') || title || '';
      } catch (error) {
      }

      if (isVideo) {
        try {
          const $videoElement = $item.find('[data-full-width-slider-embedded-video]');
          const $videoTag = $item.find('video');
          
          videoUrl = $videoElement.attr('data-full-width-slider-embedded-video') || 
                     $videoTag.attr('src');
          
          const $previewPicture = $item.find('.full-width-slider-item-preview picture');
          const images = getImageUrlFromPicture($previewPicture);
          if (images) {
            imageUrl = images.desktop;
            mobileThumb = images.mobile;
          }
        } catch (error) {
        }
      } else {
        try {
          const $picture = $item.find('.full-width-slider-item-inner picture').first();
          const images = getImageUrlFromPicture($picture);
          if (images) {
            imageUrl = images.desktop;
            mobileThumb = images.mobile;
          }
        } catch (error) {
        }
      }

      const uniqueKey = videoUrl || imageUrl;
      if (!uniqueKey || seenMedia.has(uniqueKey)) {
        return;
      }
      seenMedia.add(uniqueKey);

      sliderImages.push({
        id: (sliderImages.length + 1).toString(),
        title: alt,
        imageUrl: imageUrl,
        imageFull: imageUrl,
        mobileThumb: mobileThumb,
        href: null,
        alt: alt,
        hasVideo: isVideo,
        videoUrl: videoUrl,
        isActive: sliderImages.length === 0,
      });

    } catch (error) {
    }
  });

  if (sliderImages.length === 0) {
    const $promoContainer = $('.event-item__promo-media.artwork-container');
    if ($promoContainer.length > 0 && $promoContainer.find('.image-slider-container').length === 0) {
      const $picture = $promoContainer.find('picture').first();
      const images = getImageUrlFromPicture($picture);
      if (images) {
        const alt = $picture.find('img').attr('alt') || title;
        sliderImages.push({
          id: '1',
          title: alt,
          imageUrl: images.desktop,
          imageFull: images.desktop,
          mobileThumb: images.mobile,
          href: null,
          alt: alt,
          hasVideo: false,
          videoUrl: null,
          isActive: true,
        });
      }
    }
  }
  
  const similarEvents = [];
  $('.carousel-item--similar-event').each((i, el) => {
    const $item = $(el);
    const $link = $item.find('.carousel-item__title');
    const eventTitle = $link.text().trim();
    const eventHref = $link.attr('href');
    const eventPrice = $item.find('.price').last().text().trim();
    const eventImage = $item.find('img').attr('src');
    const accelerator = $item.find('.extended-accelerate__discount, .accelerator').text().trim();
    
    if (eventTitle) {
      similarEvents.push({
        title: eventTitle,
        href: eventHref,
        price: eventPrice,
        image: eventImage,
        accelerator: accelerator
      });
    }
  });
  
  const whyBuyReasons = [];
  $('.why-buy-block__reasons-reason').each((i, el) => {
    const $reason = $(el);
    whyBuyReasons.push({
      title: $reason.find('.why-buy-block__reasons-reason-description-header').text().trim(),
      description: $reason.find('.why-buy-block__reasons-reason-description-subheader').text().trim(),
      image: $reason.find('.why-buy-block__reasons-reason-image').attr('src')
    });
  });
  
  const paymentOptions = [];
  $('.why-buy-block__payment-options-payment-systems img').each((i, el) => {
    const $img = $(el);
    paymentOptions.push({
      src: $img.attr('src'),
      alt: $img.attr('alt') || '',
      class: $img.attr('class')
    });
  });
  
  return {
    eventId: eventId,
    eventUrl: eventUrl,
    title: title,
    teaser: teaser,
    location: {
      name: location,
      address: address
    },
    pricing: {
      priceFrom: priceFrom,
      acceleratorText: acceleratorText,
      ticketPrices: ticketPrices
    },
    eventTiming: {
      eventDate: eventDate,
      doorOpenTime: doorOpenTime,
      showStartTime: showStartTime,
      doorOpenLabel: doorOpenLabel,
      showStartLabel: showStartLabel
    },
    schedule: {
      duration: duration,
      items: scheduleItems
    },
    description: {
      main: mainDescription,
      sections: descriptionSections
    },
    gallery: galleryImages,
    sliderImages: sliderImages,
    totalSliderImages: sliderImages.length,
    buyButton: {
      url: buyButtonUrl,
      text: buyButtonText,
      ga4Data: ga4Data,
      webengageData: webengageData
    },
    similarEvents: similarEvents,
    whyBuy: {
      reasons: whyBuyReasons,
      paymentOptions: paymentOptions
    },
    lastScraped: new Date().toISOString()
  };
}

export async function getEventData(slug, city = 'cairo', skipCache = false) {
  try {
    await db.init();
    
    const manualEvent = await db.getEventBySlug(slug);
    
    if (manualEvent) {
      const tags = manualEvent.tags ? JSON.parse(manualEvent.tags) : [];
      const metadata = manualEvent.metadata ? JSON.parse(manualEvent.metadata) : {};

      const eventData = {
        eventId: `manual_${manualEvent.id}`,
        eventUrl: `/api/events?slug=${manualEvent.slug}`,
        title: manualEvent.title,
        teaser: manualEvent.description || '',
        location: {
          name: manualEvent.venue || '',
          address: manualEvent.address || ''
        },
        pricing: {
          priceFrom: (() => {
            const prices = [];
            if (manualEvent.silver_price) prices.push(parseFloat(manualEvent.silver_price.replace(/[^\d.]/g, '')));
            if (manualEvent.gold_price) prices.push(parseFloat(manualEvent.gold_price.replace(/[^\d.]/g, '')));
            if (manualEvent.platinum_price) prices.push(parseFloat(manualEvent.platinum_price.replace(/[^\d.]/g, '')));
            if (manualEvent.vip_price) prices.push(parseFloat(manualEvent.vip_price.replace(/[^\d.]/g, '')));
            if (manualEvent.diamond_price) prices.push(parseFloat(manualEvent.diamond_price.replace(/[^\d.]/g, '')));
            if (manualEvent.global_price) prices.push(parseFloat(manualEvent.global_price.replace(/[^\d.]/g, '')));
            if (manualEvent.price) prices.push(parseFloat(manualEvent.price.replace(/[^\d.]/g, '')));
            
            if (prices.length > 0) {
              const minPrice = Math.min(...prices.filter(p => !isNaN(p)));
              const currency = manualEvent.pricing_currency || 'SAR';
              return `${minPrice} ${currency}`;
            }
            return 'السعر غير متوفر';
          })(),
          acceleratorText: manualEvent.accelerator || '',
          silver_price: manualEvent.silver_price || null,
          gold_price: manualEvent.gold_price || null,
          platinum_price: manualEvent.platinum_price || null,
          vip_price: manualEvent.vip_price || null,
          diamond_price: manualEvent.diamond_price || null,
          global_price: manualEvent.global_price || null,
          pricing_currency: manualEvent.pricing_currency || 'SAR',
          ticketPrices: (() => {
            const ticketPrices = [];
            if (manualEvent.silver_price) ticketPrices.push({ name: 'تذكرة فضية', price: manualEvent.silver_price });
            if (manualEvent.gold_price) ticketPrices.push({ name: 'تذكرة ذهبية', price: manualEvent.gold_price });
            if (manualEvent.platinum_price) ticketPrices.push({ name: 'تذكرة بلاتينية', price: manualEvent.platinum_price });
            if (manualEvent.vip_price) ticketPrices.push({ name: 'تذكرة VIP', price: manualEvent.vip_price });
            if (manualEvent.diamond_price) ticketPrices.push({ name: 'تذكرة ماسية', price: manualEvent.diamond_price });
            if (manualEvent.global_price) ticketPrices.push({ name: 'تذكرة عامة', price: manualEvent.global_price });
            if (ticketPrices.length === 0 && manualEvent.price) {
              ticketPrices.push({ name: 'تذكرة عامة', price: manualEvent.price });
            }
            return ticketPrices;
          })()
        },
        eventTiming: {
          eventDate: manualEvent.date || '',
          doorOpenTime: manualEvent.start_time || '',
          showStartTime: manualEvent.start_time || '',
          doorOpenLabel: 'تُفتح الأبواب:',
          showStartLabel: 'يبدأ العرض:'
        },
        schedule: {
          duration: '',
          items: []
        },
        description: {
          main: manualEvent.description || '',
          sections: []
        },
        gallery: [],
        sliderImages: manualEvent.image_url ? [{
          id: '1',
          title: manualEvent.alt || manualEvent.title,
          imageUrl: manualEvent.image_url,
          imageFull: manualEvent.image_full || manualEvent.image_url,
          mobileThumb: manualEvent.mobile_thumb || manualEvent.image_url,
          href: null,
          alt: manualEvent.alt || manualEvent.title,
          hasVideo: false,
          videoUrl: null,
          isActive: true,
        }] : [],
        totalSliderImages: manualEvent.image_url ? 1 : 0,
        buyButton: {
          url: manualEvent.external_url || '#',
          text: 'اختيار التذاكر',
          ga4Data: null,
          webengageData: null
        },
        similarEvents: [],
        whyBuy: {
          reasons: [],
          paymentOptions: []
        },
        isManual: true,
        venue: manualEvent.venue,
        category: manualEvent.category,
        label: manualEvent.label,
        rating: manualEvent.rating,
        discount: manualEvent.discount,
        tags: tags,
        metadata: metadata,
        priority: manualEvent.priority,
        city_slug: manualEvent.city_slug,
        created_at: manualEvent.created_at,
        updated_at: manualEvent.updated_at,
        lastScraped: new Date().toISOString(),
        map_image: manualEvent.map_image || metadata?.map_image || null
      };

      return {
        success: true,
        data: eventData,
        cached: false,
        cacheAge: 0,
        parameters: {
          slug,
          city,
          skipCache
        },
        isManual: true,
        scrapedAt: new Date().toISOString()
      };
    }
    
    let url = `https://${city}.platinumlist.net/ar/event-tickets/${slug}`;

    const scrapingOptions = {
      url: url,
      cacheKey: skipCache ? null : `event-details-${city}-${slug}`,
      cacheTTL: 10 * 60 * 1000,
      dataExtractor: eventDetailsExtractor,
      pageOptions: {
        waitForFunction: 'document.querySelectorAll(".full-width-slider-item:not(.slick-cloned)").length >= 1',
        waitForFunctionTimeout: 25000,
      }
    };

    const result = await scrapePage(scrapingOptions);

    if (result.success) {
      console.log(`[EventData] Successfully scraped event: ${slug}`);
    } else {
      console.error(`[EventData] Failed to scrape event: ${slug}, Error: ${result.error}`);
    }

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        url: url
      };
    }

    return {
      success: true,
      data: result.data,
      cached: result.cached,
      cacheAge: result.cacheAge || 0,
      parameters: {
        slug,
        city,
        skipCache
      },
      isManual: false,
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('getEventData error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
