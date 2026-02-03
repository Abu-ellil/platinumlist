import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  city_slug: { type: String, required: true, index: true },
  slug: { type: String, unique: true, index: true },
  title: { type: String, required: true },
  description: String,
  price: String,
  crossed_price: String,
  global_price: String,
  gold_price: String,
  platinum_price: String,
  vip_price: String,
  silver_price: String,
  diamond_price: String,
  pricing_currency: { type: String, default: 'SAR' },
  date: String,
  start_time: String,
  end_time: String,
  venue: String,
  address: String,
  google_maps_link: String,
  category: String,
  label: String,
  rating: String,
  accelerator: String,
  accelerator_type: String,
  discount: String,
  href: String,
  external_url: String,
  image_url: String,
  image_full: String,
  mobile_thumb: String,
  alt: String,
  is_featured: { type: Boolean, default: false, index: true },
  is_active: { type: Boolean, default: true, index: true },
  priority: { type: Number, default: 0, index: true },
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const CitySchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true, index: true },
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  country: { type: String, default: 'SA' },
  is_active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

const SettingSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true, index: true },
  value: String,
  description: String,
  category: { type: String, default: 'general', index: true },
  is_active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

const OTPSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  code: { type: String, required: true },
  expires_at: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 },
}, { timestamps: true });

const ScraperCacheSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  expires_at: { type: Date, required: true, index: true },
}, { timestamps: true });

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
export const City = mongoose.models.City || mongoose.model('City', CitySchema);
export const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
export const ScraperCache = mongoose.models.ScraperCache || mongoose.model('ScraperCache', ScraperCacheSchema);
