# Variables for Hawaii TVR Compliance Dashboard deployment on Azure

variable "azure_region" {
  description = "Azure region for deployment"
  type        = string
  default     = "West US 2"
  
  validation {
    condition     = contains(["West US 2", "East US", "Central US", "West US"], var.azure_region)
    error_message = "Azure region must be one of: West US 2, East US, Central US, West US."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "app_service_plan_sku" {
  description = "App Service Plan SKU"
  type        = string
  default     = "B1"
  
  validation {
    condition     = contains(["B1", "B2", "B3", "S1", "S2", "S3", "P1v2", "P2v2", "P3v2"], var.app_service_plan_sku)
    error_message = "App Service Plan SKU must be one of: B1, B2, B3, S1, S2, S3, P1v2, P2v2, P3v2."
  }
}

# Crawler API Configuration
variable "crawler_api_url" {
  description = "URL of the crawler API service"
  type        = string
  default     = "https://crawler-api.hawaiicounty.gov"
  
  validation {
    condition     = can(regex("^https?://", var.crawler_api_url))
    error_message = "Crawler API URL must be a valid HTTP/HTTPS URL."
  }
}

variable "crawler_api_key" {
  description = "API key for the crawler API service"
  type        = string
  default     = ""
  sensitive   = true
}

# Temporal Configuration
variable "enable_temporal" {
  description = "Enable Temporal workflow orchestration"
  type        = bool
  default     = false
}

variable "temporal_version" {
  description = "Temporal version to deploy"
  type        = string
  default     = "v1.20.0"
  
  validation {
    condition     = can(regex("^v[0-9]+\\.[0-9]+\\.[0-9]+$", var.temporal_version))
    error_message = "Temporal version must be in format v1.20.0."
  }
}

variable "temporal_ui_version" {
  description = "Temporal UI version to deploy"
  type        = string
  default     = "v2.20.0"
  
  validation {
    condition     = can(regex("^v[0-9]+\\.[0-9]+\\.[0-9]+$", var.temporal_ui_version))
    error_message = "Temporal UI version must be in format v2.20.0."
  }
}

variable "temporal_namespace" {
  description = "Temporal namespace"
  type        = string
  default     = "default"
}

variable "temporal_history_shards" {
  description = "Number of history shards for Temporal"
  type        = number
  default     = 4
  
  validation {
    condition     = var.temporal_history_shards >= 1 && var.temporal_history_shards <= 16
    error_message = "Temporal history shards must be between 1 and 16."
  }
}

variable "temporal_min_replicas" {
  description = "Minimum replicas for Temporal services"
  type        = number
  default     = 1
  
  validation {
    condition     = var.temporal_min_replicas >= 1
    error_message = "Temporal minimum replicas must be at least 1."
  }
}

variable "temporal_max_replicas" {
  description = "Maximum replicas for Temporal services"
  type        = number
  default     = 3
  
  validation {
    condition     = var.temporal_max_replicas >= var.temporal_min_replicas
    error_message = "Temporal maximum replicas must be greater than or equal to minimum replicas."
  }
}

variable "temporal_worker_min_replicas" {
  description = "Minimum replicas for Temporal worker"
  type        = number
  default     = 1
  
  validation {
    condition     = var.temporal_worker_min_replicas >= 1
    error_message = "Temporal worker minimum replicas must be at least 1."
  }
}

variable "temporal_worker_max_replicas" {
  description = "Maximum replicas for Temporal worker"
  type        = number
  default     = 5
  
  validation {
    condition     = var.temporal_worker_max_replicas >= var.temporal_worker_min_replicas
    error_message = "Temporal worker maximum replicas must be greater than or equal to minimum replicas."
  }
}

# Temporal Service Resources
variable "temporal_frontend_cpu" {
  description = "CPU allocation for Temporal frontend service"
  type        = string
  default     = "0.5"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?$", var.temporal_frontend_cpu))
    error_message = "Temporal frontend CPU must be a valid number (e.g., 0.5, 1, 2)."
  }
}

variable "temporal_frontend_memory" {
  description = "Memory allocation for Temporal frontend service"
  type        = string
  default     = "1Gi"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?(Gi|Mi|GB|MB)$", var.temporal_frontend_memory))
    error_message = "Temporal frontend memory must be in format like 1Gi, 512Mi, 1GB, 512MB."
  }
}

variable "temporal_history_cpu" {
  description = "CPU allocation for Temporal history service"
  type        = string
  default     = "1.0"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?$", var.temporal_history_cpu))
    error_message = "Temporal history CPU must be a valid number (e.g., 0.5, 1, 2)."
  }
}

variable "temporal_history_memory" {
  description = "Memory allocation for Temporal history service"
  type        = string
  default     = "2Gi"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?(Gi|Mi|GB|MB)$", var.temporal_history_memory))
    error_message = "Temporal history memory must be in format like 1Gi, 512Mi, 1GB, 512MB."
  }
}

variable "temporal_matching_cpu" {
  description = "CPU allocation for Temporal matching service"
  type        = string
  default     = "0.5"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?$", var.temporal_matching_cpu))
    error_message = "Temporal matching CPU must be a valid number (e.g., 0.5, 1, 2)."
  }
}

variable "temporal_matching_memory" {
  description = "Memory allocation for Temporal matching service"
  type        = string
  default     = "1Gi"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?(Gi|Mi|GB|MB)$", var.temporal_matching_memory))
    error_message = "Temporal matching memory must be in format like 1Gi, 512Mi, 1GB, 512MB."
  }
}

variable "temporal_worker_cpu" {
  description = "CPU allocation for Temporal worker service"
  type        = string
  default     = "0.5"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?$", var.temporal_worker_cpu))
    error_message = "Temporal worker CPU must be a valid number (e.g., 0.5, 1, 2)."
  }
}

variable "temporal_worker_memory" {
  description = "Memory allocation for Temporal worker service"
  type        = string
  default     = "1Gi"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?(Gi|Mi|GB|MB)$", var.temporal_worker_memory))
    error_message = "Temporal worker memory must be in format like 1Gi, 512Mi, 1GB, 512MB."
  }
}

variable "temporal_ui_cpu" {
  description = "CPU allocation for Temporal UI service"
  type        = string
  default     = "0.25"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?$", var.temporal_ui_cpu))
    error_message = "Temporal UI CPU must be a valid number (e.g., 0.5, 1, 2)."
  }
}

variable "temporal_ui_memory" {
  description = "Memory allocation for Temporal UI service"
  type        = string
  default     = "512Mi"
  
  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?(Gi|Mi|GB|MB)$", var.temporal_ui_memory))
    error_message = "Temporal UI memory must be in format like 1Gi, 512Mi, 1GB, 512MB."
  }
}

# PostgreSQL Configuration for Temporal
variable "postgresql_version" {
  description = "PostgreSQL version for Temporal"
  type        = string
  default     = "14"
  
  validation {
    condition     = contains(["13", "14", "15"], var.postgresql_version)
    error_message = "PostgreSQL version must be one of: 13, 14, 15."
  }
}

variable "postgresql_admin_login" {
  description = "PostgreSQL admin login username"
  type        = string
  default     = "temporaladmin"
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9_-]+$", var.postgresql_admin_login))
    error_message = "PostgreSQL admin login must contain only alphanumeric characters, hyphens, and underscores."
  }
}

variable "postgresql_storage_mb" {
  description = "PostgreSQL storage size in MB"
  type        = number
  default     = 32768
  
  validation {
    condition     = var.postgresql_storage_mb >= 32768 && var.postgresql_storage_mb <= 16777216
    error_message = "PostgreSQL storage must be between 32GB (32768MB) and 16TB (16777216MB)."
  }
}

variable "postgresql_sku" {
  description = "PostgreSQL flexible server SKU"
  type        = string
  default     = "B_Standard_B2ms"
  
  validation {
    condition     = contains(["B_Standard_B1ms", "B_Standard_B2ms", "B_Standard_B4ms", "MO_Standard_E2s", "MO_Standard_E4s", "MO_Standard_E8s"], var.postgresql_sku)
    error_message = "PostgreSQL SKU must be one of: B_Standard_B1ms, B_Standard_B2ms, B_Standard_B4ms, MO_Standard_E2s, MO_Standard_E4s, MO_Standard_E8s."
  }
}

variable "postgresql_backup_retention_days" {
  description = "PostgreSQL backup retention days"
  type        = number
  default     = 7
  
  validation {
    condition     = var.postgresql_backup_retention_days >= 1 && var.postgresql_backup_retention_days <= 35
    error_message = "PostgreSQL backup retention must be between 1 and 35 days."
  }
}

variable "postgresql_geo_redundant_backup" {
  description = "Enable geo-redundant backup for PostgreSQL"
  type        = bool
  default     = false
}

variable "postgresql_ha_mode" {
  description = "PostgreSQL high availability mode"
  type        = string
  default     = "ZoneRedundant"
  
  validation {
    condition     = contains(["SameZone", "ZoneRedundant"], var.postgresql_ha_mode)
    error_message = "PostgreSQL HA mode must be one of: SameZone, ZoneRedundant."
  }
}

variable "postgresql_maintenance_day" {
  description = "PostgreSQL maintenance day of week"
  type        = number
  default     = 0  # Sunday
  
  validation {
    condition     = var.postgresql_maintenance_day >= 0 && var.postgresql_maintenance_day <= 6
    error_message = "PostgreSQL maintenance day must be between 0 (Sunday) and 6 (Saturday)."
  }
}

variable "postgresql_maintenance_hour" {
  description = "PostgreSQL maintenance start hour"
  type        = number
  default     = 2  # 2 AM
  
  validation {
    condition     = var.postgresql_maintenance_hour >= 0 && var.postgresql_maintenance_hour <= 23
    error_message = "PostgreSQL maintenance hour must be between 0 and 23."
  }
}

variable "postgresql_maintenance_minute" {
  description = "PostgreSQL maintenance start minute"
  type        = number
  default     = 0  # Start of hour
  
  validation {
    condition     = var.postgresql_maintenance_minute >= 0 && var.postgresql_maintenance_minute <= 59
    error_message = "PostgreSQL maintenance minute must be between 0 and 59."
  }
}

# Container Registry Configuration
variable "container_registry_sku" {
  description = "Azure Container Registry SKU"
  type        = string
  default     = "Basic"
  
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.container_registry_sku)
    error_message = "Container Registry SKU must be one of: Basic, Standard, Premium."
  }
}

# Monitoring and Alerts
variable "alert_email" {
  description = "Email address for monitoring alerts"
  type        = string
  default     = "admin@hawaiicounty.gov"
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.alert_email))
    error_message = "Alert email must be a valid email address."
  }
}

# Network Configuration
variable "vnet_address_space" {
  description = "Virtual network address space"
  type        = string
  default     = "10.1.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vnet_address_space, 0))
    error_message = "VNet address space must be a valid CIDR block."
  }
}

variable "application_gateway_subnet" {
  description = "Application Gateway subnet address prefix"
  type        = string
  default     = "10.1.1.0/24"
  
  validation {
    condition     = can(cidrhost(var.application_gateway_subnet, 0))
    error_message = "Application Gateway subnet must be a valid CIDR block."
  }
}

variable "private_endpoint_subnet" {
  description = "Private endpoint subnet address prefix"
  type        = string
  default     = "10.1.2.0/24"
  
  validation {
    condition     = can(cidrhost(var.private_endpoint_subnet, 0))
    error_message = "Private endpoint subnet must be a valid CIDR block."
  }
}

# Storage Configuration
variable "storage_account_tier" {
  description = "Storage account tier"
  type        = string
  default     = "Standard"
  
  validation {
    condition     = contains(["Standard", "Premium"], var.storage_account_tier)
    error_message = "Storage account tier must be Standard or Premium."
  }
}

variable "storage_replication_type" {
  description = "Storage account replication type"
  type        = string
  default     = "LRS"
  
  validation {
    condition     = contains(["LRS", "ZRS", "GRS", "GZRS"], var.storage_replication_type)
    error_message = "Storage replication type must be one of: LRS, ZRS, GRS, GZRS."
  }
}

# Cosmos DB Configuration
variable "cosmos_db_throughput" {
  description = "Cosmos DB throughput in RU/s"
  type        = number
  default     = 400
  
  validation {
    condition     = var.cosmos_db_throughput >= 400 && var.cosmos_db_throughput <= 10000
    error_message = "Cosmos DB throughput must be between 400 and 10000 RU/s."
  }
}

variable "cosmos_db_consistency_level" {
  description = "Cosmos DB consistency level"
  type        = string
  default     = "Session"
  
  validation {
    condition     = contains(["Strong", "BoundedStaleness", "Session", "ConsistentPrefix", "Eventual"], var.cosmos_db_consistency_level)
    error_message = "Cosmos DB consistency level must be one of: Strong, BoundedStaleness, Session, ConsistentPrefix, Eventual."
  }
}

# Redis Configuration
variable "redis_capacity" {
  description = "Redis cache capacity"
  type        = number
  default     = 1
  
  validation {
    condition     = contains([0, 1, 2, 3, 4, 5, 6], var.redis_capacity)
    error_message = "Redis capacity must be between 0 and 6."
  }
}

variable "redis_family" {
  description = "Redis cache family"
  type        = string
  default     = "C"
  
  validation {
    condition     = contains(["C", "P"], var.redis_family)
    error_message = "Redis family must be C or P."
  }
}

variable "redis_sku_name" {
  description = "Redis cache SKU"
  type        = string
  default     = "Basic"
  
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.redis_sku_name)
    error_message = "Redis SKU must be Basic, Standard, or Premium."
  }
}

# Application Gateway Configuration
variable "application_gateway_capacity" {
  description = "Application Gateway capacity"
  type        = number
  default     = 2
  
  validation {
    condition     = var.application_gateway_capacity >= 1 && var.application_gateway_capacity <= 10
    error_message = "Application Gateway capacity must be between 1 and 10."
  }
}

variable "application_gateway_sku" {
  description = "Application Gateway SKU"
  type        = string
  default     = "Standard_v2"
  
  validation {
    condition     = contains(["Standard_v2", "WAF_v2"], var.application_gateway_sku)
    error_message = "Application Gateway SKU must be Standard_v2 or WAF_v2."
  }
}

# Log Analytics Configuration
variable "log_retention_days" {
  description = "Log retention period in days"
  type        = number
  default     = 30
  
  validation {
    condition     = var.log_retention_days >= 7 && var.log_retention_days <= 730
    error_message = "Log retention must be between 7 and 730 days."
  }
}

# CDN Configuration
variable "enable_cdn" {
  description = "Enable Azure CDN for static assets"
  type        = bool
  default     = false
}

variable "cdn_sku" {
  description = "CDN SKU"
  type        = string
  default     = "Standard_Microsoft"
  
  validation {
    condition     = contains(["Standard_Microsoft", "Standard_Akamai", "Standard_Verizon"], var.cdn_sku)
    error_message = "CDN SKU must be one of: Standard_Microsoft, Standard_Akamai, Standard_Verizon."
  }
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "hawaii-tvr-dashboard"
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

# Feature Flags
variable "enable_application_gateway" {
  description = "Enable Application Gateway for load balancing"
  type        = bool
  default     = true
}

variable "enable_private_endpoints" {
  description = "Enable private endpoints for secure access"
  type        = bool
  default     = true
}

variable "enable_monitoring" {
  description = "Enable Azure Monitor and Application Insights"
  type        = bool
  default     = true
}

variable "enable_backup" {
  description = "Enable backup for storage and database"
  type        = bool
  default     = false
}

# Backup Configuration
variable "backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 30
  
  validation {
    condition     = var.backup_retention_days >= 1 && var.backup_retention_days <= 365
    error_message = "Backup retention must be between 1 and 365 days."
  }
}

# Scaling Configuration
variable "enable_auto_scale" {
  description = "Enable auto-scaling for App Services"
  type        = bool
  default     = false
}

variable "min_instances" {
  description = "Minimum number of instances for auto-scaling"
  type        = number
  default     = 1
  
  validation {
    condition     = var.min_instances >= 1 && var.min_instances <= 10
    error_message = "Minimum instances must be between 1 and 10."
  }
}

variable "max_instances" {
  description = "Maximum number of instances for auto-scaling"
  type        = number
  default     = 3
  
  validation {
    condition     = var.max_instances >= var.min_instances && var.max_instances <= 20
    error_message = "Maximum instances must be between min_instances and 20."
  }
}

# SSL/TLS Configuration
variable "enable_ssl" {
  description = "Enable SSL termination"
  type        = bool
  default     = true
}

variable "ssl_certificate_name" {
  description = "Name of SSL certificate to use"
  type        = string
  default     = ""
}

# Custom Domain Configuration
variable "custom_domain" {
  description = "Custom domain name for the application"
  type        = string
  default     = ""
}

variable "enable_custom_domain" {
  description = "Enable custom domain configuration"
  type        = bool
  default     = false
}

# Frontend Configuration
variable "frontend_build_command" {
  description = "Build command for frontend React app"
  type        = string
  default     = "npm run build"
}

variable "frontend_source_dir" {
  description = "Source directory for frontend"
  type        = string
  default     = "src"
}

variable "frontend_output_dir" {
  description = "Output directory for built frontend"
  type        = string
  default     = "build"
}

# Backend Configuration
variable "backend_port" {
  description = "Port for backend API"
  type        = number
  default     = 3001
  
  validation {
    condition     = var.backend_port >= 1024 && var.backend_port <= 65535
    error_message = "Backend port must be between 1024 and 65535."
  }
}

variable "backend_node_version" {
  description = "Node.js version for backend"
  type        = string
  default     = "18-lts"
  
  validation {
    condition     = contains(["16-lts", "18-lts", "20-lts"], var.backend_node_version)
    error_message = "Node.js version must be one of: 16-lts, 18-lts, 20-lts."
  }
}

# Security Configuration
variable "enable_cors" {
  description = "Enable CORS for frontend-backend communication"
  type        = bool
  default     = true
}

variable "allowed_origins" {
  description = "Allowed CORS origins"
  type        = list(string)
  default     = []
}

variable "enable_rate_limiting" {
  description = "Enable rate limiting for API endpoints"
  type        = bool
  default     = true
}

variable "rate_limit_per_minute" {
  description = "Rate limit requests per minute"
  type        = number
  default     = 100
  
  validation {
    condition     = var.rate_limit_per_minute >= 10 && var.rate_limit_per_minute <= 10000
    error_message = "Rate limit must be between 10 and 10000 requests per minute."
  }
}

# Database Configuration
variable "enable_database_backup" {
  description = "Enable automatic database backups"
  type        = bool
  default     = false
}

variable "database_backup_interval" {
  description = "Database backup interval in hours"
  type        = number
  default     = 24
  
  validation {
    condition     = var.database_backup_interval >= 1 && var.database_backup_interval <= 168
    error_message = "Database backup interval must be between 1 and 168 hours."
  }
}

# Performance Configuration
variable "enable_static_compression" {
  description = "Enable static content compression"
  type        = bool
  default     = true
}

variable "enable_api_compression" {
  description = "Enable API response compression"
  type        = bool
  default     = true
}

variable "cache_timeout_seconds" {
  description = "Cache timeout in seconds"
  type        = number
  default     = 300
  
  validation {
    condition     = var.cache_timeout_seconds >= 60 && var.cache_timeout_seconds <= 3600
    error_message = "Cache timeout must be between 60 and 3600 seconds."
  }
}

# Development Configuration
variable "enable_debug_mode" {
  description = "Enable debug mode in development"
  type        = bool
  default     = false
}

variable "enable_source_maps" {
  description = "Enable source maps for debugging"
  type        = bool
  default     = false
}

variable "enable_hot_reload" {
  description = "Enable hot reload for development"
  type        = bool
  default     = false
}

# Integration Configuration
variable "enable_crawler_integration" {
  description = "Enable crawler API integration"
  type        = bool
  default     = true
}

variable "crawler_sync_interval" {
  description = "Crawler data sync interval in minutes"
  type        = number
  default     = 15
  
  validation {
    condition     = var.crawler_sync_interval >= 1 && var.crawler_sync_interval <= 1440
    error_message = "Crawler sync interval must be between 1 and 1440 minutes."
  }
}

variable "enable_webhook_support" {
  description = "Enable webhook support for real-time updates"
  type        = bool
  default     = true
}

variable "webhook_secret" {
  description = "Secret for webhook validation"
  type        = string
  sensitive   = true
  default     = ""
}

# Email Configuration
variable "smtp_host" {
  description = "SMTP server host"
  type        = string
  default     = ""
}

variable "smtp_port" {
  description = "SMTP server port"
  type        = number
  default     = 587
  
  validation {
    condition     = var.smtp_port >= 25 && var.smtp_port <= 65535
    error_message = "SMTP port must be between 25 and 65535."
  }
}

variable "smtp_username" {
  description = "SMTP username"
  type        = string
  default     = ""
}

variable "smtp_password" {
  description = "SMTP password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_from_email" {
  description = "From email address for notifications"
  type        = string
  default     = "noreply@hawaiicounty.gov"
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.smtp_from_email))
    error_message = "SMTP from email must be a valid email address."
  }
}

# SMS Configuration (Twilio)
variable "enable_sms_notifications" {
  description = "Enable SMS notifications"
  type        = bool
  default     = false
}

variable "twilio_account_sid" {
  description = "Twilio Account SID"
  type        = string
  default     = ""
}

variable "twilio_auth_token" {
  description = "Twilio Auth Token"
  type        = string
  sensitive   = true
  default     = ""
}

variable "twilio_phone_number" {
  description = "Twilio phone number"
  type        = string
  default     = ""
}

# File Upload Configuration
variable "max_file_size_mb" {
  description = "Maximum file size in MB"
  type        = number
  default     = 10
  
  validation {
    condition     = var.max_file_size_mb >= 1 && var.max_file_size_mb <= 100
    error_message = "Max file size must be between 1 and 100 MB."
  }
}

variable "allowed_file_types" {
  description = "Allowed file types for upload"
  type        = list(string)
  default     = ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"]
}

# Session Configuration
variable "session_timeout_minutes" {
  description = "Session timeout in minutes"
  type        = number
  default     = 30
  
  validation {
    condition     = var.session_timeout_minutes >= 5 && var.session_timeout_minutes <= 480
    error_message = "Session timeout must be between 5 and 480 minutes."
  }
}

variable "enable_session_persistence" {
  description = "Enable session persistence"
  type        = bool
  default     = true
}
