# Azure Terraform Deployment Guide

This guide provides comprehensive instructions for deploying the Hawaii Vacation Rental Crawler API to Microsoft Azure using Terraform infrastructure as code.

## Overview

The Terraform deployment creates a complete, production-ready Azure environment including:

### Core Infrastructure
- **Azure App Service** - Node.js API hosting with auto-scaling
- **Azure Cosmos DB** - MongoDB-compatible database with global distribution
- **Azure Redis Cache** - High-performance caching and job queues
- **Azure Storage Account** - Secure evidence and log storage
- **Azure Key Vault** - Centralized secret management

### Networking & Security
- **Virtual Network** - Isolated network environment
- **Application Gateway** - Load balancing with WAF protection
- **Private Endpoints** - Secure service-to-service communication
- **Network Security Groups** - Traffic filtering and protection

### Monitoring & Operations
- **Application Insights** - Application performance monitoring
- **Log Analytics Workspace** - Centralized log management
- **Alert Rules** - Proactive monitoring and notifications
- **Action Groups** - Automated response to alerts

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
# Navigate to terraform directory
cd hawaii-vrbo-airbnb-crawler-api/terraform

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

# Apify Configuration (Required)
apify_token = "your_apify_token_here"
apify_user_id = "your_apify_user_id_here"

# Monitoring
alert_email = "admin@hawaiicounty.gov"

# Optional AWS S3 for evidence storage
aws_access_key_id = "your_aws_access_key_id"
aws_secret_access_key = "your_aws_secret_access_key"
aws_s3_bucket = "hawaii-vr-evidence-prod"
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

### 3. Deploy Application
```bash
# Use the deployment script
chmod +x deploy.sh
./deploy.sh

# Or manual deployment
az webapp up \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
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
                       │  Azure App      │    │ Private         │
                       │  Service        │    │ Endpoints       │
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
```

### Staging Environment
```hcl
environment = "staging"
app_service_plan_sku = "S1"
cosmos_db_throughput = 800
redis_sku_name = "Standard"
enable_application_gateway = true
enable_private_endpoints = true
```

### Production Environment
```hcl
environment = "prod"
app_service_plan_sku = "P1v2"
cosmos_db_throughput = 1200
redis_sku_name = "Premium"
enable_application_gateway = true
enable_private_endpoints = true
enable_backup = true
enable_auto_scale = true
```

## Security Configuration

### Key Vault Integration
- **Secrets Management**: All sensitive data stored in Key Vault
- **Managed Identities**: App Service uses managed identity to access secrets
- **Access Policies**: Fine-grained access control
- **Audit Logging**: Complete audit trail for secret access

### Network Security
- **Virtual Network**: Isolated network environment
- **Private Endpoints**: Secure access to Azure services
- **Application Gateway**: Web Application Firewall (WAF) protection
- **Network Security Groups**: Traffic filtering and network segmentation

### Identity and Access
- **Managed Identities**: Azure AD-based authentication
- **Role-Based Access**: RBAC for all resources
- **Service Principals**: Automated deployment access
- **Azure AD Integration**: Single sign-on capabilities

## Monitoring and Alerting

### Application Insights
```javascript
// Application monitoring includes:
// - Request tracking and performance
// - Exception monitoring and alerting
// - Dependency tracking
// - Custom metrics and events
```

### Log Analytics
```bash
# Query application logs
az monitor log-analytics query \
  --workspace $(terraform output -raw log_analytics_workspace_name) \
  --analytics-query "AppServiceConsoleLogs | take 100"
```

### Alert Rules
- **CPU Usage**: Alert when CPU > 80%
- **Memory Usage**: Alert when memory > 85%
- **Error Rate**: Alert when error rate > 5%
- **Response Time**: Alert when response time > 2 seconds

## Deployment Commands

### Basic Deployment
```bash
# Initialize and deploy
terraform init
terraform plan
terraform apply

# Deploy application
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
APP_SERVICE_NAME=$(terraform output -raw app_service_name)

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_SERVICE_NAME" \
  --src deployment.zip
```

## Cost Management

### Cost Optimization Strategies
- **Right-size SKUs**: Choose appropriate service tiers
- **Auto-scaling**: Scale based on demand
- **Reserved Instances**: Save costs for predictable workloads
- **Monitoring**: Track and optimize resource usage

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

## Scaling Configuration

### Auto-Scaling Setup
```hcl
enable_auto_scale = true
min_instances = 1
max_instances = 5
```

### Scaling Rules
- **CPU-based scaling**: Scale out when CPU > 70%
- **Memory-based scaling**: Scale out when memory > 80%
- **Queue-based scaling**: Scale based on Redis queue length
- **Time-based scaling**: Schedule-based scaling

## Custom Domain and SSL

### Custom Domain Configuration
```hcl
custom_domain = "crawler-api.hawaiicounty.gov"
enable_custom_domain = true
enable_ssl = true
```

### SSL Certificate Setup
```bash
# Add custom domain
az webapp config hostname add \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
  --hostname crawler-api.hawaiicounty.gov

# Bind SSL certificate
az webapp config ssl bind \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNIEnabled
```

## Multi-Region Deployment

### Active-Active Configuration
```hcl
# Primary region
module "primary" {
  source = "./modules/crawler-api"
  azure_region = "West US 2"
  environment = "prod"
}

# Secondary region
module "secondary" {
  source = "./modules/crawler-api"
  azure_region = "East US"
  environment = "prod"
}
```

### Traffic Manager Setup
```bash
# Create Traffic Manager profile
az network traffic-manager profile create \
  --name "hawaii-vr-crawler-tm" \
  --resource-group $(terraform output -raw resource_group_name) \
  --routing-method Performance \
  --unique-dns-name "hawaiivrcrawler"

# Add endpoints
az network traffic-manager endpoint create \
  --name "primary" \
  --profile-name "hawaii-vr-crawler-tm" \
  --resource-group $(terraform output -raw resource_group_name) \
  --type AzureEndpoints \
  --target-resource-id $(terraform output -raw app_service_id) \
  --endpoint-status Enabled
```

## Compliance and Governance

### Azure Policy Integration
```hcl
# Enable Azure Policy
data "azurerm_policy_definition" "encryption" {
  name = "Storage accounts should encrypt data at rest"
}

resource "azurerm_policy_assignment" "encryption" {
  name = "storage-encryption"
  scope = azurerm_resource_group.main.id
  policy_definition_id = data.azurerm_policy_definition.encryption.id
}
```

### Security Center Integration
- **Security posture**: Continuous security assessment
- **Threat protection**: Advanced threat detection
- **Compliance reporting**: Automated compliance checks
- **Security recommendations**: Proactive security guidance

## Troubleshooting

### Common Issues

#### Terraform State Issues
```bash
# Initialize with remote state
terraform init -backend-config="storage_account_name=mystateaccount" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=hawaii-vr-crawler.tfstate"

# Import existing resources
terraform import azurerm_resource_group.main /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
```

#### Application Deployment Issues
```bash
# Check application logs
az webapp log tail \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name)

# Restart application
az webapp restart \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name)
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

### Performance Optimization
```bash
# Monitor performance metrics
az monitor metrics list \
  --resource $(terraform output -raw app_service_id) \
  --metrics "CpuPercentage MemoryPercentage"
```

## Best Practices

### Infrastructure as Code
- **Version control**: All infrastructure in Git
- **Modular design**: Reusable Terraform modules
- **Consistent naming**: Standardized resource naming
- **Remote state**: Team collaboration with remote state

### Security Best Practices
- **Principle of least privilege**: Minimal required permissions
- **Network segmentation**: Isolated network environments
- **Secrets management**: Key Vault for all sensitive data
- **Regular updates**: Keep all services updated

### Operational Excellence
- **Automated deployment**: CI/CD pipeline integration
- **Comprehensive monitoring**: Full observability stack
- **Backup and recovery**: Regular backup testing
- **Documentation**: Complete operational documentation

## Integration with TVR Dashboard

### Update Dashboard Configuration
```javascript
// Update dashboard API configuration
const API_BASE_URL = 'https://crawler-api.hawaiicounty.gov';
const API_KEY = 'your_api_key_from_key_vault';

// Update API client
crawlerApiService.baseUrl = API_BASE_URL;
crawlerApiService.apiKey = API_KEY;
```

### Webhook Configuration
```bash
# Configure webhook URL
az webapp config appsettings set \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
  --settings "WEBHOOK_URL=https://your-tvr-dashboard.com/api/webhooks/violations"
```

This Terraform deployment provides a complete, secure, and scalable Azure infrastructure for the Hawaii Vacation Rental Crawler API with enterprise-grade monitoring, security, and operational capabilities.
