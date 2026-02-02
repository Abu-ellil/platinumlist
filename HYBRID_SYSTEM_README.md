# Platinum List - Hybrid Events System

## 🎯 Overview

This system implements a **hybrid approach** that combines **scraped events** from PlatinumList.net with **manually added events** through an admin dashboard. Manual events are prioritized and appear first in the listings.

## 🏗️ Architecture

### Key Components

1. **Database Layer** (`utils/database.js`)
   - SQLite database for manual events and cities
   - Full CRUD operations
   - Event prioritization system
   - Cities management

2. **Hybrid API** (`app/api/city/[slug]/route.js`)
   - Fetches manual events from database
   - Scrapes events from PlatinumList.net
   - Combines and deduplicates events
   - Prioritizes manual events

3. **Admin Dashboard** (`app/admin/`)
   - Complete event management interface
   - Statistics and analytics
   - Cities management
   - Arabic RTL interface

4. **Cities Configuration** (`utils/cities.js`)
   - Complete list of Saudi cities
   - Population and region data
   - Helper functions for city operations

## 🗃️ Database Schema

### Cities Table
```sql
CREATE TABLE cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  country TEXT DEFAULT 'SA',
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Manual Events Table
```sql
CREATE TABLE manual_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  crossed_price TEXT,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  venue TEXT,
  address TEXT,
  category TEXT,
  label TEXT,
  rating TEXT,
  accelerator TEXT,
  accelerator_type TEXT,
  discount TEXT,
  href TEXT,
  external_url TEXT,
  image_url TEXT,
  image_full TEXT,
  mobile_thumb TEXT,
  alt TEXT,
  is_featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  tags TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_slug) REFERENCES cities(slug)
);
```

## 🚀 API Endpoints

### Public APIs

#### Get City Events (Hybrid)
```
GET /api/city/[slug]
```
Returns combined scraped + manual events for a city.

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [...],
    "totalEvents": 25,
    "manualEventsCount": 5,
    "scrapedEventsCount": 20,
    "isHybrid": true,
    "nearbyCities": [...],
    "sliderBanners": [...],
    "headerNavigation": {...}
  }
}
```

### Admin APIs

#### Events Management
```
GET    /api/admin/events              # List all events with pagination
POST   /api/admin/events              # Create new event
GET    /api/admin/events/[id]         # Get specific event
PUT    /api/admin/events/[id]         # Update event
DELETE /api/admin/events/[id]         # Delete event
PATCH  /api/admin/events/[id]         # Toggle event status
```

#### Cities Management
```
GET    /api/admin/cities              # List all cities
POST   /api/admin/cities              # Create new city
```

#### Statistics
```
GET    /api/admin/stats               # Dashboard statistics
```

## 🎨 Admin Dashboard Features

### Dashboard (`/admin`)
- Overview statistics
- Top cities by events
- Recent activity feed
- Cities breakdown table

### Events Management (`/admin/events`)
- List all events with pagination
- Search and filter functionality
- Bulk operations
- Quick status toggles

### Create/Edit Events (`/admin/events/new`, `/admin/events/[id]/edit`)
- Comprehensive form with all event fields
- Image upload support
- Tags and metadata management
- Priority system for ordering

## 🔄 Hybrid Event Flow

1. **User visits city page** (`/[city]`)
2. **System checks database** for manual events
3. **System scrapes** PlatinumList.net for events
4. **Events are combined** with manual events first
5. **Duplicates removed** based on title matching
6. **Final list returned** with hybrid flag

## 🏙️ Supported Cities

The system supports **40+ Saudi cities** including:

### Major Cities
- الرياض (Riyadh)
- جدة (Jeddah) 
- مكة المكرمة (Mecca)
- المدينة المنورة (Medina)
- الدمام (Dammam)
- الخبر (Khobar)

### Regional Centers
- الطائف (Taif)
- تبوك (Tabuk)
- بريدة (Buraidah)
- خميس مشيط (Khamis Mushait)
- حائل (Hail)
- الهفوف (Hofuf)

[See complete list in `utils/cities.js`]

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_PATH=./data/events.db

# API Settings
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cache Settings
CACHE_TTL=600000  # 10 minutes
```

### Cache Management
- **Scraped data**: Cached for 10 minutes
- **Manual events**: No caching (real-time updates)
- **Database**: SQLite with WAL mode for concurrency

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Initialize database:**
```bash
# Database auto-initializes on first run
# Default cities are seeded automatically
```

3. **Start development:**
```bash
npm run dev
```

4. **Access admin dashboard:**
```
http://localhost:3000/admin
```

## 📊 Event Priority System

Events are ordered by:
1. **Manual events** (priority field, desc)
2. **Scraped events** (original order)

Manual events with higher priority values appear first.

## 🎯 Key Features

### ✅ Hybrid Data Source
- Combines manual + scraped events
- Real-time manual event updates
- Fallback to manual events if scraping fails

### ✅ Complete CRUD Operations
- Create, read, update, delete events
- Bulk operations support
- Status management (active/inactive)

### ✅ Advanced Search & Filtering
- Search by title, description, venue
- Filter by city, status, date
- Pagination support

### ✅ Arabic RTL Interface
- Full Arabic admin interface
- RTL layout support
- Arabic/English city names

### ✅ Priority Management
- Event ordering by priority
- Featured events support
- Custom event positioning

### ✅ Image Management
- Multiple image sizes support
- ALT text for accessibility
- Mobile-optimized images

### ✅ Analytics & Statistics
- Dashboard overview
- City-wise breakdowns
- Event performance metrics

## 🔒 Security Considerations

- Input validation on all forms
- SQL injection prevention (prepared statements)
- XSS protection
- CSRF protection (Next.js built-in)

## 🚀 Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Set production environment variables**

3. **Start production server:**
```bash
npm start
```

## 📱 Mobile Optimization

- Responsive admin interface
- Touch-friendly controls
- Mobile image variants
- RTL mobile layout

## 🎨 Styling

- **Tailwind CSS** for styling
- **Custom platinum theme** colors
- **Arabic font** support (Noto Sans Arabic)
- **Dark/light mode** ready

## 🔧 Development Tips

### Adding New Cities
```javascript
// Add to utils/cities.js
{ 
  slug: 'new-city', 
  name_ar: 'المدينة الجديدة', 
  name_en: 'New City', 
  region: 'المنطقة', 
  population: 100000, 
  is_major: false 
}
```

### Custom Event Fields
Add new fields to:
1. Database schema (`utils/database.js`)
2. API endpoints (`app/api/admin/events/`)
3. Admin forms (`app/admin/events/`)

### Extending Analytics
Modify `app/api/admin/stats/route.js` to add new metrics.

## 📞 Support

For technical support or questions about the hybrid system, contact the development team.

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Author:** Platinum List Development Team 