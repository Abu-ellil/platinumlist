import { useState, useRef } from 'react';

export default function FileUpload({ 
  value, 
  onChange, 
  label, 
  accept = "image/*",
  placeholder = "اختر صورة أو اسحبها هنا",
  required = false 
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Add the full domain URL to the relative path
        const fullUrl = `https://plateniemlist.net${data.url}`;
        onChange(fullUrl);
      } else {
        alert(data.error || 'فشل في رفع الملف');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (e) => {
    onChange(e.target.value);
  };

  const clearFile = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          {label} {required && '*'}
        </label>
      )}
      
      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin w-8 h-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-blue-600 font-medium">جاري رفع الملف...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 font-medium mb-2">{placeholder}</p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP, GIF حتى 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* URL Input Alternative */}
      <div className="relative">
        <input
          type="url"
          value={value || ''}
          onChange={handleUrlChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg input-focus transition-all duration-200 pl-12"
          placeholder="أو أدخل رابط الصورة"
          disabled={uploading}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
      </div>

      {/* Image Preview */}
      {value && !uploading && (
        <div className="relative">
          <img
            src={value}
            alt="معاينة الصورة"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 