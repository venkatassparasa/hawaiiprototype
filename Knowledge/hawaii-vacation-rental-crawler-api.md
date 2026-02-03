# Hawaii Vacation Rental Crawler API Documentation

## Overview
The Hawaii Vacation Rental Crawler API is a standalone service that automatically crawls Airbnb and VRBO listings to detect potential TVR (Transient Vacation Rental) violations in Hawaii County. It uses the Apify platform for web scraping and provides REST endpoints for integration with the TVR Compliance Dashboard.

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ TVR Compliance  │    │ Crawler API     │    │ Apify Platform  │
│ Dashboard       │◄──►│ (Node.js)       │◄──►│ (Web Scraping)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ MongoDB         │    │ MongoDB         │    │ Airbnb & VRBO   │
│ (Dashboard DB)  │    │ (Crawler DB)    │    │ Websites        │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

### Violation Detection Capabilities
1. **Unregistered Operations** - Properties operating without TVR registration
2. **Occupancy Violations** - Exceeding legal occupancy limits
3. **Zoning Violations** - Operating in prohibited zones
4. **Multiple Listings** - Same property listed multiple times
5. **False Advertising** - Misleading property descriptions
6. **Price Violations** - Illegal short-term rental pricing
7. **License Issues** - Missing or invalid license numbers

### Platform Support
- **Airbnb** - Full listing data extraction and monitoring
- **VRBO** - Comprehensive property tracking
- **Geographic Targeting** - Hawaii County specific searches
- **Evidence Collection** - Screenshots, listing data, and violation details

## Technology Stack

### Backend Services
- **Node.js 18+** with TypeScript
- **Express.js** REST API framework
- **MongoDB** with Mongoose ODM
- **Apify SDK** for web scraping
- **AWS S3** for evidence storage

### Monitoring & Deployment
- **Docker** containerization
- **Prometheus** metrics collection
- **Grafana** visualization
- **Winston** structured logging
- **Redis** caching and queues

## API Endpoints

### Crawling Operations
```http
POST /api/crawl/airbnb
POST /api/crawl/vrbo
POST /api/crawl/all
GET  /api/crawl/status/{jobId}
GET  /api/crawl/history
GET  /api/crawl/statistics
```

### Violation Management
```http
GET  /api/violations
GET  /api/violations/{id}
GET  /api/violations/property/{propertyId}
POST /api/violations/{id}/review
GET  /api/violations/statistics
```

### Property Management
```http
GET  /api/properties
GET  /api/properties/{id}
POST /api/properties/search
POST /api/properties/{id}/watch
```

### Evidence Management
```http
GET  /api/evidence/{violationId}
GET  /api/evidence/{violationId}/download
POST /api/evidence/{violationId}/archive
```

## Quick Start Guide

### 1. Environment Setup
```bash
# Clone the repository
git clone <crawler-api-repository>
cd hawaii-vrbo-airbnb-crawler-api

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
nano .env
```

### 2. Required Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/hawaii-vr-crawler

# Apify Configuration (Required)
APIFY_TOKEN=your_apify_token_here
APIFY_USER_ID=your_apify_user_id_here

# AWS S3 Configuration (Evidence Storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=hawaii-vr-evidence

# TVR Registration API Integration
TVR_REGISTRATION_API=https://api.hawaiicounty.gov/tvr/registrations
TVR_REGISTRATION_API_KEY=your_tvr_api_key_here

# Authentication
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Start the Service
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start

# Docker mode
docker-compose up -d
```

## Integration with TVR Compliance Dashboard

### 1. API Client Service
Create a service in your dashboard to communicate with the crawler API:

```javascript
// src/services/crawlerApiService.js
class CrawlerApiService {
  constructor() {
    this.baseUrl = process.env.CRAWLER_API_URL || 'http://localhost:3000';
    this.apiKey = process.env.CRAWLER_API_KEY;
  }

  async startCrawl(platform = 'all', options = {}) {
    const response = await fetch(`${this.baseUrl}/api/crawl/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        locations: ['Kailua-Kona, HI', 'Hilo, HI', 'Waimea, HI'],
        maxListings: 1000,
        ...options
      })
    });
    
    return response.json();
  }

  async getPropertyViolations(propertyId) {
    const response = await fetch(`${this.baseUrl}/api/violations/property/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return response.json();
  }

  async searchProperty(address, tmk) {
    const response = await fetch(`${this.baseUrl}/api/properties/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ address, tmk })
    });
    
    return response.json();
  }

  async getViolationStatistics() {
    const response = await fetch(`${this.baseUrl}/api/crawl/statistics`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return response.json();
  }
}

export const crawlerApiService = new CrawlerApiService();
```

### 2. Dashboard Component Integration
Update your registration detail component to show crawler data:

```javascript
// src/components/registration/RegistrationDetail.jsx
import { crawlerApiService } from '../services/crawlerApiService';
import { useState, useEffect } from 'react';

const RegistrationDetail = () => {
  const [crawlerData, setCrawlerData] = useState(null);
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    const fetchCrawlerData = async () => {
      try {
        // Search for property in crawler database
        const propertyData = await crawlerApiService.searchProperty(
          registration.property.address,
          registration.property.tmk
        );
        
        if (propertyData.properties.length > 0) {
          const property = propertyData.properties[0];
          setCrawlerData(property);
          
          // Get violations for this property
          const violationData = await crawlerApiService.getPropertyViolations(property._id);
          setViolations(violationData);
        }
      } catch (error) {
        console.error('Error fetching crawler data:', error);
      }
    };

    fetchCrawlerData();
  }, [registration]);

  // Render crawler data section
  return (
    <div>
      {/* Existing registration details */}
      
      {/* Crawler integration section */}
      {crawlerData && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Platform Monitoring Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crawlerData.airbnb?.isActive && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Airbnb Listing</h4>
                <p className="text-sm text-blue-700">Price: ${crawlerData.airbnb.price}/night</p>
                <p className="text-sm text-blue-700">Rating: {crawlerData.airbnb.rating}⭐</p>
                <a href={crawlerData.airbnb.url} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline text-sm">
                  View Listing →
                </a>
              </div>
            )}
            
            {crawlerData.vrbo?.isActive && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">VRBO Listing</h4>
                <p className="text-sm text-green-700">Price: ${crawlerData.vrbo.price}/night</p>
                <p className="text-sm text-green-700">Rating: {crawlerData.vrbo.rating}⭐</p>
                <a href={crawlerData.vrbo.url} target="_blank" rel="noopener noreferrer" 
                   className="text-green-600 hover:underline text-sm">
                  View Listing →
                </a>
              </div>
            )}
          </div>
          
          {/* Violations display */}
          {violations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-red-900 mb-3">Detected Violations</h4>
              {violations.map(violation => (
                <div key={violation._id} className="p-4 bg-red-50 rounded-lg mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-red-900">{violation.type}</p>
                      <p className="text-sm text-red-700">Severity: {violation.severity}</p>
                      <p className="text-sm text-red-700">Detected: {new Date(violation.detectedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      violation.severity === 'critical' ? 'bg-red-600 text-white' :
                      violation.severity === 'high' ? 'bg-red-100 text-red-800' :
                      violation.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {violation.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### 3. Crawler Management Dashboard
Create a dedicated dashboard for managing crawls:

```javascript
// src/components/crawler/CrawlerDashboard.jsx
import { useState, useEffect } from 'react';
import { crawlerApiService } from '../../services/crawlerApiService';

const CrawlerDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const stats = await crawlerApiService.getViolationStatistics();
      setStatistics(stats.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const startCrawl = async (platform) => {
    setLoading(true);
    try {
      const result = await crawlerApiService.startCrawl(platform);
      console.log('Crawl started:', result);
    } catch (error) {
      console.error('Error starting crawl:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Violation Detection Crawler</h1>
      
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
            <p className="text-2xl font-bold">{statistics.totalProperties}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
            <p className="text-2xl font-bold text-blue-600">
              {statistics.activeAirbnbListings + statistics.activeVRBOListings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Total Violations</h3>
            <p className="text-2xl font-bold text-red-600">{statistics.totalViolations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Unregistered</h3>
            <p className="text-2xl font-bold text-orange-600">{statistics.unregisteredProperties}</p>
          </div>
        </div>
      )}

      {/* Crawl Controls */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Crawl Controls</h2>
        <div className="flex gap-4">
          <button
            onClick={() => startCrawl('airbnb')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Airbnb Crawl'}
          </button>
          <button
            onClick={() => startCrawl('vrbo')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start VRBO Crawl'}
          </button>
          <button
            onClick={() => startCrawl('all')}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Full Crawl'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrawlerDashboard;
```

### 4. Add Routes and Navigation
Update your App.jsx and Sidebar.jsx to include the crawler dashboard:

```javascript
// App.jsx - Add route
<Route path="/crawler" element={
  <ProtectedRoute allowedRoles={['Admin', 'Enforcement Officer']}>
    <CrawlerDashboard />
  </ProtectedRoute>
} />

// Sidebar.jsx - Add navigation item
if (['Admin', 'Enforcement Officer'].includes(user?.role)) {
  items.push({ 
    icon: Search, // or appropriate icon
    label: 'Violation Detection', 
    path: '/crawler' 
  });
}
```

## Webhook Integration

### Configure Webhooks
```env
# In crawler API .env file
WEBHOOK_URL=https://your-dashboard.com/api/webhooks/violations
WEBHOOK_SECRET=your_webhook_secret_here
```

### Handle Webhooks in Dashboard
```javascript
// src/api/webhooks.js
export async function handleViolationWebhook(req, res) {
  const { type, propertyId, violationId, severity } = req.body;
  
  // Update dashboard state
  if (type === 'NEW_VIOLATION') {
    // Send notification to relevant users
    await sendNotification({
      type: 'violation_detected',
      propertyId,
      violationId,
      severity,
      message: `New ${severity} violation detected for property ${propertyId}`
    });
  }
  
  res.status(200).send('OK');
}
```

## Data Models

### Property Schema
```javascript
{
  address: String,
  tmk: String, // Tax Map Key
  coordinates: { latitude: Number, longitude: Number },
  zoning: String,
  zoneCode: String, // R-1, R-2, R-3, Commercial
  
  airbnb: {
    listingId: String,
    url: String,
    title: String,
    price: Number,
    rating: Number,
    reviews: Number,
    lastSeen: Date,
    isActive: Boolean
  },
  
  vrbo: {
    listingId: String,
    url: String,
    title: String,
    price: Number,
    rating: Number,
    reviews: Number,
    lastSeen: Date,
    isActive: Boolean
  },
  
  bedrooms: Number,
  bathrooms: Number,
  maxOccupancy: Number,
  propertyType: String,
  
  isRegistered: Boolean,
  registrationNumber: String,
  registrationExpiry: Date,
  
  violations: [ObjectId],
  violationScore: Number, // 0-100 risk score
  
  lastCrawled: Date,
  crawlHistory: [Object]
}
```

### Violation Schema
```javascript
{
  propertyId: ObjectId,
  type: String, // unregistered, occupancy, zoning, etc.
  severity: String, // low, medium, high, critical
  status: String, // detected, under-review, confirmed, resolved
  
  evidence: {
    screenshots: [String], // URLs to screenshots
    listingData: {
      platform: String, // airbnb, vrbo
      listingId: String,
      url: String,
      title: String,
      price: Number,
      occupancy: Number,
      description: String,
      lastScraped: Date
    },
    comparisonData: {
      registeredOccupancy: Number,
      listedOccupancy: Number,
      zoningRestrictions: [String]
    }
  },
  
  detectedAt: Date,
  detectedBy: String, // system, manual, report
  detectionScore: Number, // 0-100 confidence
  
  reviewedBy: String,
  reviewedAt: Date,
  reviewNotes: String,
  
  resolvedAt: Date,
  resolvedBy: String,
  resolutionNotes: String,
  
  penalty: {
    type: String, // warning, fine, suspension, revocation
    amount: Number,
    description: String
  }
}
```

## Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# This includes:
# - MongoDB database
# - Redis cache
# - API service
# - Nginx reverse proxy
# - Prometheus monitoring
# - Grafana dashboard
```

### Production Environment
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/hawaii-vr-crawler
APIFY_TOKEN=your_production_apify_token
AWS_ACCESS_KEY_ID=your_production_aws_key
JWT_SECRET=your_production_jwt_secret
```

## Monitoring & Logging

### Structured Logging
```javascript
import { logger, logViolation, logCrawlStart } from './utils/logger';

// Log violations
logViolation(violationId, 'unregistered', 'high', propertyId);

// Log crawl operations
logCrawlStart('airbnb', ['Kailua-Kona, HI'], 1000);
```

### Performance Metrics
- **Crawl Success Rates** - Platform scraping success
- **Violation Detection Accuracy** - False positive/negative rates
- **API Response Times** - Endpoint performance
- **Database Performance** - Query optimization

## Security Considerations

### API Security
- **JWT Authentication** - Secure API access
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Sanitize all inputs
- **HTTPS Only** - Encrypted communication

### Data Protection
- **Evidence Encryption** - Secure screenshot storage
- **PII Protection** - Personal data handling
- **Access Controls** - Role-based permissions
- **Audit Logging** - Complete audit trail

## Troubleshooting

### Common Issues
1. **Apify Token Invalid** - Check APIFY_TOKEN environment variable
2. **MongoDB Connection Failed** - Verify MONGODB_URI and network connectivity
3. **AWS S3 Upload Failed** - Check AWS credentials and bucket permissions
4. **Rate Limiting** - Implement proper retry logic and delays

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'crawler-api:*');

// Check API health
GET /health
```

## Best Practices

### Crawling Operations
1. **Schedule During Off-Peak Hours** - Reduce platform impact
2. **Respect Rate Limits** - Avoid IP blocking
3. **Monitor Success Rates** - Adjust crawling strategy
4. **Regular Data Cleanup** - Manage storage costs

### Integration Patterns
1. **Async Operations** - Non-blocking API calls
2. **Error Handling** - Graceful degradation
3. **Caching Strategy** - Improve performance
4. **Real-time Updates** - Webhook notifications

This crawler API provides comprehensive violation detection capabilities for Hawaii County TVR compliance, with seamless integration into your existing dashboard infrastructure.
