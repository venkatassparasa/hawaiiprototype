# Self-Hosted Temporal on Azure Deployment Guide

This guide provides comprehensive instructions for deploying self-hosted Temporal workflow orchestration on Azure as part of the Hawaii TVR Compliance Dashboard infrastructure.

## Overview

The Temporal deployment on Azure includes:
- **PostgreSQL Flexible Server** - Persistent database for workflow state
- **Azure Container Apps** - Scalable container hosting for Temporal services
- **Azure Container Registry** - Container image management
- **Log Analytics Workspace** - Centralized logging and monitoring
- **Key Vault** - Secure secrets management
- **Virtual Network** - Private networking between services

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Temporal      │    │   Temporal      │    │   Temporal      │
│   Frontend      │    │   History       │    │   Matching      │
│   (Port: 7233)  │    │   Service       │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Temporal      │    │   Temporal      │    │   PostgreSQL    │
│   UI            │    │   Worker        │    │   Database      │
│   (Port: 8080)  │    │   Service       │    │   (Port: 5432)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Container     │    │   Container     │    │   Virtual       │
│   Registry      │    │   Apps Env      │    │   Network       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Azure Requirements
- **Azure subscription** with appropriate permissions
- **Azure CLI** installed and configured
- **Terraform** >= 1.5.0
- **Container registry access** for custom images

### Resource Requirements
- **Minimum**: 4 vCPUs, 16GB RAM for development
- **Recommended**: 8 vCPUs, 32GB RAM for production
- **Storage**: 100GB+ for PostgreSQL and logs
- **Network**: VNet with private subnets

## Configuration

### Enable Temporal in Terraform

Set the following variables in `terraform.tfvars`:

```hcl
# Enable Temporal deployment
enable_temporal = true

# Temporal version configuration
temporal_version = "v1.20.0"
temporal_ui_version = "v2.20.0"
temporal_namespace = "default"
temporal_history_shards = 4

# Service scaling
temporal_min_replicas = 1
temporal_max_replicas = 3
temporal_worker_min_replicas = 1
temporal_worker_max_replicas = 5

# Resource allocation
temporal_frontend_cpu = "0.5"
temporal_frontend_memory = "1Gi"
temporal_history_cpu = "1.0"
temporal_history_memory = "2Gi"
temporal_matching_cpu = "0.5"
temporal_matching_memory = "1Gi"
temporal_worker_cpu = "0.5"
temporal_worker_memory = "1Gi"
temporal_ui_cpu = "0.25"
temporal_ui_memory = "512Mi"

# PostgreSQL configuration
postgresql_version = "14"
postgresql_admin_login = "temporaladmin"
postgresql_storage_mb = 32768
postgresql_sku = "B_Standard_B2ms"
postgresql_ha_mode = "ZoneRedundant"
```

### PostgreSQL Configuration

```hcl
# PostgreSQL for Temporal
postgresql_version = "14"
postgresql_admin_login = "temporaladmin"
postgresql_storage_mb = 32768
postgresql_sku = "B_Standard_B2ms"
postgresql_backup_retention_days = 7
postgresql_geo_redundant_backup = false
postgresql_ha_mode = "ZoneRedundant"
postgresql_maintenance_day = 0
postgresql_maintenance_hour = 2
postgresql_maintenance_minute = 0
```

### Container Registry Configuration

```hcl
# Container Registry
container_registry_sku = "Basic"
```

## Deployment Steps

### 1. Prepare Terraform Configuration

```bash
# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars

# Set enable_temporal = true
# Configure PostgreSQL settings
# Set resource allocations
```

### 2. Initialize Terraform

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan deployment
terraform plan
```

### 3. Deploy Infrastructure

```bash
# Apply Terraform configuration
terraform apply

# Confirm deployment
yes
```

### 4. Verify Deployment

```bash
# Check deployment status
terraform output

# Verify Temporal services
terraform output temporal_ui_url
terraform output temporal_frontend_url
terraform output temporal_postgresql_fqdn
```

## Services Configuration

### Temporal Frontend Service

```yaml
# Container App Configuration
resource "azurerm_container_app" "temporal_frontend" {
  name = "ca-temporal-frontend"
  image = "temporalio/auto-setup:v1.20.0"
  cpu = "0.5"
  memory = "1Gi"
  
  environment {
    DB = "postgresql"
    DB_HOST = postgresql-server.fqdn
    DB_PORT = "5432"
    DB_NAME = "temporal"
    DEFAULT_NAMESPACE = "default"
    NUM_HISTORY_SHARDS = "4"
  }
}
```

### Temporal History Service

```yaml
# History Service Configuration
resource "azurerm_container_app" "temporal_history" {
  name = "ca-temporal-history"
  image = "temporalio/history:v1.20.0"
  cpu = "1.0"
  memory = "2Gi"
  
  environment {
    DB = "postgresql"
    DB_HOST = postgresql-server.fqdn
    DB_PORT = "5432"
    DB_NAME = "temporal"
    NUM_HISTORY_SHARDS = "4"
  }
}
```

### Temporal Matching Service

```yaml
# Matching Service Configuration
resource "azurerm_container_app" "temporal_matching" {
  name = "ca-temporal-matching"
  image = "temporalio/matching:v1.20.0"
  cpu = "0.5"
  memory = "1Gi"
  
  environment {
    DB = "postgresql"
    DB_HOST = postgresql-server.fqdn
    DB_PORT = "5432"
    DB_NAME = "temporal"
    NUM_HISTORY_SHARDS = "4"
  }
}
```

### Temporal Worker Service

```yaml
# Worker Service Configuration
resource "azurerm_container_app" "temporal_worker" {
  name = "ca-temporal-worker"
  image = "container-registry/temporal-worker:latest"
  cpu = "0.5"
  memory = "1Gi"
  
  environment {
    TEMPORAL_ADDRESS = "http://temporal-frontend:7233"
    TEMPORAL_NAMESPACE = "default"
    NODE_ENV = "production"
    MONGODB_URI = cosmos-connection-string
    REDIS_URL = redis-connection-string
  }
}
```

### Temporal UI Service

```yaml
# UI Service Configuration
resource "azurerm_container_app" "temporal_ui" {
  name = "ca-temporal-ui"
  image = "temporalio/ui:v2.20.0"
  cpu = "0.25"
  memory = "512Mi"
  
  environment {
    TEMPORAL_ADDRESS = "http://temporal-frontend:7233"
    TEMPORAL_PORT = "7233"
    DEFAULT_NAMESPACE = "default"
  }
}
```

## Database Setup

### PostgreSQL Database Initialization

Temporal automatically initializes the PostgreSQL database with the required schema:

```sql
-- Tables created by Temporal
CREATE TABLE temporal_namespace (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    owner_email VARCHAR(255),
    data JSONB,
    active_cluster_id VARCHAR(255),
    history_shard_count INTEGER,
    is_global BOOLEAN DEFAULT FALSE,
    bad_binary_checksums TEXT[],
    archival_config JSONB,
    visibility_config JSONB,
    notification_config JSONB,
    replication_config JSONB,
    config_version INTEGER DEFAULT 0,
    promote_namespace BOOLEAN DEFAULT FALSE,
    workflow_execution_retention_ttl_days INTEGER,
    search_attributes JSONB,
    custom_search_attributes JSONB,
    cluster_archival_config JSONB,
    history_archival_config JSONB,
    visibility_archival_config JSONB,
    next_bad_binary_checksum TEXT,
    failover_version INTEGER DEFAULT 0,
    failover_notification_version INTEGER DEFAULT 0,
    is_global_namespace BOOLEAN DEFAULT FALSE,
    namespace_is_active BOOLEAN DEFAULT TRUE,
    namespace_is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Additional tables for workflows, executions, history, etc.
```

### Database Connection

```bash
# Connect to PostgreSQL
psql -h postgresql-server.fqdn -U temporaladmin -d temporal

# Check tables
\dt

# Check Temporal schema
SELECT * FROM temporal_namespace;
```

## Custom Worker Deployment

### Build Custom Worker Image

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Start command
CMD ["npm", "run", "worker"]
```

### Push to Container Registry

```bash
# Build and push custom worker
az acr build --registry crtemporal \
  --image temporal-worker:latest \
  --file Dockerfile \
  .

# Or use Docker
docker build -t crtemporal.azurecr.io/temporal-worker:latest .
docker push crtemporal.azurecr.io/temporal-worker:latest
```

### Worker Configuration

```typescript
// src/worker.ts
import { Worker } from '@temporalio/worker';
import { crawlWorkflows } from './workflows';
import { crawlActivities } from './activities';

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities: crawlActivities,
    taskQueue: 'hawaii-tvr-crawl',
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  });

  console.log('Worker started successfully');
  
  await worker.run();
}

runWorker().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
```

## Monitoring and Logging

### Log Analytics Integration

```yaml
# Container App Environment with Log Analytics
resource "azurerm_container_app_environment" "temporal" {
  name = "cae-temporal"
  location = azurerm_resource_group.main.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.temporal.id
}
```

### Monitoring Queries

```kql
// Temporal service logs
ContainerAppConsoleLogs
| where TimeGenerated > ago(1h)
| where AppName contains "temporal"
| project TimeGenerated, AppName, LogMessage
| order by TimeGenerated desc

// Error logs
ContainerAppSystemLogs
| where TimeGenerated > ago(1h)
| where AppName contains "temporal"
| where Level == "Error"
| project TimeGenerated, AppName, Message
| order by TimeGenerated desc

// Performance metrics
ContainerAppSystemLogs
| where TimeGenerated > ago(1h)
| where AppName contains "temporal"
| where MetricName in ["CpuUsage", "MemoryUsage"]
| project TimeGenerated, AppName, MetricName, Value
| order by TimeGenerated desc
```

### Health Checks

```bash
# Check Temporal Frontend health
curl -f http://temporal-frontend:7233/health

# Check Temporal UI health
curl -f http://temporal-ui:8080

# Check PostgreSQL health
psql -h postgresql-server.fqdn -U temporaladmin -d temporal -c "SELECT 1"

# Check worker logs
az containerapp logs show --name ca-temporal-worker --resource-group rg-hawaii-tvr-dashboard
```

## Security Configuration

### Network Security

```yaml
# Virtual Network Configuration
resource "azurerm_virtual_network" "main" {
  name = "vnet-hawaii-tvr"
  address_space = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "database" {
  name = "snet-database"
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes = ["10.0.3.0/24"]
  delegation {
    name = "delegation"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}
```

### Secrets Management

```yaml
# Key Vault for Temporal secrets
resource "azurerm_key_vault_secret" "temporal_postgres" {
  name = "temporal-postgres-connection"
  value = "Host=postgresql-server.fqdn;Port=5432;Username=temporaladmin;Password=secure-password;Database=temporal;"
  key_vault_id = azurerm_key_vault.main.id
}
```

### Access Control

```bash
# Grant access to Key Vault
az keyvault set-policy --name kv-hawaii-tvr-dashboard \
  --spn <container-app-identity> \
  --secret-permissions get list

# Grant access to Container Registry
az acr update --name crtemporal \
  --anonymous-pull-enabled false
```

## Performance Optimization

### Scaling Configuration

```yaml
# Auto-scaling for Temporal services
resource "azurerm_container_app" "temporal_frontend" {
  min_replicas = var.temporal_min_replicas
  max_replicas = var.temporal_max_replicas
  
  scale_rule {
    name = "cpu-scale"
    custom {
      type = "cpu"
      value = "70"
      operator = "GreaterThan"
    }
  }
}
```

### Resource Allocation

```hcl
# Production resource allocation
temporal_frontend_cpu = "1.0"
temporal_frontend_memory = "2Gi"
temporal_history_cpu = "2.0"
temporal_history_memory = "4Gi"
temporal_matching_cpu = "1.0"
temporal_matching_memory = "2Gi"
temporal_worker_cpu = "1.0"
temporal_worker_memory = "2Gi"
```

### Database Optimization

```hcl
# PostgreSQL performance settings
postgresql_sku = "MO_Standard_E4s"
postgresql_storage_mb = 131072
postgresql_ha_mode = "ZoneRedundant"
postgresql_geo_redundant_backup = true
```

## Backup and Disaster Recovery

### PostgreSQL Backup

```hcl
# Backup configuration
postgresql_backup_retention_days = 35
postgresql_geo_redundant_backup = true
```

### Container App Backup

```bash
# Export container app configuration
az containerapp export --name ca-temporal-frontend --resource-group rg-hawaii-tvr-dashboard

# Backup container registry images
az acr repository list --name crtemporal --output table
```

## Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Issues

```bash
# Check PostgreSQL status
az postgres flexible-server show --name psql-temporal --resource-group rg-hawaii-tvr-dashboard

# Check network rules
az postgres flexible-server firewall-rule list --server-name psql-temporal --resource-group rg-hawaii-tvr-dashboard

# Test connection
psql -h postgresql-server.fqdn -U temporaladmin -d temporal -c "SELECT version();"
```

#### 2. Container App Issues

```bash
# Check container app logs
az containerapp logs show --name ca-temporal-frontend --resource-group rg-hawaii-tvr-dashboard

# Check container app status
az containerapp show --name ca-temporal-frontend --resource-group rg-hawaii-tvr-dashboard

# Restart container app
az containerapp revision rollback --name ca-temporal-frontend --resource-group rg-hawaii-tvr-dashboard
```

#### 3. Temporal Service Issues

```bash
# Check Temporal frontend
curl -f http://temporal-frontend:7233/health

# Check Temporal UI
curl -f http://temporal-ui:8080

# Check worker status
az containerapp logs show --name ca-temporal-worker --resource-group rg-hawaii-tvr-dashboard
```

### Debug Commands

```bash
# Enable verbose logging
az containerapp update --name ca-temporal-frontend \
  --set-env-vars.LOG_LEVEL=debug

# Check resource utilization
az monitor metrics list --resource /subscriptions/<sub>/resourceGroups/rg-hawaii-tvr-dashboard/providers/Microsoft.App/containerApps/ca-temporal-frontend \
  --metrics "CpuUsage MemoryUsage"

# Check network connectivity
az network watcher check-connectivity \
  --source-resource-id /subscriptions/<sub>/resourceGroups/rg-hawaii-tvr-dashboard/providers/Microsoft.App/containerApps/ca-temporal-frontend \
  --dest-resource-id /subscriptions/<sub>/resourceGroups/rg-hawaii-tvr-dashboard/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-temporal \
  --dest-port 5432
```

## Maintenance

### Regular Tasks

```bash
# Update Temporal version
# 1. Update terraform.tfvars
temporal_version = "v1.21.0"

# 2. Apply changes
terraform apply

# 3. Verify upgrade
curl -f http://temporal-frontend:7233/health
```

### Database Maintenance

```bash
# PostgreSQL maintenance
az postgres flexible-server update \
  --name psql-temporal \
  --resource-group rg-hawaii-tvr-dashboard \
  --maintenance-window "Sunday:02:00"

# Check database size
psql -h postgresql-server.fqdn -U temporaladmin -d temporal -c "SELECT pg_size_pretty(pg_database_size('temporal'));"
```

### Log Management

```bash
# Archive old logs
az monitor log-analytics workspace update \
  --name law-temporal \
  --resource-group rg-hawaii-tvr-dashboard \
  --retention-in-days 90
```

## Integration with Dashboard

### Environment Variables

```hcl
# Dashboard backend configuration
backend_environment_variables = {
  TEMPORAL_ADDRESS = "http://temporal-frontend:7233"
  TEMPORAL_NAMESPACE = "default"
  TEMPORAL_ENABLED = "true"
}
```

### Frontend Integration

```javascript
// src/services/temporalService.js
const TEMPORAL_CONFIG = {
  enabled: process.env.REACT_APP_TEMPORAL_ENABLED === 'true',
  uiUrl: process.env.REACT_APP_TEMPORAL_UI_URL,
  namespace: process.env.REACT_APP_TEMPORAL_NAMESPACE || 'default'
};

export const temporalService = {
  async getWorkflows() {
    if (!TEMPORAL_CONFIG.enabled) return [];
    
    const response = await fetch(`${TEMPORAL_CONFIG.uiUrl}/api/namespaces/${TEMPORAL_CONFIG.namespace}/workflows`);
    return response.json();
  },
  
  async startWorkflow(workflowId, input) {
    if (!TEMPORAL_CONFIG.enabled) throw new Error('Temporal not enabled');
    
    const response = await fetch('/api/temporal/workflows/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId, input })
    });
    
    return response.json();
  }
};
```

## Cost Optimization

### Resource Optimization

```hcl
# Development environment
temporal_min_replicas = 1
temporal_max_replicas = 1
temporal_worker_min_replicas = 1
temporal_worker_max_replicas = 1

# Production environment
temporal_min_replicas = 2
temporal_max_replicas = 5
temporal_worker_min_replicas = 2
temporal_worker_max_replicas = 10
```

### Monitoring Costs

```bash
# Set up cost alerts
az monitor cost-management alert create \
  --name "Temporal Cost Alert" \
  --resource-group rg-hawaii-tvr-dashboard \
  --threshold 500 \
  --operator "GreaterThan" \
  --aggregation "Total" \
  --frequency "Monthly"
```

## Best Practices

### Security
- Use managed identities for container apps
- Enable private endpoints for PostgreSQL
- Store secrets in Key Vault
- Enable HTTPS only for all services
- Regularly update Temporal versions

### Performance
- Monitor resource utilization
- Use appropriate instance sizes
- Enable auto-scaling based on metrics
- Optimize PostgreSQL configuration
- Use connection pooling

### Reliability
- Enable high availability for PostgreSQL
- Configure backup and retention policies
- Set up health checks and monitoring
- Use zone-redundant deployments
- Implement proper error handling

### Operations
- Use infrastructure as code
- Implement CI/CD pipelines
- Set up proper logging and monitoring
- Regular security updates
- Disaster recovery planning

This comprehensive guide provides everything needed to deploy and manage self-hosted Temporal on Azure for the Hawaii TVR Compliance Dashboard.
