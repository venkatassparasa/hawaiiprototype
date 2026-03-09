# Terraform Deployment Guide - Hawaii Vacation Rental Crawler API on Azure

This guide provides comprehensive instructions for deploying the Hawaii Vacation Rental Crawler API to Microsoft Azure using Terraform.

## Overview

The Terraform configuration creates a complete, production-ready Azure environment including:
- **Azure App Service** for the Node.js API
- **Azure Cosmos DB** (MongoDB compatible) for data storage
- **Azure Redis Cache** for caching and job queues
- **Azure Storage Account** for evidence and logs
- **Azure Key Vault** for secure secret management
- **Application Gateway** for load balancing and SSL termination
- **Application Insights** and **Log Analytics** for monitoring
- **Virtual Network** with private endpoints for security
- **Alert rules** for proactive monitoring

## Prerequisites

### Required Tools
- **Terraform** >= 1.5.0
- **Azure CLI** >= 2.40.0
- **Git** for version control

### Required Accounts
- **Azure Subscription** with appropriate permissions
- **Apify Account** for web scraping services
- **AWS Account** (optional, for S3 evidence storage)

### Required Permissions
The deployment requires the following Azure permissions:
- **Contributor** role on the target subscription
- **User Access Administrator** role (for service principal creation)

## Quick Start

### 1. Clone and Prepare
```bash
# Clone the repository
git clone <repository-url>
cd hawaii-vrbo-airbnb-crawler-api/terraform

# Initialize Terraform
terraform init
```

### 2. Configure Variables
```bash
# Copy the example variables file
cp terraform.tfvars.example terraform.tfvars

# Edit the configuration
nano terraform.tfvars
```

**Required variables to configure:**
```hcl
# Azure Configuration
azure_region = "West US 2"
environment = "dev"

# Apify Configuration (Required)
apify_token = "your_apify_token_here"
apify_user_id = "your_apify_user_id_here"

# Monitoring
alert_email = "admin@hawaiicounty.gov"

# Optional AWS S3 Configuration
aws_access_key_id = "your_aws_access_key_id"
aws_secret_access_key = "your_aws_secret_access_key"
aws_s3_bucket = "hawaii-vr-evidence-prod"
```

### 3. Plan and Deploy
```bash
# Review the deployment plan
terraform plan

# Deploy the infrastructure
terraform apply

# Confirm when prompted
```

### 4. Deploy Application Code
After Terraform completes, deploy the application:
```bash
# Get the App Service name from Terraform outputs
terraform output app_service_name

# Deploy using Azure CLI (replace with your app service name)
az webapp up --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
  --runtime "NODE:18-lts" \
  --location $(terraform output -raw azure_region)
```

## Detailed Configuration

### Environment Variables

#### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `azure_region` | Azure region for deployment | `"West US 2"` |
| `environment` | Environment name | `"dev"`, `"staging"`, `"prod"` |
| `apify_token` | Apify API token | `"apify_token_here"` |
| `apify_user_id` | Apify user ID | `"apify_user_id_here"` |
| `alert_email` | Email for alerts | `"admin@hawaiicounty.gov"` |

#### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `app_service_plan_sku` | App Service Plan SKU | `"B1"` |
| `aws_access_key_id` | AWS access key | `""` |
| `aws_secret_access_key` | AWS secret key | `""` |
| `aws_s3_bucket` | AWS S3 bucket name | `""` |
| `enable_application_gateway` | Enable Application Gateway | `true` |
| `enable_private_endpoints` | Enable private endpoints | `true` |
| `enable_monitoring` | Enable monitoring | `true` |

### Scaling Options

#### App Service Plan SKUs
- **B1, B2, B3** - Basic tier (development/testing)
- **S1, S2, S3** - Standard tier (production)
- **P1v2, P2v2, P3v2** - Premium tier (high performance)

#### Auto-Scaling Configuration
```hcl
enable_auto_scale = true
min_instances = 1
max_instances = 5
```

### Networking Configuration

#### Virtual Network
```hcl
vnet_address_space = "10.0.0.0/16"
application_gateway_subnet = "10.0.1.0/24"
private_endpoint_subnet = "10.0.2.0/24"
```

#### Private Endpoints
- **Cosmos DB** - Secure database access
- **Redis Cache** - Secure cache access
- **Storage Account** - Secure file storage

### Database Configuration

#### Cosmos DB (MongoDB)
```hcl
cosmos_db_throughput = 400
cosmos_db_consistency_level = "Session"
```

#### Redis Cache
```hcl
redis_capacity = 1
redis_family = "C"
redis_sku_name = "Basic"
```

### Storage Configuration

#### Azure Storage
```hcl
storage_account_tier = "Standard"
storage_replication_type = "LRS"
```

#### Containers
- **evidence** - Screenshots and violation evidence
- **logs** - Application logs and archives

### Monitoring and Alerts

#### Application Insights
- **Request tracking**
- **Exception monitoring**
- **Performance metrics**
- **Dependency tracking**

#### Log Analytics
- **Log aggregation**
- **Query capabilities**
- **Alert integration**
- **Custom dashboards**

#### Alert Rules
- **CPU usage > 80%**
- **Memory usage > 85%**
- **Application errors**
- **Failed requests**

## Security Features

### Key Vault Integration
- **Secure secret storage**
- **Automatic rotation**
- **Access policies**
- **Audit logging**

### Network Security
- **Virtual Network isolation**
- **Private endpoints**
- **Application Gateway WAF**
- **Network security groups**

### Identity and Access
- **Managed identities**
- **Role-based access control**
- **Service principal authentication**
- **Azure AD integration**

## Deployment Commands

### Initialize Terraform
```bash
terraform init
```

### Plan Deployment
```bash
# Basic plan
terraform plan

# Plan with specific variables
terraform plan -var="environment=prod"

# Save plan for later
terraform plan -out=tfplan
```

### Apply Deployment
```bash
# Apply with confirmation
terraform apply

# Apply saved plan
terraform apply tfplan

# Apply without confirmation (automation)
terraform apply -auto-approve
```

### Destroy Deployment
```bash
# Destroy with confirmation
terraform destroy

# Destroy without confirmation
terraform destroy -auto-approve
```

## Outputs and Access

### Key Outputs
```bash
# Get all outputs
terraform output

# Get specific outputs
terraform output api_base_url
terraform output mongodb_connection_string
terraform output key_vault_uri
```

### Access Points
- **API URL**: `https://<app-service-name>.azurewebsites.net`
- **Health Check**: `https://<app-service-name>.azurewebsites.net/health`
- **API Docs**: `https://<app-service-name>.azurewebsites.net/api-docs`

### Management URLs
- **Azure Portal**: `terraform output azure_portal_resource_url`
- **Application Insights**: `terraform output application_insights_url`
- **Key Vault**: `terraform output key_vault_uri`

## Application Deployment

### Method 1: Azure CLI
```bash
# Deploy application
az webapp up \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
  --runtime "NODE:18-lts" \
  --location $(terraform output -raw azure_region)

# Configure application settings
az webapp config appsettings set \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw app_service_name) \
  --settings "$(terraform output -json app_environment_variables | jq -r '.value | to_entries[] | "\(.key)=\(.value)"' | tr '\n' ' ')"
```

### Method 2: GitHub Actions
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
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ secrets.APP_NAME }}
        package: .
        resource-group: ${{ secrets.RESOURCE_GROUP }}
```

### Method 3: Azure DevOps
Create Azure DevOps pipeline with Azure Web App deployment task.

## Environment-Specific Configurations

### Development Environment
```hcl
environment = "dev"
app_service_plan_sku = "B1"
cosmos_db_throughput = 400
redis_sku_name = "Basic"
enable_application_gateway = false
```

### Staging Environment
```hcl
environment = "staging"
app_service_plan_sku = "S1"
cosmos_db_throughput = 800
redis_sku_name = "Standard"
enable_application_gateway = true
```

### Production Environment
```hcl
environment = "prod"
app_service_plan_sku = "P1v2"
cosmos_db_throughput = 1200
redis_sku_name = "Premium"
enable_application_gateway = true
enable_backup = true
enable_auto_scale = true
```

## Monitoring and Maintenance

### Application Monitoring
```bash
# View Application Insights metrics
az monitor app-insights query \
  --app $(terraform output -raw application_insights_name) \
  --analytics-query "requests | summarize count() by bin(timestamp, 1h)"
```

### Log Analysis
```bash
# Query logs
az monitor log-analytics query \
  --workspace $(terraform output -raw log_analytics_workspace_name) \
  --analytics-query "AppServiceConsoleLogs | take 100"
```

### Backup Management
```bash
# Configure backup (if enabled)
az backup protection enable-for-vm \
  --resource-group $(terraform output -raw resource_group_name) \
  --vault-name $(terraform output -raw backup_vault_name) \
  --vm $(terraform output -raw app_service_name)
```

## Troubleshooting

### Common Issues

#### Terraform Initialization
```bash
# Clean initialization
rm -rf .terraform
terraform init
```

#### Permission Issues
```bash
# Check Azure permissions
az role assignment list --assignee $(az account show --query user.name -o tsv)
```

#### Resource Limits
```bash
# Check subscription limits
az vm list-usage --location $(terraform output -raw azure_region)
```

#### Network Connectivity
```bash
# Test network connectivity
az network vnet check-ip-address \
  --resource-group $(terraform output -raw resource_group_name) \
  --name $(terraform output -raw virtual_network_name) \
  --ip-address <test-ip>
```

### Debug Commands
```bash
# Enable Terraform debug
export TF_LOG=DEBUG
terraform plan

# Check resource state
terraform show

# Import existing resources
terraform import azurerm_resource_group.main /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
```

## Cost Management

### Cost Optimization
- Use **Basic** tier for development
- Enable **auto-scaling** for production
- Configure **log retention** appropriately
- Use **reserved instances** for long-running workloads

### Cost Monitoring
```bash
# View cost analysis
az consumption usage list \
  --resource-group $(terraform output -raw resource_group_name) \
  --start-date 2023-01-01 \
  --end-date 2023-12-31
```

## Best Practices

### Infrastructure as Code
- **Version control** all Terraform files
- **Use remote state** for team collaboration
- **Implement module structure** for reusability
- **Use consistent naming conventions**

### Security
- **Enable private endpoints** for all data services
- **Use managed identities** instead of secrets
- **Implement network security groups**
- **Regular security updates**

### Performance
- **Choose appropriate SKUs** for workload
- **Enable auto-scaling** for production
- **Implement caching strategies**
- **Monitor performance metrics**

### Reliability
- **Enable backup and recovery**
- **Implement health checks**
- **Set up alerting rules**
- **Use availability zones**

## Advanced Configuration

### Multi-Region Deployment
```hcl
# Configure multiple regions for high availability
module "primary" {
  source = "./modules/crawler-api"
  azure_region = "West US 2"
  environment = "prod"
}

module "secondary" {
  source = "./modules/crawler-api"
  azure_region = "East US"
  environment = "prod"
}
```

### Custom Modules
Create `modules/crawler-api/main.tf` for reusable infrastructure.

### Policy as Code
```hcl
# Azure Policy integration
data "azurerm_policy_definition" "example" {
  name = "example-policy"
}

resource "azurerm_policy_assignment" "example" {
  name = "example-assignment"
  scope = azurerm_resource_group.main.id
  policy_definition_id = data.azurerm_policy_definition.example.id
}
```

This Terraform configuration provides a complete, secure, and scalable Azure deployment for the Hawaii Vacation Rental Crawler API with comprehensive monitoring, security, and operational features.
