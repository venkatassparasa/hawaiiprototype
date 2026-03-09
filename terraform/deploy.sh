#!/bin/bash

# Deployment Script for Hawaii TVR Compliance Dashboard on Azure
# This script automates the Terraform deployment and application deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        error "Azure CLI is not installed. Please install it first."
    fi
    
    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        error "Terraform is not installed. Please install it first."
    fi
    
    # Check if user is logged in to Azure
    if ! az account show &> /dev/null; then
        error "You are not logged in to Azure. Please run 'az login' first."
    fi
    
    # Check if terraform.tfvars exists
    if [ ! -f "terraform.tfvars" ]; then
        error "terraform.tfvars file not found. Please copy terraform.tfvars.example and configure it."
    fi
    
    success "Prerequisites check passed"
}

# Check for crawler API deployment
check_crawler_deployment() {
    log "Checking for crawler API deployment..."
    
    # Check if crawler API is deployed by trying to access its outputs
    local crawler_dir="../hawaii-vrbo-airbnb-crawler-api/terraform"
    
    if [ -d "$crawler_dir" ] && [ -f "$crawler_dir/terraform.tfstate" ]; then
        log "Found crawler API deployment"
        
        # Try to get crawler API outputs
        if cd "$crawler_dir" && terraform output > /dev/null 2>&1; then
            log "Crawler API is deployed and accessible"
            
            # Get crawler API outputs
            CRAWLER_API_URL=$(terraform output -raw api_base_url 2>/dev/null || echo "")
            
            cd ..
            
            if [ -n "$CRAWLER_API_URL" ]; then
                success "Crawler API URL retrieved successfully"
                return 0
            else
                warning "Crawler API URL not available - will use manual configuration"
                return 1
            fi
        else
            warning "Crawler API deployment not found or not accessible"
            return 1
        fi
    else
        warning "Crawler API directory not found - will use manual configuration"
        return 1
    fi
}

# Auto-configure dashboard with crawler API outputs
auto_configure_crawler_integration() {
    log "Auto-configuring dashboard with crawler API integration..."
    
    local crawler_dir="../hawaii-vrbo-airbnb-crawler-api/terraform"
    
    if [ ! -d "$crawler_dir" ]; then
        warning "Crawler API directory not found - skipping auto-configuration"
        return 1
    fi
    
    # Get crawler API outputs
    log "Getting crawler API outputs..."
    
    if cd "$crawler_dir" && terraform output > /dev/null 2>&1; then
        CRAWLER_API_URL=$(terraform output -raw api_base_url 2>/dev/null || echo "")
        CRAWLER_API_KEY=$(terraform output -raw crawler_api_key 2>/dev/null || echo "")
        cd ..
        
        if [ -z "$CRAWLER_API_URL" ] || [ -z "$CRAWLER_API_KEY" ]; then
            error "Unable to retrieve crawler API outputs. Please ensure crawler API is deployed first."
        fi
        
        log "Retrieved crawler API URL: ${CRAWLER_API_URL}"
        log "Updating dashboard configuration..."
        
        # Update dashboard terraform.tfvars with crawler API information
        if [ -f "terraform.tfvars" ]; then
            # Backup original file
            cp terraform.tfvars terraform.tfvars.backup
            
            # Update crawler API configuration
            sed -i.bak "s|crawler_api_url.*=.*|crawler_api_url = \"$CRAWLER_API_URL\"|" terraform.tfvars
            sed -i.bak "s|crawler_api_key.*=.*|crawler_api_key = \"$CRAWLER_API_KEY\"|" terraform.tfvars
            
            # Remove backup file
            rm terraform.tfvars.bak
            
            success "Dashboard configuration updated with crawler API information"
        else
            error "terraform.tfvars file not found for configuration update"
        fi
    else
        error "Unable to access crawler API outputs directory"
    fi
}

# Validate Terraform configuration
validate_terraform() {
    log "Validating Terraform configuration..."
    
    # Initialize Terraform
    log "Initializing Terraform..."
    terraform init
    
    # Validate configuration
    log "Validating Terraform files..."
    terraform validate
    
    # Check required variables
    log "Checking required variables..."
    
    # Extract required variables from terraform.tfvars
    if ! grep -q "crawler_api_url.*=" terraform.tfvars || grep -q "crawler_api_url.*=\"\"" terraform.tfvars; then
        error "crawler_api_url is required and cannot be empty in terraform.tfvars"
    fi
    
    if ! grep -q "crawler_api_key.*=" terraform.tfvars || grep -q "crawler_api_key.*=\"\"" terraform.tfvars; then
        error "crawler_api_key is required and cannot be empty in terraform.tfvars"
    fi
    
    success "Terraform configuration validation passed"
}

# Plan Terraform deployment
plan_deployment() {
    log "Planning Terraform deployment..."
    
    # Show plan
    terraform plan
    
    success "Terraform plan completed"
}

# Apply Terraform deployment
apply_terraform() {
    log "Applying Terraform deployment..."
    
    # Apply with auto-approval for automation
    terraform apply -auto-approve
    
    success "Terraform deployment completed"
}

# Deploy applications
deploy_applications() {
    log "Deploying applications..."
    
    # Get outputs from Terraform
    RESOURCE_GROUP=$(terraform output -raw resource_group_name)
    FRONTEND_APP_NAME=$(terraform output -raw frontend_app_service_name)
    BACKEND_APP_NAME=$(terraform output -raw backend_app_service_name)
    LOCATION=$(terraform output -raw azure_region)
    
    # Build and deploy frontend
    log "Building and deploying frontend..."
    cd ..
    
    # Install dependencies
    log "Installing frontend dependencies..."
    npm ci
    
    # Build frontend
    log "Building frontend application..."
    npm run build
    
    # Create deployment package
    log "Creating frontend deployment package..."
    zip -r frontend-deployment.zip build/ package.json package-lock.json
    
    # Deploy frontend to Azure
    log "Deploying frontend to Azure App Service..."
    az webapp deployment source config-zip \
        --resource-group "$RESOURCE_GROUP" \
        --name "$FRONTEND_APP_NAME" \
        --src frontend-deployment.zip
    
    # Clean up frontend package
    rm -f frontend-deployment.zip
    
    # Build and deploy backend
    log "Building and deploying backend..."
    
    # Install dependencies (if backend has separate package.json)
    if [ -f "backend/package.json" ]; then
        cd backend
        npm ci
        npm run build
        zip -r backend-deployment.zip dist/ package.json package-lock.json
        az webapp deployment source config-zip \
            --resource-group "$RESOURCE_GROUP" \
            --name "$BACKEND_APP_NAME" \
            --src backend-deployment.zip
        rm -f backend-deployment.zip
        cd ..
    else
        # Assume backend is in same directory
        npm run build:backend || npm run build
        zip -r backend-deployment.zip dist/ package.json package-lock.json
        az webapp deployment source config-zip \
            --resource-group "$RESOURCE_GROUP" \
            --name "$BACKEND_APP_NAME" \
            --src backend-deployment.zip
        rm -f backend-deployment.zip
    fi
    
    cd terraform
    
    success "Application deployment completed"
}

# Configure application settings
configure_app_settings() {
    log "Configuring application settings..."
    
    # Get outputs from Terraform
    RESOURCE_GROUP=$(terraform output -raw resource_group_name)
    FRONTEND_APP_NAME=$(terraform output -raw frontend_app_service_name)
    BACKEND_APP_NAME=$(terraform output -raw backend_app_service_name)
    
    # Get environment variables from Terraform output
    FRONTEND_VARS=$(terraform output -json frontend_environment_variables | jq -r '.value | to_entries[] | "\(.key)=\(.value)"' | tr '\n' ' ')
    BACKEND_VARS=$(terraform output -json backend_environment_variables | jq -r '.value | to_entries[] | "\(.key)=\(.value)"' | tr '\n' ' ')
    
    # Set frontend application settings
    log "Setting frontend application settings..."
    az webapp config appsettings set \
        --resource-group "$RESOURCE_GROUP" \
        --name "$FRONTEND_APP_NAME" \
        --settings $FRONTEND_VARS
    
    # Set backend application settings
    log "Setting backend application settings..."
    az webapp config appsettings set \
        --resource-group "$RESOURCE_GROUP" \
        --name "$BACKEND_APP_NAME" \
        --settings $BACKEND_VARS
    
    success "Application settings configured"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Get outputs from Terraform
    FRONTEND_URL=$(terraform output -raw frontend_url)
    BACKEND_URL=$(terraform output -raw backend_url)
    HEALTH_URL=$(terraform output -raw api_health_url)
    
    log "Testing frontend health endpoint..."
    
    # Wait for applications to start
    log "Waiting for applications to start..."
    sleep 60
    
    # Test frontend health endpoint (retry up to 5 times)
    for i in {1..5}; do
        if curl -f -s "$FRONTEND_URL" > /dev/null; then
            success "Frontend health check passed"
            break
        else
            if [ $i -eq 5 ]; then
                warning "Frontend health check failed after 5 attempts"
            fi
            log "Frontend health check attempt $i failed, retrying in 30 seconds..."
            sleep 30
        fi
    done
    
    # Test backend health endpoint
    log "Testing backend health endpoint..."
    for i in {1..5}; do
        if curl -f -s "$HEALTH_URL" > /dev/null; then
            success "Backend health check passed"
            break
        else
            if [ $i -eq 5 ]; then
                warning "Backend health check failed after 5 attempts"
            fi
            log "Backend health check attempt $i failed, retrying in 30 seconds..."
            sleep 30
        fi
    done
    
    # Test API endpoints
    log "Testing API endpoints..."
    if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
        success "API health endpoint is accessible"
    else
        warning "API health endpoint is not accessible (may need additional configuration)"
    fi
    
    success "Deployment verification completed"
}

# Show deployment summary
show_summary() {
    log "Deployment Summary:"
    echo "=================================="
    
    # Get all outputs from Terraform
    echo "Resource Group: $(terraform output -raw resource_group_name)"
    echo "Frontend URL: $(terraform output -raw frontend_url)"
    echo "Backend URL: $(terraform output -raw backend_url)"
    echo "API Health URL: $(terraform output -raw api_health_url)"
    echo "Application Insights: $(terraform output -raw application_insights_url)"
    echo "Key Vault: $(terraform output -raw key_vault_uri)"
    echo "Application Gateway: $(terraform output -raw application_gateway_fqdn)"
    echo "=================================="
    
    echo ""
    echo "Next Steps:"
    echo "1. Test the application functionality"
    echo "2. Configure crawler API integration if not already done"
    echo "3. Set up custom domain and SSL (if needed)"
    echo "4. Configure monitoring alerts"
    echo "5. Set up backup policies (if enabled)"
    echo "6. Test auto-scaling rules (if enabled)"
    echo "7. Update DNS records to point to Application Gateway"
    
    success "Deployment completed successfully!"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    rm -f ../frontend-deployment.zip
    rm -f ../backend-deployment.zip
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -p, --plan-only          Only run terraform plan, don't apply"
    echo "  -s, --skip-app-deploy    Skip application deployment"
    echo "  -d, --destroy            Destroy the deployment"
    echo "  -v, --validate-only      Only validate configuration"
    echo "  -c, --cleanup            Clean up temporary files"
    echo "  --check-crawler         Check for crawler API deployment"
    echo "  --auto-crawler         Auto-configure with crawler API"
    echo ""
    echo "Examples:"
    echo "  $0                      # Full deployment"
    echo "  $0 -p                    # Plan only"
    echo "  $0 -s                    # Skip app deployment"
    echo "  $0 -d                    # Destroy deployment"
    echo "  $0 -v                    # Validate only"
    echo "  $0 --check-crawler         # Check crawler API deployment"
    echo "  $0 --auto-crawler         # Auto-configure with crawler API"
    echo ""
    echo "Environment Variables:"
    echo "  SKIP_BUILD              Skip npm build steps (for testing)"
    echo "  SKIP_DEPLOY              Skip Azure deployment (for testing)"
    echo ""
    echo "Integration Options:"
    echo "  --check-crawler         Check if crawler API is deployed"
    echo "  --auto-crawler         Auto-configure dashboard with crawler API outputs"
    echo ""
    echo "Deployment Order:"
    echo "  1. Deploy crawler API first (if not already deployed)"
    echo "  2. Deploy dashboard with crawler integration"
    echo "  3. Verify integration between services"
}

# Main execution
main() {
    local PLAN_ONLY=false
    local SKIP_APP_DEPLOY=false
    local DESTROY=false
    local VALIDATE_ONLY=false
    local CLEANUP_ONLY=false
    local CHECK_CRAWLER=false
    local AUTO_CRAWLER=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -p|--plan-only)
                PLAN_ONLY=true
                shift
                ;;
            -s|--skip-app-deploy)
                SKIP_APP_DEPLOY=true
                shift
                ;;
            -d|--destroy)
                DESTROY=true
                shift
                ;;
            -v|--validate-only)
                VALIDATE_ONLY=true
                shift
                ;;
            -c|--cleanup)
                CLEANUP_ONLY=true
                shift
                ;;
            --check-crawler)
                CHECK_CRAWLER=true
                shift
                ;;
            --auto-crawler)
                AUTO_CRAWLER=true
                shift
                ;;
            *)
                error "Unknown option: $1. Use -h for help."
                ;;
        esac
    done
    
    # Cleanup only
    if [ "$CLEANUP_ONLY" = true ]; then
        cleanup
        exit 0
    fi
    
    # Check for crawler API deployment first
    if [ "$CHECK_CRAWLER" = true ]; then
        check_crawler_deployment
        CRAWLER_AVAILABLE=$?
        
        if [ "$CRAWLER_AVAILABLE" -ne 0 ]; then
            error "Crawler API is not deployed. Please deploy crawler API first using:"
            echo "  cd ../hawaii-vrbo-airbnb-crawler-api/terraform && ./deploy.sh"
        fi
    fi
    
    # Auto-configure with crawler API
    if [ "$AUTO_CRAWLER" = true ]; then
        auto_configure_crawler_integration
    fi
    
    # Destroy deployment
    if [ "$DESTROY" = true ]; then
        log "Destroying deployment..."
        terraform destroy -auto-approve
        success "Deployment destroyed"
        exit 0
    fi
    
    # Validate only
    if [ "$VALIDATE_ONLY" = true ]; then
        check_prerequisites
        validate_terraform
        success "Validation completed successfully"
        exit 0
    fi
    
    # Set trap for cleanup on exit
    trap cleanup EXIT
    
    # Main deployment flow
    check_prerequisites
    validate_terraform
    
    if [ "$PLAN_ONLY" = true ]; then
        plan_deployment
        success "Plan completed. Run '$0' to apply the deployment."
        exit 0
    fi
    
    apply_terraform
    
    if [ "$SKIP_APP_DEPLOY" = false ]; then
        deploy_applications
        configure_app_settings
        verify_deployment
    fi
    
    show_summary
}

# Run main function with all arguments
main "$@"
