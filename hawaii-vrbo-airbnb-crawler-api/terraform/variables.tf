# Variables for Hawaii Vacation Rental Crawler API deployment on Azure

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

# Apify Configuration
variable "apify_token" {
  description = "Apify API token for web scraping"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.apify_token) > 0
    error_message = "Apify token is required and cannot be empty."
  }
}

variable "apify_user_id" {
  description = "Apify user ID"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.apify_user_id) > 0
    error_message = "Apify user ID is required and cannot be empty."
  }
}

# AWS Configuration (Optional - for S3 evidence storage)
variable "aws_access_key_id" {
  description = "AWS access key ID for S3 storage"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_secret_access_key" {
  description = "AWS secret access key for S3 storage"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_region" {
  description = "AWS region for S3 storage"
  type        = string
  default     = "us-west-1"
}

variable "aws_s3_bucket" {
  description = "AWS S3 bucket name for evidence storage"
  type        = string
  default     = ""
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
  default     = "10.0.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vnet_address_space, 0))
    error_message = "VNet address space must be a valid CIDR block."
  }
}

variable "application_gateway_subnet" {
  description = "Application Gateway subnet address prefix"
  type        = string
  default     = "10.0.1.0/24"
  
  validation {
    condition     = can(cidrhost(var.application_gateway_subnet, 0))
    error_message = "Application Gateway subnet must be a valid CIDR block."
  }
}

variable "private_endpoint_subnet" {
  description = "Private endpoint subnet address prefix"
  type        = string
  default     = "10.0.2.0/24"
  
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

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "hawaii-vr-crawler"
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
  description = "Enable auto-scaling for App Service"
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
