import ContentItem from "@/components/event-tickets/ContentItem";
import SideBar from "@/components/event-tickets/SideBar";
import HeaderWrapper from "@/components/HeaderWrapper";
import Navgation from "@/components/event-tickets/Navgation";
import SliderWrapper from "@/components/event-tickets/SliderWrapper";
import Footer from "@/components/Footer";

async function fetchEventData(slug, city) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const url = `${baseUrl}/api/events?slug=${encodeURIComponent(slug)}&city=${encodeURIComponent(city)}`;
        
        console.log('Fetching event data from:', url);
        
        const response = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API request failed: ${response.status} - ${errorText}`);
            return { 
                success: false, 
                error: `Failed to fetch event data: ${response.status}` 
            };
        }
        
        const data = await response.json();
        console.log('--- Event Page Data Log ---');
        console.log(data);
        console.log('--- End Event Page Data Log ---');
        
        // Process pricing data to ensure consistent format
        if (data.success && data.data) {
            const eventData = data.data;
            
            // Ensure pricing data includes currency
            const currency = eventData.pricing_currency || eventData.currency || 'SAR';
            
            // Format pricing data consistently
            const formatPrice = (price) => {
                if (!price) return null;
                // Remove any existing currency symbols and formatting
                const numericPrice = price.toString().replace(/[^0-9.]/g, '');
                return `${numericPrice} ${currency}`;
            };

            // Update all price fields with consistent formatting
            eventData.global_price = formatPrice(eventData.global_price);
            eventData.gold_price = formatPrice(eventData.gold_price);
            eventData.platinum_price = formatPrice(eventData.platinum_price);
            eventData.vip_price = formatPrice(eventData.vip_price);
            eventData.silver_price = formatPrice(eventData.silver_price);
            eventData.price = formatPrice(eventData.price);
            eventData.crossed_price = formatPrice(eventData.crossed_price);
            
            // Ensure currency is explicitly set
            eventData.pricing_currency = currency;
            
            // Store formatted data in localStorage for checkout
            if (typeof window !== 'undefined') {
                localStorage.setItem('eventData', JSON.stringify({
                    ...eventData,
                    currency: currency,
                    pricing: {
                        global: eventData.global_price,
                        gold: eventData.gold_price,
                        platinum: eventData.platinum_price,
                        vip: eventData.vip_price,
                        silver: eventData.silver_price
                    }
                }));
            }

            data.data = eventData;
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching event data:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

async function fetchCityData(citySlug) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/city/${citySlug}`, {
        cache: 'no-store' // Ensure fresh data
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch city data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching city data:', error);
      return null;
    }
  }
const EventTickets = async ({ params }) => {
    const { slug, city } = await params;
    
    // Handle catch-all routes by joining slug parts with a slash
    const finalSlug = Array.isArray(slug) ? slug.join('/') : slug;
    const cityData = await fetchCityData(city);

    // Fetch event data server-side
    const eventData = await fetchEventData(finalSlug, city);
    
    // Handle loading/error states
    if (!eventData.success || eventData.error) {
        return (
            <>
                <HeaderWrapper cityData={cityData} />
                <Navgation />
                <SliderWrapper sliderData={eventData?.data?.sliderImages || []} />
                <div className="container2 padded event-item clearfix">
                    <div className="error-message">
                        <h1>خطأ في تحميل البيانات</h1>
                        <p>عذراً، حدث خطأ أثناء تحميل بيانات الفعالية: {eventData.error}</p>
                        <p>يرجى المحاولة مرة أخرى لاحقاً.</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Check if we have valid event data
    if (!eventData.data) {
        return (
            <>
                <HeaderWrapper cityData={cityData}/>
                <Navgation />
                <SliderWrapper sliderData={eventData?.data?.sliderImages || []} />
                <div className="container2 padded event-item clearfix">
                    <div className="error-message">
                        <h1>لا توجد بيانات</h1>
                        <p>لم يتم العثور على بيانات الفعالية المطلوبة.</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Ensure pricing data is available in the client
    const scriptContent = `
        window.eventPricing = ${JSON.stringify({
            currency: eventData.data.pricing_currency,
            prices: {
                global: eventData.data.global_price,
                gold: eventData.data.gold_price,
                platinum: eventData.data.platinum_price,
                vip: eventData.data.vip_price,
                silver: eventData.data.silver_price
            }
        })};
    `;

    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
            <HeaderWrapper cityData={cityData} />
            <Navgation />
            <SliderWrapper sliderData={eventData.data.sliderImages || []} />
            <div className="container2 padded event-item clearfix">
                <SideBar data={eventData} slug={finalSlug} />
                <ContentItem data={eventData} slug={finalSlug} />
            </div>
            <Footer />
        </>
    );
}

export default EventTickets;
