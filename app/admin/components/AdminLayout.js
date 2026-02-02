'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children, title = "لوحة التحكم", showBackButton = false, backHref = "/admin" }) {
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              {showBackButton && (
                <>
                  <Link href={backHref} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    العودة
                  </Link>
                  <div className="h-6 w-px bg-gray-300"></div>
                </>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-md font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {children}
      </main>
    </div>
  );
} 