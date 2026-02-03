import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  // Basic property information
  address: string;
  tmk: string; // Tax Map Key
  coordinates: {
    latitude: number;
    longitude: number;
  };
  zoning: string;
  zoneCode: string; // R-1, R-2, R-3, Commercial, etc.
  
  // Platform information
  airbnb?: {
    listingId?: string;
    url?: string;
    title?: string;
    price?: number;
    rating?: number;
    reviews?: number;
    lastSeen?: Date;
    isActive?: boolean;
  };
  
  vrbo?: {
    listingId?: string;
    url?: string;
    title?: string;
    price?: number;
    rating?: number;
    reviews?: number;
    lastSeen?: Date;
    isActive?: boolean;
  };
  
  // Property details
  bedrooms: number;
  bathrooms: number;
  maxOccupancy: number;
  propertyType: string; // House, Apartment, Condo, etc.
  amenities: string[];
  
  // Compliance information
  isRegistered: boolean;
  registrationNumber?: string;
  registrationExpiry?: Date;
  lastInspectionDate?: Date;
  
  // Violation tracking
  violations: mongoose.Types.ObjectId[];
  violationScore: number; // 0-100 risk score
  lastCrawled: Date;
  crawlHistory: Array<{
    date: Date;
    platform: 'airbnb' | 'vrbo';
    found: boolean;
    price?: number;
    occupancy?: number;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  address: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  tmk: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  zoning: {
    type: String,
    required: true,
    trim: true,
  },
  zoneCode: {
    type: String,
    required: true,
    enum: ['R-1', 'R-2', 'R-3', 'Commercial', 'Agricultural', 'Industrial'],
    index: true,
  },
  
  // Platform-specific data
  airbnb: {
    listingId: String,
    url: String,
    title: String,
    price: Number,
    rating: { type: Number, min: 0, max: 5 },
    reviews: { type: Number, min: 0 },
    lastSeen: Date,
    isActive: { type: Boolean, default: false },
  },
  
  vrbo: {
    listingId: String,
    url: String,
    title: String,
    price: Number,
    rating: { type: Number, min: 0, max: 5 },
    reviews: { type: Number, min: 0 },
    lastSeen: Date,
    isActive: { type: Boolean, default: false },
  },
  
  // Property details
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['House', 'Apartment', 'Condo', 'Villa', 'Cottage', 'Studio', 'Other'],
  },
  amenities: [String],
  
  // Compliance information
  isRegistered: {
    type: Boolean,
    default: false,
    index: true,
  },
  registrationNumber: String,
  registrationExpiry: Date,
  lastInspectionDate: Date,
  
  // Violation tracking
  violations: [{
    type: Schema.Types.ObjectId,
    ref: 'Violation',
  }],
  violationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    index: true,
  },
  lastCrawled: {
    type: Date,
    default: Date.now,
  },
  crawlHistory: [{
    date: { type: Date, default: Date.now },
    platform: {
      type: String,
      enum: ['airbnb', 'vrbo'],
      required: true,
    },
    found: { type: Boolean, required: true },
    price: Number,
    occupancy: Number,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
PropertySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
PropertySchema.index({ violationScore: -1 });
PropertySchema.index({ lastCrawled: -1 });
PropertySchema.index({ isRegistered: 1, violationScore: -1 });
PropertySchema.index({ 'airbnb.isActive': 1 });
PropertySchema.index({ 'vrbo.isActive': 1 });

// Virtuals
PropertySchema.virtual('isActiveListing').get(function() {
  return (this.airbnb?.isActive || this.vrbo?.isActive);
});

PropertySchema.virtual('platforms').get(function() {
  const platforms = [];
  if (this.airbnb?.isActive) platforms.push('airbnb');
  if (this.vrbo?.isActive) platforms.push('vrbo');
  return platforms;
});

PropertySchema.virtual('totalReviews').get(function() {
  const airbnbReviews = this.airbnb?.reviews || 0;
  const vrboReviews = this.vrbo?.reviews || 0;
  return airbnbReviews + vrboReviews;
});

PropertySchema.virtual('averageRating').get(function() {
  const ratings = [];
  if (this.airbnb?.rating) ratings.push(this.airbnb.rating);
  if (this.vrbo?.rating) ratings.push(this.vrbo.rating);
  
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

// Methods
PropertySchema.methods.updateViolationScore = function() {
  // Calculate violation score based on various factors
  let score = 0;
  
  // Unregistered operation (+40 points)
  if (!this.isRegistered) score += 40;
  
  // Active on platforms (+20 points)
  if (this.isActiveListing) score += 20;
  
  // Multiple platforms (+15 points)
  if (this.platforms.length > 1) score += 15;
  
  // High occupancy (+10 points)
  const maxAllowedOccupancy = this.getMaxAllowedOccupancy();
  if (this.maxOccupancy > maxAllowedOccupancy) {
    score += 10;
  }
  
  // Recent activity (+5 points)
  const daysSinceLastCrawl = Math.floor((Date.now() - this.lastCrawled.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceLastCrawl < 7) score += 5;
  
  this.violationScore = Math.min(score, 100);
  return this.save();
};

PropertySchema.methods.getMaxAllowedOccupancy = function() {
  const occupancyLimits = {
    'R-1': 6,
    'R-2': 8,
    'R-3': 10,
    'Commercial': 12,
    'Agricultural': 6,
    'Industrial': 0, // Not allowed
  };
  
  return occupancyLimits[this.zoneCode] || 6;
};

PropertySchema.methods.hasOccupancyViolation = function() {
  return this.maxOccupancy > this.getMaxAllowedOccupancy();
};

// Static methods
PropertySchema.statics.findByAddress = function(address: string) {
  return this.findOne({ 
    address: new RegExp(address, 'i') 
  }).populate('violations');
};

PropertySchema.statics.findByTMK = function(tmk: string) {
  return this.findOne({ tmk }).populate('violations');
};

PropertySchema.statics.findActiveListings = function() {
  return this.find({
    $or: [
      { 'airbnb.isActive': true },
      { 'vrbo.isActive': true }
    ]
  }).populate('violations');
};

PropertySchema.statics.findUnregistered = function() {
  return this.find({
    isRegistered: false,
    $or: [
      { 'airbnb.isActive': true },
      { 'vrbo.isActive': true }
    ]
  }).populate('violations');
};

PropertySchema.statics.findHighRisk = function(threshold = 70) {
  return this.find({
    violationScore: { $gte: threshold }
  }).populate('violations').sort({ violationScore: -1 });
};

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
