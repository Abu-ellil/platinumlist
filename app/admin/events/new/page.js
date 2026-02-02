'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthWrapper from '../../components/AuthWrapper';
import FileUpload from '../../../../components/FileUpload';

function NewEventForm() {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    city_slug: '',
    title: '',
    description: '',
    price: '',
    crossed_price: '',
    global_price: '',
    gold_price: '',
    platinum_price: '',
    vip_price: '',
    silver_price: '',
    diamond_price: '',
    pricing_currency: 'SAR',
    currency: 'SAR',
    date: '',
    start_time: '',
    end_time: '',
    venue: '',
    address: '',
    google_maps_link: '',
    map_image: '', // Add map image field
    category: '',
    label: '',
    rating: '',
    accelerator: '',
    accelerator_type: '',
    discount: '',
    href: '',
    external_url: '',
    image_url: '',
    image_full: '',
    mobile_thumb: '',
    alt: '',
    is_featured: false,
    is_active: true,
    priority: 0,
    tags: [],
    metadata: {}
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const currencies = [
    { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
    { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
    { code: 'EUR', name: 'يورو', symbol: '€' },
    { code: 'GBP', name: 'جنيه استرليني', symbol: '£' },
    { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
    { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق' },
    { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك' },
    { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب' },
    { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع' }
  ];

  useEffect(() => {
    fetchCities();
    
    // Pre-select city if provided in URL
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setFormData(prev => ({ ...prev, city_slug: cityParam }));
    }
  }, [searchParams]);

  const fetchCities = async () => {
    try {
      setLoadingCities(true);

      // Fallback to scraping approach
      const response = await fetch('/api/cities?city=riyadh');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.html) {
        // Parse the HTML to extract cities like CityModal does
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data.html, 'text/html');
        const cityLinks = doc.querySelectorAll('.city-switcher__city-name');
        
        const citiesData = [];
        cityLinks.forEach((link, index) => {
          const cityName = link.textContent.trim();
          const cityHref = link.getAttribute('href');
          
          // Extract city slug from URL
          let citySlug = '';
          if (cityHref) {
            const slugMatch = cityHref.match(/https?:\/\/([^.]+)\.platinumlist\.net/);
            if (slugMatch) {
              citySlug = slugMatch[1];
            }
          }
          
          if (cityName && citySlug) {
            citiesData.push({
              slug: citySlug,
              name_ar: cityName,
              name_en: citySlug
            });
          }
        });
        
        setCities(citiesData);
        console.log('Loaded cities from scraping:', citiesData.length, 'cities');
      } else {
        console.error('API returned error:', data.error || 'Unknown error');
        setError('فشل في تحميل قائمة المدن. يرجى إعادة تحميل الصفحة.');
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
      setError('فشل في تحميل قائمة المدن. يرجى التحقق من الاتصال بالإنترنت.');
    } finally {
      setLoadingCities(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = () => {
    if (!formData.city_slug || !formData.title) {
      setError('المدينة والعنوان مطلوبان');
      return false;
    }
    
    // Validate that the selected city exists in the cities list
    if (formData.city_slug && cities.length > 0) {
      const cityExists = cities.some(city => city.slug === formData.city_slug);
      if (!cityExists) {
        setError('المدينة المختارة غير صحيحة. يرجى اختيار مدينة من القائمة.');
        return false;
      }
    }

    // Validate that at least one pricing tier is set
    const hasPricing = formData.global_price || 
                      formData.gold_price || 
                      formData.platinum_price || 
                      formData.vip_price || 
                      formData.silver_price ||
                      formData.diamond_price;
    
    if (!hasPricing) {
      setError('يجب تحديد سعر واحد على الأقل من خيارات التسعير المتاحة');
      return false;
    }
    
    if (formData.external_url && !formData.external_url.startsWith('http')) {
      setError('الرابط الخارجي يجب أن يبدأ بـ http:// أو https://');
      return false;
    }
    
    return true;
  };

  const prepareFormData = (data) => {
    // Ensure proper data types for SQLite
    return {
      ...data,
      // Convert boolean fields to integers (0 or 1)
      is_featured: data.is_featured ? 1 : 0,
      is_active: data.is_active ? 1 : 0,
      // Ensure priority is an integer
      priority: parseInt(data.priority) || 0,
      // Ensure arrays are properly formatted
      tags: Array.isArray(data.tags) ? data.tags : [],
      // Set pricing currency from selected currency
      pricing_currency: data.currency,
      // Add currency to metadata if specified
      metadata: {
        ...data.metadata,
        currency: data.currency,
        map_image: data.map_image // Add map image to metadata
      },
      // Format price with currency if both are provided (maintain backward compatibility)
      price: data.price && data.currency ? `${data.price} ${data.currency}` : data.price,
      crossed_price: data.crossed_price && data.currency ? `${data.crossed_price} ${data.currency}` : data.crossed_price,
      // Format pricing tiers
      global_price: data.global_price ? `${data.global_price} ${data.currency}` : null,
      gold_price: data.gold_price ? `${data.gold_price} ${data.currency}` : null,
      platinum_price: data.platinum_price ? `${data.platinum_price} ${data.currency}` : null,
      vip_price: data.vip_price ? `${data.vip_price} ${data.currency}` : null,
      silver_price: data.silver_price ? `${data.silver_price} ${data.currency}` : null,
      diamond_price: data.diamond_price ? `${data.diamond_price} ${data.currency}` : null,
      // Add map image
      map_image: data.map_image || null
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const preparedData = prepareFormData(formData);

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preparedData)
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/events?success=created');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الفعالية');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <style jsx global>{`
        input, select, textarea {
          color: #000000 !important;
        }
        input::placeholder, textarea::placeholder {
          color: #666666 !important;
        }
        option {
          color: #000000 !important;
        }
        .form-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .form-card {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }
        .form-card:hover {
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6 space-x-reverse">
              <Link href="/admin/events" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة لإدارة الفعاليات
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 ml-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة فعالية جديدة
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="form-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="form-section p-6">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                المعلومات الأساسية
              </h2>
              <p className="mt-2 opacity-90">أدخل التفاصيل الأساسية للفعالية</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    المدينة * {cities.length > 0 && (
                      <span className="text-xs text-gray-500 font-normal">
                        ({cities.length} مدينة متاحة)
                      </span>
                    )}
                  </label>
                  <select
                    value={formData.city_slug}
                    onChange={(e) => handleInputChange('city_slug', e.target.value)}
                    required
                    disabled={loadingCities}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingCities ? 'جاري تحميل المدن...' : cities.length > 0 ? 'اختر المدينة' : 'لا توجد مدن متاحة'}
                    </option>
                    {cities.map(city => (
                      <option key={city.slug} value={city.slug}>
                        {city.name_ar}
                      </option>
                    ))}
                  </select>
                  {loadingCities && (
                    <p className="text-xs text-blue-600 mt-2">جاري تحميل قائمة المدن...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    الأولوية
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-2">الأولوية الأعلى تظهر أولاً</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  عنوان الفعالية *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="أدخل عنوان الفعالية"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  وصف الفعالية
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200 resize-vertical"
                  placeholder="أدخل وصف مفصل للفعالية"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                    placeholder="مثال: ترفيه، رياضة، ثقافة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    تصنيف إضافي
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                    placeholder="تصنيف فرعي"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="form-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="form-section p-6">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 0 002-2V7a2 0 00-2-2H5a2 0 00-2 2v12a2 0 002 2z" />
                </svg>
                التاريخ والوقت
              </h2>
              <p className="mt-2 opacity-90">حدد تاريخ ووقت بدء ونهاية الفعالية</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    وقت البداية
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    وقت النهاية
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="form-section p-6">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                الموقع
              </h2>
              <p className="mt-2 opacity-90">حدد موقع الفعالية والعنوان التفصيلي</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  المكان
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="اسم المكان أو القاعة"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="العنوان التفصيلي"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  رابط خرائط جوجل
                </label>
                <input
                  type="url"
                  value={formData.google_maps_link}
                  onChange={(e) => handleInputChange('google_maps_link', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="https://maps.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-2">أضف رابط الموقع من خرائط جوجل لإظهار الخريطة في صفحة الفعالية</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  صورة الخريطة
                </label>
                <FileUpload
                  label="صورة الخريطة"
                  value={formData.map_image}
                  onChange={(value) => handleInputChange('map_image', value)}
                  placeholder="اختر صورة الخريطة للموقع"
                />
                <p className="text-xs text-gray-500 mt-2">أضف صورة للخريطة لعرضها في صفحة الفعالية</p>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="form-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="form-section p-6">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                التسعير والعملة
              </h2>
              <p className="mt-2 opacity-90">حدد أسعار التذاكر حسب الفئات المختلفة (يجب تحديد فئة واحدة على الأقل)</p>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  العملة
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Global Price */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-gray-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-800">السعر العام</h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.global_price}
                    onChange={(e) => handleInputChange('global_price', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg input-focus transition-all duration-200 pl-16"
                    placeholder="السعر العام للفعالية"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    {currencies.find(c => c.code === formData.currency)?.symbol}
                  </div>
                </div>
              </div>

              {/* Pricing Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diamond Tier */}
                <div className="bg-[#d678f5]/10 p-6 rounded-lg border-2 border-[#d678f5]/30">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-[#d678f5] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" />
                    </svg>
                    <h3 className="text-lg font-bold text-[#d678f5]">تذكرة دايموند</h3>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.diamond_price}
                      onChange={(e) => handleInputChange('diamond_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#d678f5]/30 rounded-lg input-focus transition-all duration-200 pl-16"
                      placeholder="سعر تذكرة دايموند"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {currencies.find(c => c.code === formData.currency)?.symbol}
                    </div>
                  </div>
                </div>

                {/* Gold Tier */}
                <div className="bg-[#5c90f7]/10 p-6 rounded-lg border-2 border-[#5c90f7]/30">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-[#5c90f7] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" />
                    </svg>
                    <h3 className="text-lg font-bold text-[#5c90f7]">تذكرة ذهبية</h3>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.gold_price}
                      onChange={(e) => handleInputChange('gold_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#5c90f7]/30 rounded-lg input-focus transition-all duration-200 pl-16"
                      placeholder="سعر التذكرة الذهبية"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {currencies.find(c => c.code === formData.currency)?.symbol}
                    </div>
                  </div>
                </div>

                {/* Platinum Tier */}
                <div className="bg-[#7c71f2]/10 p-6 rounded-lg border-2 border-[#7c71f2]/30">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-[#7c71f2] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-[#7c71f2]">تذكرة بلاتينية</h3>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.platinum_price}
                      onChange={(e) => handleInputChange('platinum_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#7c71f2]/30 rounded-lg input-focus transition-all duration-200 pl-16"
                      placeholder="سعر التذكرة البلاتينية"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {currencies.find(c => c.code === formData.currency)?.symbol}
                    </div>
                  </div>
                </div>

                {/* VIP Tier */}
                <div className="bg-[#ef6565]/10 p-6 rounded-lg border-2 border-[#ef6565]/30">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-[#ef6565] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.719,17.073l-6.562-6.51c-0.27-0.268-0.27-0.701,0-0.969l0.943-0.943c0.27-0.268,0.688-0.268,0.958,0l5.124,5.069l9.17-9.069c0.268-0.268,0.701-0.268,0.969,0l0.943,0.943c0.27,0.268,0.27,0.701,0,0.969L10.677,17.073C10.409,17.341,9.988,17.341,9.719,17.073z" />
                    </svg>
                    <h3 className="text-lg font-bold text-[#ef6565]">تذكرة VIP</h3>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.vip_price}
                      onChange={(e) => handleInputChange('vip_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#ef6565]/30 rounded-lg input-focus transition-all duration-200 pl-16"
                      placeholder="سعر تذكرة VIP"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {currencies.find(c => c.code === formData.currency)?.symbol}
                    </div>
                  </div>
                </div>

                {/* Silver Tier */}
                <div className="bg-[#4ebaf7]/10 p-6 rounded-lg border-2 border-[#4ebaf7]/30">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-[#4ebaf7] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                    </svg>
                    <h3 className="text-lg font-bold text-[#4ebaf7]">تذكرة فضية</h3>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.silver_price}
                      onChange={(e) => handleInputChange('silver_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#4ebaf7]/30 rounded-lg input-focus transition-all duration-200 pl-16"
                      placeholder="سعر التذكرة الفضية"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {currencies.find(c => c.code === formData.currency)?.symbol}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legacy Pricing (Backward Compatibility) */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات إضافية للتسعير</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      السعر القديم (للتوافق مع النظام القديم)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200 pl-16"
                        placeholder="100"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        {currencies.find(c => c.code === formData.currency)?.symbol}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      السعر السابق (مشطوب)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.crossed_price}
                        onChange={(e) => handleInputChange('crossed_price', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200 pl-16"
                        placeholder="150"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        {currencies.find(c => c.code === formData.currency)?.symbol}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      نسبة الخصم
                    </label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                      placeholder="25% خصم"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links and Additional Info */}
          <div className="form-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="form-section p-6">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                الروابط والمعلومات الإضافية
              </h2>
              <p className="mt-2 opacity-90">أضف روابط وتفاصيل إضافية للفعالية</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    رابط داخلي
                  </label>
                  <input
                    type="text"
                    value={formData.href}
                    onChange={(e) => handleInputChange('href', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                    placeholder="/event/123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    رابط خارجي
                  </label>
                  <input
                    type="url"
                    value={formData.external_url}
                    onChange={(e) => handleInputChange('external_url', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                    placeholder="https://external-site.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  التقييم
                </label>
                <input
                  type="text"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="مثال: 4.5 نجوم"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  الكلمات المفتاحية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="ترفيه, عائلي, موسيقى"
                />
              </div>

              <div className="flex items-center space-x-6 space-x-reverse">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm font-medium text-gray-700">فعالية مميزة</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm font-medium text-gray-700">فعالية نشطة</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images and Media */}
          <div className="form-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="form-section p-6">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                الصور والوسائط
              </h2>
              <p className="mt-2 opacity-90">ارفع صور ووسائط متعددة للفعالية</p>
            </div>
            <div className="p-8 space-y-8">
              <FileUpload
                label="الصورة الرئيسية"
                value={formData.image_url}
                onChange={(value) => handleInputChange('image_url', value)}
                placeholder="اختر الصورة الرئيسية للفعالية"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUpload
                  label="صورة بجودة عالية"
                  value={formData.image_full}
                  onChange={(value) => handleInputChange('image_full', value)}
                  placeholder="اختر صورة بدقة عالية"
                />

                <FileUpload
                  label="صورة مصغرة للهاتف"
                  value={formData.mobile_thumb}
                  onChange={(value) => handleInputChange('mobile_thumb', value)}
                  placeholder="اختر صورة مصغرة للعرض على الهاتف"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  النص البديل للصورة
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => handleInputChange('alt', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200"
                  placeholder="وصف الصورة للمستخدمين ذوي الاحتياجات الخاصة"
                />
                <p className="text-xs text-gray-500 mt-2">هذا النص يظهر إذا فشل تحميل الصورة ويساعد في إمكانية الوصول</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <Link
              href="/admin/events"
              className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  إنشاء الفعالية
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewEvent() {
  return (
    <AuthWrapper>
      <NewEventForm />
    </AuthWrapper>
  );
}