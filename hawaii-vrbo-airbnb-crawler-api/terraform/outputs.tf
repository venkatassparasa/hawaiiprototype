# Outputs for Hawaii Vacation Rental Crawler API deployment on Azure

# Resource Information
output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

# Application Information
output "app_service_name" {
  description = "Name of the App Service"
  value       = azurerm_linux_web_app.main.name
}

output "app_service_url" {
  description = "URL of the App Service"
  value       = azurerm_linux_web_app.main.default_hostname
}

output "app_service_id" {
  description = "ID of the App Service"
  value       = azurerm_linux_web_app.main.id
}

# Database Information
output "cosmos_db_account_name" {
  description = "Name of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.name
}

output "cosmos_db_connection_string" {
  description = "Connection string for Cosmos DB"
  value       = azurerm_cosmosdb_account.main.connection_strings[0]
  sensitive   = true
}

output "cosmos_db_endpoint" {
  description = "Endpoint URL for Cosmos DB"
  value       = azurerm_cosmosdb_account.main.endpoint
}

# Redis Information
output "redis_cache_name" {
  description = "Name of the Redis cache"
  value       = azurerm_redis_cache.main.name
}

output "redis_hostname" {
  description = "Hostname of the Redis cache"
  value       = azurerm_redis_cache.main.hostname
}

output "redis_port" {
  description = "Port of the Redis cache"
  value       = azurerm_redis_cache.main.port
}

output "redis_primary_key" {
  description = "Primary key for Redis cache"
  value       = azurerm_redis_cache.main.primary_access_key
  sensitive   = true
}

# Storage Information
output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "storage_account_id" {
  description = "ID of the storage account"
  value       = azurerm_storage_account.main.id
}

output "storage_primary_key" {
  description = "Primary key for storage account"
  value       = azurerm_storage_account.main.primary_access_key
  sensitive   = true
}

output "storage_connection_string" {
  description = "Connection string for storage account"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

output "evidence_container_name" {
  description = "Name of the evidence storage container"
  value       = azurerm_storage_container.evidence.name
}

output "logs_container_name" {
  description = "Name of the logs storage container"
  value       = azurerm_storage_container.logs.name
}

# Key Vault Information
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.main.id
}

# Monitoring Information
output "application_insights_name" {
  description = "Name of Application Insights"
  value       = azurerm_application_insights.main.name
}

output "application_insights_app_id" {
  description = "App ID of Application Insights"
  value       = azurerm_application_insights.main.app_id
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key for Application Insights"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "log_analytics_workspace_name" {
  description = "Name of Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.name
}

output "log_analytics_workspace_id" {
  description = "ID of Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.workspace_id
}

output "log_analytics_workspace_primary_shared_key" {
  description = "Primary shared key for Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.primary_shared_key
  sensitive   = true
}

# Networking Information
output "virtual_network_name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.main.name
}

output "virtual_network_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.main.id
}

output "application_gateway_name" {
  description = "Name of the Application Gateway"
  value       = azurerm_application_gateway.main.name
}

output "application_gateway_public_ip" {
  description = "Public IP address of the Application Gateway"
  value       = azurerm_public_ip.main.ip_address
}

output "application_gateway_fqdn" {
  description = "FQDN of the Application Gateway"
  value       = azurerm_public_ip.main.fqdn
}

# Service Plan Information
output "service_plan_name" {
  description = "Name of the App Service Plan"
  value       = azurerm_service_plan.main.name
}

output "service_plan_id" {
  description = "ID of the App Service Plan"
  value       = azurerm_service_plan.main.id
}

# Action Group Information
output "action_group_name" {
  description = "Name of the monitoring action group"
  value       = azurerm_monitor_action_group.main.name
}

output "action_group_id" {
  description = "ID of the monitoring action group"
  value       = azurerm_monitor_action_group.main.id
}

# Useful Connection Strings and Endpoints
output "mongodb_connection_string" {
  description = "MongoDB connection string for the application"
  value       = azurerm_cosmosdb_account.main.connection_strings[0]
  sensitive   = true
}

output "redis_connection_string" {
  description = "Redis connection string for the application"
  value       = "${azurerm_redis_cache.main.hostname}:6380,ssl=true,password=${azurerm_redis_cache.main.primary_access_key}"
  sensitive   = true
}

output "storage_connection_string" {
  description = "Storage connection string for the application"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

# Deployment Information
output "random_suffix" {
  description = "Random suffix used for unique resource names"
  value       = random_string.suffix.result
}

output "deployment_timestamp" {
  description = "Timestamp of the deployment"
  value       = timestamp()
}

# Environment Variables for Application
output "app_environment_variables" {
  description = "Environment variables needed for the application"
  value = {
    NODE_ENV                           = var.environment
    PORT                               = "3000"
    MONGODB_URI                        = azurerm_cosmosdb_account.main.connection_strings[0]
    REDIS_URL                          = "${azurerm_redis_cache.main.hostname}:6380,ssl=true"
    STORAGE_CONNECTION_STRING          = azurerm_storage_account.main.primary_connection_string
    STORAGE_CONTAINER_NAME              = azurerm_storage_container.evidence.name
    APPINSIGHTS_INSTRUMENTATIONKEY    = azurerm_application_insights.main.instrumentation_key
    LOG_ANALYTICS_WORKSPACE_ID         = azurerm_log_analytics_workspace.main.workspace_id
  }
  sensitive = true
}

# URLs for Access
output "api_base_url" {
  description = "Base URL for the API"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "api_health_url" {
  description = "Health check URL for the API"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}/health"
}

output "api_docs_url" {
  description = "API documentation URL"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}/api-docs"
}

# Management URLs
output "azure_portal_resource_url" {
  description = "URL to the resource in Azure Portal"
  value       = "https://portal.azure.com/#resource${azurerm_resource_group.main.id}"
}

output "application_insights_url" {
  description = "URL to Application Insights in Azure Portal"
  value       = "https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Insights%2Fcomponents/name/${azurerm_application_insights.main.name}"
}

# Configuration Summary
output "configuration_summary" {
  description = "Summary of the deployment configuration"
  value = {
    environment                    = var.environment
    azure_region                   = var.azure_region
    app_service_plan_sku           = var.app_service_plan_sku
    enable_application_gateway     = var.enable_application_gateway
    enable_private_endpoints       = var.enable_private_endpoints
    enable_monitoring              = var.enable_monitoring
    cosmos_db_throughput           = var.cosmos_db_throughput
    redis_capacity                 = var.redis_capacity
    log_retention_days             = var.log_retention_days
    storage_account_tier           = var.storage_account_tier
    storage_replication_type       = var.storage_replication_type
  }
}

# Next Steps Information
output "next_steps" {
  description = "Next steps after deployment"
  value = {
    step1 = "1. Update your DNS records to point to the Application Gateway public IP"
    step2 = "2. Configure SSL certificates if using custom domains"
    step3 = "3. Set up backup policies if enable_backup is true"
    step4 = "4. Configure auto-scaling rules if enable_auto_scale is true"
    step5 = "5. Test the API endpoints and monitoring"
    step6 = "6. Update your dashboard application with the new API URLs"
  }
}
