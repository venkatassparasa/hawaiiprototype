// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('hawaii-vr-crawler');

// Create application user
db.createUser({
  user: 'crawler_user',
  pwd: 'crawler_password',
  roles: [
    {
      role: 'readWrite',
      db: 'hawaii-vr-crawler'
    }
  ]
});

// Create collections with indexes
print('Creating collections and indexes...');

// Properties collection
db.createCollection('properties');
db.properties.createIndex({ "address": "text", "tmk": "text" });
db.properties.createIndex({ "coordinates.latitude": 1, "coordinates.longitude": 1 });
db.properties.createIndex({ "tmk": 1 }, { unique: true, sparse: true });
db.properties.createIndex({ "airbnb.listingId": 1 }, { sparse: true });
db.properties.createIndex({ "vrbo.listingId": 1 }, { sparse: true });
db.properties.createIndex({ "isRegistered": 1 });
db.properties.createIndex({ "violationScore": 1 });
db.properties.createIndex({ "lastCrawled": 1 });
db.properties.createIndex({ "zoneCode": 1 });
db.properties.createIndex({ "zoning": 1 });

// Violations collection
db.createCollection('violations');
db.violations.createIndex({ "propertyId": 1 });
db.violations.createIndex({ "type": 1 });
db.violations.createIndex({ "severity": 1 });
db.violations.createIndex({ "status": 1 });
db.violations.createIndex({ "detectedAt": 1 });
db.violations.createIndex({ "propertyId": 1, "detectedAt": -1 });
db.violations.createIndex({ "type": 1, "status": 1 });
db.violations.createIndex({ "severity": 1, "status": 1 });

// Crawl jobs collection (for tracking crawl operations)
db.createCollection('crawljobs');
db.crawljobs.createIndex({ "jobId": 1 }, { unique: true });
db.crawljobs.createIndex({ "platform": 1 });
db.crawljobs.createIndex({ "status": 1 });
db.crawljobs.createIndex({ "startedAt": 1 });
db.crawljobs.createIndex({ "completedAt": 1 });

// Evidence collection (for storing evidence metadata)
db.createCollection('evidence');
db.evidence.createIndex({ "violationId": 1 });
db.evidence.createIndex({ "type": 1 });
db.evidence.createIndex({ "createdAt": 1 });
db.evidence.createIndex({ "propertyId": 1 });

// Audit logs collection
db.createCollection('auditlogs');
db.auditlogs.createIndex({ "timestamp": 1 });
db.auditlogs.createIndex({ "action": 1 });
db.auditlogs.createIndex({ "userId": 1 });
db.auditlogs.createIndex({ "propertyId": 1 });
db.auditlogs.createIndex({ "violationId": 1 });

// Statistics collection (for caching computed statistics)
db.createCollection('statistics');
db.statistics.createIndex({ "type": 1 }, { unique: true });
db.statistics.createIndex({ "updatedAt": 1 });

// Create sample configuration data
print('Creating initial configuration data...');

// Insert default zone configurations
db.zoneconfigurations.insertMany([
  {
    _id: "R-1",
    name: "Single Family Residential",
    maxOccupancy: 6,
    maxNights: 30,
    requiresRegistration: true,
    restrictions: ["no-commercial-activity", "owner-occupancy-required"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "R-2",
    name: "Two Family Residential",
    maxOccupancy: 8,
    maxNights: 30,
    requiresRegistration: true,
    restrictions: ["no-commercial-activity"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "R-3",
    name: "Multi-Family Residential",
    maxOccupancy: 10,
    maxNights: 30,
    requiresRegistration: true,
    restrictions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "Commercial",
    name: "Commercial Zone",
    maxOccupancy: 12,
    maxNights: 365,
    requiresRegistration: true,
    restrictions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "Agricultural",
    name: "Agricultural Zone",
    maxOccupancy: 6,
    maxNights: 30,
    requiresRegistration: true,
    restrictions: ["no-commercial-activity", "agricultural-use-only"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert default violation types
db.violationtypes.insertMany([
  {
    _id: "unregistered",
    name: "Unregistered Operation",
    description: "Property operating without TVR registration",
    severity: "high",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "occupancy-violation",
    name: "Occupancy Violation",
    description: "Exceeding maximum occupancy limits",
    severity: "medium",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "zoning-violation",
    name: "Zoning Violation",
    description: "Operating in prohibited zone",
    severity: "high",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "multiple-listings",
    name: "Multiple Platform Listings",
    description: "Same property listed on multiple platforms",
    severity: "medium",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "false-advertising",
    name: "False Advertising",
    description: "Misleading property information",
    severity: "low",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "license-violation",
    name: "License Violation",
    description: "Missing or invalid license information",
    severity: "high",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "price-violation",
    name: "Price Violation",
    description: "Illegal pricing practices",
    severity: "medium",
    autoDetect: true,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Initialize statistics
db.statistics.insertOne({
  _id: "crawl-stats",
  type: "crawl_statistics",
  data: {
    totalCrawls: 0,
    successfulCrawls: 0,
    failedCrawls: 0,
    totalProperties: 0,
    totalViolations: 0,
    lastCrawlAt: null,
    lastSuccessfulCrawlAt: null
  },
  updatedAt: new Date()
});

// Create user roles for the application (if using role-based access)
print('Creating user roles...');

// This would be used if implementing role-based access control
db.roles.insertMany([
  {
    _id: "admin",
    name: "Administrator",
    permissions: ["*"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "enforcement-officer",
    name: "Enforcement Officer",
    permissions: [
      "read:properties",
      "read:violations",
      "update:violations",
      "create:evidence",
      "read:statistics"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "viewer",
    name: "Viewer",
    permissions: [
      "read:properties",
      "read:violations",
      "read:statistics"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB initialization completed successfully!');
print('Database: hawaii-vr-crawler');
print('User: crawler_user');
print('Collections created: properties, violations, crawljobs, evidence, auditlogs, statistics, zoneconfigurations, violationtypes, roles');
print('Indexes created for optimal performance');
