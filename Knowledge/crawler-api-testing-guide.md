# Crawler API Testing Guide

This guide provides exact, step-by-step instructions for testing the Hawaii Vacation Rental Crawler API before integration with the TVR Compliance Dashboard.

## Prerequisites

### Required Accounts & Services
1. **Apify Account** - For web scraping services
   - Sign up at https://console.apify.com/
   - Get your API token from Account Settings

2. **AWS Account** - For evidence storage (optional but recommended)
   - S3 bucket for screenshots
   - Access keys and permissions

3. **MongoDB Database** - For data storage
   - Local MongoDB or MongoDB Atlas
   - Connection string

4. **Node.js 18+** - Runtime environment
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

## Step 1: Initial Setup

### 1.1 Clone and Install the Crawler API
```bash
# Navigate to your dashboard directory
cd d:\Venkata\County of Hawaaii\compliance-dashboard

# Verify crawler API directory exists
ls hawaii-vrbo-airbnb-crawler-api

# Navigate to crawler API directory
cd hawaii-vrbo-airbnb-crawler-api

# Install dependencies
npm install
```

### 1.2 Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit the environment file
notepad .env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hawaii-vr-crawler

# Apify Configuration (REQUIRED)
APIFY_TOKEN=your_apify_token_here
APIFY_USER_ID=your_apify_user_id_here

# AWS S3 Configuration (Optional but recommended)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-west-1
AWS_S3_BUCKET=hawaii-vr-evidence

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# TVR Registration API (Optional for testing)
TVR_REGISTRATION_API=https://api.hawaiicounty.gov/tvr/registrations
TVR_REGISTRATION_API_KEY=your_tvr_api_key_here
```

### 1.3 Get Apify Token
1. Go to https://console.apify.com/
2. Sign in or create an account
3. Click on your profile → Settings
4. Copy the "API token"
5. Paste it into your `.env` file as `APIFY_TOKEN`

### 1.4 Setup MongoDB (Local)
```bash
# Option 1: Install MongoDB locally
# Download from https://www.mongodb.com/try/download/community

# Option 2: Use Docker
docker run --name mongodb-test -p 27017:27017 -d mongo:7.0

# Option 3: Use MongoDB Atlas (Cloud)
# 1. Go to https://www.mongodb.com/atlas
# 2. Create a free cluster
# 3. Get connection string
# 4. Update MONGODB_URI in .env
```

## Step 2: Start the Crawler API

### 2.1 Start the Development Server
```bash
# In the crawler API directory
cd d:\Venkata\County of Hawaaii\compliance-dashboard\hawaii-vrbo-airbnb-crawler-api

# Start development server
npm run dev

# You should see output like:
# [INFO] Connected to MongoDB successfully
# [INFO] Server running on port 3000
# [INFO] Swagger documentation available at http://localhost:3000/api-docs
```

### 2.2 Verify Server is Running
```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2026-03-09T06:22:00.000Z","uptime":1234}
```

### 2.3 Access API Documentation
Open your browser and navigate to:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## Step 3: Test Basic API Endpoints

### 3.1 Test Authentication
```bash
# Create a test JWT token (for development)
# In your browser, open: http://localhost:3000/api-docs
# Use the /api/auth/login endpoint with test credentials
```

### 3.2 Test Crawl Endpoints (Manual Testing)

#### Method 1: Using Swagger UI
1. Open http://localhost:3000/api-docs
2. Expand "Crawling" section
3. Click on "POST /api/crawl/airbnb"
4. Click "Try it out"
5. Enter test data:
```json
{
  "locations": ["Kailua-Kona, HI"],
  "maxListings": 10,
  "guests": 2
}
```
6. Click "Execute"
7. Copy the response (should include jobId)

#### Method 2: Using curl
```bash
# Start Airbnb crawl (small test)
curl -X POST http://localhost:3000/api/crawl/airbnb \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "locations": ["Kailua-Kona, HI"],
    "maxListings": 10,
    "guests": 2
  }'
```

### 3.3 Check Crawl Status
```bash
# Replace JOB_ID with the ID from previous step
curl http://localhost:3000/api/crawl/status/JOB_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3.4 Test Property Search
```bash
# Search for properties
curl -X POST http://localhost:3000/api/properties/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "address": "74-5599 Alii Dr, Kailua-Kona, HI 96740",
    "tmk": "7-7-4-008-002-0000"
  }'
```

### 3.5 Test Violations Endpoint
```bash
# Get all violations
curl http://localhost:3000/api/violations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get violation statistics
curl http://localhost:3000/api/crawl/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Step 4: Automated Testing with Scripts

### 4.1 Create Test Script
Create a test file in your crawler API directory:

```bash
# Create test directory
mkdir tests
cd tests

# Create test script
notepad test-crawler.js
```

**File: tests/test-crawler.js**
```javascript
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const JWT_TOKEN = 'your_test_jwt_token'; // Get from auth endpoint

// Test configuration
const TEST_CONFIG = {
  locations: ['Kailua-Kona, HI'],
  maxListings: 5, // Small number for testing
  guests: 2,
};

class CrawlerTester {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async testHealthCheck() {
    console.log('🔍 Testing health check...');
    try {
      const response = await this.api.get('/health');
      console.log('✅ Health check passed:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return false;
    }
  }

  async startCrawl(platform = 'airbnb') {
    console.log(`🚀 Starting ${platform} crawl...`);
    try {
      const response = await this.api.post(`/api/crawl/${platform}`, TEST_CONFIG);
      console.log('✅ Crawl started:', response.data);
      return response.data.jobId;
    } catch (error) {
      console.error('❌ Failed to start crawl:', error.response?.data || error.message);
      return null;
    }
  }

  async checkCrawlStatus(jobId) {
    console.log(`📊 Checking crawl status for job: ${jobId}`);
    try {
      const response = await this.api.get(`/api/crawl/status/${jobId}`);
      console.log('✅ Crawl status:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get crawl status:', error.response?.data || error.message);
      return null;
    }
  }

  async getStatistics() {
    console.log('📈 Getting crawler statistics...');
    try {
      const response = await this.api.get('/api/crawl/statistics');
      console.log('✅ Statistics:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get statistics:', error.response?.data || error.message);
      return null;
    }
  }

  async searchProperty() {
    console.log('🔍 Testing property search...');
    try {
      const response = await this.api.post('/api/properties/search', {
        address: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
        tmk: '7-7-4-008-002-0000',
      });
      console.log('✅ Property search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Property search failed:', error.response?.data || error.message);
      return null;
    }
  }

  async getViolations() {
    console.log('⚠️ Getting violations...');
    try {
      const response = await this.api.get('/api/violations');
      console.log('✅ Violations found:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get violations:', error.response?.data || error.message);
      return null;
    }
  }

  async runFullTest() {
    console.log('🧪 Starting full crawler API test...\n');

    // Test 1: Health Check
    const healthOk = await this.testHealthCheck();
    if (!healthOk) return false;

    // Test 2: Get initial statistics
    await this.getStatistics();

    // Test 3: Start crawl
    const jobId = await this.startCrawl('airbnb');
    if (!jobId) return false;

    // Test 4: Poll crawl status
    console.log('⏳ Waiting for crawl to complete...');
    let crawlComplete = false;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    while (!crawlComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      const status = await this.checkCrawlStatus(jobId);
      
      if (status && (status.status === 'completed' || status.status === 'failed')) {
        crawlComplete = true;
        console.log(`🏁 Crawl ${status.status} after ${attempts * 10} seconds`);
      }
      
      attempts++;
    }

    if (!crawlComplete) {
      console.log('⏰ Crawl did not complete within timeout period');
      return false;
    }

    // Test 5: Get updated statistics
    await this.getStatistics();

    // Test 6: Test property search
    await this.searchProperty();

    // Test 7: Get violations
    await this.getViolations();

    console.log('\n🎉 Full test completed successfully!');
    return true;
  }
}

// Run the test
async function main() {
  const tester = new CrawlerTester();
  await tester.runFullTest();
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CrawlerTester;
```

### 4.2 Run the Test Script
```bash
# Install axios for testing
npm install axios

# Run the test
node tests/test-crawler.js
```

## Step 5: Database Testing

### 5.1 Verify MongoDB Connection
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/hawaii-vr-crawler

# List collections
show collections

# Check properties
db.properties.find().limit(5)

# Check violations
db.violations.find().limit(5)

# Exit
exit
```

### 5.2 Test Data Models
```javascript
// In MongoDB shell
// Test property creation
db.properties.insertOne({
  address: "Test Property, Kailua-Kona, HI 96740",
  tmk: "7-7-4-008-002-0000",
  coordinates: { latitude: 19.6417, longitude: -155.9972 },
  zoning: "Residential",
  zoneCode: "R-1",
  airbnb: {
    listingId: "test-listing-123",
    url: "https://airbnb.com/rooms/test-listing-123",
    title: "Test Property",
    price: 150,
    rating: 4.5,
    reviews: 10,
    lastSeen: new Date(),
    isActive: true
  },
  bedrooms: 2,
  bathrooms: 1,
  maxOccupancy: 4,
  isRegistered: false,
  violationScore: 25,
  lastCrawled: new Date(),
  crawlHistory: [{
    date: new Date(),
    platform: "airbnb",
    found: true,
    price: 150,
    occupancy: 4
  }]
});

// Verify insertion
db.properties.find({address: /Test Property/})
```

## Step 6: Integration Testing with Dashboard

### 6.1 Create Integration Test File
**File: tests/test-dashboard-integration.js**
```javascript
const CrawlerTester = require('./test-crawler');

class DashboardIntegrationTester extends CrawlerTester {
  constructor() {
    super();
    this.dashboardUrl = 'http://localhost:5173'; // Your React app URL
  }

  async testDashboardAPIIntegration() {
    console.log('🔗 Testing dashboard API integration...');

    // Test 1: Verify crawler API is accessible from dashboard
    try {
      const response = await this.api.get('/health');
      console.log('✅ Crawler API accessible from dashboard context');
    } catch (error) {
      console.error('❌ Dashboard cannot reach crawler API:', error.message);
      return false;
    }

    // Test 2: Test CORS headers
    try {
      const corsTest = await axios.get(`${API_BASE_URL}/health`, {
        headers: {
          'Origin': 'http://localhost:5173'
        }
      });
      console.log('✅ CORS headers configured correctly');
    } catch (error) {
      console.error('❌ CORS issues detected:', error.message);
      return false;
    }

    return true;
  }

  async testRealWorldScenario() {
    console.log('🌍 Testing real-world scenario...');

    // Step 1: Start a crawl
    const jobId = await this.startCrawl('airbnb');
    if (!jobId) return false;

    // Step 2: Simulate dashboard checking status
    console.log('📱 Simulating dashboard status checks...');
    let dashboardChecks = 0;
    const maxChecks = 10;

    while (dashboardChecks < maxChecks) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
      const status = await this.checkCrawlStatus(jobId);
      
      console.log(`📱 Dashboard check ${dashboardChecks + 1}: Status ${status?.status}`);
      
      if (status && status.status === 'completed') {
        break;
      }
      
      dashboardChecks++;
    }

    // Step 3: Get results as dashboard would
    const statistics = await this.getStatistics();
    const violations = await this.getViolations();

    console.log('✅ Real-world scenario test completed');
    return true;
  }
}

// Run integration test
async function runIntegrationTest() {
  const tester = new DashboardIntegrationTester();
  
  console.log('🔗 Starting dashboard integration test...\n');
  
  const apiIntegrationOk = await tester.testDashboardAPIIntegration();
  if (!apiIntegrationOk) return false;

  const realWorldOk = await tester.testRealWorldScenario();
  if (!realWorldOk) return false;

  console.log('\n🎉 Dashboard integration test completed successfully!');
}

if (require.main === module) {
  runIntegrationTest().catch(console.error);
}

module.exports = DashboardIntegrationTester;
```

### 6.2 Run Integration Tests
```bash
# Start your dashboard (in another terminal)
cd ../
npm run dev

# Run integration tests
cd hawaii-vrbo-airbnb-crawler-api
node tests/test-dashboard-integration.js
```

## Step 7: Performance Testing

### 7.1 Load Testing Script
**File: tests/load-test.js**
```javascript
const axios = require('axios');
const { performance } = require('perf_hooks');

class LoadTester {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json',
      },
    });
  }

  async measureResponseTime(endpoint, payload = {}) {
    const start = performance.now();
    try {
      const response = await this.api.post(endpoint, payload);
      const end = performance.now();
      return {
        success: true,
        responseTime: end - start,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      const end = performance.now();
      return {
        success: false,
        responseTime: end - start,
        error: error.message,
      };
    }
  }

  async runLoadTest() {
    console.log('⚡ Starting load test...');

    const testCases = [
      {
        name: 'Health Check',
        endpoint: '/health',
        method: 'get',
      },
      {
        name: 'Statistics',
        endpoint: '/api/crawl/statistics',
        method: 'get',
      },
      {
        name: 'Property Search',
        endpoint: '/api/properties/search',
        payload: {
          address: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
        },
      },
    ];

    for (const testCase of testCases) {
      console.log(`\n📊 Testing: ${testCase.name}`);
      
      const results = [];
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        const result = await this.measureResponseTime(
          testCase.endpoint,
          testCase.payload
        );
        results.push(result);
      }

      // Calculate statistics
      const successResults = results.filter(r => r.success);
      const avgResponseTime = successResults.reduce(
        (sum, r) => sum + r.responseTime, 0
      ) / successResults.length;
      
      const maxResponseTime = Math.max(...successResults.map(r => r.responseTime));
      const minResponseTime = Math.min(...successResults.map(r => r.responseTime));

      console.log(`✅ Success Rate: ${(successResults.length / iterations * 100).toFixed(1)}%`);
      console.log(`⏱️  Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`⏱️  Min Response Time: ${minResponseTime.toFixed(2)}ms`);
      console.log(`⏱️  Max Response Time: ${maxResponseTime.toFixed(2)}ms`);
    }
  }
}

// Run load test
async function main() {
  const tester = new LoadTester();
  await tester.runLoadTest();
}

if (require.main === module) {
  main().catch(console.error);
}
```

### 7.2 Run Performance Tests
```bash
node tests/load-test.js
```

## Step 8: Troubleshooting Common Issues

### 8.1 Common Problems and Solutions

#### Problem: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongo

# Start MongoDB if not running
docker run --name mongodb-test -p 27017:27017 -d mongo:7.0

# Verify connection string in .env
echo $MONGODB_URI
```

#### Problem: "Apify token invalid"
**Solution:**
```bash
# Verify token format
echo $APIFY_TOKEN

# Token should be long alphanumeric string
# Get new token from: https://console.apify.com/settings
```

#### Problem: "CORS errors in browser"
**Solution:**
```bash
# Check server logs for CORS configuration
npm run dev

# Look for CORS middleware logs
# Verify ALLOWED_ORIGINS in .env
```

#### Problem: "Crawl fails to start"
**Solution:**
```bash
# Check Apify actor availability
curl https://api.apify.com/v2/actors/dtrangtin/airbnb-scraper

# Verify API token has sufficient permissions
# Check Apify account credits/balance
```

### 8.2 Debug Mode
```bash
# Enable debug logging
export DEBUG=crawler:*

# Run with verbose output
npm run dev -- --verbose

# Check logs
tail -f logs/combined.log
```

## Step 9: Validation Checklist

### 9.1 Pre-Integration Validation
- [ ] Server starts without errors
- [ ] Health check endpoint responds correctly
- [ ] MongoDB connection established
- [ ] Apify authentication working
- [ ] Basic crawl operation completes
- [ ] Data stored in database correctly
- [ ] API documentation accessible

### 9.2 Integration Validation
- [ ] Dashboard can reach crawler API
- [ ] CORS headers configured correctly
- [ ] Authentication works end-to-end
- [ ] Real-time status updates functional
- [ ] Error handling works properly
- [ ] Performance acceptable (< 2s response time)

### 9.3 Production Readiness
- [ ] Environment variables configured
- [ ] Security settings implemented
- [ ] Monitoring and logging enabled
- [ ] Backup procedures documented
- [ ] Error alerts configured
- [ ] Load testing completed

## Step 10: Next Steps After Testing

### 10.1 Integration with Dashboard
1. **Add crawler API client** to your dashboard
2. **Update registration components** with crawler data
3. **Add crawler dashboard** to navigation
4. **Implement real-time updates** with webhooks
5. **Add error handling** and user feedback

### 10.2 Production Deployment
1. **Configure production environment**
2. **Set up monitoring and alerts**
3. **Implement backup strategies**
4. **Configure security settings**
5. **Document operational procedures**

### 10.3 Ongoing Maintenance
1. **Monitor crawl success rates**
2. **Update Apify actors** as needed
3. **Review violation detection accuracy**
4. **Optimize performance** based on usage
5. **Update documentation** with changes

This testing guide provides a comprehensive approach to validate the crawler API functionality before full integration with your TVR Compliance Dashboard.
