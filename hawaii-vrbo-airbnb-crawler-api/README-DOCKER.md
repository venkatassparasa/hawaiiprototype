# Docker Development Setup

This guide provides instructions for setting up the Hawaii Vacation Rental Crawler API using Docker Compose for local development and testing.

## Quick Start

### 1. Start the Development Environment
```bash
# Navigate to the crawler API directory
cd hawaii-vrbo-airbnb-crawler-api

# Start all services (MongoDB, Redis, API)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 2. Access Development Services
- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **MongoDB Express**: http://localhost:8081 (optional)
- **Redis Commander**: http://localhost:8082 (optional)
- **Health Check**: http://localhost:3000/health

### 3. Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (clears data)
docker-compose -f docker-compose.dev.yml down -v
```

## Services Overview

### Core Services
- **mongodb**: MongoDB 7.0 database with initialization scripts
- **redis**: Redis 7.2 for caching and job queues
- **api**: Node.js API service with hot reloading

### Optional Tools (enabled with `--profile tools`)
- **mongo-express**: Web-based MongoDB management interface
- **redis-commander**: Web-based Redis management interface
- **dev-tools**: Development utilities container

## Environment Configuration

### Required Environment Variables
Create a `.env` file in the crawler API directory:

```env
# Apify Configuration (REQUIRED)
APIFY_TOKEN=your_apify_token_here
APIFY_USER_ID=your_apify_user_id_here

# AWS S3 Configuration (Optional but recommended)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_S3_BUCKET=hawaii-vr-evidence-dev

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

### Database Connection Strings
The Docker Compose automatically configures:
- **MongoDB**: `mongodb://admin:password123@localhost:27017/hawaii-vr-crawler?authSource=admin`
- **Redis**: `redis://localhost:6379`

## Development Commands

### Start Services
```bash
# Start core services only
docker-compose -f docker-compose.dev.yml up -d

# Start with optional tools
docker-compose -f docker-compose.dev.yml --profile tools up -d

# Start with rebuild
docker-compose -f docker-compose.dev.yml up -d --build
```

### View Logs
```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs

# Follow logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs api
docker-compose -f docker-compose.dev.yml logs mongodb
docker-compose -f docker-compose.dev.yml logs redis
```

### Access Services
```bash
# Access API container
docker-compose -f docker-compose.dev.yml exec api sh

# Access MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Access Redis
docker-compose -f docker-compose.dev.yml exec redis redis-cli
```

### Restart Services
```bash
# Restart specific service
docker-compose -f docker-compose.dev.yml restart api

# Restart all services
docker-compose -f docker-compose.dev.yml restart
```

## Database Management

### MongoDB Access
```bash
# Connect to MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongosh

# Switch to application database
use hawaii-vr-crawler

# View collections
show collections

# Query properties
db.properties.find().limit(5)

# Query violations
db.violations.find().limit(5)
```

### Sample Data
The database is automatically seeded with sample data on first startup:
- **5 sample properties** with various configurations
- **4 sample violations** with different types and severities
- **3 sample crawl jobs** with different statuses
- **Evidence records** and **audit logs**

### Reset Database
```bash
# Stop services and remove volumes
docker-compose -f docker-compose.dev.yml down -v

# Start services again (fresh database)
docker-compose -f docker-compose.dev.yml up -d
```

## Testing with Docker

### Run Tests
```bash
# Access API container and run tests
docker-compose -f docker-compose.dev.yml exec api npm test

# Run specific test file
docker-compose -f docker-compose.dev.yml exec api node tests/test-crawler.js

# Run integration tests
docker-compose -f docker-compose.dev.yml exec api node tests/test-dashboard-integration.js
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API documentation
curl http://localhost:3000/api-docs

# Test statistics endpoint
curl http://localhost:3000/api/crawl/statistics
```

## Development Tools

### MongoDB Express
Access at: http://localhost:8081
- **Username**: admin
- **Password**: admin123
- **MongoDB URL**: mongodb://admin:password123@mongodb:27017/

### Redis Commander
Access at: http://localhost:8082
- **Username**: admin
- **Password**: admin123
- **Redis Host**: redis:6379

### Development Utilities
```bash
# Access dev-tools container
docker-compose -f docker-compose.dev.yml --profile tools exec dev-tools sh

# Run database scripts
docker-compose -f docker-compose.dev.yml --profile tools exec dev-tools node scripts/seed-data.js
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check if ports are in use
netstat -an | grep :3000
netstat -an | grep :27017
netstat -an | grep :6379

# Kill processes using ports (if needed)
sudo kill -9 $(lsof -ti:3000)
```

#### Permission Issues
```bash
# Fix volume permissions
sudo chown -R $USER:$USER .

# Reset Docker permissions
docker system prune -f
```

#### Database Connection Issues
```bash
# Check MongoDB container status
docker-compose -f docker-compose.dev.yml ps mongodb

# Check MongoDB logs
docker-compose -f docker-compose.dev.yml logs mongodb

# Restart MongoDB
docker-compose -f docker-compose.dev.yml restart mongodb
```

#### API Build Issues
```bash
# Rebuild API container
docker-compose -f docker-compose.dev.yml up -d --build api

# Clear npm cache
docker-compose -f docker-compose.dev.yml exec api npm cache clean --force
```

### Debug Mode
```bash
# Start with verbose logging
docker-compose -f docker-compose.dev.yml up --build

# Enable debug logs
docker-compose -f docker-compose.dev.yml exec api LOG_LEVEL=debug npm run dev
```

## Production Comparison

### Development vs Production
| Feature | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ Enabled | ❌ Disabled |
| Debug Logging | ✅ Enabled | ❌ Disabled |
| Source Maps | ✅ Enabled | ❌ Disabled |
| Dev Tools | ✅ Available | ❌ Not Available |
| Database | Sample Data | Empty Database |
| Security | Basic | Full Security |

### Production Deployment
For production deployment, use the main `docker-compose.yml`:
```bash
# Production deployment
docker-compose up -d

# Production configuration
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_SWAGGER=false
```

## Performance Monitoring

### Container Resources
```bash
# View container stats
docker stats

# View container resource usage
docker-compose -f docker-compose.dev.yml top api
```

### Database Performance
```bash
# MongoDB performance
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --eval "db.stats()"

# Redis performance
docker-compose -f docker-compose.dev.yml exec redis redis-cli info memory
```

## Backup and Restore

### Backup Database
```bash
# Backup MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongodump --out /backup

# Copy backup to host
docker cp $(docker-compose -f docker-compose.dev.yml ps -q mongodb):/backup ./backup
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backup $(docker-compose -f docker-compose.dev.yml ps -q mongodb):/backup

# Restore MongoDB
docker-compose -f docker-compose.dev.yml exec mongodb mongorestore /backup
```

This Docker setup provides a complete development environment with all necessary services, sample data, and development tools for testing the crawler API.
