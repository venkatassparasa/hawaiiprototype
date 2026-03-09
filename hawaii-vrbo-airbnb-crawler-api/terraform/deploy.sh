#!/bin/bash

# Deployment Script for Hawaii Vacation Rental Crawler API on Azure
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
    if ! grep -q "apify_token.*=" terraform.tfvars || grep -q "apify_token.*=\"\"" terraform.tfvars; then
        error "apify_token is required and cannot be empty in terraform.tfvars"
    fi
    
    if ! grep -q "apify_user_id.*=" terraform.tfvars || grep -q "apify_user_id.*=\"\"" terraform.tfvars; then
        error "apify_user_id is required and cannot be empty in terraform.tfvars"
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

# Deploy application code
deploy_application() {
    log "Deploying application code..."
    
    # Get outputs from Terraform
    RESOURCE_GROUP=$(terraform output -raw resource_group_name)
    APP_SERVICE_NAME=$(terraform output -raw app_service_name)
    LOCATION=$(terraform output -raw azure_region)
    
    log "Deploying to App Service: $APP_SERVICE_NAME in Resource Group: $RESOURCE_GROUP"
    
    # Build the application
    log "Building application..."
    cd ..
    npm ci
    npm run build
    
    # Create deployment package
    log "Creating deployment package..."
    zip -r deployment.zip dist/ package.json package-lock.json
    cd terraform
    
    # Deploy to Azure App Service
    log "Deploying to Azure App Service..."
    az webapp deployment source config-zip \
        --resource-group "$RESOURCE_GROUP" \
        --name "$APP_SERVICE_NAME" \
        --src "../deployment.zip"
    
    # Clean up deployment package
    rm -f ../deployment.zip
    
    success "Application deployment completed"
}

# Configure application settings
configure_app_settings() {
    log "Configuring application settings..."
    
    # Get outputs from Terraform
    RESOURCE_GROUP=$(terraform output -raw resource_group_name)
    APP_SERVICE_NAME=$(terraform output -raw app_service_name)
    
    # Get environment variables from Terraform output
    ENV_VARS=$(terraform output -json app_environment_variables | jq -r '.value | to_entries[] | "\(.key)=\(.value)"' | tr '\n' ' ')
    
    # Set application settings
    log "Setting application settings..."
    az webapp config appsettings set \
        --resource-group "$RESOURCE_GROUP" \
        --name "$APP_SERVICE_NAME" \
        --settings $ENV_VARS
    
    success "Application settings configured"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Get outputs from Terraform
    API_URL=$(terraform output -raw api_base_url)
    HEALTH_URL=$(terraform output -raw api_health_url)
    
    log "Testing API health endpoint..."
    
    # Wait for application to start
    log "Waiting for application to start..."
    sleep 30
    
    # Test health endpoint (retry up to 5 times)
    for i in {1..5}; do
        if curl -f -s "$HEALTH_URL" > /dev/null; then
            success "API health check passed"
            break
        else
            if [ $i -eq 5 ]; then
                error "API health check failed after 5 attempts"
            fi
            log "Health check attempt $i failed, retrying in 30 seconds..."
            sleep 30
        fi
    done
    
    # Test API documentation endpoint
    log "Testing API documentation endpoint..."
    if curl -f -s "$API_URL/api-docs" > /dev/null; then
        success "API documentation endpoint is accessible"
    else
        warning "API documentation endpoint is not accessible (may need additional configuration)"
    fi
}

# Show deployment summary
show_summary() {
    log "Deployment Summary:"
    echo "=================================="
    
    # Get all outputs from Terraform
    echo "Resource Group: $(terraform output -raw resource_group_name)"
    echo "API URL: $(terraform output -raw api_base_url)"
    echo "Health Check URL: $(terraform output -raw api_health_url)"
    echo "API Documentation: $(terraform output -raw api_docs_url)"
    echo "Application Insights: $(terraform output -raw application_insights_url)"
    echo "Key Vault: $(terraform output -raw key_vault_uri)"
    echo "=================================="
    
    echo ""
    echo "Next Steps:"
    echo "1. Test the API endpoints"
    echo "2. Configure monitoring alerts"
    echo "3. Set up backup policies (if enabled)"
    echo "4. Update your dashboard application with the new API URL"
    echo "5. Configure custom domain and SSL (if needed)"
    
    success "Deployment completed successfully!"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    rm -f ../deployment.zip
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -p, --plan-only          Only run terraform plan, don't apply"
    echo "  -s, --skip-app-deploy    Skip application code deployment"
    echo "  -d, --destroy            Destroy the deployment"
    echo "  -v, --validate-only      Only validate configuration"
    echo "  -c, --cleanup            Clean up temporary files"
    echo ""
    echo "Examples:"
    echo "  $0                      # Full deployment"
    echo "  $0 -p                    # Plan only"
    echo "  $0 -s                    # Skip app deployment"
    echo "  $0 -d                    # Destroy deployment"
    echo "  $0 -v                    # Validate only"
}

# Main execution
main() {
    local PLAN_ONLY=false
    local SKIP_APP_DEPLOY=false
    local DESTROY=false
    local VALIDATE_ONLY=false
    local CLEANUP_ONLY=false
    
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
        deploy_application
        configure_app_settings
        verify_deployment
    fi
    
    show_summary
}

# Run main function with all arguments
main "$@"
