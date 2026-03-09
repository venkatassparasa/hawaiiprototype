# Terraform Deployment Guide - Hawaii TVR Compliance Dashboard

This guide provides comprehensive instructions for deploying the Hawaii TVR Compliance Dashboard to Microsoft Azure using Terraform infrastructure as code.

## Overview

The Terraform configuration creates a complete, production-ready Azure environment including:

### Application Architecture
- **Frontend App Service** - React application hosting
- **Backend App Service** - Node.js API hosting  
- **Application Gateway** - Load balancing with SSL termination
- **Azure CDN** - Static content delivery (optional)

### Data Storage
- **Azure Cosmos DB** - MongoDB-compatible database
- **Azure Redis Cache** - Session management and caching
- **Azure Storage Account** - Static assets and logs

### Security & Monitoring
- **Azure Key Vault** - Secure secret management
- **Application Insights** - Application performance monitoring
- **Log Analytics Workspace** - Centralized log management
- **Virtual Network** - Isolated network environment

### Integration
- **Crawler API Integration** - Real-time violation data sync
- **Webhook Support** - Automated notifications
- **Email/SMS Notifications** - Alert system integration

## Prerequisites

### Required Tools
- **Terraform** >= 1.5.0
- **Azure CLI** >= 2.40.0
- **Git** for version control

### Required Accounts
- **Azure Subscription** with appropriate permissions
- **Crawler API** access (URL and API key)

### Required Permissions
The deployment requires the following Azure permissions:
- **Contributor** role on the target subscription
- **User Access Administrator** role (for service principal creation)

## Quick Start

### 1. Clone and Prepare
```bash
# Clone the repository
git clone <repository-url>
cd compliance-dashboard/terraform

# Initialize Terraform
terraform init
```

### 2. Configure Variables
```bash
# Copy variables template
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars
```

**Required variables to configure:**
```hcl
# Azure Configuration
azure_region = "West US 2"
environment = "dev"

# Crawler API Integration (Required)
crawler_api_url = "https://crawler-api.hawaiicounty.gov"
crawler_api_key = "your_crawler_api_key_here"

# Monitoring
alert_email = "admin@hawaiicounty.gov"
```

### 3. Plan and Deploy
```bash
# Review deployment plan
terraform plan

# Deploy infrastructure
terraform apply

# Confirm when prompted
```

### 4. Deploy Applications
After Terraform completes, deploy the applications:
```bash
# Deploy frontend
az webapp up \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name) \
  --runtime "NODE:18-lts" \
  --location $(terraform output -raw azure_region)

# Deploy backend
az webapp up \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw backend_app_service_name) \
  --runtime "NODE:18-lts" \
  --location $(terraform output -raw azure_region)
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Internet      │    │ Application     │    │ Virtual Network │
│                 │◄──►│   Gateway       │◄──►│   (VNet)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                       │
                              ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Frontend App   │    │  Backend App    │
                       │  Service        │    │  Service        │
                       └─────────────────┘    └─────────────────┘
                              │                       │
                              ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Azure Cosmos    │    │ Azure Redis     │    │ Azure Storage   │
│ DB (MongoDB)    │    │ Cache           │    │ Account         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                       │
                              ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
│ Azure Key       │    │ Application     │    │ Log Analytics   │
│ Vault           │    │ Insights        │    │ Workspace       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Environment Configurations

### Development Environment
```hcl
environment = "dev"
app_service_plan_sku = "B1"
cosmos_db_throughput = 400
redis_sku_name = "Basic"
enable_application_gateway = false
enable_private_endpoints = false
enable_cdn = false
```

### Staging Environment
```hcl
environment = "staging"
app_service_plan_sku = "S1"
cosmos_db_throughput = 800
redis_sku_name = "Standard"
enable_application_gateway = true
enable_private_endpoints = true
enable_cdn = true
```

### Production Environment
```hcl
environment = "prod"
app_service_plan_sku = "P1v2"
cosmos_db_throughput = 1200
redis_sku_name = "Premium"
enable_application_gateway = true
enable_private_endpoints = true
enable_cdn = true
enable_backup = true
enable_auto_scale = true
```

## Application Deployment

### Frontend (React) Deployment
```bash
# Build frontend
cd ../
npm ci
npm run build

# Create deployment package
zip -r frontend-deployment.zip build/ package.json package-lock.json

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name) \
  --src frontend-deployment.zip
```

### Backend (Node.js) Deployment
```bash
# Build backend
cd ../
npm ci
npm run build

# Create deployment package
zip -r backend-deployment.zip dist/ package.json package-lock.json

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw backend_app_service_name) \
  --src backend-deployment.zip
```

### Environment Variables
The Terraform configuration automatically sets up environment variables for both applications:

#### Frontend Variables
```javascript
REACT_APP_API_BASE_URL = "https://backend-app.azurewebsites.net"
REACT_APP_CRAWLER_API_URL = "https://crawler-api.hawaiicounty.gov"
REACT_APP_CRAWLER_API_KEY = "api-key-from-key-vault"
```

#### Backend Variables
```javascript
NODE_ENV = "production"
PORT = 3001
MONGODB_URI = "connection-string-from-key-vault"
REDIS_URL = "redis-hostname:6380,ssl=true"
JWT_SECRET = "generated-jwt-secret"
CRAWLER_API_URL = "https://crawler-api.hawaiicounty.gov"
CRAWLER_API_KEY = "api-key-from-key-vault"
```

## Crawler API Integration

### Configuration
```hcl
# Enable crawler integration
enable_crawler_integration = true
crawler_api_url = "https://crawler-api.hawaiicounty.gov"
crawler_api_key = "your_api_key_here"
crawler_sync_interval = 15 # minutes
```

### Webhook Setup
```hcl
# Enable webhook support
enable_webhook_support = true
webhook_secret = "your_webhook_secret_here"
```

### Integration Features
- **Real-time data sync** from crawler API
- **Violation status updates** via webhooks
- **Evidence file access** through secure URLs
- **Automated notifications** for new violations

## Security Configuration

### Key Vault Integration
```hcl
# Secrets stored in Key Vault
JWT_SECRET = "generated-jwt-secret"
MONGODB_CONNECTION_STRING = "cosmos-db-connection-string"
REDIS_CONNECTION_STRING = "redis-connection-string"
STORAGE_CONNECTION_STRING = "storage-connection-string"
CRAWLER_API_KEY = "crawler-api-key"
```

### Network Security
```hcl
# Private endpoints for secure access
enable_private_endpoints = true

# Application Gateway with WAF
enable_application_gateway = true
application_gateway_sku = "Standard_v2"
```

### Authentication
- **Managed identities** for Azure service access
- **JWT tokens** for application authentication
- **CORS configuration** for frontend-backend communication
- **Rate limiting** for API protection

## Monitoring and Alerting

### Application Insights
- **Request tracking** and performance metrics
- **Exception monitoring** with alerting
- **Dependency tracking** for external services
- **Custom metrics** and events

### Log Analytics
```bash
# Query application logs
az monitor log-analytics query \
  --workspace $(terraform output -raw log_analytics_workspace_name) \
  --analytics-query "AppServiceConsoleLogs | take 100"
```

### Alert Rules
- **CPU usage > 80%** for both frontend and backend
- **Memory usage > 85%** threshold alerts
- **Application error rate** monitoring
- **Response time** performance alerts

## Performance Optimization

### CDN Configuration
```hcl
# Enable CDN for static assets
enable_cdn = true
cdn_sku = "Standard_Microsoft"
```

### Caching Strategy
```hcl
# Redis cache for session management
redis_capacity = 1
cache_timeout_seconds = 300
```

### Compression
```hcl
# Enable compression
enable_static_compression = true
enable_api_compression = true
```

## Auto-Scaling Configuration

### Enable Auto-Scaling
```hcl
enable_auto_scale = true
min_instances = 1
max_instances = 5
```

### Scaling Rules
- **CPU-based scaling**: Scale out when CPU > 70%
- **Memory-based scaling**: Scale out when memory > 80%
- **Time-based scaling**: Schedule-based scaling
- **Queue-based scaling**: Based on Redis queue length

## Custom Domain and SSL

### Custom Domain Setup
```hcl
custom_domain = "tvr-dashboard.hawaiicounty.gov"
enable_custom_domain = true
enable_ssl = true
```

### SSL Certificate Management
```bash
# Add custom domain to frontend
az webapp config hostname add \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name) \
  --hostname tvr-dashboard.hawaiicounty.gov

# Add SSL certificate
az webapp config ssl bind \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name) \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNIEnabled
```

## Notification System

### Email Configuration
```hcl
smtp_host = "smtp.hawaiicounty.gov"
smtp_port = 587
smtp_username = "notifications@hawaiicounty.gov"
smtp_password = "your_smtp_password"
smtp_from_email = "noreply@hawaiicounty.gov"
```

### SMS Configuration (Twilio)
```hcl
enable_sms_notifications = true
twilio_account_sid = "your_twilio_account_sid"
twilio_auth_token = "your_twilio_auth_token"
twilio_phone_number = "+18085551234"
```

## Backup and Recovery

### Enable Backups
```hcl
enable_backup = true
backup_retention_days = 30
```

### Backup Management
```bash
# Configure backup
az backup protection enable-for-vm \
  --resource-group $(terraform output -raw resource_group_name) \
  --vault-name $(terraform output -raw backup_vault_name) \
  --vm $(terraform output -raw app_service_name)
```

## Cost Management

### Cost Optimization Strategies
- **Right-size SKUs** for different environments
- **Auto-scaling** to match demand
- **Reserved instances** for predictable workloads
- **CDN caching** to reduce bandwidth costs

### Cost Monitoring
```bash
# View cost analysis
az consumption usage list \
  --resource-group $(terraform output -raw resource_group_name) \
  --start-date 2023-01-01 \
  --end-date 2023-12-31
```

## Troubleshooting

### Common Issues

#### Terraform State Issues
```bash
# Initialize with remote state
terraform init -backend-config="storage_account_name=mystateaccount" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=hawaii-tvr-dashboard.tfstate"
```

#### Application Deployment Issues
```bash
# Check application logs
az webapp log tail \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name)

# Restart application
az webapp restart \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name)
```

#### Network Connectivity Issues
```bash
# Test network connectivity
az network vnet check-ip-address \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw virtual_network_name) \
  --ip-address <test-ip>
```

## Multi-Region Deployment

### Active-Active Configuration
```hcl
# Primary region
module "primary" {
  source = "./modules/tvr-dashboard"
  azure_region = "West US 2"
  environment = "prod"
}

# Secondary region
module "secondary" {
  source = "./modules/tvr-dashboard"
  azure_region = "East US"
  environment = "prod"
}
```

### Traffic Manager Setup
```bash
# Create Traffic Manager profile
az network traffic-manager profile create \
  --name "hawaii-tvr-dashboard-tm" \
  --resource-group $(terraform output -raw resource_group_name) \
  --routing-method Performance \
  --unique-dns-name "hawaiitvrdashboard"
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Deploy Frontend
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ secrets.FRONTEND_APP_NAME }}
        package: ./frontend-build
        resource-group: ${{ secrets.RESOURCE_GROUP }}
    
    - name: Deploy Backend
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ secrets.BACKEND_APP_NAME }}
        package: ./backend-build
        resource-group: ${{ secrets.RESOURCE_GROUP }}
```

## Best Practices

### Infrastructure as Code
- **Version control** all Terraform files
- **Use remote state** for team collaboration
- **Implement module structure** for reusability
- **Use consistent naming conventions**

### Security Best Practices
- **Principle of least privilege**: Minimal required permissions
- **Network segmentation**: Isolated network environments
- **Secrets management**: Key Vault for all sensitive data
- **Regular security updates**: Keep all services updated

### Performance Best Practices
- **Choose appropriate SKUs** for workload requirements
- **Enable auto-scaling** for production workloads
- **Implement caching strategies** for better performance
- **Monitor performance metrics** continuously

### Reliability Best Practices
- **Enable backup and recovery** for all critical data
- **Implement health checks** for all services
- **Set up alerting rules** for proactive monitoring
- **Use availability zones** for high availability

## Integration with Crawler API

### Dashboard Configuration
Update your dashboard configuration to connect with the crawler API:

```javascript
// src/config/api.js
export const config = {
  crawlerApiUrl: process.env.REACT_APP_CRAWLER_API_URL,
  crawlerApiKey: process.env.REACT_APP_CRAWLER_API_KEY,
  syncInterval: 15 * 60 * 1000, // 15 minutes
  webhookSecret: process.env.WEBHOOK_SECRET
};
```

### Real-time Updates
```javascript
// src/services/crawlerService.js
export class CrawlerService {
  async getViolations() {
    const response = await fetch(`${config.crawlerApiUrl}/api/violations`, {
      headers: {
        'Authorization': `Bearer ${config.crawlerApiKey}`
      }
    });
    return response.json();
  }

  async getViolationStatistics() {
    const response = await fetch(`${config.crawlerApiUrl}/api/crawl/statistics`, {
      headers: {
        'Authorization': `Bearer ${config.crawlerApiKey}`
      }
    });
    return response.json();
  }
}
```

This Terraform configuration provides a complete, secure, and scalable Azure infrastructure for the Hawaii TVR Compliance Dashboard with comprehensive monitoring, security, and operational capabilities.
