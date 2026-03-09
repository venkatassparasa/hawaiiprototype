# Terraform configuration for Hawaii Vacation Rental Crawler API deployment on Azure

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
  name     = "rg-hawaii-vr-crawler-${random_string.suffix.result}"
  location = var.azure_region
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
    ManagedBy   = "terraform"
  }
}

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = "asp-hawaii-vr-crawler-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "ai-hawaii-vr-crawler-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-hawaii-vr-crawler-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Storage Account for evidence and logs
resource "azurerm_storage_account" "main" {
  name                     = "sthawaiivrcrawler${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version         = "1.2"
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Storage Container for evidence
resource "azurerm_storage_container" "evidence" {
  name                  = "evidence"
  storage_account_name = azurerm_storage_account.main.name
  container_access_type = "private"
}

# Storage Container for logs
resource "azurerm_storage_container" "logs" {
  name                  = "logs"
  storage_account_name = azurerm_storage_account.main.name
  container_access_type = "private"
}

# Cosmos DB (MongoDB compatible)
resource "azurerm_cosmosdb_account" "main" {
  name                = "cosmos-hawaii-vr-crawler-${random_string.suffix.result}"
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
    Project     = "hawaii-vr-crawler"
  }
}

# Cosmos DB Database
resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = "hawaii-vr-crawler"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  
  throughput = 400
}

# Redis Cache
resource "azurerm_redis_cache" "main" {
  name                = "redis-hawaii-vr-crawler-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = 1
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Key Vault for secrets
resource "azurerm_key_vault" "main" {
  name                = "kv-hawaii-vr-crawler-${random_string.suffix.result}"
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
    Project     = "hawaii-vr-crawler"
  }
}

# Key Vault Secrets
resource "azurerm_key_vault_secret" "apify_token" {
  name         = "apify-token"
  value        = var.apify_token
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "apify_user_id" {
  name         = "apify-user-id"
  value        = var.apify_user_id
  key_vault_id = azurerm_key_vault.main.id
}

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

# Generate random JWT secret
resource "random_password" "jwt_secret" {
  length  = 32
  special = true
}

# App Service for API
resource "azurerm_linux_web_app" "main" {
  name                = "app-hawaii-vr-crawler-${random_string.suffix.result}"
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
    "PORT"                               = "3000"
    "MONGODB_URI"                        = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.mongodb_connection_string.id})"
    "REDIS_URL"                          = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.redis_connection_string.id})"
    "APIFY_TOKEN"                        = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.apify_token.id})"
    "APIFY_USER_ID"                      = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.apify_user_id.id})"
    "JWT_SECRET"                         = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.jwt_secret.id})"
    "AWS_ACCESS_KEY_ID"                  = var.aws_access_key_id != "" ? var.aws_access_key_id : ""
    "AWS_SECRET_ACCESS_KEY"              = var.aws_secret_access_key != "" ? var.aws_secret_access_key : ""
    "AWS_REGION"                         = var.aws_region
    "AWS_S3_BUCKET"                      = var.aws_s3_bucket != "" ? var.aws_s3_bucket : ""
    "STORAGE_CONNECTION_STRING"          = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.storage_connection_string.id})"
    "STORAGE_CONTAINER_NAME"              = azurerm_storage_container.evidence.name
    "APPINSIGHTS_INSTRUMENTATIONKEY"    = azurerm_application_insights.main.instrumentation_key
    "LOG_ANALYTICS_WORKSPACE_ID"         = azurerm_log_analytics_workspace.main.workspace_id
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Grant App Service access to Key Vault
resource "azurerm_key_vault_access_policy" "app_service" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.main.identity[0].principal_id
  
  secret_permissions = [
    "Get",
    "List"
  ]
}

# Grant App Service access to Storage
resource "azurerm_role_assignment" "storage_contributor" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_web_app.main.identity[0].principal_id
}

# Application Gateway for load balancing and SSL termination
resource "azurerm_application_gateway" "main" {
  name                = "agw-hawaii-vr-crawler-${random_string.suffix.result}"
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
    name = "backend-pool"
  }
  
  backend_http_settings {
    name                  = "backend-http-settings"
    cookie_based_affinity = "Disabled"
    path                  = "/"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }
  
  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip-config"
    frontend_port_name             = "frontend-port-80"
    protocol                       = "Http"
  }
  
  request_routing_rule {
    name                       = "routing-rule-http"
    rule_type                  = "Basic"
    http_listener_name         = "http-listener"
    backend_address_pool_name  = "backend-pool"
    backend_http_settings_name = "backend-http-settings"
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-hawaii-vr-crawler-${random_string.suffix.result}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# Subnets
resource "azurerm_subnet" "application_gateway" {
  name                 = "snet-application-gateway"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "private_endpoint" {
  name                 = "snet-private-endpoint"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
  
  enforce_private_link_endpoint_network_policies = true
}

# Public IP
resource "azurerm_public_ip" "main" {
  name                = "pip-hawaii-vr-crawler-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                = "Standard"
  zones              = ["1", "2", "3"]
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
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
    Project     = "hawaii-vr-crawler"
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
    Project     = "hawaii-vr-crawler"
  }
}

# DNS Zone for private endpoints
resource "azurerm_private_dns_zone" "cosmos" {
  name                = "privatelink.mongo.cosmos.azure.com"
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

resource "azurerm_private_dns_zone" "redis" {
  name                = "privatelink.redis.cache.windows.net"
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}

# DNS Zone Links
resource "azurerm_private_dns_zone_virtual_network_link" "cosmos" {
  name                  = "cosmos-dns-link"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.cosmos.name
  virtual_network_id    = azurerm_virtual_network.main.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "redis" {
  name                  = "redis-dns-link"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.redis.name
  virtual_network_id    = azurerm_virtual_network.main.name
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

# Alert Rules
resource "azurerm_monitor_metric_alert" "cpu_high" {
  name                = "cpu-high-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_web_app.main.id]
  description         = "Alert when CPU usage is high"
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
  scopes              = [azurerm_linux_web_app.main.id]
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
  name                = "ag-hawaii-vr-crawler-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "hawaiivrcrawler"
  
  email_receiver {
    name          = "admin"
    email_address = var.alert_email
  }
  
  tags = {
    Environment = var.environment
    Project     = "hawaii-vr-crawler"
  }
}
