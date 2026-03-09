// MongoDB seed data script
// This script creates sample data for development and testing

// Switch to the application database
db = db.getSiblingDB('hawaii-vr-crawler');

print('Creating sample property data...');

// Sample properties for testing
const sampleProperties = [
  {
    address: "74-5599 Alii Dr, Kailua-Kona, HI 96740",
    tmk: "7-7-4-008-002-0000",
    coordinates: {
      latitude: 19.6417,
      longitude: -155.9972
    },
    zoning: "Residential",
    zoneCode: "R-1",
    airbnb: {
      listingId: "HKO123456",
      url: "https://airbnb.com/rooms/HKO123456",
      title: "Oceanfront Paradise in Kona",
      price: 250,
      rating: 4.8,
      reviews: 127,
      lastSeen: new Date(),
      isActive: true
    },
    vrbo: {
      listingId: "987654",
      url: "https://vrbo.com/987654",
      title: "Beautiful Kona Oceanview",
      price: 275,
      rating: 4.7,
      reviews: 89,
      lastSeen: new Date(),
      isActive: true
    },
    bedrooms: 3,
    bathrooms: 2,
    maxOccupancy: 8,
    propertyType: "Condo",
    amenities: ["WiFi", "Kitchen", "Pool", "Beach Access", "Air Conditioning"],
    isRegistered: false,
    registrationNumber: null,
    registrationExpiry: null,
    violations: [],
    violationScore: 75,
    lastCrawled: new Date(),
    crawlHistory: [
      {
        date: new Date(Date.now() - 86400000), // 1 day ago
        platform: "airbnb",
        found: true,
        price: 250,
        occupancy: 8
      },
      {
        date: new Date(Date.now() - 86400000), // 1 day ago
        platform: "vrbo",
        found: true,
        price: 275,
        occupancy: 8
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    address: "75-6120 Kuakini Hwy, Kailua-Kona, HI 96740",
    tmk: "7-7-4-015-003-0000",
    coordinates: {
      latitude: 19.6234,
      longitude: -155.9876
    },
    zoning: "Commercial",
    zoneCode: "Commercial",
    airbnb: {
      listingId: "HKO789012",
      url: "https://airbnb.com/rooms/HKO789012",
      title: "Kona Commercial Space",
      price: 180,
      rating: 4.5,
      reviews: 45,
      lastSeen: new Date(),
      isActive: true
    },
    vrbo: null,
    bedrooms: 2,
    bathrooms: 1,
    maxOccupancy: 4,
    propertyType: "Apartment",
    amenities: ["WiFi", "Kitchen", "Parking"],
    isRegistered: true,
    registrationNumber: "TVR-2023-001",
    registrationExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    violations: [],
    violationScore: 15,
    lastCrawled: new Date(),
    crawlHistory: [
      {
        date: new Date(Date.now() - 172800000), // 2 days ago
        platform: "airbnb",
        found: true,
        price: 180,
        occupancy: 4
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    address: "68-1332 Kamehameha Ave, Waikoloa, HI 96738",
    tmk: "7-7-3-022-001-0000",
    coordinates: {
      latitude: 19.9364,
      longitude: -155.8232
    },
    zoning: "Resort",
    zoneCode: "Commercial",
    airbnb: null,
    vrbo: {
      listingId: "WKL345678",
      url: "https://vrbo.com/345678",
      title: "Waikoloa Beach Resort Villa",
      price: 450,
      rating: 4.9,
      reviews: 203,
      lastSeen: new Date(),
      isActive: true
    },
    bedrooms: 4,
    bathrooms: 3,
    maxOccupancy: 12,
    propertyType: "Villa",
    amenities: ["WiFi", "Kitchen", "Pool", "Hot Tub", "Beach Access", "Gym", "Tennis"],
    isRegistered: true,
    registrationNumber: "TVR-2022-045",
    registrationExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    violations: [],
    violationScore: 10,
    lastCrawled: new Date(),
    crawlHistory: [
      {
        date: new Date(Date.now() - 259200000), // 3 days ago
        platform: "vrbo",
        found: true,
        price: 450,
        occupancy: 12
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    address: "16-643 Kilauea Ave, Hilo, HI 96720",
    tmk: "3-3-4-011-004-0000",
    coordinates: {
      latitude: 19.7297,
      longitude: -155.0890
    },
    zoning: "Residential",
    zoneCode: "R-2",
    airbnb: {
      listingId: "HIL345678",
      url: "https://airbnb.com/rooms/HIL345678",
      title: "Hilo Jungle Retreat",
      price: 120,
      rating: 4.3,
      reviews: 67,
      lastSeen: new Date(),
      isActive: true
    },
    vrbo: null,
    bedrooms: 2,
    bathrooms: 1,
    maxOccupancy: 6,
    propertyType: "House",
    amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
    isRegistered: false,
    registrationNumber: null,
    registrationExpiry: null,
    violations: [],
    violationScore: 45,
    lastCrawled: new Date(),
    crawlHistory: [
      {
        date: new Date(Date.now() - 3600000), // 1 hour ago
        platform: "airbnb",
        found: true,
        price: 120,
        occupancy: 6
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    address: "56-565 Waikoloa Rd, Waimea, HI 96743",
    tmk: "5-3-1-009-002-0000",
    coordinates: {
      latitude: 20.0234,
      longitude: -155.6456
    },
    zoning: "Agricultural",
    zoneCode: "Agricultural",
    airbnb: {
      listingId: "WME901234",
      url: "https://airbnb.com/rooms/WME901234",
      title: "Waimea Farm Stay",
      price: 95,
      rating: 4.6,
      reviews: 34,
      lastSeen: new Date(),
      isActive: true
    },
    vrbo: null,
    bedrooms: 1,
    bathrooms: 1,
    maxOccupancy: 4,
    propertyType: "Cottage",
    amenities: ["WiFi", "Kitchen", "Garden", "Farm Animals"],
    isRegistered: false,
    registrationNumber: null,
    registrationExpiry: null,
    violations: [],
    violationScore: 35,
    lastCrawled: new Date(),
    crawlHistory: [
      {
        date: new Date(Date.now() - 7200000), // 2 hours ago
        platform: "airbnb",
        found: true,
        price: 95,
        occupancy: 4
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Insert sample properties
const insertedProperties = db.properties.insertMany(sampleProperties);
print(`Inserted ${insertedProperties.insertedCount} sample properties`);

print('Creating sample violation data...');

// Sample violations
const sampleViolations = [
  {
    propertyId: insertedProperties.insertedIds[0], // First property (unregistered)
    type: "unregistered",
    severity: "high",
    status: "detected",
    evidence: {
      screenshots: [
        "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/airbnb-HKO123456-1.png",
        "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/airbnb-HKO123456-2.png"
      ],
      listingData: {
        platform: "airbnb",
        listingId: "HKO123456",
        url: "https://airbnb.com/rooms/HKO123456",
        title: "Oceanfront Paradise in Kona",
        price: 250,
        occupancy: 8,
        description: "Beautiful oceanfront condo with stunning views",
        lastScraped: new Date()
      },
      comparisonData: {
        registeredOccupancy: 0,
        listedOccupancy: 8,
        zoningRestrictions: ["R-1", "max-occupancy-6", "requires-registration"]
      }
    },
    detectedAt: new Date(Date.now() - 3600000), // 1 hour ago
    detectedBy: "system",
    detectionScore: 95,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    propertyId: insertedProperties.insertedIds[0], // First property (multiple listings)
    type: "multiple-listings",
    severity: "medium",
    status: "detected",
    evidence: {
      screenshots: [
        "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/vrbo-987654-1.png"
      ],
      listingData: {
        platform: "vrbo",
        listingId: "987654",
        url: "https://vrbo.com/987654",
        title: "Beautiful Kona Oceanview",
        price: 275,
        occupancy: 8,
        description: "Same property as Airbnb listing",
        lastScraped: new Date()
      },
      comparisonData: {
        airbnbListingId: "HKO123456",
        vrboListingId: "987654",
        propertyMatch: true
      }
    },
    detectedAt: new Date(Date.now() - 7200000), // 2 hours ago
    detectedBy: "system",
    detectionScore: 88,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    propertyId: insertedProperties.insertedIds[3], // Fourth property (occupancy violation)
    type: "occupancy-violation",
    severity: "medium",
    status: "under-review",
    evidence: {
      screenshots: [
        "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/airbnb-HIL345678-1.png"
      ],
      listingData: {
        platform: "airbnb",
        listingId: "HIL345678",
        url: "https://airbnb.com/rooms/HIL345678",
        title: "Hilo Jungle Retreat",
        price: 120,
        occupancy: 6,
        description: "Cozy jungle retreat for up to 6 guests",
        lastScraped: new Date()
      },
      comparisonData: {
        registeredOccupancy: 4,
        listedOccupancy: 6,
        zoningRestrictions: ["R-2", "max-occupancy-4"]
      }
    },
    detectedAt: new Date(Date.now() - 86400000), // 1 day ago
    detectedBy: "system",
    detectionScore: 92,
    reviewedBy: "enforcement-officer-1",
    reviewedAt: new Date(Date.now() - 43200000), // 12 hours ago
    reviewNotes: "Property appears to be exceeding R-2 zoning limits",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    propertyId: insertedProperties.insertedIds[4], // Fifth property (zoning violation)
    type: "zoning-violation",
    severity: "high",
    status: "confirmed",
    evidence: {
      screenshots: [
        "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/airbnb-WME901234-1.png"
      ],
      listingData: {
        platform: "airbnb",
        listingId: "WME901234",
        url: "https://airbnb.com/rooms/WME901234",
        title: "Waimea Farm Stay",
        price: 95,
        occupancy: 4,
        description: "Experience farm life in Waimea",
        lastScraped: new Date()
      },
      comparisonData: {
        propertyZoning: "Agricultural",
        allowedUse: "agricultural-only",
        commercialActivity: "short-term-rental"
      }
    },
    detectedAt: new Date(Date.now() - 172800000), // 2 days ago
    detectedBy: "system",
    detectionScore: 98,
    reviewedBy: "enforcement-officer-2",
    reviewedAt: new Date(Date.now() - 86400000), // 1 day ago
    reviewNotes: "Agricultural zone violation - commercial short-term rental not permitted",
    resolvedAt: new Date(Date.now() - 43200000), // 12 hours ago
    resolvedBy: "admin-1",
    resolutionNotes: "Notice sent to property owner",
    penalty: {
      type: "warning",
      amount: 0,
      description: "Compliance warning issued"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Insert sample violations
const insertedViolations = db.violations.insertMany(sampleViolations);
print(`Inserted ${insertedViolations.insertedCount} sample violations`);

// Update properties with violation references
db.properties.updateMany(
  { _id: { $in: [insertedProperties.insertedIds[0], insertedProperties.insertedIds[3], insertedProperties.insertedIds[4]] } },
  { 
    $push: { violations: { $each: Object.values(insertedViolations.insertedIds) } },
    $set: { updatedAt: new Date() }
  }
);

print('Creating sample crawl job data...');

// Sample crawl jobs
const sampleCrawlJobs = [
  {
    jobId: "airbnb-" + Date.now() + "-abc123",
    platform: "airbnb",
    status: "completed",
    startedAt: new Date(Date.now() - 3600000), // 1 hour ago
    completedAt: new Date(Date.now() - 3000000), // 50 minutes ago
    input: {
      locations: ["Kailua-Kona, HI", "Hilo, HI"],
      maxListings: 50,
      guests: 2
    },
    statistics: {
      listingsProcessed: 47,
      violationsFound: 3,
      propertiesUpdated: 12,
      newProperties: 5
    },
    error: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    jobId: "vrbo-" + Date.now() + "-def456",
    platform: "vrbo",
    status: "running",
    startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
    completedAt: null,
    input: {
      locations: ["Waimea, HI", "Waikoloa, HI"],
      maxListings: 30,
      guests: 4
    },
    statistics: {
      listingsProcessed: 18,
      violationsFound: 1,
      propertiesUpdated: 8,
      newProperties: 2
    },
    error: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    jobId: "all-" + Date.now() + "-ghi789",
    platform: "all",
    status: "failed",
    startedAt: new Date(Date.now() - 7200000), // 2 hours ago
    completedAt: new Date(Date.now() - 6600000), // 1 hour 50 minutes ago
    input: {
      locations: ["Kailua-Kona, HI"],
      maxListings: 100,
      guests: 2
    },
    statistics: {
      listingsProcessed: 15,
      violationsFound: 0,
      propertiesUpdated: 3,
      newProperties: 1
    },
    error: "Apify API rate limit exceeded",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Insert sample crawl jobs
const insertedCrawlJobs = db.crawljobs.insertMany(sampleCrawlJobs);
print(`Inserted ${insertedCrawlJobs.insertedCount} sample crawl jobs`);

print('Creating sample evidence data...');

// Sample evidence records
const sampleEvidence = [
  {
    violationId: insertedViolations.insertedIds[0],
    type: "screenshot",
    filename: "airbnb-HKO123456-1.png",
    url: "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/airbnb-HKO123456-1.png",
    size: 2048576, // 2MB
    mimeType: "image/png",
    metadata: {
      platform: "airbnb",
      listingId: "HKO123456",
      capturedAt: new Date(Date.now() - 3600000),
      device: "Chrome/120.0.0.0"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    violationId: insertedViolations.insertedIds[1],
    type: "screenshot",
    filename: "vrbo-987654-1.png",
    url: "https://s3.amazonaws.com/hawaii-vr-evidence/screenshots/vrbo-987654-1.png",
    size: 1843200, // 1.8MB
    mimeType: "image/png",
    metadata: {
      platform: "vrbo",
      listingId: "987654",
      capturedAt: new Date(Date.now() - 7200000),
      device: "Chrome/120.0.0.0"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Insert sample evidence
const insertedEvidence = db.evidence.insertMany(sampleEvidence);
print(`Inserted ${insertedEvidence.insertedCount} sample evidence records`);

print('Creating sample audit logs...');

// Sample audit logs
const sampleAuditLogs = [
  {
    action: "crawl_started",
    userId: "system",
    crawlJobId: insertedCrawlJobs.insertedIds[0],
    details: {
      platform: "airbnb",
      locations: ["Kailua-Kona, HI", "Hilo, HI"],
      maxListings: 50
    },
    timestamp: new Date(Date.now() - 3600000),
    ipAddress: "127.0.0.1",
    userAgent: "Node.js Crawler API"
  },
  {
    action: "violation_detected",
    userId: "system",
    violationId: insertedViolations.insertedIds[0],
    propertyId: insertedProperties.insertedIds[0],
    details: {
      type: "unregistered",
      severity: "high",
      platform: "airbnb"
    },
    timestamp: new Date(Date.now() - 3600000),
    ipAddress: "127.0.0.1",
    userAgent: "Node.js Crawler API"
  },
  {
    action: "violation_reviewed",
    userId: "enforcement-officer-1",
    violationId: insertedViolations.insertedIds[2],
    details: {
      status: "under-review",
      notes: "Property appears to be exceeding R-2 zoning limits"
    },
    timestamp: new Date(Date.now() - 43200000),
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  }
];

// Insert sample audit logs
const insertedAuditLogs = db.auditlogs.insertMany(sampleAuditLogs);
print(`Inserted ${insertedAuditLogs.insertedCount} sample audit logs`);

// Update statistics
db.statistics.updateOne(
  { _id: "crawl-stats" },
  {
    $set: {
      "data.totalCrawls": 3,
      "data.successfulCrawls": 1,
      "data.failedCrawls": 1,
      "data.totalProperties": insertedProperties.insertedCount,
      "data.totalViolations": insertedViolations.insertedCount,
      "data.lastCrawlAt": new Date(Date.now() - 3000000),
      "data.lastSuccessfulCrawlAt": new Date(Date.now() - 3000000),
      "updatedAt": new Date()
    }
  }
);

print('Sample data creation completed successfully!');
print('Summary:');
print(`- Properties: ${insertedProperties.insertedCount}`);
print(`- Violations: ${insertedViolations.insertedCount}`);
print(`- Crawl Jobs: ${insertedCrawlJobs.insertedCount}`);
print(`- Evidence Records: ${insertedEvidence.insertedCount}`);
print(`- Audit Logs: ${insertedAuditLogs.insertedCount}`);
print('');
print('Sample data includes:');
print('- Properties with various zoning types (R-1, R-2, Commercial, Agricultural)');
print('- Properties with different registration statuses');
print('- Properties on Airbnb, VRBO, and both platforms');
print('- Various violation types and severities');
print('- Crawl job history with different statuses');
print('- Evidence screenshots and metadata');
print('- Complete audit trail');
print('');
print('You can now test the API with realistic sample data!');
