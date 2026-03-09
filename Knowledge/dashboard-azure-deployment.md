# TVR Compliance Dashboard Azure Deployment Guide

This guide provides comprehensive instructions for deploying the Hawaii TVR Compliance Dashboard to Microsoft Azure using Terraform infrastructure as code.

## Overview

The TVR Compliance Dashboard Azure deployment creates a complete, production-ready environment including:

### Application Architecture
- **Frontend App Service** - React application hosting
- **Backend App Service** - Node.js API hosting  
- **Application Gateway** - Load balancing with SSL termination
- **Azure CDN** - Static content delivery (optional)

### Data and Storage
- **Azure Cosmos DB** - MongoDB-compatible database for application data
- **Azure Redis Cache** - Session management and caching
- **Azure Storage Account** - Static assets and file storage

### Security & Monitoring
- **Azure Key Vault** - Secure secret management
- **Application Insights** - Application performance monitoring
- **Log Analytics Workspace** - Centralized log management
- **Virtual Network** - Isolated network environment with private endpoints

### Integration Features
- **Crawler API Integration** - Real-time violation data synchronization
- **Webhook Support** - Automated notifications from crawler
- **Email/SMS Notifications** - Alert system integration
- **Auto-scaling** - Dynamic resource management

## Quick Start

### Prerequisites
```bash
# Install required tools
# Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
# Terraform: https://learn.hashicorp.com/tutorials/terraform/azure-install

# Login to Azure
az login

# Verify subscription
az account show
```

### 1. Configure Terraform Variables
```bash
# Navigate to dashboard terraform directory
cd compliance-dashboard/terraform

# Copy variables template
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars
```

**Required Configuration:**
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

### 2. Deploy Infrastructure
```bash
# Initialize Terraform
terraform init

# Review deployment plan
terraform plan

# Deploy infrastructure
terraform apply

# Confirm when prompted
```

### 3. Deploy Applications
```bash
# Use the deployment script
chmod +x deploy.sh
./deploy.sh

# Or manual deployment
az webapp up \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw frontend_app_service_name) \
  --runtime "NODE:18-lts"
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
enable_auto_scale = false
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
enable_auto_scale = false
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
The deployment script automatically:
1. **Builds** the React application
2. **Creates** deployment package
3. **Deploys** to Azure App Service
4. **Configures** environment variables

### Backend (Node.js) Deployment
The deployment script automatically:
1. **Builds** the Node.js API
2. **Creates** deployment package
3. **Deploys** to Azure App Service
4. **Configures** environment variables and secrets

### Environment Variables
Terraform automatically configures:

#### Frontend Variables
```javascript
REACT_APP_API_BASE_URL = "https://backend-app.azurewebsites.net"
REACT_APP_CRAWLER_API_URL = "https://crawler-api.hawaiicounty.gov"
REACT_APP_CRAWLER_API_KEY = "api-key-from-key-vault"
APPINSIGHTS_INSTRUMENTATIONKEY = "app-insights-key"
```

#### Backend Variables
```javascript
NODE_ENV = "production"
PORT = 3001
MONGODB_URI = "cosmos-db-connection-string"
REDIS_URL = "redis-hostname:6380,ssl=true"
JWT_SECRET = "generated-jwt-secret"
CRAWLER_API_URL = "https://crawler-api.hawaiicounty.gov"
CRAWLER_API_KEY = "api-key-from-key-vault"
STORAGE_CONNECTION_STRING = "storage-connection-string"
CORS_ORIGIN = "https://frontend-app.azurewebsites.net"
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

### Integration Features
- **Real-time data sync** from crawler API every 15 minutes
- **Violation status updates** via webhooks
- **Evidence file access** through secure Azure Storage URLs
- **Automated notifications** for new violations

### Dashboard Integration
```javascript
// src/config/api.js
export const config = {
  crawlerApiUrl: process.env.REACT_APP_CRAWLER_API_URL,
  crawlerApiKey: process.env.REACT_APP_CRAWLER_API_KEY,
  syncInterval: 15 * 60 * 1000, // 15 minutes
  webhookSecret: process.env.WEBHOOK_SECRET
};

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

  async getPropertyViolations(propertyId) {
    const response = await fetch(`${config.crawlerApiUrl}/api/violations/property/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${config.crawlerApiKey}`
      }
    });
    return response.json();
  }
}
```

## Security Configuration

### Key Vault Integration
All sensitive data is stored in Azure Key Vault:
- **JWT Secret** - Generated secure token
- **Database Connection Strings** - Cosmos DB and Redis
- **API Keys** - Crawler API integration
- **Storage Connection Strings** - Azure Storage access

### Network Security
```hcl
# Private endpoints for secure service-to-service communication
enable_private_endpoints = true

# Application Gateway with WAF protection
enable_application_gateway = true
application_gateway_sku = "Standard_v2"

# Isolated network environment
vnet_address_space = "10.1.0.0/16"
```

### Authentication & Authorization
- **Managed Identities** for Azure service access
- **JWT Tokens** for application authentication
- **CORS Configuration** for frontend-backend communication
- **Rate Limiting** for API protection

## Performance Optimization

### CDN Configuration
```hcl
# Enable Azure CDN for static assets
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
# Enable compression for better performance
enable_static_compression = true
enable_api_compression = true
```

### Auto-Scaling
```hcl
# Enable auto-scaling for production workloads
enable_auto_scale = true
min_instances = 1
max_instances = 5
```

#### Scaling Rules
- **CPU-based scaling**: Scale out when CPU > 70%
- **Memory-based scaling**: Scale out when memory > 80%
- **Time-based scaling**: Schedule-based scaling
- **Queue-based scaling**: Based on Redis queue length

## Monitoring and Alerting

### Application Insights
- **Request tracking** and performance metrics
- **Exception monitoring** with automated alerting
- **Dependency tracking** for external services
- **Custom metrics** and events

### Log Analytics
```bash
# Query application logs
az monitor log-analytics query \
  --workspace $(terraform output -raw log_analytics_workspace_name) \
  --analytics-query "AppServiceConsoleLogs | take 100"

# Query performance metrics
az monitor metrics list \
  --resource $(terraform output -raw frontend_id) \
  --metrics "CpuPercentage MemoryPercentage"
```

### Alert Rules
- **CPU usage > 80%** for both frontend and backend
- **Memory usage > 85%** threshold alerts
- **Application error rate** monitoring
- **Response time** performance alerts

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

### Webhook Support
```hcl
# Enable webhook support for real-time updates
enable_webhook_support = true
webhook_secret = "your_webhook_secret_here"
```

## Deployment Commands

### Basic Deployment
```bash
# Initialize and deploy
terraform init
terraform plan
terraform apply

# Deploy applications
./deploy.sh
```

### Advanced Options
```bash
# Plan only (review changes)
./deploy.sh -p

# Skip application deployment
./deploy.sh -s

# Validate configuration only
./deploy.sh -v

# Destroy deployment
./deploy.sh -d
```

### Manual Application Deployment
```bash
# Get deployment information
RESOURCE_GROUP=$(terraform output -raw resource_group_name)
FRONTEND_APP_NAME=$(terraform output -raw frontend_app_service_name)
BACKEND_APP_NAME=$(terraform output -raw backend_app_service_name)

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group "$RESOURCE_GROUP" \
  --name "$FRONTEND_APP_NAME" \
  --src deployment.zip
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

# Set up budget alerts
az consumption budget create \
  --resource-group $(terraform output -raw resource_group_name) \
  --name "MonthlyBudget" \
  --amount 500 \
  --time-grain Monthly
```

## Backup and Disaster Recovery

### Backup Configuration
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

# Restore from backup
az backup restore restore-disks \
  --resource-group $(terraform output -raw resource_group_name) \
  --vault-name $(terraform output -raw backup_vault_name) \
  --backup-name $(terraform output -raw backup_name) \
  --restore-point $(terraform output -raw restore_point)
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

# Add endpoints
az network traffic-manager endpoint create \
  --name "primary" \
  --profile-name "hawaii-tvr-dashboard-tm" \
  --resource-group $(terraform output -raw resource_group_name) \
  --type AzureEndpoints \
  --target-resource-id $(terraform output -raw frontend_id) \
  --endpoint-status Enabled
```

## CI/CD Integration

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
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

### Azure DevOps Pipeline
- **Build Pipeline** - Build and test applications
- **Release Pipeline** - Deploy to Azure App Services
- **Variable Groups** - Manage environment-specific configurations
- **Approval Gates** - Manual approval for production deployments

## Troubleshooting

### Common Issues

#### Terraform State Issues
```bash
# Initialize with remote state
terraform init -backend-config="storage_account_name=mystateaccount" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=hawaii-tvr-dashboard.tfstate"

# Import existing resources
terraform import azurerm_resource_group.main /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
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

# Check deployment history
az webapp deployment list \
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

# Debug private endpoints
az network private-endpoint show \
  --resource-group $(terraform output -raw resource_group_name) \
  --name <private-endpoint-name>
```

#### Performance Issues
```bash
# Monitor performance metrics
az monitor metrics list \
  --resource $(terraform output -raw frontend_id) \
  --metrics "CpuPercentage MemoryPercentage ResponseTime"

# Check application insights
az monitor app-insights query \
  --app $(terraform output -raw application_insights_name) \
  --analytics-query "requests | summarize count() by bin(timestamp, 1h)"
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

### Dashboard Configuration Updates
Update your dashboard application to connect with the crawler API:

```javascript
// src/config/api.js
const config = {
  crawlerApiUrl: process.env.REACT_APP_CRAWLER_API_URL,
  crawlerApiKey: process.env.REACT_APP_CRAWLER_API_KEY,
  syncInterval: 15 * 60 * 1000, // 15 minutes
  webhookSecret: process.env.WEBHOOK_SECRET
};

// src/components/registration/RegistrationList.jsx
import { CrawlerService } from '../services/crawlerService';

const RegistrationList = () => {
  const [crawlerData, setCrawlerData] = useState({});
  
  useEffect(() => {
    const fetchCrawlerData = async () => {
      try {
        const stats = await CrawlerService.getViolationStatistics();
        setCrawlerData(stats);
      } catch (error) {
        console.error('Error fetching crawler data:', error);
      }
    };
    
    fetchCrawlerData();
    const interval = setInterval(fetchCrawlerData, config.syncInterval);
    
    return () => clearInterval(interval);
  }, []);
  
  // Render crawler data in registration list
  return (
    <div>
      <h3>Crawler Statistics</h3>
      <p>Total Properties: {crawlerData.totalProperties}</p>
      <p>Active Listings: {crawlerData.activeListings}</p>
      <p>Total Violations: {crawlerData.totalViolations}</p>
    </div>
  );
};
```

### Real-time Updates
```javascript
// src/services/webhookService.js
export class WebhookService {
  async handleViolationWebhook(req, res) {
    const { type, violationId, propertyId, severity } = req.body;
    
    if (type === 'NEW_VIOLATION') {
      // Update dashboard state
      await updateDashboardState({
        type: 'violation_detected',
        propertyId,
        violationId,
        severity,
        message: `New ${severity} violation detected for property ${propertyId}`
      });
      
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
}
```

This comprehensive Azure deployment provides a complete, secure, and scalable infrastructure for the Hawaii TVR Compliance Dashboard with full integration with the crawler API, enterprise-grade monitoring, and operational excellence capabilities.
