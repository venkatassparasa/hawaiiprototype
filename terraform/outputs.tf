# Outputs for Hawaii TVR Compliance Dashboard deployment on Azure

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
output "frontend_app_service_name" {
  description = "Name of the frontend App Service"
  value       = azurerm_linux_web_app.frontend.name
}

output "backend_app_service_name" {
  description = "Name of the backend App Service"
  value       = azurerm_linux_web_app.backend.name
}

output "frontend_url" {
  description = "URL of the frontend application"
  value       = "https://${azurerm_linux_web_app.frontend.default_hostname}"
}

output "backend_url" {
  description = "URL of the backend API"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_id" {
  description = "ID of the frontend App Service"
  value       = azurerm_linux_web_app.frontend.id
}

output "backend_id" {
  description = "ID of the backend App Service"
  value       = azurerm_linux_web_app.backend.id
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

output "redis_cache_name" {
  description = "Name of the Redis Cache"
  value       = azurerm_redis_cache.main.name
}

output "redis_cache_hostname" {
  description = "Hostname of the Redis Cache"
  value       = azurerm_redis_cache.main.hostname
}

output "redis_cache_port" {
  description = "Port of the Redis Cache"
  value       = azurerm_redis_cache.main.port
}

output "redis_cache_primary_key" {
  description = "Primary key of the Redis Cache"
  value       = azurerm_redis_cache.main.primary_key
  sensitive   = true
}

# Temporal Information (conditional)
output "temporal_enabled" {
  description = "Whether Temporal is enabled"
  value       = var.enable_temporal
}

output "temporal_postgresql_server_name" {
  description = "Name of the PostgreSQL server for Temporal"
  value       = var.enable_temporal ? azurerm_postgresql_flexible_server.temporal[0].name : null
}

output "temporal_postgresql_fqdn" {
  description = "Fully qualified domain name of PostgreSQL server"
  value       = var.enable_temporal ? azurerm_postgresql_flexible_server.temporal[0].fqdn : null
}

output "temporal_postgresql_connection_string" {
  description = "Connection string for Temporal PostgreSQL"
  value       = var.enable_temporal ? "Host=${azurerm_postgresql_flexible_server.temporal[0].fqdn};Port=5432;Username=${var.postgresql_admin_login};Password=${random_password.postgresql_password[0].result};Database=temporal;" : null
  sensitive   = true
}

output "temporal_frontend_url" {
  description = "URL of the Temporal Frontend service"
  value       = var.enable_temporal ? "https://${azurerm_container_app.temporal_frontend[0].latest_revision_fqdn}:7233" : null
}

output "temporal_ui_url" {
  description = "URL of the Temporal UI"
  value       = var.enable_temporal ? "https://${azurerm_container_app.temporal_ui[0].latest_revision_fqdn}" : null
}

output "temporal_worker_url" {
  description = "URL of the Temporal Worker service"
  value       = var.enable_temporal ? "https://${azurerm_container_app.temporal_worker[0].latest_revision_fqdn}" : null
}

output "temporal_container_registry_name" {
  description = "Name of the Container Registry for Temporal"
  value       = var.enable_temporal ? azurerm_container_registry.temporal[0].name : null
}

output "temporal_container_registry_login_server" {
  description = "Login server for the Container Registry"
  value       = var.enable_temporal ? azurerm_container_registry.temporal[0].login_server : null
}

output "temporal_log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace for Temporal"
  value       = var.enable_temporal ? azurerm_log_analytics_workspace.temporal[0].name : null
}

output "temporal_container_app_environment_name" {
  description = "Name of the Container App Environment for Temporal"
  value       = var.enable_temporal ? azurerm_container_app_environment.temporal[0].name : null
}

# Storage Information
output "storage_account_name" {
  description = "Name of the Storage Account"
  value       = azurerm_storage_account.main.name
}

output "storage_account_primary_connection_string" {
  description = "Primary connection string for Storage Account"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

# Key Vault Information
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.main.id
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

# Application Gateway Information
output "application_gateway_name" {
  description = "Name of the Application Gateway"
  value       = azurerm_application_gateway.main.name
}

output "application_gateway_public_ip" {
  description = "Public IP address of the Application Gateway"
  value       = azurerm_public_ip.main.ip_address
}

output "application_gateway_frontend_url" {
  description = "Frontend URL of the Application Gateway"
  value       = "https://${azurerm_public_ip.main.ip_address}"
}

# Network Information
output "virtual_network_name" {
  description = "Name of the Virtual Network"
  value       = azurerm_virtual_network.main.name
}

output "virtual_network_id" {
  description = "ID of the Virtual Network"
  value       = azurerm_virtual_network.main.id
}

output "subnet_names" {
  description = "Names of all subnets"
  value = {
    public  = azurerm_subnet.public.name
    private = azurerm_subnet.private.name
    database = azurerm_subnet.database.name
  }
}

# Service Plan Information
output "app_service_plan_name" {
  description = "Name of the App Service Plan"
  value       = azurerm_service_plan.main.name
}

output "app_service_plan_id" {
  description = "ID of the App Service Plan"
  value       = azurerm_service_plan.main.id
}

# Monitoring Information
output "application_insights_name" {
  description = "Name of the Application Insights"
  value       = azurerm_application_insights.main.name
}

output "application_insights_app_id" {
  description = "App ID of the Application Insights"
  value       = azurerm_application_insights.main.app_id
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key of the Application Insights"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.name
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.id
}

output "log_analytics_workspace_primary_shared_key" {
  description = "Primary shared key of the Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.primary_shared_key
  sensitive   = true
}

# Action Group Information
output "action_group_name" {
  description = "Name of the Action Group"
  value       = azurerm_monitor_action_group.main.name
}

output "action_group_id" {
  description = "ID of the Action Group"
  value       = azurerm_monitor_action_group.main.id
}

# Environment Variables for Applications
output "frontend_environment_variables" {
  description = "Environment variables for frontend application"
  value = {
    REACT_APP_API_BASE_URL          = "https://${azurerm_linux_web_app.backend.default_hostname}"
    REACT_APP_CRAWLER_API_URL       = var.crawler_api_url
    REACT_APP_CRAWLER_API_KEY       = var.crawler_api_key
    REACT_APP_TEMPORAL_ENABLED      = var.enable_temporal ? "true" : "false"
    REACT_APP_TEMPORAL_UI_URL       = var.enable_temporal ? "https://${azurerm_container_app.temporal_ui[0].latest_revision_fqdn}" : ""
    NODE_ENV                        = var.environment
  }
  sensitive = true
}

output "backend_environment_variables" {
  description = "Environment variables for backend application"
  value = {
    NODE_ENV                        = var.environment
    PORT                            = "3001"
    MONGODB_URI                     = azurerm_cosmosdb_account.main.connection_strings[0]
    REDIS_URL                       = "${azurerm_redis_cache.main.hostname}:6380"
    REDIS_PASSWORD                  = azurerm_redis_cache.main.primary_key
    JWT_SECRET                      = azurerm_key_vault_secret.jwt_secret.value
    CRAWLER_API_URL                 = var.crawler_api_url
    CRAWLER_API_KEY                 = var.crawler_api_key
    TEMPORAL_ADDRESS                = var.enable_temporal ? "http://${azurerm_container_app.temporal_frontend[0].latest_revision_fqdn}:7233" : ""
    TEMPORAL_NAMESPACE              = var.temporal_namespace
    AZURE_STORAGE_CONNECTION_STRING = azurerm_storage_account.main.primary_connection_string
    AZURE_STORAGE_CONTAINER_NAME    = "dashboard-evidence"
    LOG_LEVEL                       = var.environment == "prod" ? "warn" : "debug"
  }
  sensitive = true
}

# Deployment Summary
output "deployment_summary" {
  description = "Summary of the deployment"
  value = {
    resource_group        = azurerm_resource_group.main.name
    location             = azurerm_resource_group.main.location
    environment          = var.environment
    frontend_url         = "https://${azurerm_linux_web_app.frontend.default_hostname}"
    backend_url          = "https://${azurerm_linux_web_app.backend.default_hostname}"
    temporal_enabled      = var.enable_temporal
    temporal_ui_url       = var.enable_temporal ? "https://${azurerm_container_app.temporal_ui[0].latest_revision_fqdn}" : "N/A"
    application_gateway   = "https://${azurerm_public_ip.main.ip_address}"
    databases = {
      cosmos_db = azurerm_cosmosdb_account.main.name
      redis     = azurerm_redis_cache.main.name
      postgresql = var.enable_temporal ? azurerm_postgresql_flexible_server.temporal[0].name : "N/A"
    }
    storage = {
      account_name = azurerm_storage_account.main.name
      containers  = ["static", "logs", "evidence"]
    }
    monitoring = {
      application_insights = azurerm_application_insights.main.name
      log_analytics        = azurerm_log_analytics_workspace.main.name
      action_group         = azurerm_monitor_action_group.main.name
    }
  }
}

# Next Steps
output "next_steps" {
  description = "Next steps after deployment"
  value = [
    "1. Test the frontend application: https://${azurerm_linux_web_app.frontend.default_hostname}",
    "2. Test the backend API: https://${azurerm_linux_web_app.backend.default_hostname}/api/health",
    var.enable_temporal ? "3. Access Temporal UI: https://${azurerm_container_app.temporal_ui[0].latest_revision_fqdn}" : "",
    var.enable_temporal ? "4. Configure Temporal workflows and activities" : "",
    "5. Set up custom domain and SSL certificates",
    "6. Configure monitoring alerts and notifications",
    "7. Update DNS records to point to Application Gateway",
    "8. Test the complete application functionality",
    "9. Set up CI/CD pipelines for automated deployments",
    "10. Configure backup and disaster recovery"
  ]
}

# Integration Information
output "integration_info" {
  description = "Integration information for external services"
  value = {
    crawler_api = {
      url  = var.crawler_api_url
      key  = var.crawler_api_key
      status = "External service - ensure proper connectivity"
    }
    temporal = var.enable_temporal ? {
      frontend_url = "http://${azurerm_container_app.temporal_frontend[0].latest_revision_fqdn}:7233"
      ui_url       = "https://${azurerm_container_app.temporal_ui[0].latest_revision_fqdn}"
      namespace    = var.temporal_namespace
      postgresql   = azurerm_postgresql_flexible_server.temporal[0].fqdn
      status       = "Self-hosted in Azure Container Apps"
    } : {
      status = "Not enabled"
    }
    databases = {
      mongodb = {
        connection_string = azurerm_cosmosdb_account.main.connection_strings[0]
        database_name     = "hawaii-tvr-dashboard"
        type              = "Cosmos DB (MongoDB API)"
      }
      redis = {
        hostname = azurerm_redis_cache.main.hostname
        port     = azurerm_redis_cache.main.port
        password = azurerm_redis_cache.main.primary_key
        type     = "Azure Cache for Redis"
      }
      postgresql = var.enable_temporal ? {
        hostname = azurerm_postgresql_flexible_server.temporal[0].fqdn
        port     = "5432"
        database = "temporal"
        type     = "PostgreSQL Flexible Server"
      } : null
    }
  }
  sensitive = true
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

output "static_container_name" {
  description = "Name of the static storage container"
  value       = azurerm_storage_container.static.name
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

# CDN Information (if enabled)
output "cdn_profile_name" {
  description = "Name of the CDN profile"
  value       = var.enable_cdn ? azurerm_cdn_profile.main[0].name : null
}

output "cdn_endpoint_name" {
  description = "Name of the CDN endpoint"
  value       = var.enable_cdn ? azurerm_cdn_endpoint.main[0].name : null
}

output "cdn_endpoint_url" {
  description = "URL of the CDN endpoint"
  value       = var.enable_cdn ? "https://${azurerm_cdn_endpoint.main[0].host_name}" : null
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

# Environment Variables for Application
output "frontend_environment_variables" {
  description = "Environment variables needed for the frontend application"
  value = {
    NODE_ENV                           = var.environment
    REACT_APP_API_BASE_URL              = "https://${azurerm_linux_web_app.backend.default_hostname}"
    REACT_APP_CRAWLER_API_URL           = var.crawler_api_url
    REACT_APP_CRAWLER_API_KEY           = var.crawler_api_key
    APPINSIGHTS_INSTRUMENTATIONKEY    = azurerm_application_insights.main.instrumentation_key
    LOG_ANALYTICS_WORKSPACE_ID         = azurerm_log_analytics_workspace.main.workspace_id
  }
  sensitive = true
}

output "backend_environment_variables" {
  description = "Environment variables needed for the backend application"
  value = {
    NODE_ENV                           = var.environment
    PORT                               = var.backend_port
    MONGODB_URI                        = azurerm_cosmosdb_account.main.connection_strings[0]
    REDIS_URL                          = "${azurerm_redis_cache.main.hostname}:6380,ssl=true"
    STORAGE_CONNECTION_STRING          = azurerm_storage_account.main.primary_connection_string
    STORAGE_CONTAINER_NAME              = azurerm_storage_container.static.name
    JWT_SECRET                         = random_password.jwt_secret.result
    CRAWLER_API_URL                    = var.crawler_api_url
    CRAWLER_API_KEY                    = var.crawler_api_key
    APPINSIGHTS_INSTRUMENTATIONKEY    = azurerm_application_insights.main.instrumentation_key
    LOG_ANALYTICS_WORKSPACE_ID         = azurerm_log_analytics_workspace.main.workspace_id
    CORS_ORIGIN                        = "https://${azurerm_linux_web_app.frontend.default_hostname}"
  }
  sensitive = true
}

# URLs for Access
output "dashboard_url" {
  description = "Main dashboard URL"
  value       = "https://${azurerm_public_ip.main.fqdn}"
}

output "api_base_url" {
  description = "Base URL for the API"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "api_health_url" {
  description = "Health check URL for the API"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}/health"
}

output "frontend_health_url" {
  description = "Health check URL for the frontend"
  value       = "https://${azurerm_linux_web_app.frontend.default_hostname}"
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

output "key_vault_url" {
  description = "URL to Key Vault in Azure Portal"
  value       = "https://portal.azure.com/#resource${azurerm_key_vault.main.id}"
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
    enable_cdn                     = var.enable_cdn
    cosmos_db_throughput           = var.cosmos_db_throughput
    redis_capacity                 = var.redis_capacity
    log_retention_days             = var.log_retention_days
    storage_account_tier           = var.storage_account_tier
    storage_replication_type       = var.storage_replication_type
    enable_auto_scale              = var.enable_auto_scale
    min_instances                  = var.min_instances
    max_instances                  = var.max_instances
    crawler_integration_enabled     = var.enable_crawler_integration
    webhook_support_enabled        = var.enable_webhook_support
  }
}

# Next Steps Information
output "next_steps" {
  description = "Next steps after deployment"
  value = {
    step1 = "1. Deploy the frontend and backend applications to their respective App Services"
    step2 = "2. Configure custom domain and SSL certificates if needed"
    step3 = "3. Set up backup policies if enable_backup is true"
    step4 = "4. Configure auto-scaling rules if enable_auto_scale is true"
    step5 = "5. Test the application endpoints and monitoring"
    step6 = "6. Configure webhook endpoints for crawler integration"
    step7 = "7. Set up email/SMS notifications if configured"
    step8 = "8. Update DNS records to point to the Application Gateway public IP"
  }
}

# Integration Information
output "crawler_integration_info" {
  description = "Information for crawler API integration"
  value = {
    crawler_api_url    = var.crawler_api_url
    crawler_api_key    = var.crawler_api_key
    sync_interval      = var.crawler_sync_interval
    webhook_enabled    = var.enable_webhook_support
    webhook_secret     = var.webhook_secret
  }
  sensitive = true
}

# Performance Metrics
output "performance_metrics" {
  description = "Performance configuration metrics"
  value = {
    max_file_size_mb           = var.max_file_size_mb
    cache_timeout_seconds    = var.cache_timeout_seconds
    rate_limit_per_minute      = var.rate_limit_per_minute
    session_timeout_minutes    = var.session_timeout_minutes
    enable_static_compression = var.enable_static_compression
    enable_api_compression    = var.enable_api_compression
  }
}

# Security Configuration
output "security_configuration" {
  description = "Security configuration details"
  value = {
    enable_cors              = var.enable_cors
    enable_rate_limiting      = var.enable_rate_limiting
    enable_ssl               = var.enable_ssl
    enable_private_endpoints = var.enable_private_endpoints
    allowed_origins          = var.allowed_origins
    session_persistence      = var.enable_session_persistence
  }
}

# Notification Configuration
output "notification_configuration" {
  description = "Notification system configuration"
  value = {
    smtp_host              = var.smtp_host
    smtp_port              = var.smtp_port
    smtp_from_email        = var.smtp_from_email
    enable_sms_notifications = var.enable_sms_notifications
    twilio_phone_number    = var.twilio_phone_number
  }
  sensitive = true
}

# Development Configuration
output "development_configuration" {
  description = "Development-specific configuration"
  value = {
    enable_debug_mode      = var.enable_debug_mode
    enable_source_maps    = var.enable_source_maps
    enable_hot_reload      = var.enable_hot_reload
    frontend_build_command = var.frontend_build_command
    backend_node_version   = var.backend_node_version
  }
}

# Random Values
output "random_suffix" {
  description = "Random suffix used for unique resource names"
  value       = random_string.suffix.result
}

output "jwt_secret" {
  description = "Generated JWT secret"
  value       = random_password.jwt_secret.result
  sensitive   = true
}

output "deployment_timestamp" {
  description = "Timestamp of the deployment"
  value       = timestamp()
}
