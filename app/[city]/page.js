import CardsWrapper from "@/components/cities/CardsWrapper";
import TicktsPromo from "@/components/cities/TicktsPromo";
import Footer from "@/components/Footer";
import Payments from "@/components/cities/Payments";
import Download from "@/components/cities/Download";
import Categories from "@/components/cities/Categories";
import NearbyWrapper from "@/components/cities/NearbyWrapper";
import SliderWrapper from "@/components/cities/SliderWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";
import { getCityData } from "@/utils/cityData";

async function fetchCityData(citySlug) {
  return await getCityData(citySlug);
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

      return (
    <div>
      <HeaderWrapper navigationData={headerNavigation} cityData={cityData} currentCityName={currentCityName} />
      <SliderWrapper sliderData={sliderBanners} />
      <CardsWrapper
        citySlug={city} 
        eventsData={eventsData} 
        sectionTitle={sectionTitle}
        serverError={!cityData?.success}
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