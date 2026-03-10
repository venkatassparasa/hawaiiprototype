# Local Docker Development Setup - Hawaii TVR Compliance Stack

This guide provides comprehensive instructions for setting up the complete Hawaii TVR Compliance Stack (Dashboard + Crawler API + Temporal) in local Docker Desktop for development and testing.

## Overview

The local Docker setup includes:
- **Crawler API** - Node.js API for crawling Airbnb/VRBO listings
- **Compliance Dashboard** - React frontend + Node.js backend
- **Temporal Workflow Engine** - Self-hosted Temporal with PostgreSQL
- **MongoDB** - Database for both applications
- **Redis** - Caching and session management
- **PostgreSQL** - Database for Temporal workflows
- **Azure Blob Storage Emulator** - Evidence storage simulation
- **Temporal UI** - Workflow management interface
- **Monitoring Tools** - Logs and health checks

## Prerequisites

### Required Software
- **Docker Desktop** >= 4.15.0
- **Docker Compose** >= 2.0.0
- **Node.js** >= 18.0.0 (for local development)
- **Git** for version control

### System Requirements
- **RAM**: Minimum 12GB, Recommended 16GB (increased for Temporal)
- **Storage**: Minimum 30GB free space (increased for PostgreSQL + Temporal)
- **CPU**: Minimum 4 cores, Recommended 8 cores

### Docker Desktop Configuration
```bash
# Verify Docker Desktop is running
docker --version
docker-compose --version

# Check Docker resources (recommended settings)
# RAM: 12GB+ (for Temporal + PostgreSQL)
# CPUs: 4+
# Disk: 60GB+ (for all services)
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Crawler API   │    │   Temporal UI   │
│   Frontend      │    │   (Port: 3002)  │    │   (Port: 8088)  │
│   (Port: 3000)  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Temporal      │    │   Temporal      │
│   Backend       │    │   Frontend      │    │   Worker        │
│   (Port: 3001)  │    │   (Port: 7233)  │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   PostgreSQL    │    │   Redis         │
│   (Port: 27017) │    │   (Port: 5432)  │    │   (Port: 6379)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Azurite       │    │   Adminer       │    │   Redis Cmdr    │
│   (Port: 10000) │    │   (Port: 8080)  │    │   (Port: 9000)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd hawaii-tvr-compliance-stack
```

### 2. Environment Configuration
```bash
# Copy environment templates
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml

# Edit environment variables
nano .env
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Access Applications
- **Dashboard**: http://localhost:3000
- **Crawler API**: http://localhost:3001
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Node.js API   │    │   Node.js API   │
│   (Dashboard)   │    │   (Dashboard)   │    │   (Crawler)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   MongoDB       │    │   Redis Cache   │
│   Port: 80/443  │    │   Port: 27017   │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Azure Storage  │    │   Monitoring    │    │   Development   │
│  Emulator       │    │   Tools         │    │   Tools         │
│  Port: 10000    │    │   Port: 8080    │    │   Port: 9000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Docker Compose Configuration

### Complete docker-compose.yml
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:6.0
    container_name: hawaii-tvr-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: hawaii-tvr-dev
    volumes:
      - mongodb_data:/data/db
      - ./scripts/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
      - ./scripts/seed-data.js:/docker-entrypoint-initdb.d/seed-data.js:ro
    networks:
      - hawaii-tvr-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: hawaii-tvr-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass redis123
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    networks:
      - hawaii-tvr-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL for Temporal
  postgres:
    image: postgres:13
    container_name: hawaii-tvr-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=temporal
      - POSTGRES_PASSWORD=temporal
      - POSTGRES_DB=temporal
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - hawaii-tvr-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U temporal"]
      interval: 5s
      timeout: 5s
      retries: 10

  # Temporal Server
  temporal:
    image: temporalio/auto-setup:latest
    container_name: hawaii-tvr-temporal
    restart: unless-stopped
    ports:
      - "7233:7233"  # gRPC
      - "8233:8233"  # HTTP
    environment:
      - DB=postgresql
      - DB_PORT=5432
      - DB_USER=temporal
      - DB_PASSWORD=temporal
      - DB_HOST=postgres
      - DB_NAME=temporal
      - DEFAULT_NAMESPACE=default
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - hawaii-tvr-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8233"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Temporal UI
  temporal-ui:
    image: temporalio/ui:latest
    container_name: hawaii-tvr-temporal-ui
    restart: unless-stopped
    ports:
      - "8088:8088"
    environment:
      - TEMPORAL_ADDRESS=temporal:7233
      - TEMPORAL_PORT=7233
    depends_on:
      - temporal
    networks:
      - hawaii-tvr-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8088"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Temporal Worker
  temporal-worker:
    build:
      context: ./hawaii-vrbo-airbnb-crawler-api
      dockerfile: Dockerfile.worker
    container_name: hawaii-tvr-temporal-worker
    restart: unless-stopped
    environment:
      - TEMPORAL_ADDRESS=temporal:7233
      - TEMPORAL_NAMESPACE=default
      - NODE_ENV=development
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/hawaii-tvr-crawler?authSource=admin
      - REDIS_URL=redis://:redis123@redis:6379
    depends_on:
      - temporal
      - postgres
      - mongodb
      - redis
    networks:
      - hawaii-tvr-network
    volumes:
      - ./hawaii-vrbo-airbnb-crawler-api/src:/app/src
      - ./hawaii-vrbo-airbnb-crawler-api/package.json:/app/package.json
    command: npm run worker:dev

  # Azure Blob Storage Emulator
  azurite:
    image: mcr.microsoft.com/azure-storage/azurite:3.24.0
    container_name: hawaii-tvr-azurite
    restart: unless-stopped
    ports:
      - "10000:10000"  # Blob
      - "10001:10001"  # Queue
      - "10002:10002"  # Table
    volumes:
      - azurite_data:/data
    networks:
      - hawaii-tvr-network
    command: azurite --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0 --debug /data

  # Database Admin Tool
  adminer:
    image: adminer:4.8.1
    container_name: hawaii-tvr-adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      ADMINER_DEFAULT_SERVER: mongodb
    depends_on:
      - mongodb
      - postgres
    networks:
      - hawaii-tvr-network

  # Redis Admin Tool
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: hawaii-tvr-redis-commander
    restart: unless-stopped
    ports:
      - "9000:8080"
    environment:
      REDIS_HOSTS: local:redis:6379:0:redis123
    depends_on:
      - redis
    networks:
      - hawaii-tvr-network

volumes:
  mongodb_data:
    driver: local
  postgres_data:
    driver: local
  redis_data:
    driver: local
  azurite_data:
    driver: local

networks:
  default:
    name: hawaii-tvr-network
    driver: bridge
```

## Development Workflow

### Starting Services
```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d mongodb redis postgres temporal temporal-ui

# Start with logs
docker-compose up -f docker-compose.yml --build

# Start in development mode with hot reload
docker-compose up --build
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

### Monitoring Services
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f temporal
docker-compose logs -f dashboard-backend

# Check resource usage
docker stats

# Health checks
docker-compose exec temporal curl -f http://localhost:8233
docker-compose exec temporal-ui curl -f http://localhost:8088
docker-compose exec postgres pg_isready -U temporal
```

## Database Management

### MongoDB Operations
```bash
# Connect to MongoDB
docker-compose exec mongodb mongo -u admin -p password123

# Connect to specific database
docker-compose exec mongodb mongo hawaii-tvr-dashboard -u admin -p password123

# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /backup
```

### PostgreSQL Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U temporal -d temporal

# Check database schema
docker-compose exec postgres psql -U temporal -d temporal -c "\dt"

# Backup PostgreSQL
docker-compose exec postgres pg_dump -U temporal temporal > backup.sql

# Restore PostgreSQL
docker-compose exec -T postgres psql -U temporal temporal < backup.sql
```

### Redis Operations
```bash
# Connect to Redis
docker-compose exec redis redis-cli -a redis123

# Check Redis keys
docker-compose exec redis redis-cli -a redis123 keys "*"

# Flush Redis
docker-compose exec redis redis-cli -a redis123 flushall
```

## Temporal Workflow Management

### Accessing Temporal UI
```bash
# Open Temporal UI in browser
open http://localhost:8088

# Check Temporal service status
curl -f http://localhost:7233/health
```

### Managing Workflows
```bash
# View running workflows
curl -X GET "http://localhost:7233/api/v1/namespaces/default/workflows"

# Start a new workflow
curl -X POST "http://localhost:7233/api/v1/namespaces/default/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowType": "CrawlWorkflow",
    "taskQueue": "hawaii-tvr-crawl",
    "input": "{\"locations\": [\"Honolulu\", \"Maui\"]}"
  }'

# Get workflow details
curl -X GET "http://localhost:7233/api/v1/namespaces/default/workflows/<workflow-id>"
```

### Worker Management
```bash
# Check worker status
docker-compose logs temporal-worker

# Restart worker
docker-compose restart temporal-worker

# Scale worker
docker-compose up -d --scale temporal-worker=2
```

## Troubleshooting

### Common Issues

#### 1. Services Not Starting
```bash
# Check Docker resources
docker system df
docker system prune

# Check port conflicts
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### 2. Database Connection Issues
```bash
# Check MongoDB
docker-compose exec mongodb mongo --eval "db.adminCommand('ismaster')"

# Check PostgreSQL
docker-compose exec postgres pg_isready -U temporal

# Check Redis
docker-compose exec redis redis-cli ping
```

#### 3. Temporal Issues
```bash
# Check Temporal logs
docker-compose logs temporal

# Verify PostgreSQL connection
docker-compose exec temporal curl -f http://localhost:8233

# Reset Temporal database
docker-compose exec postgres psql -U temporal -d temporal -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker-compose restart temporal
```

#### 4. Memory Issues
```bash
# Check memory usage
docker stats

# Increase Docker memory allocation
# Docker Desktop -> Settings -> Resources -> Memory -> 12GB+

# Clean up unused containers
docker system prune -a
```

### Debug Commands
```bash
# Check service logs
docker-compose logs -f <service-name>

# Execute commands in container
docker-compose exec <service-name> <command>

# Inspect container
docker inspect <container-name>

# Check network connectivity
docker-compose exec dashboard-backend ping mongodb
docker-compose exec temporal-worker ping temporal
```

## Performance Optimization

### Resource Allocation
```yaml
# For production development
services:
  temporal:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G
  
  postgres:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G
```

### Database Optimization
```sql
-- PostgreSQL optimization
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
```

### Docker Optimization
```bash
# Use Docker BuildKit
export DOCKER_BUILDKIT=1
docker-compose build

# Parallel builds
docker-compose build --parallel

# Multi-stage builds
# Already implemented in Dockerfiles
```

## Testing

### Unit Tests
```bash
# Run backend tests
docker-compose exec dashboard-backend npm test

# Run crawler tests
docker-compose exec crawler-api npm test

# Run worker tests
docker-compose exec temporal-worker npm test
```

### Integration Tests
```bash
# Test API endpoints
curl -f http://localhost:3001/api/health
curl -f http://localhost:3002/api/health
curl -f http://localhost:7233/health

# Test database connections
docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"
docker-compose exec postgres psql -U temporal -d temporal -c "SELECT 1;"
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run load-test-config.yml

# Monitor during load test
docker stats
```

## Production Considerations

### Security
```bash
# Use environment files for secrets
cp .env.example .env.production
# Edit with production values

# Use Docker secrets
echo "secure-password" | docker secret create db_password -

# Enable TLS
# Configure in docker-compose.prod.yml
```

### Monitoring
```bash
# Add monitoring stack
# docker-compose.monitoring.yml with Prometheus, Grafana

# Health checks
# Already implemented in all services

# Logging
# Configure centralized logging
```

### Backup Strategy
```bash
# Automated backups
docker-compose exec mongodb mongodump --out /backup/$(date +%Y%m%d)
docker-compose exec postgres pg_dump -U temporal temporal > backup_$(date +%Y%m%d).sql

# Restore procedures
# Documented in disaster recovery plan
```

## Development Tips

### Hot Reloading
```bash
# Frontend hot reload enabled by default
# Backend nodemon watching for changes
# Worker restarts on file changes

# Manual restart
docker-compose restart dashboard-backend
docker-compose restart temporal-worker
```

### Debugging
```bash
# Attach debugger
docker-compose exec dashboard-backend npm run debug

# View logs in real-time
docker-compose logs -f dashboard-backend

# Use breakpoints
# Configure in VS Code launch.json
```

### Code Quality
```bash
# Lint code
docker-compose exec dashboard-backend npm run lint
docker-compose exec crawler-api npm run lint

# Format code
docker-compose exec dashboard-backend npm run format

# Run tests before commit
docker-compose exec dashboard-backend npm run test:ci
```

This comprehensive setup provides a complete local development environment with Temporal workflow orchestration, enabling full-stack development and testing of the Hawaii TVR Compliance system.

## Quick Reference Commands

### Essential Commands
```bash
# Start complete stack
docker-compose up -d

# Check all services
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart temporal-worker

# Scale worker
docker-compose up -d --scale temporal-worker=2
```

### Service URLs
| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Main application |
| Backend API | http://localhost:3001 | Dashboard API |
| Crawler API | http://localhost:3002 | Crawler service |
| Temporal UI | http://localhost:8088 | Workflow management |
| Adminer | http://localhost:8080 | Database admin |
| Redis Cmdr | http://localhost:9000 | Redis admin |

### Health Checks
```bash
# Test all services
curl -f http://localhost:3001/api/health && \
curl -f http://localhost:3002/api/health && \
curl -f http://localhost:7233/health && \
curl -f http://localhost:8088 && \
echo "All services healthy"
```

### Database Connections
```bash
# MongoDB
docker-compose exec mongodb mongo -u admin -p password123

# PostgreSQL
docker-compose exec postgres psql -U temporal -d temporal

# Redis
docker-compose exec redis redis-cli -a redis123
```

## Updated Features

### ✅ New Temporal Integration
- **PostgreSQL Database** - Dedicated database for Temporal workflows
- **Temporal Server** - Auto-setup with PostgreSQL backend
- **Temporal UI** - Web interface for workflow management
- **Temporal Worker** - Custom worker for crawl workflows
- **Health Checks** - Comprehensive health monitoring

### ✅ Enhanced Architecture
- **Increased Resources** - 12GB+ RAM recommended for Temporal
- **Service Dependencies** - Proper startup ordering
- **Network Isolation** - Dedicated Docker network
- **Volume Management** - Persistent data storage

### ✅ Development Tools
- **Database Admin Tools** - Adminer for MongoDB/PostgreSQL
- **Redis Commander** - Redis management interface
- **Health Monitoring** - Built-in health checks
- **Log Management** - Centralized logging

### ✅ Production Ready
- **Environment Configuration** - Complete .env setup
- **Security Best Practices** - Non-root users, secrets management, least privilege access
- **Performance Optimization** - Resource limits and reservations
- **Backup Strategies** - Database backup procedures

This updated guide provides everything needed for local development with the complete Temporal-enabled Hawaii TVR Compliance stack.
LOG_LEVEL=warn
```

### Scaling Considerations
```yaml
# Production docker-compose.yml
services:
  crawler-api:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
```

This comprehensive Docker setup provides a complete local development environment for the Hawaii TVR Compliance Stack with all services, monitoring, and development tools properly configured and integrated.
