#!/bin/bash

# 🚀 Vercel Deployment Script for Hawaii Compliance Dashboard

echo "🌺 Starting deployment of Hawaii Compliance Dashboard..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "📝 Please login to Vercel:"
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --limit 1 | grep -o 'https://[^[:space:]]*' | head -1)

echo "✅ Deployment completed!"
echo "🌐 Your app is live at: $DEPLOYMENT_URL"
echo "🔍 Health check: $DEPLOYMENT_URL/api/health"
echo "⏰ Temporal workflows: $DEPLOYMENT_URL/api/temporal/workflows"

echo ""
echo "📋 Next Steps:"
echo "1. Set up Temporal Cloud at https://temporal.io/cloud"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Deploy Temporal worker separately"
echo "4. Test the deployment"

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
