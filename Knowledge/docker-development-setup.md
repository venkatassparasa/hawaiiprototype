# Docker Development Setup Guide

This guide provides comprehensive instructions for setting up the Hawaii Vacation Rental Crawler API using Docker Compose for local development and testing.

## Overview

The Docker development environment includes:
- **MongoDB 7.0** with automatic initialization and sample data
- **Redis 7.2** for caching and job queues
- **Node.js API Service** with hot reloading
- **Development Tools** (MongoDB Express, Redis Commander)
- **Complete sample data** for testing

## Quick Start

### 1. Start the Development Environment
```bash
# Navigate to the crawler API directory
cd hawaii-vrbo-airbnb-crawler-api

# Start all core services (MongoDB, Redis, API)
docker-compose -f docker-compose.dev.yml up -d

# View logs in real-time
docker-compose -f docker-compose.dev.yml logs -f
```

### 2. Access Development Services
Once started, you can access:
- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **MongoDB Express**: http://localhost:8081 (optional)
- **Redis Commander**: http://localhost:8082 (optional)

### 3. Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove all data (fresh start)
docker-compose -f docker-compose.dev.yml down -v
```

## Services Configuration

### Core Services
| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| mongodb | mongo:7.0 | 27017 | Primary database |
| redis | redis:7.2-alpine | 6379 | Caching and job queues |
| api | Custom build | 3000 | Node.js API service |

### Optional Tools (enabled with `--profile tools`)
| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| mongo-express | mongo-express:latest | 8081 | Web MongoDB management |
| redis-commander | rediscommander/redis-commander:latest | 8082 | Web Redis management |
| dev-tools | node:18-alpine | - | Development utilities |

## Environment Configuration

### Required Environment Variables
Create a `.env` file in the crawler API directory:

```env
# Apify Configuration (REQUIRED for web scraping)
APIFY_TOKEN=your_apify_token_here
APIFY_USER_ID=your_apify_user_id_here

# AWS S3 Configuration (Optional but recommended for evidence storage)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_S3_BUCKET=hawaii-vr-evidence-dev

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_SWAGGER=true
ENABLE_CORS=true
```

### Database Connection Strings
The Docker Compose automatically configures:
- **MongoDB**: `mongodb://admin:password123@localhost:27017/hawaii-vr-crawler?authSource=admin`
- **Redis**: `redis://localhost:6379`

## Development Commands

### Service Management
```bash
# Start core services only
docker-compose -f docker-compose.dev.yml up -d

# Start with optional management tools
docker-compose -f docker-compose.dev.yml --profile tools up -d

# Rebuild and start services
docker-compose -f docker-compose.dev.yml up -d --build

# View all logs
docker-compose -f docker-compose.dev.yml logs

# Follow logs for specific service
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f mongodb
docker-compose -f docker-compose.dev.yml logs -f redis
```

### Container Access
```bash
# Access API container shell
docker-compose -f docker-compose.dev.yml exec api sh

# Access MongoDB shell
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Access Redis CLI
docker-compose -f docker-compose.dev.yml exec redis redis-cli

# Access development tools container
docker-compose -f docker-compose.dev.yml --profile tools exec dev-tools sh
```

### Service Control
```bash
# Restart specific service
docker-compose -f docker-compose.dev.yml restart api

# Restart all services
docker-compose -f docker-compose.dev.yml restart

# Stop specific service
docker-compose -f docker-compose.dev.yml stop mongodb

# Recreate service
docker-compose -f docker-compose.dev.yml up -d --force-recreate api
```

## Database Management

### MongoDB Operations
```bash
# Connect to MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Switch to application database
use hawaii-vr-crawler

# View all collections
show collections

# Query sample properties
db.properties.find().limit(5).pretty()

# Query violations
db.violations.find().limit(5).pretty()

# Check database statistics
db.stats()

# Check collection statistics
db.properties.stats()
```

### Sample Data Overview
The database is automatically seeded with comprehensive test data:

#### Properties (5 samples)
- **74-5599 Alii Dr, Kailua-Kona** - Unregistered, both platforms, R-1 zoning
- **75-6120 Kuakini Hwy, Kailua-Kona** - Registered, Airbnb only, Commercial zoning
- **68-1332 Kamehameha Ave, Waikoloa** - Registered, VRBO only, Resort zoning
- **16-643 Kilauea Ave, Hilo** - Unregistered, Airbnb only, R-2 zoning
- **56-565 Waikoloa Rd, Waimea** - Unregistered, Airbnb only, Agricultural zoning

#### Violations (4 samples)
- **Unregistered Operation** - High severity, detected status
- **Multiple Platform Listings** - Medium severity, detected status
- **Occupancy Violation** - Medium severity, under review
- **Zoning Violation** - High severity, confirmed and resolved

#### Crawl Jobs (3 samples)
- **Completed crawl** - Airbnb, 47 listings processed, 3 violations
- **Running crawl** - VRBO, 18 listings processed, 1 violation
- **Failed crawl** - All platforms, API rate limit error

### Database Reset
```bash
# Stop services and remove all data volumes
docker-compose -f docker-compose.dev.yml down -v

# Start services again with fresh database
docker-compose -f docker-compose.dev.yml up -d

# The database will be re-initialized with sample data automatically
```

## Development Tools

### MongoDB Express
Web-based MongoDB management interface:
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: admin123
- **MongoDB URL**: mongodb://admin:password123@mongodb:27017/

**Features:**
- Browse and edit collections
- Run queries and aggregations
- View database statistics
- Export/import data

### Redis Commander
Web-based Redis management interface:
- **URL**: http://localhost:8082
- **Username**: admin
- **Password**: admin123
- **Redis Host**: redis:6379

**Features:**
- Browse Redis keys and values
- Edit key-value pairs
- Monitor Redis statistics
- Clear cache data

### Development Utilities Container
```bash
# Access dev-tools for running scripts
docker-compose -f docker-compose.dev.yml --profile tools exec dev-tools sh

# Run database scripts
node scripts/seed-data.js
node scripts/init-mongo.js

# Run test suites
node tests/test-crawler.js
node tests/test-dashboard-integration.js
```

## Testing with Docker

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API documentation access
curl http://localhost:3000/api-docs

# Test statistics endpoint
curl http://localhost:3000/api/crawl/statistics

# Test property search
curl -X POST http://localhost:3000/api/properties/search \
  -H "Content-Type: application/json" \
  -d '{"address": "74-5599 Alii Dr, Kailua-Kona, HI 96740"}'

# Test violations endpoint
curl http://localhost:3000/api/violations
```

### Running Test Suites
```bash
# Access API container and run tests
docker-compose -f docker-compose.dev.yml exec api npm test

# Run specific test files
docker-compose -f docker-compose.dev.yml exec api node tests/test-crawler.js
docker-compose -f docker-compose.dev.yml exec api node tests/test-dashboard-integration.js
docker-compose -f docker-compose.dev.yml exec api node tests/load-test.js
```

### Integration Testing
```bash
# Start both dashboard and crawler API
# Terminal 1: Start dashboard
cd ../
npm run dev

# Terminal 2: Start crawler API
cd hawaii-vrbo-airbnb-crawler-api
docker-compose -f docker-compose.dev.yml up -d

# Run integration tests
docker-compose -f docker-compose.dev.yml exec api node tests/test-dashboard-integration.js
```

## Hot Reloading Development

### Code Changes
The development environment supports hot reloading:
- **Source code changes** automatically restart the API
- **Configuration changes** require manual restart
- **Database changes** persist across restarts

### Monitoring Development
```bash
# Follow API logs for development feedback
docker-compose -f docker-compose.dev.yml logs -f api

# Monitor container resource usage
docker stats

# Check service health
docker-compose -f docker-compose.dev.yml ps
```

## Troubleshooting

### Common Issues and Solutions

#### Port Conflicts
```bash
# Check if ports are in use
netstat -an | grep :3000
netstat -an | grep :27017
netstat -an | grep :6379
netstat -an | grep :8081
netstat -an | grep :8082

# Kill processes using ports (if needed)
sudo kill -9 $(lsof -ti:3000)
```

#### Permission Issues
```bash
# Fix volume permissions
sudo chown -R $USER:$USER .

# Reset Docker system
docker system prune -f
docker volume prune -f
```

#### Database Connection Issues
```bash
# Check MongoDB container status
docker-compose -f docker-compose.dev.yml ps mongodb

# Check MongoDB logs
docker-compose -f docker-compose.dev.yml logs mongodb

# Restart MongoDB service
docker-compose -f docker-compose.dev.yml restart mongodb

# Test MongoDB connection
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### API Build Issues
```bash
# Rebuild API container
docker-compose -f docker-compose.dev.yml up -d --build api

# Clear npm cache
docker-compose -f docker-compose.dev.yml exec api npm cache clean --force

# Reinstall dependencies
docker-compose -f docker-compose.dev.yml exec api npm ci
```

#### Redis Connection Issues
```bash
# Check Redis container status
docker-compose -f docker-compose.dev.yml ps redis

# Check Redis logs
docker-compose -f docker-compose.dev.yml logs redis

# Test Redis connection
docker-compose -f docker-compose.dev.yml exec redis redis-cli ping
```

### Debug Mode
```bash
# Start with verbose logging
docker-compose -f docker-compose.dev.yml up --build

# Enable debug environment variables
docker-compose -f docker-compose.dev.yml exec api LOG_LEVEL=debug npm run dev

# Access container for debugging
docker-compose -f docker-compose.dev.yml exec api sh
```

## Performance Monitoring

### Container Resources
```bash
# View all container resource usage
docker stats

# View specific container usage
docker-compose -f docker-compose.dev.yml top api

# Monitor disk usage
docker system df
```

### Database Performance
```bash
# MongoDB performance metrics
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --eval "
  db.stats();
  db.properties.stats();
  db.violations.stats();
"

# Redis memory usage
docker-compose -f docker-compose.dev.yml exec redis redis-cli info memory

# Redis performance metrics
docker-compose -f docker-compose.dev.yml exec redis redis-cli info stats
```

## Backup and Restore

### Database Backup
```bash
# Create MongoDB backup
docker-compose -f docker-compose.dev.yml exec mongodb mongodump --out /backup

# Copy backup to host
docker cp $(docker-compose -f docker-compose.dev.yml ps -q mongodb):/backup ./mongodb-backup

# Create Redis backup
docker-compose -f docker-compose.dev.yml exec redis redis-cli BGSAVE
docker cp $(docker-compose -f docker-compose.dev.yml ps -q redis):/data/dump.rdb ./redis-backup
```

### Database Restore
```bash
# Copy backup to container
docker cp ./mongodb-backup $(docker-compose -f docker-compose.dev.yml ps -q mongodb):/backup

# Restore MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongorestore /backup

# Restore Redis
docker cp ./redis-backup/dump.rdb $(docker-compose -f docker-compose.dev.yml ps -q redis):/data/dump.rdb
docker-compose -f docker-compose.dev.yml restart redis
```

## Production Comparison

### Development vs Production Features
| Feature | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ Enabled | ❌ Disabled |
| Debug Logging | ✅ Enabled | ❌ Disabled |
| Source Maps | ✅ Enabled | ❌ Disabled |
| Dev Tools | ✅ Available | ❌ Not Available |
| Sample Data | ✅ Pre-seeded | ❌ Empty Database |
| Security | Basic | Full Security |
| Performance | Development | Optimized |

### Production Deployment
For production deployment, use the main docker-compose.yml:
```bash
# Production deployment
docker-compose up -d

# Production environment variables
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_SWAGGER=false
ENABLE_CORS=false
```

## Best Practices

### Development Workflow
1. **Start services**: `docker-compose -f docker-compose.dev.yml up -d`
2. **Make code changes**: Hot reload automatically applies
3. **Test changes**: Use API endpoints and test suites
4. **Debug issues**: Check logs and access containers
5. **Stop when done**: `docker-compose -f docker-compose.dev.yml down`

### Data Management
- **Use sample data** for development and testing
- **Reset database** when needed with `down -v`
- **Backup data** before major changes
- **Monitor performance** during development

### Security Considerations
- **Never commit API tokens** to version control
- **Use environment variables** for sensitive data
- **Keep development tools** disabled in production
- **Regular updates** of Docker images

This Docker development setup provides a complete, production-like environment with all necessary services, sample data, and development tools for comprehensive testing and development of the crawler API.
