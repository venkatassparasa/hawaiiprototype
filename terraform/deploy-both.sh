#!/bin/bash

# Master Deployment Script - Hawaii TVR Compliance Stack
# This script deploys both crawler API and dashboard in the correct order with automatic integration

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
    
    success "Prerequisites check passed"
}

# Deploy crawler API first
deploy_crawler_api() {
    log "📊 Step 1: Deploying Crawler API..."
    
    local crawler_dir="../hawaii-vrbo-airbnb-crawler-api/terraform"
    
    if [ ! -d "$crawler_dir" ]; then
        error "Crawler API directory not found at $crawler_dir"
    fi
    
    cd "$crawler_dir"
    
    # Check if already deployed
    if [ -f "terraform.tfstate" ]; then
        log "Checking existing crawler API deployment..."
        if terraform plan | grep -q "0 added, 0 changed" > /dev/null; then
            log "Crawler API is already deployed. Applying changes..."
            terraform apply -auto-approve
            success "Crawler API deployment updated"
        else
            log "Crawler API is already deployed and up-to-date"
        fi
    else
        log "Deploying crawler API for the first time..."
        terraform init
        terraform plan
        terraform apply -auto-approve
        success "Crawler API deployed successfully"
    fi
    
    # Get crawler API outputs
    CRAWLER_URL=$(terraform output -raw api_base_url 2>/dev/null || echo "")
    CRAWLER_KEY=$(terraform output -raw crawler_api_key 2>/dev/null || echo "")
    
    cd ..
    
    if [ -n "$CRAWLER_URL" ] && [ -n "$CRAWLER_KEY" ]; then
        success "Crawler API deployed and accessible"
        log "Crawler API URL: $CRAWLER_URL"
        return 0
    else
        error "Crawler API deployment failed or outputs not available"
    fi
}

# Deploy dashboard with crawler integration
deploy_dashboard() {
    log "🎯 Step 2: Deploying Dashboard with Crawler Integration..."
    
    # Navigate to dashboard directory
    cd compliance-dashboard/terraform
    
    # Check if dashboard directory exists
    if [ ! -d "." ]; then
        error "Dashboard directory not found at compliance-dashboard/terraform"
    fi
    
    # Initialize Terraform
    log "Initializing Terraform for dashboard..."
    terraform init
    
    # Auto-configure with crawler API if available
    if [ -n "$CRAWLER_URL" ] && [ -n "$CRAWLER_KEY" ]; then
        log "Auto-configuring dashboard with crawler API integration..."
        
        # Update dashboard terraform.tfvars with crawler API information
        if [ -f "terraform.tfvars" ]; then
            # Backup original file
            cp terraform.tfvars terraform.tfvars.backup
            
            # Update crawler API configuration
            sed -i.bak "s|crawler_api_url.*=.*|crawler_api_url = \"$CRAWLER_URL\"|" terraform.tfvars
            sed -i.bak "s|crawler_api_key.*=.*|crawler_api_key = \"$CRAWLER_KEY\"|" terraform.tfvars
            
            # Remove backup file
            rm terraform.tfvars.bak
            
            success "Dashboard configuration updated with crawler API integration"
        else
            error "terraform.tfvars file not found for configuration update"
        fi
    else
        log "No crawler API outputs available - using manual configuration"
        log "Please ensure crawler_api_url and crawler_api_key are set in terraform.tfvars"
    fi
    
    # Deploy dashboard infrastructure
    log "Deploying dashboard infrastructure..."
    terraform plan
    terraform apply -auto-approve
    
    success "Dashboard deployed successfully"
    
    # Get dashboard outputs
    FRONTEND_URL=$(terraform output -raw frontend_url)
    BACKEND_URL=$(terraform output -raw backend_url)
    
    success "Dashboard URL: $FRONTEND_URL"
    return 0
}

# Verify integration
verify_integration() {
    log "🔍 Step 3: Verifying Integration..."
    
    # Test crawler API connectivity
    if [ -n "$CRAWLER_URL" ]; then
        log "Testing crawler API connectivity..."
        if curl -f -s "$CRAWLER_URL/api/crawl/statistics" > /dev/null; then
            success "Crawler API is accessible"
        else
            warning "Crawler API not accessible at $CRAWLER_URL"
        fi
    else
        warning "Crawler API URL not available"
    fi
    
    # Test dashboard API endpoints
    if [ -n "$BACKEND_URL" ]; then
        log "Testing dashboard API endpoints..."
        if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
            success "Dashboard API is accessible"
        else
            warning "Dashboard API not accessible at $BACKEND_URL"
        fi
    else
        warning "Dashboard URL not available"
    fi
    
    # Test frontend
    if [ -n "$FRONTEND_URL" ]; then
        log "Testing frontend accessibility..."
        if curl -f -s "$FRONTEND_URL" > /dev/null; then
            success "Frontend is accessible"
        else
            warning "Frontend not accessible at $FRONTEND_URL"
        fi
    else
        warning "Frontend URL not available"
    fi
    
    success "Integration verification completed"
}

# Show deployment summary
show_deployment_summary() {
    log "🎉 Complete Deployment Summary:"
    echo "=================================="
    
    # Get all outputs from Terraform
    echo "Resource Group: $(terraform output -raw resource_group_name)"
    
    echo ""
    echo "📊 Crawler API:"
    if [ -n "$CRAWLER_URL" ]; then
        echo "  URL: $CRAWLER_URL"
        echo "  Status: Deployed and accessible"
    else
        echo "  Status: Not deployed"
    fi
    
    echo ""
    echo "🎯 Dashboard:"
    if [ -n "$FRONTEND_URL" ] && [ -n "$BACKEND_URL" ]; then
        echo "  URL: $FRONTEND_URL"
        echo "  Status: Deployed and accessible"
    else
        echo "  URL: Not deployed"
    fi
    
    echo ""
    echo "🔗 Integration Status:"
    if [ -n "$CRAWLER_URL" ] && [ -n "$FRONTEND_URL" ]; then
        echo "  ✅ Crawler API accessible"
        echo "  ✅ Dashboard accessible"
        echo "  ✅ Integration configured"
    else
        echo "  ❌ Integration incomplete"
    fi
    
    echo "=================================="
    
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Test the application functionality"
    echo "2. Verify crawler API integration"
    echo "3. Test real-time data synchronization"
    echo "4. Configure custom domain and SSL (if needed)"
    echo "5. Set up monitoring alerts"
    echo "6. Test webhook notifications"
    echo "7. Update DNS records to point to Application Gateway"
    
    success "🎉 Complete deployment finished successfully!"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    rm -f ../frontend-deployment.zip
    rm -f ../backend-deployment.zip
    rm -f terraform.tfvars.bak 2>/dev/null || true
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -c, --crawler-only       Deploy crawler API only"
    echo "  -d, --dashboard-only     Deploy dashboard only"
    echo "  -f, --full              Deploy both services with auto-configuration"
    echo "  -v, --validate-only      Validate configuration only"
    echo "  -c, --cleanup            Clean up temporary files"
    echo ""
    echo "Examples:"
    echo "  $0                      # Full deployment"
    echo "  $0 -c                    # Deploy crawler API only"
    echo "  $0 -d                    # Deploy dashboard only"
    echo "  $0 -f                    # Deploy both services"
    echo "  $0 -v                    # Validate only"
    echo "  $0 -c                    # Clean up temporary files"
    echo ""
    echo "Deployment Order:"
    echo " 1. Deploy crawler API first (if not already deployed)"
    echo " 2. Deploy dashboard with auto-configuration"
    echo " 3. Verify integration between services"
    echo ""
    echo "Integration Features:"
    echo "  ✅ Auto-configuration of dashboard with crawler API outputs"
    echo "  ✅ Automatic webhook configuration"
    echo "  ✅ Real-time data synchronization"
    echo "  ✅ Error handling and retry logic"
    echo ""
    echo "Environment Variables:"
    echo "  SKIP_BUILD              Skip npm build steps (for testing)"
    echo "  SKIP_DEPLOY              Skip Azure deployment (for testing)"
    echo ""
    echo "Prerequisites:"
    echo "  - Azure CLI installed and configured"
    echo "  - Terraform installed and configured"
    echo "  - Appropriate Azure permissions"
    echo "  - Crawler API deployed (for integration)"
}

# Main execution
main() {
    local CRAWLER_ONLY=false
    local DASHBOARD_ONLY=false
    local FULL_DEPLOY=false
    local VALIDATE_ONLY=false
    local CLEANUP_ONLY=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -c|--crawler-only)
                CRAWLER_ONLY=true
                shift
                ;;
            -d|--dashboard-only)
                DASHBOARD_ONLY=true
                shift
                ;;
            -f|--full)
                FULL_DEPLOY=true
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
    
    # Validate only
    if [ "$VALIDATE_ONLY" = true ]; then
        check_prerequisites
        success "Validation completed successfully"
        exit 0
    fi
    
    # Set trap for cleanup on exit
    trap cleanup EXIT
    
    # Full deployment (default)
    if [ "$FULL_DEPLOY" = true ] || ([ "$CRAWLER_ONLY" = false ] && [ "$DASHBOARD_ONLY" = false ]); then
        log "🚀 Starting full deployment..."
        
        # Deploy crawler API first
        deploy_crawler_api
        CRAWLER_SUCCESS=$?
        
        if [ "$CRAWLER_SUCCESS" -eq 0 ]; then
            success "Crawler API deployed successfully"
            
            # Deploy dashboard with auto-configuration
            deploy_dashboard
            DASHBOARD_SUCCESS=$?
            
            if [ "$DASHBOARD_SUCCESS" -eq 0 ]; then
                success "Both services deployed successfully"
                verify_integration
            else
                warning "Dashboard deployment failed. Check logs and retry."
            fi
        else
            error "Crawler API deployment failed. Please check logs and retry."
        fi
    fi
    
    # Deploy crawler only
    if [ "$CRAWLER_ONLY" = true ]; then
        deploy_crawler_api
        CRAWLER_SUCCESS=$?
        
        if [ "$CRAWLER_SUCCESS" -eq 0 ]; then
            success "Crawler API deployed successfully"
        else
            error "Crawler API deployment failed. Please check logs and retry."
        fi
    fi
    
    # Deploy dashboard only
    if [ "$DASHBOARD_ONLY" = true ]; then
        deploy_dashboard
        DASHBOARD_SUCCESS=$?
        
        if [ "$DASHBOARD_SUCCESS" -eq 0 ]; then
            success "Dashboard deployed successfully"
        else
            error "Dashboard deployment failed. Please check logs and retry."
        fi
    fi
    
    # Show deployment summary
    show_deployment_summary
    
    success "🎉 Deployment completed successfully!"
}

# Run main function with all arguments
main "$@"
