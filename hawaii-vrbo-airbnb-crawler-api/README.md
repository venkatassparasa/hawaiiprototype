# Hawaii Vacation Rental Violation Detection API

## Overview
This API service crawls Airbnb and VRBO listings to detect potential TVR (Transient Vacation Rental) violations in Hawaii County. It uses the Apify platform for web scraping and provides REST endpoints for integration with the TVR Compliance Dashboard.

## Features
- **Multi-platform crawling**: Airbnb and VRBO listings
- **Violation detection**: Automated identification of potential violations
- **Evidence collection**: Screenshots, listing data, and violation details
- **Geographic targeting**: Hawaii County specific searches
- **RESTful API**: Easy integration with existing systems
- **Real-time monitoring**: Scheduled crawls and updates
- **Violation scoring**: Risk assessment for each property

## Detected Violations
1. **Unregistered Operations**: Properties operating without TVR registration
2. **Occupancy Violations**: Exceeding legal occupancy limits
3. **Zoning Violations**: Operating in prohibited zones
4. **Multiple Listings**: Same property listed multiple times
5. **False Advertising**: Misleading property descriptions
6. **Price Violations**: Illegal short-term rental pricing
7. **License Issues**: Missing or invalid license numbers

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Apify SDK     │    │   Violation     │    │   REST API      │
│   (Crawlers)    │───▶│   Detection     │───▶│   Endpoints     │
│                 │    │   Engine        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Storage  │    │   Evidence      │    │   Dashboard     │
│   (MongoDB)     │    │   Collection    │    │   Integration   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Web Scraping**: Apify SDK
- **Database**: MongoDB with Mongoose
- **Image Storage**: AWS S3 or Cloudinary
- **Scheduling**: node-cron
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest
- **Deployment**: Docker

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Apify Account
- AWS S3 Account (for screenshots)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hawaii-vrbo-airbnb-crawler-api

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
nano .env

# Start the development server
npm run dev
```

### Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hawaii-vr-crawler

# Apify Configuration
APIFY_TOKEN=your_apify_token
APIFY_USER_ID=your_apify_user_id

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-west-1
AWS_S3_BUCKET=hawaii-vr-evidence

# Hawaii County Configuration
HAWAII_COUNTY_ZONES=Hilo,Kona,Kohala,Puna,Hamakua,Kau
MAX_OCCUPANCY_LIMITS={"R-1":6,"R-2":8,"R-3":10,"Commercial":12}

# API Configuration
API_BASE_URL=https://api.hawaiicounty.gov
TVR_REGISTRATION_API=https://api.hawaiicounty.gov/tvr/registrations

# Scheduling
CRAWL_SCHEDULE=0 2 * * * # Daily at 2 AM
EVIDENCE_RETENTION_DAYS=90
```

## API Endpoints

### Crawling Operations
```http
POST /api/crawl/airbnb
POST /api/crawl/vrbo
POST /api/crawl/all
GET  /api/crawl/status/{jobId}
GET  /api/crawl/history
```

### Violation Detection
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
GET  /api/properties/search
POST /api/properties/{id}/watch
```

### Evidence Management
```http
GET  /api/evidence/{violationId}
GET  /api/evidence/{violationId}/download
POST /api/evidence/{violationId}/archive
```

## Integration with TVR Compliance Dashboard

### 1. Property Registration Check
```javascript
// Check if property is registered
const response = await fetch('https://your-api.com/api/properties/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
    tmk: '7-7-4-008-002-0000'
  })
});

const { properties, violations } = await response.json();
```

### 2. Violation Monitoring
```javascript
// Get violations for a property
const violations = await fetch(`https://your-api.com/api/violations/property/${propertyId}`);
const violationData = await violations.json();

// Integrate with existing violation cases
if (violationData.length > 0) {
  // Create violation case in dashboard
  createViolationCase(violationData);
}
```

### 3. Real-time Updates
```javascript
// Webhook for new violations
app.post('/webhooks/new-violation', (req, res) => {
  const violation = req.body;
  
  // Notify dashboard
  notifyDashboard({
    type: 'NEW_VIOLATION',
    propertyId: violation.propertyId,
    violationType: violation.type,
    severity: violation.severity
  });
  
  res.status(200).send('OK');
});
```

## Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t hawaii-vr-crawler .

# Run with Docker Compose
docker-compose up -d
```

### Cloud Deployment
- **AWS**: ECS or Lambda
- **Google Cloud**: Cloud Run
- **Azure**: Container Instances
- **Heroku**: Container Registry

## Monitoring and Logging
- **Application Logs**: Winston
- **Performance Metrics**: Prometheus
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot

## Legal and Compliance
- **Terms of Service**: Compliance with platform ToS
- **Rate Limiting**: Respectful crawling practices
- **Data Privacy**: GDPR and CCPA compliance
- **Evidence Storage**: Secure and auditable

## Support
- **Documentation**: `/docs` endpoint
- **API Status**: `/health` endpoint
- **Support Email**: support@hawaiicounty.gov

## License
MIT License - Hawaii County Government
