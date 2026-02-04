import CardsWrapper from "@/components/cities/CardsWrapper";
import TicktsPromo from "@/components/cities/TicktsPromo";
import Footer from "@/components/Footer";
import Payments from "@/components/cities/Payments";
import Download from "@/components/cities/Download";
import Categories from "@/components/cities/Categories";
import NearbyWrapper from "@/components/cities/NearbyWrapper";
import SliderWrapper from "@/components/cities/SliderWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";

async function fetchCityData(citySlug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/city/${citySlug}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch city data');
    }
    
    const data = await response.json();
    console.log('--- City Page Data Log ---');
    console.log(data);
    console.log('--- End City Page Data Log ---');
    return data;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
}

export default async function CityPage({ params }) {
  const { city } = await params;
  
  // Fetch city data including events, nearby cities, slider banners, and header navigation
  const cityData = await fetchCityData(city);
  const eventsData = cityData?.data?.events || [];
  const nearbyCities = cityData?.data?.nearbyCities || [];
  const sliderBanners = cityData?.data?.sliderBanners || [];
  const headerNavigation = cityData?.data?.headerNavigation || { mainLinks: [], dropdowns: {} };
  const sectionTitle = cityData?.data?.sectionTitle || 'أبرز الفعاليات';
  const currentCityName = cityData?.data?.currentCityName || 'المدينة';
  const isFallback = cityData?.fallbackSource === 'database';

      return (
    <div>
      <HeaderWrapper navigationData={headerNavigation} cityData={cityData} currentCityName={currentCityName} />
      <SliderWrapper sliderData={sliderBanners} />
      <CardsWrapper
        citySlug={city} 
        eventsData={eventsData} 
        sectionTitle={sectionTitle}
        serverError={!cityData?.success}
        isFallback={isFallback}
      />
      <NearbyWrapper citiesData={nearbyCities} />
      <Categories />
      <Download />
      <Payments />
      <TicktsPromo />
      <Footer />
    </div>
  );
}