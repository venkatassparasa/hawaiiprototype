import mongoose, { Document, Schema } from 'mongoose';

export interface IViolation extends Document {
  // Property reference
  propertyId: mongoose.Types.ObjectId;
  
  // Violation details
  type: 'unregistered' | 'occupancy' | 'zoning' | 'multiple-listings' | 'false-advertising' | 'price' | 'license';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'under-review' | 'confirmed' | 'resolved' | 'dismissed';
  
  // Evidence
  evidence: {
    screenshots: string[]; // URLs to screenshots
    listingData: {
      platform: 'airbnb' | 'vrbo';
      listingId: string;
      url: string;
      title: string;
      price: number;
      occupancy: number;
      description: string;
      amenities: string[];
      houseRules: string[];
      lastScraped: Date;
    };
    comparisonData?: {
      registeredOccupancy: number;
      listedOccupancy: number;
      registeredPrice?: number;
      listedPrice: number;
      zoningRestrictions: string[];
    };
  };
  
  // Detection information
  detectedAt: Date;
  detectedBy: 'system' | 'manual' | 'report';
  detectionScore: number; // 0-100 confidence score
  
  // Review process
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Resolution
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  penalty?: {
    type: 'warning' | 'fine' | 'suspension' | 'revocation';
    amount?: number;
    description: string;
  };
  
  // Communication
  notifications: Array<{
    type: 'email' | 'sms' | 'mail' | 'phone';
    recipient: string;
    sentAt: Date;
    status: 'sent' | 'delivered' | 'failed';
    content: string;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const ViolationSchema = new Schema<IViolation>({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true,
  },
  
  type: {
    type: String,
    required: true,
    enum: ['unregistered', 'occupancy', 'zoning', 'multiple-listings', 'false-advertising', 'price', 'license'],
    index: true,
  },
  
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    index: true,
  },
  
  status: {
    type: String,
    required: true,
    enum: ['detected', 'under-review', 'confirmed', 'resolved', 'dismissed'],
    default: 'detected',
    index: true,
  },
  
  evidence: {
    screenshots: [String],
    listingData: {
      platform: {
        type: String,
        required: true,
        enum: ['airbnb', 'vrbo'],
      },
      listingId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      occupancy: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      amenities: [String],
      houseRules: [String],
      lastScraped: {
        type: Date,
        required: true,
      },
    },
    comparisonData: {
      registeredOccupancy: Number,
      listedOccupancy: Number,
      registeredPrice: Number,
      listedPrice: Number,
      zoningRestrictions: [String],
    },
  },
  
  detectedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
  detectedBy: {
    type: String,
    required: true,
    enum: ['system', 'manual', 'report'],
    default: 'system',
  },
  
  detectionScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    index: true,
  },
  
  // Review process
  reviewedBy: String,
  reviewedAt: Date,
  reviewNotes: String,
  
  // Resolution
  resolvedAt: Date,
  resolvedBy: String,
  resolutionNotes: String,
  
  penalty: {
    type: {
      type: String,
      enum: ['warning', 'fine', 'suspension', 'revocation'],
    },
    amount: Number,
    description: String,
  },
  
  notifications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'mail', 'phone'],
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent',
    },
    content: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
ViolationSchema.index({ propertyId: 1, status: 1 });
ViolationSchema.index({ type: 1, severity: 1 });
ViolationSchema.index({ detectedAt: -1 });
ViolationSchema.index({ status: 1, detectedAt: -1 });
ViolationSchema.index({ detectionScore: -1 });

// Virtuals
ViolationSchema.virtual('isResolved').get(function() {
  return this.status === 'resolved' || this.status === 'dismissed';
});

ViolationSchema.virtual('daysSinceDetection').get(function() {
  return Math.floor((Date.now() - this.detectedAt.getTime()) / (1000 * 60 * 60 * 24));
});

ViolationSchema.virtual('urgency').get(function() {
  if (this.severity === 'critical') return 'immediate';
  if (this.severity === 'high') return 'high';
  if (this.daysSinceDetection > 30) return 'high';
  if (this.daysSinceDetection > 14) return 'medium';
  return 'low';
});

// Methods
ViolationSchema.methods.addNotification = function(type: string, recipient: string, content: string) {
  this.notifications.push({
    type,
    recipient,
    content,
    sentAt: new Date(),
    status: 'sent',
  });
  return this.save();
};

ViolationSchema.methods.markAsReviewed = function(reviewedBy: string, notes?: string) {
  this.status = 'under-review';
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  if (notes) this.reviewNotes = notes;
  return this.save();
};

ViolationSchema.methods.confirmViolation = function(reviewedBy: string, notes?: string, penalty?: any) {
  this.status = 'confirmed';
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  if (notes) this.reviewNotes = notes;
  if (penalty) this.penalty = penalty;
  return this.save();
};

ViolationSchema.methods.resolveViolation = function(resolvedBy: string, notes?: string) {
  this.status = 'resolved';
  this.resolvedBy = resolvedBy;
  this.resolvedAt = new Date();
  if (notes) this.resolutionNotes = notes;
  return this.save();
};

ViolationSchema.methods.dismissViolation = function(resolvedBy: string, notes?: string) {
  this.status = 'dismissed';
  this.resolvedBy = resolvedBy;
  this.resolvedAt = new Date();
  if (notes) this.resolutionNotes = notes;
  return this.save();
};

// Static methods
ViolationSchema.statics.findByProperty = function(propertyId: mongoose.Types.ObjectId) {
  return this.find({ propertyId }).sort({ detectedAt: -1 });
};

ViolationSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['detected', 'under-review', 'confirmed'] }
  }).sort({ detectedAt: -1 });
};

ViolationSchema.statics.findByType = function(type: string) {
  return this.find({ type }).sort({ detectedAt: -1 });
};

ViolationSchema.statics.findBySeverity = function(severity: string) {
  return this.find({ severity }).sort({ detectedAt: -1 });
};

ViolationSchema.statics.findHighRisk = function(threshold = 80) {
  return this.find({
    detectionScore: { $gte: threshold },
    status: { $in: ['detected', 'under-review'] }
  }).sort({ detectionScore: -1 });
};

ViolationSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        detected: { $sum: { $cond: [{ $eq: ['$status', 'detected'] }, 1, 0] } },
        underReview: { $sum: { $cond: [{ $eq: ['$status', 'under-review'] }, 1, 0] } },
        confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        dismissed: { $sum: { $cond: [{ $eq: ['$status', 'dismissed'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } },
      },
    },
  ]);
};

ViolationSchema.statics.getViolationTrends = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    { $match: { detectedAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' },
          day: { $dayOfMonth: '$detectedAt' },
        },
        count: { $sum: 1 },
        types: {
          $push: {
            type: '$type',
            severity: '$severity',
          },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);
};

export const Violation = mongoose.model<IViolation>('Violation', ViolationSchema);
