'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Login Component
function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        onLogin();
      } else {
        setError('كلمة مرور خاطئة');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">دخول الإدارة</h2>
            <p className="text-gray-600 mt-2">أدخل كلمة المرور للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="أدخل كلمة المرور..."
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  جاري الدخول...
                </div>
              ) : (
                'دخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal Component
function Modal({ isOpen, onClose, title, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/20 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal panel */}
        <div className={`relative z-50 inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${className}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right flex-1">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                  {title}
                </h3>
                <div className="mt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Confirmation Modal
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "تأكيد", cancelText = "إلغاء", type = "danger" }) {
  const buttonColors = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500"
  };

  const iconTypes = {
    danger: (
      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    warning: (
      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    success: (
      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        <div className="sm:flex sm:items-start">
          {iconTypes[type]}
          <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right flex-1">
            <h3 className="text-lg leading-6 font-bold text-gray-900 mb-3">
              {title}
            </h3>
            <div className="text-sm text-gray-600 mb-6 leading-relaxed">
              {message}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${buttonColors[type]}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Toast Notification
function Toast({ message, type = "success", isVisible, onClose }) {
  if (!isVisible) return null;

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <span>{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function EventsManagement() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    city: '',
    search: '',
    status: 'all',
    page: 1,
    limit: 20
  });
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventId: null, eventTitle: '' });
  const [statusModal, setStatusModal] = useState({ isOpen: false, eventId: null, eventTitle: '', currentStatus: false });
  
  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    setIsAuthenticated(authStatus === 'true');
    setAuthLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast({ isVisible: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    // Initialize filters from URL params
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setFilters(prev => ({ ...prev, city: cityParam }));
    }
    
    // Check for success message
    const success = searchParams.get('success');
    if (success === 'created') {
      showToast('تم إنشاء الفعالية بنجاح!', 'success');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCities();
    fetchEvents();
  }, [filters]);

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
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/admin/events?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data.events);
        setPagination(data.data.pagination);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('فشل في تحميل الفعاليات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('تم حذف الفعالية بنجاح!', 'success');
        fetchEvents(); // Refresh list
      } else {
        showToast('خطأ في حذف الفعالية: ' + data.error, 'error');
      }
    } catch (err) {
      showToast('خطأ في حذف الفعالية', 'error');
    }
  };

  const handleToggleStatus = async (eventId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'toggle_status',
          is_active: newStatus
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast(`تم ${newStatus ? 'تفعيل' : 'إلغاء تفعيل'} الفعالية بنجاح!`, 'success');
        fetchEvents(); // Refresh list
      } else {
        showToast('خطأ في تغيير حالة الفعالية: ' + data.error, 'error');
      }
    } catch (err) {
      showToast('خطأ في تغيير حالة الفعالية', 'error');
    }
  };

  const openDeleteModal = (event) => {
    setDeleteModal({
      isOpen: true,
      eventId: event.id,
      eventTitle: event.title
    });
  };

  const openStatusModal = (event) => {
    setStatusModal({
      isOpen: true,
      eventId: event.id,
      eventTitle: event.title,
      currentStatus: event.is_active
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getCityName = (slug) => {
    const city = cities.find(c => c.slug === slug);
    return city ? city.name_ar : slug;
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">جاري تحميل الفعاليات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        
        .card-hover {
          transition: all 0.2s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />

      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6">
            {/* Top section - Back link and title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link href="/admin" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="hidden sm:inline">العودة للوحة التحكم</span>
                  <span className="sm:hidden">العودة</span>
                </Link>
                <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 0 002-2V7a2 0 00-2-2H5a2 0 00-2 2v12a2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">إدارة الفعاليات</span>
                  <span className="sm:hidden">الفعاليات</span>
                </h1>
              </div>
              
              {/* Mobile add button */}
              <Link 
                href="/admin/events/new" 
                className="btn-primary px-4 py-2 text-white rounded-lg font-medium shadow-lg flex items-center sm:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>

            {/* Bottom section - Stats and desktop add button */}
            <div className="flex items-center justify-between mt-3 sm:mt-0 sm:space-x-4 sm:space-x-reverse">
              {pagination.totalEvents > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                  {pagination.totalEvents} فعالية
                </span>
              )}
              
              {/* Desktop add button */}
              <div className="hidden sm:flex items-center space-x-3 space-x-reverse">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-lg font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  خروج
                </button>
                <Link 
                  href="/admin/events/new" 
                  className="btn-primary px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg font-medium shadow-lg flex items-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden lg:inline">إضافة فعالية جديدة</span>
                  <span className="lg:hidden">إضافة فعالية</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg mb-8 card-hover animate-fade-in">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              البحث والتصفية
            </h2>
            <p className="text-gray-600 mt-1">استخدم المرشحات للعثور على الفعاليات المطلوبة</p>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                البحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="البحث في العنوان أو الوصف..."
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                المدينة
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">جميع المدن</option>
                {cities.map(city => (
                  <option key={city.slug} value={city.slug}>
                    {city.name_ar}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                الحالة
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                عدد النتائج
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg card-hover animate-fade-in">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                قائمة الفعاليات
                {pagination.totalEvents > 0 && (
                  <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full mr-3">
                    {pagination.totalEvents}
                  </span>
                )}
              </h2>
              {loading && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 ml-2"></div>
                  جاري التحديث...
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="p-6 bg-red-50 border-b border-red-200">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      الفعالية
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      المدينة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      العمليات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          {event.image_url ? (
                            <img 
                              src={event.image_url} 
                              alt={event.alt}
                              className="h-12 w-12 rounded-lg object-cover ml-4 border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 ml-4 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-gray-900">{event.title}</div>
                            {event.venue && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.venue}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                          {getCityName(event.city_slug)}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                        {event.date ? (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 0 002-2V7a2 0 00-2-2H5a2 0 00-2 2v12a2 0 002 2z" />
                            </svg>
                            {event.date}
                          </div>
                        ) : (
                          <span className="text-gray-400">غير محدد</span>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        {event.price ? (
                          <span className="text-green-600 font-bold">{event.price}</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">مجاني</span>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            event.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.is_active ? (
                              <>
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                نشط
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                </svg>
                                غير نشط
                              </>
                            )}
                          </span>
                          {event.is_featured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              مميز
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <Link 
                            href={`/admin/events/${event.id}/edit`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            تعديل
                          </Link>
                          <button
                            onClick={() => openStatusModal(event)}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              event.is_active 
                                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-700' 
                                : 'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700'
                            }`}
                          >
                            {event.is_active ? (
                              <>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 12a9 9 0 00-9-9c2.004 0 3.842.656 5.353 1.767l10.181 10.181z" />
                                </svg>
                                إلغاء تفعيل
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                تفعيل
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => openDeleteModal(event)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 0 002-2V7a2 0 00-2-2H5a2 0 00-2 2v12a2 0 002 2z" />
              </svg>
              <p className="text-xl text-gray-500 mb-4">لا توجد فعاليات متاحة</p>
              <Link 
                href="/admin/events/new"
                className="btn-primary px-6 py-3 text-white rounded-lg font-medium shadow-lg inline-flex items-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة فعالية جديدة
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 font-medium">
                  عرض {((pagination.page - 1) * pagination.limit) + 1} إلى {Math.min(pagination.page * pagination.limit, pagination.totalEvents)} من {pagination.totalEvents} نتيجة
                </div>
                <div className="flex space-x-3 space-x-reverse">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200"
                  >
                    السابق
                  </button>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                    صفحة {pagination.page} من {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' })}
        onConfirm={() => handleDeleteEvent(deleteModal.eventId)}
        title="تأكيد حذف الفعالية"
        message={`هل أنت متأكد من حذف الفعالية "${deleteModal.eventTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
      />

      {/* Status Toggle Modal */}
      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, eventId: null, eventTitle: '', currentStatus: false })}
        onConfirm={() => handleToggleStatus(statusModal.eventId, !statusModal.currentStatus)}
        title={statusModal.currentStatus ? "إلغاء تفعيل الفعالية" : "تفعيل الفعالية"}
        message={`هل أنت متأكد من ${statusModal.currentStatus ? 'إلغاء تفعيل' : 'تفعيل'} الفعالية "${statusModal.eventTitle}"؟`}
        confirmText={statusModal.currentStatus ? "إلغاء تفعيل" : "تفعيل"}
        cancelText="إلغاء"
        type={statusModal.currentStatus ? "warning" : "success"}
      />
    </div>
  );
} 