import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/**
 * Database Manager for Manual Events
 */
class DatabaseManager {
  constructor(options = {}) {
    this.options = {
      dbPath: options.dbPath || './data/events.db',
      tableName: options.tableName || 'manual_events',
      citiesTable: options.citiesTable || 'cities',
      ...options
    };

    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the database
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Ensure directory exists
      const dbDir = path.dirname(this.options.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Open database connection
      this.db = new Database(this.options.dbPath);
      
      // Disable foreign key constraints
      this.db.pragma('foreign_keys = OFF');
      
      // Enable WAL mode for better concurrency
      this.db.pragma('journal_mode = WAL');
      
      // Create cities table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS ${this.options.citiesTable} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT UNIQUE NOT NULL,
          name_ar TEXT NOT NULL,
          name_en TEXT NOT NULL,
          country TEXT DEFAULT 'SA',
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create manual events table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS ${this.options.tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          city_slug TEXT NOT NULL,
          slug TEXT UNIQUE,
          title TEXT NOT NULL,
          description TEXT,
          price TEXT,
          crossed_price TEXT,
          global_price TEXT,
          gold_price TEXT,
          platinum_price TEXT,
          vip_price TEXT,
          silver_price TEXT,
          diamond_price TEXT,
          pricing_currency TEXT DEFAULT 'SAR',
          date TEXT,
          start_time TEXT,
          end_time TEXT,
          venue TEXT,
          address TEXT,
          google_maps_link TEXT,
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
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create settings table (basic version first)
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create OTP table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS otps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          code TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          attempts INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add slug column if it doesn't exist (for existing databases)
      try {
        this.db.exec(`ALTER TABLE ${this.options.tableName} ADD COLUMN slug TEXT`);
        console.log('Added slug column to events table');
      } catch (error) {
        // Column might already exist, ignore error
        console.log('Slug column already exists or error adding it:', error.message);
      }

      // Add pricing tier columns if they don't exist (for existing databases)
      const pricingColumns = [
        'global_price',
        'gold_price', 
        'platinum_price',
        'vip_price',
        'silver_price',
        'diamond_price',
        'pricing_currency'
      ];

      for (const column of pricingColumns) {
        try {
          const defaultValue = column === 'pricing_currency' ? 'TEXT DEFAULT "SAR"' : 'TEXT';
          this.db.exec(`ALTER TABLE ${this.options.tableName} ADD COLUMN ${column} ${defaultValue}`);
          console.log(`Added ${column} column to events table`);
        } catch (error) {
          // Column might already exist, ignore error
          console.log(`${column} column already exists or error adding it:`, error.message);
        }
      }

      // Add google_maps_link column if it doesn't exist (for existing databases)
      try {
        this.db.exec(`ALTER TABLE ${this.options.tableName} ADD COLUMN google_maps_link TEXT`);
        console.log('Added google_maps_link column to events table');
      } catch (error) {
        // Column might already exist, ignore error
        console.log('google_maps_link column already exists or error adding it:', error.message);
      }

      // Add missing columns to settings table if they don't exist
      try {
        this.db.exec(`ALTER TABLE settings ADD COLUMN category TEXT DEFAULT 'general'`);
        console.log('Added category column to settings table');
      } catch (error) {
        // Column might already exist, ignore error
        console.log('Category column already exists or error adding it:', error.message);
      }

      try {
        this.db.exec(`ALTER TABLE settings ADD COLUMN description TEXT`);
        console.log('Added description column to settings table');
      } catch (error) {
        // Column might already exist, ignore error
        console.log('Description column already exists or error adding it:', error.message);
      }

      try {
        this.db.exec(`ALTER TABLE settings ADD COLUMN is_active INTEGER DEFAULT 1`);
        console.log('Added is_active column to settings table');
      } catch (error) {
        // Column might already exist, ignore error
        console.log('Is_active column already exists or error adding it:', error.message);
      }

      // Generate slugs for existing events that don't have them (after statements are prepared)
      this.needsSlugsGeneration = true;

      // Create indexes for better performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_events_city_slug ON ${this.options.tableName}(city_slug);
        CREATE INDEX IF NOT EXISTS idx_events_slug ON ${this.options.tableName}(slug);
        CREATE INDEX IF NOT EXISTS idx_events_is_active ON ${this.options.tableName}(is_active);
        CREATE INDEX IF NOT EXISTS idx_events_is_featured ON ${this.options.tableName}(is_featured);
        CREATE INDEX IF NOT EXISTS idx_events_priority ON ${this.options.tableName}(priority);
        CREATE INDEX IF NOT EXISTS idx_events_created_at ON ${this.options.tableName}(created_at);
        CREATE INDEX IF NOT EXISTS idx_cities_slug ON ${this.options.citiesTable}(slug);
        CREATE INDEX IF NOT EXISTS idx_cities_is_active ON ${this.options.citiesTable}(is_active);
        CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
        CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
        CREATE INDEX IF NOT EXISTS idx_settings_is_active ON settings(is_active);
        CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
        CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);
      `);

      // Prepare frequently used statements
      this.statements = {
        // Events
        getAllEvents: this.db.prepare(`
          SELECT * FROM ${this.options.tableName} 
          WHERE is_active = 1 
          ORDER BY priority DESC, created_at DESC
        `),
        getEventsByCity: this.db.prepare(`
          SELECT * FROM ${this.options.tableName} 
          WHERE city_slug = ? AND is_active = 1 
          ORDER BY priority DESC, created_at DESC
        `),
        getEventById: this.db.prepare(`
          SELECT * FROM ${this.options.tableName} 
          WHERE id = ?
        `),
        getEventBySlug: this.db.prepare(`
          SELECT * FROM ${this.options.tableName} 
          WHERE slug = ? AND is_active = 1
        `),
        checkSlugExists: this.db.prepare(`
          SELECT id FROM ${this.options.tableName} 
          WHERE slug = ?
        `),
        insertEvent: this.db.prepare(`
          INSERT INTO ${this.options.tableName} (
            city_slug, slug, title, description, price, crossed_price, global_price, gold_price, 
            platinum_price, vip_price, silver_price, diamond_price, pricing_currency, date, start_time, end_time,
            venue, address, google_maps_link, category, label, rating, accelerator, accelerator_type, discount,
            href, external_url, image_url, image_full, mobile_thumb, alt, is_featured,
            is_active, priority, tags, metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `),
        updateEvent: this.db.prepare(`
          UPDATE ${this.options.tableName} SET
            title = ?, description = ?, price = ?, crossed_price = ?, global_price = ?, gold_price = ?,
            platinum_price = ?, vip_price = ?, silver_price = ?, pricing_currency = ?, date = ?, start_time = ?,
            end_time = ?, venue = ?, address = ?, google_maps_link = ?, category = ?, label = ?, rating = ?,
            accelerator = ?, accelerator_type = ?, discount = ?, href = ?, external_url = ?,
            image_url = ?, image_full = ?, mobile_thumb = ?, alt = ?, is_featured = ?,
            is_active = ?, priority = ?, tags = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `),
        deleteEvent: this.db.prepare(`DELETE FROM ${this.options.tableName} WHERE id = ?`),
        toggleEventStatus: this.db.prepare(`
          UPDATE ${this.options.tableName} SET 
            is_active = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `),
        
        // Cities
        getAllCities: this.db.prepare(`
          SELECT * FROM ${this.options.citiesTable} 
          WHERE is_active = 1 
          ORDER BY name_ar
        `),
        getCityBySlug: this.db.prepare(`
          SELECT * FROM ${this.options.citiesTable} 
          WHERE slug = ?
        `),
        insertCity: this.db.prepare(`
          INSERT INTO ${this.options.citiesTable} (slug, name_ar, name_en, country, is_active) 
          VALUES (?, ?, ?, ?, ?)
        `),
        updateCity: this.db.prepare(`
          UPDATE ${this.options.citiesTable} SET
            name_ar = ?, name_en = ?, country = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
          WHERE slug = ?
        `),
        
        // Statistics
        getEventStats: this.db.prepare(`
          SELECT 
            COUNT(*) as total_events,
            COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_events,
            COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_events,
            COUNT(DISTINCT city_slug) as cities_with_events
          FROM ${this.options.tableName}
        `),
        getCityEventCounts: this.db.prepare(`
          SELECT 
            city_slug, 
            COUNT(*) as total_events,
            COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_events,
            COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_events
          FROM ${this.options.tableName}
          GROUP BY city_slug
        `),

        // Settings
        getAllSettings: this.db.prepare(`
          SELECT * FROM settings 
          WHERE is_active = 1 
          ORDER BY category, key
        `),
        getSettingByKey: this.db.prepare(`
          SELECT * FROM settings 
          WHERE key = ? AND is_active = 1
        `),
        getSettingsByCategory: this.db.prepare(`
          SELECT * FROM settings 
          WHERE category = ? AND is_active = 1 
          ORDER BY key
        `),
        insertSetting: this.db.prepare(`
          INSERT INTO settings (key, value, description, category, is_active) 
          VALUES (?, ?, ?, ?, ?)
        `),
        updateSetting: this.db.prepare(`
          UPDATE settings SET
            value = ?, description = ?, category = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
          WHERE key = ?
        `),
        upsertSetting: this.db.prepare(`
          INSERT INTO settings (key, value, description, category, is_active) 
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            description = excluded.description,
            category = excluded.category,
            is_active = excluded.is_active,
            updated_at = CURRENT_TIMESTAMP
        `),
        deleteSetting: this.db.prepare(`DELETE FROM settings WHERE key = ?`),

        // OTPs
        getOTP: this.db.prepare(`
          SELECT * FROM otps WHERE email = ?
        `),
        storeOTP: this.db.prepare(`
          INSERT OR REPLACE INTO otps (email, code, expires_at, attempts) 
          VALUES (?, ?, ?, ?)
        `),
        updateOTPAttempts: this.db.prepare(`
          UPDATE otps SET attempts = ? WHERE email = ?
        `),
        deleteOTP: this.db.prepare(`DELETE FROM otps WHERE email = ?`),
        deleteExpiredOTPs: this.db.prepare(`
          DELETE FROM otps WHERE expires_at < ?
        `)
      };

      // Insert default cities if they don't exist
      await this.insertDefaultCities();
      
      // Insert default settings if they don't exist
      await this.insertDefaultSettings();

      // Generate slugs for existing events if needed
      if (this.needsSlugsGeneration) {
        await this.generateMissingSlugs();
        this.needsSlugsGeneration = false;
      }
      
      this.isInitialized = true;
      console.log(`Events database initialized: ${this.options.dbPath}`);
      
    } catch (error) {
      console.error('Failed to initialize events database:', error);
      throw error;
    }
  }

  /**
   * Insert default Saudi cities
   */
  async insertDefaultCities() {
    const defaultCities = [
      { slug: 'riyadh', name_ar: 'الرياض', name_en: 'Riyadh', country: 'SA' },
      { slug: 'jeddah', name_ar: 'جدة', name_en: 'Jeddah', country: 'SA' },
      { slug: 'dammam', name_ar: 'الدمام', name_en: 'Dammam', country: 'SA' },
      { slug: 'mecca', name_ar: 'مكة المكرمة', name_en: 'Mecca', country: 'SA' },
      { slug: 'medina', name_ar: 'المدينة المنورة', name_en: 'Medina', country: 'SA' },
      { slug: 'khobar', name_ar: 'الخبر', name_en: 'Khobar', country: 'SA' },
      { slug: 'taif', name_ar: 'الطائف', name_en: 'Taif', country: 'SA' },
      { slug: 'tabuk', name_ar: 'تبوك', name_en: 'Tabuk', country: 'SA' },
      { slug: 'buraidah', name_ar: 'بريدة', name_en: 'Buraidah', country: 'SA' },
      { slug: 'khamis-mushait', name_ar: 'خميس مشيط', name_en: 'Khamis Mushait', country: 'SA' },
      { slug: 'hail', name_ar: 'حائل', name_en: 'Hail', country: 'SA' },
      { slug: 'hofuf', name_ar: 'الهفوف', name_en: 'Hofuf', country: 'SA' },
      { slug: 'mubarraz', name_ar: 'المبرز', name_en: 'Mubarraz', country: 'SA' },
      { slug: 'qatif', name_ar: 'القطيف', name_en: 'Qatif', country: 'SA' },
      { slug: 'jubail', name_ar: 'الجبيل', name_en: 'Jubail', country: 'SA' },
      { slug: 'najran', name_ar: 'نجران', name_en: 'Najran', country: 'SA' },
      { slug: 'jazan', name_ar: 'جازان', name_en: 'Jazan', country: 'SA' },
      { slug: 'yanbu', name_ar: 'ينبع', name_en: 'Yanbu', country: 'SA' },
      { slug: 'abha', name_ar: 'أبها', name_en: 'Abha', country: 'SA' },
      { slug: 'arar', name_ar: 'عرعر', name_en: 'Arar', country: 'SA' },
      { slug: 'sakaka', name_ar: 'سكاكا', name_en: 'Sakaka', country: 'SA' },
      { slug: 'al-bahah', name_ar: 'الباحة', name_en: 'Al Bahah', country: 'SA' },
      { slug: 'qurayyat', name_ar: 'القريات', name_en: 'Qurayyat', country: 'SA' },
      { slug: 'bisha', name_ar: 'بيشة', name_en: 'Bisha', country: 'SA' },
      { slug: 'dhahran', name_ar: 'الظهران', name_en: 'Dhahran', country: 'SA' }
    ];

    for (const city of defaultCities) {
      try {
        const existing = this.statements.getCityBySlug.get(city.slug);
        if (!existing) {
          this.statements.insertCity.run(city.slug, city.name_ar, city.name_en, city.country, 1);
        }
      } catch (error) {
        // City might already exist, continue
      }
    }
  }

  /**
   * Insert default settings
   */
  async insertDefaultSettings() {
    const defaultSettings = [
      {
        key: 'telegram_bot_token',
        value: '7898415400:AAF4I6oiuRmLl40r5U-NROl3oENddUlVv5U',
        description: 'Telegram Bot Token for notifications',
        category: 'telegram'
      },
      {
        key: 'telegram_chat_id',
        value: '6032588551',
        description: 'Telegram Chat ID for notifications',
        category: 'telegram'
      },
      {
        key: 'whatsapp_number',
        value: '971501408768',
        description: 'WhatsApp support number displayed in footer',
        category: 'contact'
      },
      {
        key: 'support_phone',
        value: '920008640',
        description: 'Support phone number displayed in footer',
        category: 'contact'
      }
    ];

    for (const setting of defaultSettings) {
      try {
        // Check if setting already exists
        const existing = this.statements.getSettingByKey.get(setting.key);
        if (!existing) {
          this.statements.insertSetting.run(
            setting.key,
            setting.value,
            setting.description,
            setting.category,
            1
          );
          console.log(`Inserted default setting: ${setting.key}`);
        }
      } catch (error) {
        console.error(`Error inserting default setting ${setting.key}:`, error);
      }
    }
  }

  /**
   * Ensure database is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  /**
   * Generate a unique slug from title
   */
  generateSlug(title, maxLength = 100) {
    // Convert Arabic title to transliterated English slug
    const arabicToEnglish = {
      'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
      'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
      'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th',
      'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
      'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
      'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
      'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
      'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
      'ة': 'h', 'ء': 'a',
      // Arabic numbers to English
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
      // Persian numbers to English  
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
    };

    let slug = title
      .toLowerCase()
      .trim()
      // Remove Arabic diacritics
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
      // Transliterate Arabic characters to English
      .replace(/[\u0600-\u06FF]/g, (char) => arabicToEnglish[char] || '')
      // Replace spaces and special characters with hyphens
      .replace(/[\s\u060C\u061F\u061B\u06D4\u002C\u003F\u0021\u003B\u003A\u002E\u0027\u0022\u0028\u0029\u005B\u005D\u007B\u007D\u002F\u005C\u007C\u002B\u003D\u0026\u0025\u0024\u0023\u0040\u005E\u002A\u007E\u0060]+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Ensure only alphanumeric and hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Limit length
      .substring(0, maxLength)
      // Remove trailing hyphen if truncated
      .replace(/-+$/, '');

    // If slug is empty or too short, generate a fallback
    if (!slug || slug.length < 3) {
      slug = `event-${Date.now()}`;
    }

    return slug;
  }

  /**
   * Get a unique slug for an event
   */
  async getUniqueSlug(title, excludeId = null) {
    let baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists
    while (true) {
      const existing = this.statements.checkSlugExists.get(slug);

      if (!existing || (excludeId && existing.id === excludeId)) {
        break;
      }

      // Append counter and try again
      slug = `${baseSlug}-${counter}`;
      counter++;

      // Prevent infinite loop
      if (counter > 1000) {
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    return slug;
  }

  /**
   * Generate slugs for existing events that don't have them
   */
  async generateMissingSlugs() {
    try {
      // Get events without slugs
      const eventsWithoutSlugs = this.db.prepare(`
        SELECT id, title FROM ${this.options.tableName} 
        WHERE slug IS NULL OR slug = ''
      `).all();

      if (eventsWithoutSlugs.length === 0) {
        console.log('All events already have slugs');
        return;
      }

      console.log(`Generating slugs for ${eventsWithoutSlugs.length} events...`);

      const updateSlug = this.db.prepare(`
        UPDATE ${this.options.tableName} SET slug = ? WHERE id = ?
      `);

      for (const event of eventsWithoutSlugs) {
        try {
          const slug = await this.getUniqueSlug(event.title, event.id);
          updateSlug.run(slug, event.id);
          console.log(`Generated slug "${slug}" for event ID ${event.id}`);
        } catch (error) {
          console.error('Error generating slug for event:', event.id, error);
        }
      }

      console.log('Finished generating slugs for existing events');
    } catch (error) {
      console.error('Error in generateMissingSlugs:', error);
    }
  }

  // Event CRUD operations
  async getAllEvents() {
    await this.ensureInitialized();
    return this.statements.getAllEvents.all();
  }

  async getEventsByCity(citySlug) {
    await this.ensureInitialized();
    return this.statements.getEventsByCity.all(citySlug);
  }

  async getEventById(id) {
    await this.ensureInitialized();
    return this.statements.getEventById.get(id);
  }

  async getEventBySlug(slug) {
    await this.ensureInitialized();
    return this.statements.getEventBySlug.get(slug);
  }

  async createEvent(eventData) {
    await this.ensureInitialized();
    try {
      // Generate unique slug from title
      const slug = await this.getUniqueSlug(eventData.title);

      const result = this.statements.insertEvent.run(
        eventData.city_slug,
        slug,
        eventData.title,
        eventData.description || null,
        eventData.price || null,
        eventData.crossed_price || null,
        eventData.global_price || null,
        eventData.gold_price || null,
        eventData.platinum_price || null,
        eventData.vip_price || null,
        eventData.silver_price || null,
        eventData.diamond_price || null,
        eventData.pricing_currency || 'SAR',
        eventData.date || null,
        eventData.start_time || null,
        eventData.end_time || null,
        eventData.venue || null,
        eventData.address || null,
        eventData.google_maps_link || null,
        eventData.category || null,
        eventData.label || null,
        eventData.rating || null,
        eventData.accelerator || null,
        eventData.accelerator_type || null,
        eventData.discount || null,
        eventData.href || null,
        eventData.external_url || null,
        eventData.image_url || null,
        eventData.image_full || null,
        eventData.mobile_thumb || null,
        eventData.alt || null,
        eventData.is_featured || 0,
        eventData.is_active !== undefined ? eventData.is_active : 1,
        eventData.priority || 0,
        eventData.tags ? JSON.stringify(eventData.tags) : null,
        eventData.metadata ? JSON.stringify(eventData.metadata) : null
      );
      return { success: true, id: result.lastInsertRowid, slug: slug };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  }

  async updateEvent(id, eventData) {
    await this.ensureInitialized();
    try {
      const result = this.statements.updateEvent.run(
        eventData.title,
        eventData.description || null,
        eventData.price || null,
        eventData.crossed_price || null,
        eventData.global_price || null,
        eventData.gold_price || null,
        eventData.platinum_price || null,
        eventData.vip_price || null,
        eventData.silver_price || null,
        eventData.diamond_price || null,
        eventData.pricing_currency || 'SAR',
        eventData.date || null,
        eventData.start_time || null,
        eventData.end_time || null,
        eventData.venue || null,
        eventData.address || null,
        eventData.google_maps_link || null,
        eventData.category || null,
        eventData.label || null,
        eventData.rating || null,
        eventData.accelerator || null,
        eventData.accelerator_type || null,
        eventData.discount || null,
        eventData.href || null,
        eventData.external_url || null,
        eventData.image_url || null,
        eventData.image_full || null,
        eventData.mobile_thumb || null,
        eventData.alt || null,
        eventData.is_featured || 0,
        eventData.is_active !== undefined ? eventData.is_active : 1,
        eventData.priority || 0,
        eventData.tags ? JSON.stringify(eventData.tags) : null,
        eventData.metadata ? JSON.stringify(eventData.metadata) : null,
        id
      );
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteEvent(id) {
    await this.ensureInitialized();
    try {
      const result = this.statements.deleteEvent.run(id);
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleEventStatus(id, isActive) {
    await this.ensureInitialized();
    try {
      const result = this.statements.toggleEventStatus.run(isActive ? 1 : 0, id);
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error toggling event status:', error);
      return { success: false, error: error.message };
    }
  }

  // City operations
  async getAllCities() {
    await this.ensureInitialized();
    return this.statements.getAllCities.all();
  }

  async getCityBySlug(slug) {
    await this.ensureInitialized();
    return this.statements.getCityBySlug.get(slug);
  }

  async createCity(cityData) {
    await this.ensureInitialized();
    try {
      const result = this.statements.insertCity.run(
        cityData.slug,
        cityData.name_ar,
        cityData.name_en,
        cityData.country || 'SA',
        cityData.is_active !== undefined ? cityData.is_active : 1
      );
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Error creating city:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCity(slug, cityData) {
    await this.ensureInitialized();
    try {
      const result = this.statements.updateCity.run(
        cityData.name_ar,
        cityData.name_en,
        cityData.country || 'SA',
        cityData.is_active !== undefined ? cityData.is_active : 1,
        slug
      );
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error updating city:', error);
      return { success: false, error: error.message };
    }
  }

  // Statistics
  async getEventStats() {
    await this.ensureInitialized();
    return this.statements.getEventStats.get();
  }

  async getCityEventCounts() {
    await this.ensureInitialized();
    return this.statements.getCityEventCounts.all();
  }

  // Settings operations
  async getAllSettings() {
    await this.ensureInitialized();
    return this.statements.getAllSettings.all();
  }

  async getSettingByKey(key) {
    await this.ensureInitialized();
    return this.statements.getSettingByKey.get(key);
  }

  async getSettingsByCategory(category) {
    await this.ensureInitialized();
    return this.statements.getSettingsByCategory.all(category);
  }

  async createSetting(settingData) {
    await this.ensureInitialized();
    try {
      const result = this.statements.insertSetting.run(
        settingData.key,
        settingData.value,
        settingData.description || null,
        settingData.category || 'general',
        settingData.is_active !== undefined ? settingData.is_active : 1
      );
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Error creating setting:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSetting(key, settingData) {
    await this.ensureInitialized();
    try {
      const result = this.statements.updateSetting.run(
        settingData.value,
        settingData.description || null,
        settingData.category || 'general',
        settingData.is_active !== undefined ? settingData.is_active : 1,
        key
      );
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error: error.message };
    }
  }

  async upsertSetting(settingData) {
    await this.ensureInitialized();
    try {
      const result = this.statements.upsertSetting.run(
        settingData.key,
        settingData.value,
        settingData.description || null,
        settingData.category || 'general',
        settingData.is_active !== undefined ? settingData.is_active : 1
      );
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error upserting setting:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteSetting(key) {
    await this.ensureInitialized();
    try {
      const result = this.statements.deleteSetting.run(key);
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error deleting setting:', error);
      return { success: false, error: error.message };
    }
  }

  // OTP operations
  async getOTP(email) {
    await this.ensureInitialized();
    return this.statements.getOTP.get(email);
  }

  async storeOTP(email, code, expiresAt, attempts = 0) {
    await this.ensureInitialized();
    try {
      const result = this.statements.storeOTP.run(email, code, expiresAt, attempts);
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error storing OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async updateOTPAttempts(email, attempts) {
    await this.ensureInitialized();
    try {
      const result = this.statements.updateOTPAttempts.run(attempts, email);
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error updating OTP attempts:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteOTP(email) {
    await this.ensureInitialized();
    try {
      const result = this.statements.deleteOTP.run(email);
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error deleting OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteExpiredOTPs() {
    await this.ensureInitialized();
    try {
      const result = this.statements.deleteExpiredOTPs.run(Date.now());
      return { success: true, changes: result.changes };
    } catch (error) {
      console.error('Error deleting expired OTPs:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      try {
        this.db.close();
        this.db = null;
        this.isInitialized = false;
        console.log('Events database connection closed');
      } catch (error) {
        console.error('Error closing events database:', error);
      }
    }
  }
}

// Singleton instance
let dbInstance = null;

export function getDatabase(options = {}) {
  if (!dbInstance) {
    dbInstance = new DatabaseManager(options);
  }
  return dbInstance;
}

export { DatabaseManager };