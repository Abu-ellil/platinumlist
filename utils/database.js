import connectDB from './mongodb.js';
import { Event, City, Setting, OTP } from '../models/index.js';

/**
 * Database Manager for Manual Events using MongoDB
 */
class DatabaseManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the database connection
   */
  async init() {
    if (this.isInitialized) return;
    try {
      await connectDB();
      await this.insertDefaultCities();
      await this.insertDefaultSettings();
      this.isInitialized = true;
      console.log('MongoDB connection established');
    } catch (error) {
      console.error('Failed to initialize MongoDB:', error);
      throw error;
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

    for (const cityData of defaultCities) {
      try {
        await City.findOneAndUpdate(
          { slug: cityData.slug },
          cityData,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error inserting default city ${cityData.slug}:`, error);
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

    for (const settingData of defaultSettings) {
      try {
        await Setting.findOneAndUpdate(
          { key: settingData.key },
          settingData,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error inserting default setting ${settingData.key}:`, error);
      }
    }
  }

  // Event CRUD operations
  async getAllEvents() {
    await this.ensureInitialized();
    return await Event.find({ is_active: true }).sort({ priority: -1, createdAt: -1 });
  }

  async getEventsByCity(citySlug) {
    await this.ensureInitialized();
    return await Event.find({ city_slug: citySlug, is_active: true }).sort({ priority: -1, createdAt: -1 });
  }

  async getEventById(id) {
    await this.ensureInitialized();
    return await Event.findById(id);
  }

  async getEventBySlug(slug) {
    await this.ensureInitialized();
    return await Event.findOne({ slug: slug, is_active: true });
  }

  async generateSlug(title, maxLength = 100) {
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
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
    };

    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
      .replace(/[\u0600-\u06FF]/g, (char) => arabicToEnglish[char] || '')
      .replace(/[\s\u060C\u061F\u061B\u06D4\u002C\u003F\u0021\u003B\u003A\u002E\u0027\u0022\u0028\u0029\u005B\u005D\u007B\u007D\u002F\u005C\u007C\u002B\u003D\u0026\u0025\u0024\u0023\u0040\u005E\u002A\u007E\u0060]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, maxLength)
      .replace(/-+$/, '');

    if (!slug || slug.length < 3) {
      slug = `event-${Date.now()}`;
    }

    return slug;
  }

  async getUniqueSlug(title, excludeId = null) {
    let baseSlug = await this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await Event.findOne({ slug: slug });
      if (!existing || (excludeId && existing._id.toString() === excludeId.toString())) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
      if (counter > 1000) {
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }
    return slug;
  }

  async createEvent(eventData) {
    await this.ensureInitialized();
    try {
      const slug = await this.getUniqueSlug(eventData.title);
      const event = new Event({
        ...eventData,
        slug: slug,
        is_active: eventData.is_active !== undefined ? eventData.is_active : true,
        is_featured: eventData.is_featured || false,
        priority: eventData.priority || 0,
      });
      const result = await event.save();
      return { success: true, id: result._id, slug: slug };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  }

  async updateEvent(id, eventData) {
    await this.ensureInitialized();
    try {
      const result = await Event.findByIdAndUpdate(id, {
        ...eventData,
        updatedAt: new Date()
      }, { new: true });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteEvent(id) {
    await this.ensureInitialized();
    try {
      const result = await Event.findByIdAndDelete(id);
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleEventStatus(id, isActive) {
    await this.ensureInitialized();
    try {
      const result = await Event.findByIdAndUpdate(id, { is_active: isActive });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error toggling event status:', error);
      return { success: false, error: error.message };
    }
  }

  // City operations
  async getAllCities() {
    await this.ensureInitialized();
    return await City.find({ is_active: true }).sort({ name_ar: 1 });
  }

  async getCityBySlug(slug) {
    await this.ensureInitialized();
    return await City.findOne({ slug: slug });
  }

  async createCity(cityData) {
    await this.ensureInitialized();
    try {
      const city = new City({
        ...cityData,
        is_active: cityData.is_active !== undefined ? cityData.is_active : true
      });
      const result = await city.save();
      return { success: true, id: result._id };
    } catch (error) {
      console.error('Error creating city:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCity(slug, cityData) {
    await this.ensureInitialized();
    try {
      const result = await City.findOneAndUpdate({ slug: slug }, cityData, { new: true });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error updating city:', error);
      return { success: false, error: error.message };
    }
  }

  // Statistics
  async getEventStats() {
    await this.ensureInitialized();
    const total_events = await Event.countDocuments();
    const active_events = await Event.countDocuments({ is_active: true });
    const featured_events = await Event.countDocuments({ is_featured: true });
    const cities_with_events_list = await Event.distinct('city_slug');
    return {
      total_events,
      active_events,
      featured_events,
      cities_with_events: cities_with_events_list.length
    };
  }

  async getCityEventCounts() {
    await this.ensureInitialized();
    return await Event.aggregate([
      {
        $group: {
          _id: '$city_slug',
          total_events: { $sum: 1 },
          active_events: { $sum: { $cond: ['$is_active', 1, 0] } },
          featured_events: { $sum: { $cond: ['$is_featured', 1, 0] } }
        }
      },
      {
        $project: {
          city_slug: '$_id',
          total_events: 1,
          active_events: 1,
          featured_events: 1,
          _id: 0
        }
      }
    ]);
  }

  // Settings operations
  async getAllSettings() {
    await this.ensureInitialized();
    return await Setting.find({ is_active: true }).sort({ category: 1, key: 1 });
  }

  async getSettingByKey(key) {
    await this.ensureInitialized();
    return await Setting.findOne({ key: key, is_active: true });
  }

  async getSettingsByCategory(category) {
    await this.ensureInitialized();
    return await Setting.find({ category: category, is_active: true }).sort({ key: 1 });
  }

  async createSetting(settingData) {
    await this.ensureInitialized();
    try {
      const setting = new Setting({
        ...settingData,
        is_active: settingData.is_active !== undefined ? settingData.is_active : true
      });
      const result = await setting.save();
      return { success: true, id: result._id };
    } catch (error) {
      console.error('Error creating setting:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSetting(key, settingData) {
    await this.ensureInitialized();
    try {
      const result = await Setting.findOneAndUpdate({ key: key }, settingData, { new: true });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error: error.message };
    }
  }

  async upsertSetting(settingData) {
    await this.ensureInitialized();
    try {
      const result = await Setting.findOneAndUpdate(
        { key: settingData.key },
        settingData,
        { upsert: true, new: true }
      );
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error upserting setting:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteSetting(key) {
    await this.ensureInitialized();
    try {
      const result = await Setting.findOneAndDelete({ key: key });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error deleting setting:', error);
      return { success: false, error: error.message };
    }
  }

  // OTP operations
  async getOTP(email) {
    await this.ensureInitialized();
    return await OTP.findOne({ email: email });
  }

  async storeOTP(email, code, expiresAt, attempts = 0) {
    await this.ensureInitialized();
    try {
      const result = await OTP.findOneAndUpdate(
        { email: email },
        { code, expires_at: expiresAt, attempts },
        { upsert: true, new: true }
      );
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error storing OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async updateOTPAttempts(email, attempts) {
    await this.ensureInitialized();
    try {
      const result = await OTP.findOneAndUpdate({ email: email }, { attempts });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error updating OTP attempts:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteOTP(email) {
    await this.ensureInitialized();
    try {
      const result = await OTP.findOneAndDelete({ email: email });
      return { success: true, changes: result ? 1 : 0 };
    } catch (error) {
      console.error('Error deleting OTP:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteExpiredOTPs() {
    await this.ensureInitialized();
    try {
      const result = await OTP.deleteMany({ expires_at: { $lt: new Date() } });
      return { success: true, changes: result.deletedCount };
    } catch (error) {
      console.error('Error deleting expired OTPs:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Close database connection (not usually needed with Mongoose's connection pooling)
   */
  async close() {
    // Mongoose handles connection management
    this.isInitialized = false;
  }
}

// Singleton instance
let dbInstance = null;

export function getDatabase(options = {}) {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
  }
  return dbInstance;
}

export { DatabaseManager };
