'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AuthWrapper from '../../../components/AuthWrapper';
import FileUpload from '../../../../../components/FileUpload';

function EditEventForm() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    city_slug: '',
    title: '',
    description: '',
    price: '',
    crossed_price: '',
    date: '',
    start_time: '',
    end_time: '',
    venue: '',
    address: '',
    google_maps_link: '',
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
  const params = useParams();
  const eventId = params.id;

  useEffect(() => {
    fetchCities();
    fetchEvent();
  }, [eventId]);

  const fetchCities = async () => {
    try {
      // Use the same endpoint and technique as CityModal
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
      } else {
        console.error('API returned error:', data.error || 'Unknown error');
        // Fallback to admin cities API if scraping fails
        const fallbackResponse = await fetch('/api/admin/cities');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success) {
          setCities(fallbackData.data.cities);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
      // Fallback to admin cities API if scraping fails
      try {
        const fallbackResponse = await fetch('/api/admin/cities');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success) {
          setCities(fallbackData.data.cities);
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch also failed:', fallbackErr);
      }
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/events/${eventId}`);
      const data = await response.json();
      
      if (data.success) {
        const event = data.data;
        setFormData({
          city_slug: event.city_slug || '',
          title: event.title || '',
          description: event.description || '',
          price: event.price || '',
          crossed_price: event.crossed_price || '',
          date: event.date || '',
          start_time: event.start_time || '',
          end_time: event.end_time || '',
          venue: event.venue || '',
          address: event.address || '',
          google_maps_link: event.google_maps_link || '',
          category: event.category || '',
          label: event.label || '',
          rating: event.rating || '',
          accelerator: event.accelerator || '',
          accelerator_type: event.accelerator_type || '',
          discount: event.discount || '',
          href: event.href || '',
          external_url: event.external_url || '',
          image_url: event.image_url || '',
          image_full: event.image_full || '',
          mobile_thumb: event.mobile_thumb || '',
          alt: event.alt || '',
          is_featured: event.is_featured || false,
          is_active: event.is_active || false,
          priority: event.priority || 0,
          tags: event.tags || [],
          metadata: event.metadata || {}
        });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('فشل في تحميل بيانات الفعالية');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, manual) => {
    setFormData(prev => ({ ...prev, [field]: manual ? `https://plateniemlist.net${value}` : value }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      setError('العنوان مطلوب');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/events?success=updated');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الفعالية');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الفعالية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/admin/events" className="text-blue-600 hover:text-blue-800">
                ← العودة لإدارة الفعاليات
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">تعديل الفعالية</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">المعلومات الأساسية</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأولوية
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة
                  </label>
                  <p className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600">
                    {cities.find(c => c.slug === formData.city_slug)?.name_ar || formData.city_slug}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير المدينة بعد الإنشاء</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الفعالية *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الفعالية
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف الإضافي
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">التاريخ والوقت</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وقت البداية
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وقت النهاية
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">الموقع</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المكان
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط خرائط جوجل
                </label>
                <input
                  type="url"
                  value={formData.google_maps_link}
                  onChange={(e) => handleInputChange('google_maps_link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://maps.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">أضف رابط الموقع من خرائط جوجل لإظهار الخريطة في صفحة الفعالية</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">التسعير والعروض</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر السابق (مشطوب)
                  </label>
                  <input
                    type="text"
                    value={formData.crossed_price}
                    onChange={(e) => handleInputChange('crossed_price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الخصم
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images and Media */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">الصور والوسائط</h2>
            </div>
            <div className="p-6 space-y-8">
              <FileUpload
                label="الصورة الرئيسية"
                value={formData.image_url}
                onChange={(value) => handleInputChange('image_url', value, true)}
                placeholder="اختر الصورة الرئيسية للفعالية"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUpload
                  label="صورة بجودة عالية"
                  value={formData.image_full}
                  onChange={(value) => handleInputChange('image_full', value, true)}
                  placeholder="اختر صورة بدقة عالية"
                />

                <FileUpload
                  label="صورة مصغرة للهاتف"
                  value={formData.mobile_thumb}
                  onChange={(value) => handleInputChange('mobile_thumb', value, true)}
                  placeholder="اختر صورة مصغرة للعرض على الهاتف"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النص البديل للصورة
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => handleInputChange('alt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="وصف الصورة للمستخدمين ذوي الاحتياجات الخاصة"
                />
                <p className="text-xs text-gray-500 mt-2">هذا النص يظهر إذا فشل تحميل الصورة ويساعد في إمكانية الوصول</p>
              </div>
            </div>
          </div>

          {/* Links and Additional Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">الروابط والمعلومات الإضافية</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط داخلي
                  </label>
                  <input
                    type="text"
                    value={formData.href}
                    onChange={(e) => handleInputChange('href', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط خارجي
                  </label>
                  <input
                    type="url"
                    value={formData.external_url}
                    onChange={(e) => handleInputChange('external_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمات المفتاحية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <Link
              href="/admin/events"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditEvent() {
  return (
    <AuthWrapper>
      <EditEventForm />
    </AuthWrapper>
  );
}