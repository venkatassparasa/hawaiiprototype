# Terraform configuration for Hawaii TVR Compliance Dashboard deployment on Azure

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "azurerm" {
  features {}
}

# Generate random suffix for unique resource names
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-hawaii-tvr-dashboard-${random_string.suffix.result}"
  location = var.azure_region
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    ManagedBy   = "terraform"
  }
}

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = "asp-hawaii-tvr-dashboard-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "ai-hawaii-tvr-dashboard-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-hawaii-tvr-dashboard-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Storage Account for static assets and logs
resource "azurerm_storage_account" "main" {
  name                     = "sthawaiitvrdashboard${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version         = "1.2"
  
  static_website {
    index_document = "index.html"
    error_404_document = "404.html"
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Storage Container for static assets
resource "azurerm_storage_container" "static" {
  name                  = "static"
  storage_account_name = azurerm_storage_account.main.name
  container_access_type = "private"
}

# Storage Container for logs
resource "azurerm_storage_container" "logs" {
  name                  = "logs"
  storage_account_name = azurerm_storage_account.main.name
  container_access_type = "private"
}

# Cosmos DB (MongoDB compatible) for application data
resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-hawaii-tvr-dashboard-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  offer_type          = "Standard"
  kind                = "MongoDB"
  
  consistency_policy {
    consistency_level = "Session"
  }
  
  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Cosmos DB Database
resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = "hawaii-tvr-dashboard"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  
  throughput = 400
}

# Redis Cache for session management# Azure Cache for Redis
resource "azurerm_redis_cache" "main" {
  name                = "redis-hawaii-tvr-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = var.redis_capacity
  family              = var.redis_family
  sku_name            = var.redis_sku
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "redis"
    ManagedBy   = "terraform"
  }
}

# PostgreSQL for Temporal
resource "azurerm_postgresql_flexible_server" "temporal" {
  count               = var.enable_temporal ? 1 : 0
  name                = "psql-temporal-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  version             = var.postgresql_version
  administrator_login = var.postgresql_admin_login
  administrator_login_password = random_password.postgresql_password.result
  storage_mb          = var.postgresql_storage_mb
  sku_name            = var.postgresql_sku
  
  backup {
    retention_days = var.postgresql_backup_retention_days
    geo_redundant_backup_enabled = var.postgresql_geo_redundant_backup
  }
  
  high_availability {
    mode = var.postgresql_ha_mode
  }
  
  maintenance_window {
    day_of_week  = var.postgresql_maintenance_day
    start_hour   = var.postgresql_maintenance_hour
    start_minute = var.postgresql_maintenance_minute
  }

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "postgresql-temporal"
    ManagedBy   = "terraform"
  }
}

# PostgreSQL Database for Temporal
resource "azurerm_postgresql_flexible_server_database" "temporal" {
  count      = var.enable_temporal ? 1 : 0
  name       = "temporal"
  server_id  = azurerm_postgresql_flexible_server.temporal[0].id
  charset    = "UTF8"
  collation  = "en_US.UTF8"
}

# PostgreSQL Virtual Network Rule for Temporal
resource "azurerm_postgresql_flexible_server_virtual_network_rule" "temporal" {
  count               = var.enable_temporal ? 1 : 0
  server_id          = azurerm_postgresql_flexible_server.temporal[0].id
  subnet_id          = azurerm_subnet.private.id
  ignore_missing_vnet_service_endpoint = true
}

# Key Vault for Temporal Secrets
resource "azurerm_key_vault_secret" "temporal_postgres" {
  count        = var.enable_temporal ? 1 : 0
  name         = "temporal-postgres-connection"
  value        = "Host=${azurerm_postgresql_flexible_server.temporal[0].fqdn};Port=5432;Username=${var.postgresql_admin_login};Password=${random_password.postgresql_password.result};Database=temporal;"
  key_vault_id = azurerm_key_vault.main.id

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "temporal-postgres"
  }
}

# Container Registry for Temporal Images
resource "azurerm_container_registry" "temporal" {
  count               = var.enable_temporal ? 1 : 0
  name                = "crtemporal${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.container_registry_sku
  admin_enabled       = true

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "container-registry-temporal"
    ManagedBy   = "terraform"
  }
}

# Log Analytics Workspace for Temporal
resource "azurerm_log_analytics_workspace" "temporal" {
  count               = var.enable_temporal ? 1 : 0
  name                = "law-temporal-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = var.log_analytics_sku
  retention_in_days   = var.log_retention_days

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "log-analytics-temporal"
    ManagedBy   = "terraform"
  }
}

# Container App Environment for Temporal
resource "azurerm_container_app_environment" "temporal" {
  count               = var.enable_temporal ? 1 : 0
  name                = "cae-temporal-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.temporal[0].id

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "container-app-env-temporal"
    ManagedBy   = "terraform"
  }
}

# Temporal Frontend Service
resource "azurerm_container_app" "temporal_frontend" {
  count               = var.enable_temporal ? 1 : 0
  name                = "ca-temporal-frontend-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.temporal[0].id
  revision_mode       = "Single"

  identity {
    type = "SystemAssigned"
  }

  ingress {
    external_enabled = true
    target_port     = 7233
    transport       = "http"
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = var.temporal_min_replicas
    max_replicas = var.temporal_max_replicas

    container {
      name  = "temporal-frontend"
      image = "temporalio/auto-setup:${var.temporal_version}"
      cpu    = var.temporal_frontend_cpu
      memory = var.temporal_frontend_memory
      
      env {
        name  = "DB"
        value = "postgresql"
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name        = "DB_USER"
        secret_name = azurerm_key_vault_secret.temporal_postgres[0].name
      }
      env {
        name        = "DB_PASSWORD"
        secret_name = azurerm_key_vault_secret.temporal_postgres[0].name
      }
      env {
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.temporal[0].fqdn
      }
      env {
        name  = "DB_NAME"
        value = "temporal"
      }
      env {
        name  = "DEFAULT_NAMESPACE"
        value = var.temporal_namespace
      }
      env {
        name  = "NUM_HISTORY_SHARDS"
        value = var.temporal_history_shards
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "temporal-frontend"
    ManagedBy   = "terraform"
  }
}

# Temporal History Service
resource "azurerm_container_app" "temporal_history" {
  count               = var.enable_temporal ? 1 : 0
  name                = "ca-temporal-history-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.temporal[0].id
  revision_mode       = "Single"

  identity {
    type = "SystemAssigned"
  }

  template {
    min_replicas = var.temporal_min_replicas
    max_replicas = var.temporal_max_replicas

    container {
      name  = "temporal-history"
      image = "temporalio/history:${var.temporal_version}"
      cpu    = var.temporal_history_cpu
      memory = var.temporal_history_memory
      
      env {
        name  = "DB"
        value = "postgresql"
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name        = "DB_USER"
        secret_name = azurerm_key_vault_secret.temporal_postgres[0].name
      }
      env {
        name        = "DB_PASSWORD"
        secret_name = azurerm_key_vault_secret.temporal_postgres[0].name
      }
      env {
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.temporal[0].fqdn
      }
      env {
        name  = "DB_NAME"
        value = "temporal"
      }
      env {
        name  = "NUM_HISTORY_SHARDS"
        value = var.temporal_history_shards
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "temporal-history"
    ManagedBy   = "terraform"
  }
}

# Temporal Matching Service
resource "azurerm_container_app" "temporal_matching" {
  count               = var.enable_temporal ? 1 : 0
  name                = "ca-temporal-matching-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.temporal[0].id
  revision_mode       = "Single"

  identity {
    type = "SystemAssigned"
  }

  template {
    min_replicas = var.temporal_min_replicas
    max_replicas = var.temporal_max_replicas

    container {
      name  = "temporal-matching"
      image = "temporalio/matching:${var.temporal_version}"
      cpu    = var.temporal_matching_cpu
      memory = var.temporal_matching_memory
      
      env {
        name  = "DB"
        value = "postgresql"
      }
      env {
        name  = "DB_PORT"
        value = "5432"
      }
      env {
        name        = "DB_USER"
        secret_name = azurerm_key_vault_secret.temporal_postgres[0].name
      }
      env {
        name        = "DB_PASSWORD"
        secret_name = azurerm_key_vault_secret.temporal_postgres[0].name
      }
      env {
        name  = "DB_HOST"
        value = azurerm_postgresql_flexible_server.temporal[0].fqdn
      }
      env {
        name  = "DB_NAME"
        value = "temporal"
      }
      env {
        name  = "NUM_HISTORY_SHARDS"
        value = var.temporal_history_shards
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "temporal-matching"
    ManagedBy   = "terraform"
  }
}

# Temporal Worker Service
resource "azurerm_container_app" "temporal_worker" {
  count               = var.enable_temporal ? 1 : 0
  name                = "ca-temporal-worker-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.temporal[0].id
  revision_mode       = "Single"

  identity {
    type = "SystemAssigned"
  }

  template {
    min_replicas = var.temporal_worker_min_replicas
    max_replicas = var.temporal_worker_max_replicas

    container {
      name  = "temporal-worker"
      image = "${azurerm_container_registry.temporal[0].login_server}/temporal-worker:latest"
      cpu    = var.temporal_worker_cpu
      memory = var.temporal_worker_memory
      
      env {
        name  = "TEMPORAL_ADDRESS"
        value = "http://${azurerm_container_app.temporal_frontend[0].latest_revision_fqdn}:7233"
      }
      env {
        name  = "TEMPORAL_NAMESPACE"
        value = var.temporal_namespace
      }
      env {
        name  = "NODE_ENV"
        value = var.environment
      }
      env {
        name  = "MONGODB_URI"
        value = azurerm_cosmosdb_account.main.connection_strings[0]
      }
      env {
        name  = "REDIS_URL"
        value = "${azurerm_redis_cache.main.hostname}:6380"
        secret_name = azurerm_key_vault_secret.redis_password.name
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "temporal-worker"
    ManagedBy   = "terraform"
  }
}

# Temporal UI Service
resource "azurerm_container_app" "temporal_ui" {
  count               = var.enable_temporal ? 1 : 0
  name                = "ca-temporal-ui-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.temporal[0].id
  revision_mode       = "Single"

  ingress {
    external_enabled = true
    target_port     = 8080
    transport       = "http"
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 1
    max_replicas = 2

    container {
      name  = "temporal-ui"
      image = "temporalio/ui:${var.temporal_ui_version}"
      cpu    = var.temporal_ui_cpu
      memory = var.temporal_ui_memory
      
      env {
        name  = "TEMPORAL_ADDRESS"
        value = "http://${azurerm_container_app.temporal_frontend[0].latest_revision_fqdn}:7233"
      }
      env {
        name  = "TEMPORAL_PORT"
        value = "7233"
      }
      env {
        name  = "DEFAULT_NAMESPACE"
        value = var.temporal_namespace
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
    Component   = "temporal-ui"
    ManagedBy   = "terraform"
  }
}

# Random password for PostgreSQL
resource "random_password" "postgresql_password" {
  count = var.enable_temporal ? 1 : 0
  length = 32
  special = true
}

# Key Vault for secrets
resource "azurerm_key_vault" "main" {
  name                = "kv-hawaii-tvr-dashboard-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
  
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id
    
    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Recover"
    ]
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Key Vault Secrets
resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = random_password.jwt_secret.result
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "mongodb_connection_string" {
  name         = "mongodb-connection-string"
  value        = azurerm_cosmosdb_account.main.connection_strings[0]
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name         = "redis-connection-string"
  value        = "${azurerm_redis_cache.main.hostname}:6380,ssl=true"
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "storage_connection_string" {
  name         = "storage-connection-string"
  value        = azurerm_storage_account.main.primary_connection_string
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "crawler_api_url" {
  name         = "crawler-api-url"
  value        = var.crawler_api_url
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "crawler_api_key" {
  name         = "crawler-api-key"
  value        = var.crawler_api_key
  key_vault_id = azurerm_key_vault.main.id
}

# Generate random JWT secret
resource "random_password" "jwt_secret" {
  length  = 32
  special = true
}

# App Service for Frontend (React)
resource "azurerm_linux_web_app" "frontend" {
  name                = "app-hawaii-tvr-frontend-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  
  site_config {
    always_on                 = true
    http2_enabled             = true
    minimum_tls_version       = "1.2"
    ftps_state                = "Disabled"
    remote_debugging_enabled  = false
    websockets_enabled        = false
    
    application_stack {
      node_version = "18-lts"
    }
    
    ip_restriction {
      default_action = "Allow"
    }
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "true"
    "WEBSITE_RUN_FROM_PACKAGE"            = "0"
    "NODE_ENV"                           = var.environment
    "REACT_APP_API_BASE_URL"              = "https://${azurerm_linux_web_app.backend.default_hostname}"
    "REACT_APP_CRAWLER_API_URL"           = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.crawler_api_url.id})"
    "REACT_APP_CRAWLER_API_KEY"           = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.crawler_api_key.id})"
    "APPINSIGHTS_INSTRUMENTATIONKEY"    = azurerm_application_insights.main.instrumentation_key
    "LOG_ANALYTICS_WORKSPACE_ID"         = azurerm_log_analytics_workspace.main.workspace_id
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# App Service for Backend API
resource "azurerm_linux_web_app" "backend" {
  name                = "app-hawaii-tvr-backend-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  
  site_config {
    always_on                 = true
    http2_enabled             = true
    minimum_tls_version       = "1.2"
    ftps_state                = "Disabled"
    remote_debugging_enabled  = false
    websockets_enabled        = true
    
    application_stack {
      node_version = "18-lts"
    }
    
    ip_restriction {
      default_action = "Allow"
    }
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "true"
    "WEBSITE_RUN_FROM_PACKAGE"            = "0"
    "NODE_ENV"                           = var.environment
    "PORT"                               = "3001"
    "MONGODB_URI"                        = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.mongodb_connection_string.id})"
    "REDIS_URL"                          = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.redis_connection_string.id})"
    "STORAGE_CONNECTION_STRING"          = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.storage_connection_string.id})"
    "STORAGE_CONTAINER_NAME"              = azurerm_storage_container.static.name
    "JWT_SECRET"                         = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.jwt_secret.id})"
    "CRAWLER_API_URL"                    = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.crawler_api_url.id})"
    "CRAWLER_API_KEY"                    = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.crawler_api_key.id})"
    "APPINSIGHTS_INSTRUMENTATIONKEY"    = azurerm_application_insights.main.instrumentation_key
    "LOG_ANALYTICS_WORKSPACE_ID"         = azurerm_log_analytics_workspace.main.workspace_id
    "CORS_ORIGIN"                        = "https://${azurerm_linux_web_app.frontend.default_hostname}"
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Grant App Services access to Key Vault
resource "azurerm_key_vault_access_policy" "frontend" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.frontend.identity[0].principal_id
  
  secret_permissions = [
    "Get",
    "List"
  ]
}

resource "azurerm_key_vault_access_policy" "backend" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.backend.identity[0].principal_id
  
  secret_permissions = [
    "Get",
    "List"
  ]
}

# Grant App Services access to Storage
resource "azurerm_role_assignment" "storage_frontend" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Reader"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}

resource "azurerm_role_assignment" "storage_backend" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}

# Application Gateway for load balancing and SSL termination
resource "azurerm_application_gateway" "main" {
  name                = "agw-hawaii-tvr-dashboard-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  
  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }
  
  gateway_ip_configuration {
    name      = "gateway-ip-config"
    subnet_id = azurerm_subnet.application_gateway.id
  }
  
  frontend_port_configuration {
    name = "frontend-port-80"
    port = 80
  }
  
  frontend_port_configuration {
    name = "frontend-port-443"
    port = 443
  }
  
  frontend_ip_configuration {
    name                 = "frontend-ip-config"
    public_ip_address_id = azurerm_public_ip.main.id
  }
  
  backend_address_pool {
    name = "frontend-pool"
  }
  
  backend_address_pool {
    name = "backend-pool"
  }
  
  backend_http_settings {
    name                  = "frontend-http-settings"
    cookie_based_affinity = "Disabled"
    path                  = "/"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }
  
  backend_http_settings {
    name                  = "backend-http-settings"
    cookie_based_affinity = "Disabled"
    path                  = "/api"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }
  
  http_listener {
    name                           = "http-listener-frontend"
    frontend_ip_configuration_name = "frontend-ip-config"
    frontend_port_name             = "frontend-port-80"
    protocol                       = "Http"
    host_names                     = ["${azurerm_public_ip.main.fqdn}"]
  }
  
  http_listener {
    name                           = "http-listener-backend"
    frontend_ip_configuration_name = "frontend-ip-config"
    frontend_port_name             = "frontend-port-80"
    protocol                       = "Http"
    host_names                     = ["${azurerm_public_ip.main.fqdn}"]
    request_routing_rules {
      name                       = "routing-rule-frontend"
      rule_type                  = "Basic"
      http_listener_name         = "http-listener-frontend"
      backend_address_pool_name  = "frontend-pool"
      backend_http_settings_name = "frontend-http-settings"
    }
    
    request_routing_rule {
      name                       = "routing-rule-backend"
      rule_type                  = "PathBased"
      http_listener_name         = "http-listener-backend"
      backend_address_pool_name  = "backend-pool"
      backend_http_settings_name = "backend-http-settings"
      
      match {
        path_pattern {
          paths = ["/api/*"]
        }
      }
    }
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-hawaii-tvr-dashboard-${random_string.suffix.result}"
  address_space       = ["10.1.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Subnets
resource "azurerm_subnet" "application_gateway" {
  name                 = "snet-application-gateway"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.1.0/24"]
}

resource "azurerm_subnet" "private_endpoint" {
  name                 = "snet-private-endpoint"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.2.0/24"]
  
  enforce_private_link_endpoint_network_policies = true
}

# Public IP
resource "azurerm_public_ip" "main" {
  name                = "pip-hawaii-tvr-dashboard-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                = "Standard"
  zones              = ["1", "2", "3"]
  
  domain_name_label = var.custom_domain != "" ? var.custom_domain : null
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Private Endpoints for secure access to resources
resource "azurerm_private_endpoint" "cosmos" {
  name                = "pe-cosmos-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  subnet_id           = azurerm_subnet.private_endpoint.id
  
  private_service_connection {
    name                           = "psc-cosmos"
    private_connection_resource_id = azurerm_cosmosdb_account.main.id
    subresource_names              = ["MongoDB"]
    is_manual_connection           = false
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

resource "azurerm_private_endpoint" "redis" {
  name                = "pe-redis-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  subnet_id           = azurerm_subnet.private_endpoint.id
  
  private_service_connection {
    name                           = "psc-redis"
    private_connection_resource_id = azurerm_redis_cache.main.id
    subresource_names              = ["redisCache"]
    is_manual_connection           = false
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# DNS Zone for private endpoints
resource "azurerm_private_dns_zone" "cosmos" {
  name                = "privatelink.mongo.cosmos.azure.com"
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

resource "azurerm_private_dns_zone" "redis" {
  name                = "privatelink.redis.cache.windows.net"
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# DNS Zone Links
resource "azurerm_private_dns_zone_virtual_network_link" "cosmos" {
  name                  = "cosmos-dns-link"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.cosmos.name
  virtual_network_id    = azurerm_virtual_network.main.id
}

resource "azurerm_private_dns_zone_virtual_network_link" "redis" {
  name                  = "redis-dns-link"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.redis.name
  virtual_network_id    = azurerm_virtual_network.main.id
}

# DNS Records for private endpoints
resource "azurerm_private_dns_a_record" "cosmos" {
  name                = azurerm_cosmosdb_account.main.name
  zone_name           = azurerm_private_dns_zone.cosmos.name
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 300
  records             = [azurerm_private_endpoint.cosmos.private_service_connection[0].private_addresses[0]]
}

resource "azurerm_private_dns_a_record" "redis" {
  name                = azurerm_redis_cache.main.name
  zone_name           = azurerm_private_dns_zone.redis.name
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 300
  records             = [azurerm_private_endpoint.redis.private_service_connection[0].private_addresses[0]]
}

# Log Analytics Solution for monitoring
resource "azurerm_log_analytics_solution" "main" {
  solution_name         = "ContainerInsights"
  location              = azurerm_resource_group.main.location
  resource_group_name   = azurerm_resource_group.main.name
  workspace_resource_id = azurerm_log_analytics_workspace.main.id
  workspace_name        = azurerm_log_analytics_workspace.main.name
  
  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/ContainerInsights"
  }
}

# CDN for static assets (optional)
resource "azurerm_cdn_profile" "main" {
  count               = var.enable_cdn ? 1 : 0
  name                = "cdn-hawaii-tvr-dashboard-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Standard_Microsoft"
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

resource "azurerm_cdn_endpoint" "main" {
  count               = var.enable_cdn ? 1 : 0
  name                = "cdn-hawaii-tvr-dashboard-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  profile_name        = azurerm_cdn_profile.main[0].name
  origin_host_header   = azurerm_linux_web_app.frontend.default_hostname
  
  origin {
    name      = "origin"
    host_name = azurerm_linux_web_app.frontend.default_hostname
    origin_type = "WebApp"
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Alert Rules
resource "azurerm_monitor_metric_alert" "frontend_cpu_high" {
  name                = "frontend-cpu-high-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_web_app.frontend.id]
  description         = "Alert when frontend CPU usage is high"
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = 2
  
  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "CpuPercentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }
  
  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

resource "azurerm_monitor_metric_alert" "backend_cpu_high" {
  name                = "backend-cpu-high-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_web_app.backend.id]
  description         = "Alert when backend CPU usage is high"
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = 2
  
  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "CpuPercentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }
  
  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

resource "azurerm_monitor_metric_alert" "memory_high" {
  name                = "memory-high-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_web_app.frontend.id, azurerm_linux_web_app.backend.id]
  description         = "Alert when memory usage is high"
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = 2
  
  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "MemoryPercentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 85
  }
  
  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

# Action Group for alerts
resource "azurerm_monitor_action_group" "main" {
  name                = "ag-hawaii-tvr-dashboard-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "hawaiitvrdashboard"
  
  email_receiver {
    name          = "admin"
    email_address = var.alert_email
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-tvr-dashboard"
  }
}

# Auto-scaling for App Services (if enabled)
resource "azurerm_monitor_autoscale_setting" "frontend" {
  count               = var.enable_auto_scale ? 1 : 0
  name                = "autoscale-frontend-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  target_resource_id  = azurerm_linux_web_app.frontend.id
  
  profile {
    name = "default"
    capacity {
      default = var.min_instances
      minimum = var.min_instances
      maximum = var.max_instances
    }
  }
  
  rule {
    name = "cpu-scale-out"
    metric_trigger {
      metric_name = "CpuPercentage"
      metric_namespace = "Microsoft.Web/sites"
      time_grain = "PT1M"
      statistic = "Average"
      time_window = "PT5M"
      time_aggregation = "Average"
      operator = "GreaterThan"
      threshold = 70
    }
    scale_action {
      direction = "Increase"
      type = "ChangeCount"
      value = "1"
      cooldown = "PT1M"
    }
  }
  
  rule {
    name = "cpu-scale-in"
    metric_trigger {
      metric_name = "CpuPercentage"
      metric_namespace = "Microsoft.Web/sites"
      time_grain = "PT1M"
      statistic = "Average"
      time_window = "PT5M"
      time_aggregation = "Average"
      operator = "LessThan"
      threshold = 30
    }
    scale_action {
      direction = "Decrease"
      type = "ChangeCount"
      value = "1"
      cooldown = "PT1M"
    }
  }
}

resource "azurerm_monitor_autoscale_setting" "backend" {
  count               = var.enable_auto_scale ? 1 : 0
  name                = "autoscale-backend-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  target_resource_id  = azurerm_linux_web_app.backend.id
  
  profile {
    name = "default"
    capacity {
      default = var.min_instances
      minimum = var.min_instances
      maximum = var.max_instances
    }
  }
  
  rule {
    name = "cpu-scale-out"
    metric_trigger {
      metric_name = "CpuPercentage"
      metric_namespace = "Microsoft.Web/sites"
      time_grain = "PT1M"
      statistic = "Average"
      time_window = "PT5M"
      time_aggregation = "Average"
      operator = "GreaterThan"
      threshold = 70
    }
    scale_action {
      direction = "Increase"
      type = "ChangeCount"
      value = "1"
      cooldown = "PT1M"
    }
  }
  
  rule {
    name = "cpu-scale-in"
    metric_trigger {
      metric_name = "CpuPercentage"
      metric_namespace = "Microsoft.Web/sites"
      time_grain = "PT1M"
      statistic = "Average"
      time_window = "PT5M"
      time_aggregation = "Average"
      operator = "LessThan"
      threshold = 30
    }
    scale_action {
      direction = "Decrease"
      type = "ChangeCount"
      value = "1"
      cooldown = "PT1M"
    }
  }
}
