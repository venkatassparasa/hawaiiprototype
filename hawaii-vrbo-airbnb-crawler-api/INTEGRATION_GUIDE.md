# Hawaii Vacation Rental Crawler API Integration Guide

## Overview
This guide explains how to integrate the Hawaii Vacation Rental Crawler API with your existing TVR Compliance Dashboard. The crawler API automatically detects violations by monitoring Airbnb and VRBO listings in Hawaii County.

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

## Quick Start Integration

### 1. Environment Setup
```bash
# Clone the crawler API repository
git clone <crawler-api-repository>
cd hawaii-vrbo-airbnb-crawler-api

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
nano .env
```

### 2. Key Environment Variables
```env
# API Configuration
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/hawaii-vr-crawler

# Apify (required for web scraping)
APIFY_TOKEN=your_apify_token_here

# AWS S3 (for evidence storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=hawaii-vr-evidence

# TVR Registration API (for integration)
TVR_REGISTRATION_API=https://api.hawaiicounty.gov/tvr/registrations
TVR_REGISTRATION_API_KEY=your_tvr_api_key_here
```

### 3. Start the Crawler API
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start

# Docker mode
docker-compose up -d
```

## API Endpoints for Integration

### 1. Start Crawling Operations
```javascript
// Start Airbnb crawl
const response = await fetch('http://localhost:3000/api/crawl/airbnb', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    locations: ['Kailua-Kona, HI', 'Hilo, HI'],
    maxListings: 1000,
    guests: 2
  })
});

const { jobId, estimatedTime } = await response.json();
```

### 2. Check Crawl Status
```javascript
const statusResponse = await fetch(`http://localhost:3000/api/crawl/status/${jobId}`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const { status, progress, statistics } = await statusResponse.json();
```

### 3. Get Violations
```javascript
// Get all violations
const violationsResponse = await fetch('http://localhost:3000/api/violations', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const violations = await violationsResponse.json();

// Get violations for specific property
const propertyViolations = await fetch(`http://localhost:3000/api/violations/property/${propertyId}`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

### 4. Property Search Integration
```javascript
// Search for properties by address
const searchResponse = await fetch('http://localhost:3000/api/properties/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    address: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
    tmk: '7-7-4-008-002-0000'
  })
});

const { properties, violations } = await searchResponse.json();
```

## Integration with TVR Compliance Dashboard

### 1. Add Crawler API Client
Create a new service in your dashboard:
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

### 2. Update Registration Detail Component
```javascript
// src/components/registration/RegistrationDetail.jsx
import { crawlerApiService } from '../services/crawlerApiService';
import { useState, useEffect } from 'react';

const RegistrationDetail = () => {
  const [crawlerData, setcrawlerData] = useState(null);
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
          setcrawlerData(property);
          
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

  // Render crawler data
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
                <a 
                  href={crawlerData.airbnb.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Listing →
                </a>
              </div>
            )}
            
            {crawlerData.vrbo?.isActive && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">VRBO Listing</h4>
                <p className="text-sm text-green-700">Price: ${crawlerData.vrbo.price}/night</p>
                <p className="text-sm text-green-700">Rating: {crawlerData.vrbo.rating}⭐</p>
                <a 
                  href={crawlerData.vrbo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline text-sm"
                >
                  View Listing →
                </a>
              </div>
            )}
          </div>
          
          {/* Violations section */}
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
                  
                  {violation.evidence?.screenshots?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-red-700 mb-2">Evidence:</p>
                      <div className="flex gap-2">
                        {violation.evidence.screenshots.map((screenshot, index) => (
                          <img 
                            key={index}
                            src={screenshot} 
                            alt="Violation evidence"
                            className="w-24 h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
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

### 3. Add Crawler Management Dashboard
Create a new component for managing crawls:
```javascript
// src/components/crawler/CrawlerDashboard.jsx
import { useState, useEffect } from 'react';
import { crawlerApiService } from '../../services/crawlerApiService';

const CrawlerDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [activeCrawls, setActiveCrawls] = useState([]);
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
      setActiveCrawls([...activeCrawls, result]);
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
      <div className="bg-white p-6 rounded-lg border mb-8">
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

      {/* Active Crawls */}
      {activeCrawls.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Active Crawls</h2>
          <div className="space-y-3">
            {activeCrawls.map(crawl => (
              <div key={crawl.jobId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{crawl.platform} Crawl</p>
                    <p className="text-sm text-gray-600">Job ID: {crawl.jobId}</p>
                    <p className="text-sm text-gray-600">Estimated time: {crawl.estimatedTime}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Running
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrawlerDashboard;
```

### 4. Add Route for Crawler Dashboard
Update your App.jsx:
```javascript
import CrawlerDashboard from './components/crawler/CrawlerDashboard';

// Add to your routes
<Route path="/crawler" element={
  <ProtectedRoute allowedRoles={['Admin', 'Enforcement Officer']}>
    <CrawlerDashboard />
  </ProtectedRoute>
} />
```

### 5. Update Sidebar Navigation
Add crawler management to your sidebar:
```javascript
// Add to navigation items
if (['Admin', 'Enforcement Officer'].includes(user?.role)) {
  items.push({ 
    icon: Search, // or appropriate icon
    label: 'Violation Detection', 
    path: '/crawler' 
  });
}
```

## Webhook Integration

### 1. Configure Webhook in Crawler API
```env
WEBHOOK_URL=https://your-dashboard.com/api/webhooks/violations
WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Handle Webhooks in Dashboard
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
    
    // Update violation counts
    await updateViolationStatistics();
  }
  
  res.status(200).send('OK');
}
```

## Data Synchronization

### 1. Sync Property Registration Status
```javascript
// Sync TVR registration data with crawler database
const syncRegistrationStatus = async () => {
  const registrations = await fetchTVRRegistrations();
  
  for (const registration of registrations) {
    await crawlerApiService.updatePropertyRegistration(registration.tmk, {
      isRegistered: registration.status === 'approved',
      registrationNumber: registration.number,
      registrationExpiry: registration.expiryDate
    });
  }
};
```

### 2. Scheduled Sync
```javascript
// Run sync every hour
setInterval(syncRegistrationStatus, 60 * 60 * 1000);
```

## Security Considerations

### 1. API Authentication
```javascript
// Use JWT tokens for API authentication
const API_HEADERS = {
  'Authorization': `Bearer ${process.env.CRAWLER_API_KEY}`,
  'Content-Type': 'application/json'
};
```

### 2. Rate Limiting
```javascript
// Respect rate limits when calling crawler API
const rateLimitedFetch = async (url, options) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
  return fetch(url, options);
};
```

### 3. Data Validation
```javascript
// Validate data from crawler API
const validateViolationData = (violation) => {
  const requiredFields = ['type', 'severity', 'propertyId', 'evidence'];
  return requiredFields.every(field => violation[field]);
};
```

## Monitoring and Logging

### 1. Error Handling
```javascript
const safeApiCall = async (apiCall, fallback = null) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('Crawler API error:', error);
    return fallback;
  }
};
```

### 2. Performance Monitoring
```javascript
// Track API response times
const trackApiPerformance = async (apiCall, metricName) => {
  const start = performance.now();
  const result = await apiCall();
  const duration = performance.now() - start;
  
  // Send to monitoring service
  sendMetric(metricName, duration);
  
  return result;
};
```

## Deployment

### 1. Environment Configuration
```env
# Production settings
CRAWLER_API_URL=https://crawler-api.hawaiicounty.gov
CRAWLER_API_KEY=your_production_api_key
```

### 2. Docker Integration
```yaml
# Add to your docker-compose.yml
crawler-api:
  image: hawaii-vr-crawler:latest
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongodb:27017/hawaii-vr-crawler
```

## Testing

### 1. Mock Crawler API for Testing
```javascript
// src/services/mockCrawlerApiService.js
export const mockCrawlerApiService = {
  async startCrawl() {
    return {
      jobId: 'mock-job-123',
      estimatedTime: '5 minutes'
    };
  },
  
  async getPropertyViolations() {
    return [
      {
        _id: 'mock-violation-1',
        type: 'unregistered',
        severity: 'high',
        detectedAt: new Date().toISOString()
      }
    ];
  }
};
```

### 2. Integration Tests
```javascript
// tests/crawler.integration.test.js
describe('Crawler API Integration', () => {
  test('should fetch property violations', async () => {
    const violations = await crawlerApiService.getPropertyViolations('property-123');
    expect(Array.isArray(violations)).toBe(true);
  });
  
  test('should start crawl successfully', async () => {
    const result = await crawlerApiService.startCrawl('airbnb');
    expect(result.jobId).toBeDefined();
  });
});
```

## Troubleshooting

### Common Issues
1. **API Connection Failed**: Check network connectivity and API key
2. **Authentication Error**: Verify JWT token is valid and not expired
3. **Rate Limiting**: Implement proper rate limiting and retry logic
4. **Data Sync Issues**: Check database connections and sync schedules

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'crawler-api:*');
```

This integration guide provides a comprehensive approach to connecting the crawler API with your TVR Compliance Dashboard, enabling automatic violation detection and evidence collection from Airbnb and VRBO platforms.
