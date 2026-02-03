# 🚀 Vercel Deployment Guide

## Overview
This guide explains how to deploy the Hawaii Compliance Dashboard with Temporal integration to Vercel.

## Architecture Changes

### Before (Local Development)
- Frontend: React app on localhost:5173
- API Server: Express.js on localhost:3010
- Temporal: Docker containers on localhost:7233/8080
- PostgreSQL: Docker on localhost:5432

### After (Vercel Production)
- Frontend: Vercel static hosting
- API: Vercel Serverless Functions
- Temporal: Temporal Cloud (recommended)
- Database: Vercel Postgres or external PostgreSQL

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Temporal Cloud Account**: Sign up at [temporal.io/cloud](https://temporal.io/cloud)
3. **Database**: Vercel Postgres or external PostgreSQL

## Step 1: Setup Temporal Cloud

1. Go to [Temporal Cloud](https://temporal.io/cloud)
2. Create a new namespace
3. Note your namespace and connection details
4. Update environment variables:
   ```
   TEMPORAL_ADDRESS=your-namespace.tmprl.cloud:7233
   TEMPORAL_NAMESPACE=your-namespace
   ```

## Step 2: Setup Database

### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to Storage → Postgres
2. Create a new database
3. Note the connection string
4. Set environment variable: `POSTGRES_URI=@postgres_db`

### Option B: External PostgreSQL
1. Use any PostgreSQL provider (AWS RDS, Railway, etc.)
2. Get connection string
3. Set environment variable: `POSTGRES_URI=your-connection-string`

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from dashboard directory
cd compliance-dashboard
vercel --prod
```

### Method 2: GitHub Integration
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Import the repository
4. Configure environment variables in Vercel dashboard

## Step 4: Configure Environment Variables

In Vercel dashboard, set these environment variables:

### Required
```
TEMPORAL_ADDRESS=your-namespace.tmprl.cloud:7233
TEMPORAL_NAMESPACE=your-namespace
POSTGRES_URI=@postgres_db  # or your external connection string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Optional
```
TEMPORAL_TASK_QUEUE=tvr-compliance-queue
NODE_ENV=production
```

## Step 5: Deploy Temporal Worker

Since Vercel functions are serverless, you need to deploy the Temporal worker separately:

### Option A: Railway/Render
```bash
# Deploy worker to Railway
git clone https://github.com/your-repo/worker
cd worker
railway login
railway deploy
```

### Option B: Docker Cloud
```bash
# Build and deploy worker
docker build -t temporal-worker .
docker push your-registry/temporal-worker
```

## Step 6: Update Frontend Configuration

The frontend automatically uses the correct API endpoints:
- **Local**: `http://localhost:3010/api/temporal`
- **Production**: `/api/temporal` (Vercel functions)

## Step 7: Verify Deployment

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Temporal UI**: Your Temporal Cloud dashboard
3. **Frontend**: `https://your-app.vercel.app`

## Troubleshooting

### Common Issues

1. **Temporal Connection Failed**
   - Check TEMPORAL_ADDRESS and TEMPORAL_NAMESPACE
   - Ensure Temporal worker is running
   - Verify network connectivity

2. **Database Connection Failed**
   - Check POSTGRES_URI
   - Ensure SSL settings are correct
   - Verify database is accessible

3. **CORS Errors**
   - Check that CORS headers are set in serverless functions
   - Verify API endpoints are accessible

### Debugging

```bash
# Check Vercel function logs
vercel logs

# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test temporal endpoint
curl https://your-app.vercel.app/api/temporal/workflows
```

## Monitoring

### Vercel Analytics
- Function execution logs
- Performance metrics
- Error tracking

### Temporal Cloud
- Workflow execution metrics
- Worker performance
- Task queue monitoring

## Cost Optimization

### Vercel
- Function execution time
- Memory usage
- Request count

### Temporal Cloud
- Workflow execution time
- Worker resource usage
- Storage costs

## Security Considerations

1. **Environment Variables**: Store secrets in Vercel dashboard
2. **JWT Tokens**: Use strong, unique secrets
3. **Database**: Use SSL connections
4. **Temporal**: Use namespace isolation

## Rollback Plan

```bash
# Rollback to previous deployment
vercel rollback [deployment-url]

# Or redeploy previous commit
vercel --prod --git-reset HEAD~1
```

## Support

- **Vercel**: [Vercel Docs](https://vercel.com/docs)
- **Temporal**: [Temporal Cloud Docs](https://docs.temporal.io/cloud)
- **Issues**: Create GitHub issues in the repository
