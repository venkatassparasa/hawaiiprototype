# Hawaii County TVR Compliance - Temporal Integration

This document provides instructions for setting up and using the Temporal workflow management system with the Hawaii County TVR Compliance Dashboard.

## Overview

The Temporal integration enables the dashboard to manage long-running compliance workflows that can span days, weeks, or months. This includes:

- **TVR Registration Workflows**: Complete application processing with NCUC approval
- **Complaint Investigation Workflows**: Systematic violation investigation processes
- **Violation Appeal Workflows**: Legal review and hearing management
- **Annual Inspection Workflows**: Scheduled compliance inspections

## Quick Start

### Prerequisites

1. **Docker Desktop** installed and running
2. **Node.js 18+** installed
3. **Git** for cloning the repository

### Starting the System

#### Windows Users

```bash
# Run the startup script
start-temporal-integration.bat
```

#### Linux/Mac Users

```bash
# Make the script executable
chmod +x start-temporal-integration.sh

# Run the startup script
./start-temporal-integration.sh
```

### What Gets Started

The startup script launches the following services:

| Service | Port | Description |
|----------|------|-------------|
| Temporal Server | 7233 | Core workflow engine |
| Temporal UI | 8080 | Web interface for monitoring |
| PostgreSQL | 5432 | Workflow state persistence |
| Redis | 6379 | Caching and messaging |
| API Server | 3010 | REST API for workflows |
| Temporal Worker | Background | Executes workflow activities |

## Access Points

Once running, you can access:

- **Temporal UI**: http://localhost:8080
- **API Documentation**: http://localhost:3010/docs
- **Dashboard**: http://localhost:5173/workflows (after starting the frontend)

## Testing the Integration

### Automated Test

Run the integration test to verify everything is working:

```bash
node test-temporal-integration.js
```

### Manual Testing

1. **Open Temporal UI**: Navigate to http://localhost:8080
2. **Start a Workflow**: Use the API or dashboard to create a new workflow
3. **Monitor Progress**: Watch the workflow execute in the Temporal UI

## Available Workflows

### 1. TVR Registration Workflow

**Duration**: 2-10 weeks
**Purpose**: Complete TVR registration process

**Steps**:
1. Initial Review (2 hours)
2. Zoning Verification (1 day)
3. NCUC Processing (3-7 days, if required)
4. Inspection Scheduling (2-3 days)
5. Final Approval (1-2 days)

**API Usage**:
```javascript
POST /api/temporal/workflows/start
{
  "workflowType": "TVRRegistrationWorkflow",
  "input": {
    "applicationId": "APP-12345",
    "propertyId": "PROP-12345",
    "applicantName": "John Doe",
    "propertyAddress": "123 Main St, Kona, HI 96740",
    "zoningCode": "R-1",
    "requiresNCUC": false,
    "assignee": "Planning Department",
    "priority": "medium"
  }
}
```

### 2. Complaint Investigation Workflow

**Duration**: 1-4 weeks
**Purpose**: Investigate TVR violation complaints

**Steps**:
1. Initial Assessment (1 day)
2. Evidence Collection (3-7 days)
3. Site Visit (2-3 days)
4. Investigation Report (2-3 days)
5. Violation Determination (1-2 days)
6. Notice Generation (1 day)

**API Usage**:
```javascript
POST /api/temporal/workflows/start
{
  "workflowType": "ComplaintInvestigationWorkflow",
  "input": {
    "complaintId": "COMP-12345",
    "propertyId": "PROP-12345",
    "complainantName": "Jane Smith",
    "complaintType": "Illegal Rental",
    "description": "Property operating without TVR registration",
    "priority": "high",
    "assignee": "Enforcement Officer"
  }
}
```

### 3. Violation Appeal Workflow

**Duration**: 2-6 weeks
**Purpose**: Handle violation appeals

**Steps**:
1. Document Review (3-5 days)
2. Legal Review (1-2 weeks)
3. Hearing Scheduling (1 week)
4. Decision Making (3-5 days)
5. Notification (1 day)

### 4. Annual Inspection Workflow

**Duration**: 1-2 weeks
**Purpose**: Conduct annual compliance inspections

**Steps**:
1. Scheduling (2-3 days)
2. On-site Inspection (1 day)
3. Report Generation (1-2 days)
4. Follow-up (if needed)
5. Compliance Verification (1 day)

## API Endpoints

### Workflow Management

- `GET /api/temporal/workflows` - List all workflows
- `GET /api/temporal/workflows/:id` - Get workflow details
- `POST /api/temporal/workflows/start` - Start new workflow
- `POST /api/temporal/workflows/:id/terminate` - Terminate workflow
- `POST /api/temporal/workflows/:id/signal` - Send signal to workflow
- `POST /api/temporal/workflows/:id/query` - Query workflow state
- `GET /api/temporal/workflows/:id/history` - Get workflow history

### Workflow Definitions

- `GET /api/temporal/workflow-definitions` - Get available workflow types

### Statistics

- `GET /api/temporal/stats` - Get workflow statistics

## Dashboard Integration

The compliance dashboard includes:

### Workflow Dashboard (`/workflows`)
- Real-time workflow status monitoring
- Progress visualization
- Filtering and search capabilities
- Quick actions (terminate, retry)

### Workflow Builder (`/workflows/new`)
- Visual workflow designer
- Step configuration
- Trigger setup
- Notification rules

### Workflow Details (`/workflows/:id`)
- Complete timeline visualization
- Step-by-step progress tracking
- Activity feed and comments
- Property information integration

## Environment Configuration

Add these variables to your `.env` file:

```env
# Temporal Configuration
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=tvr-compliance-queue
TEMPORAL_UI_URL=http://localhost:8088
```

## Development

### Project Structure

```
compliance-dashboard/
├── docker-compose.temporal.yml    # Temporal infrastructure
├── hawaii-vrbo-airbnb-crawler-api/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── temporalController.ts  # Temporal API endpoints
│   │   ├── routes/
│   │   │   └── temporal.ts           # Temporal routes
│   │   ├── workflows/
│   │   │   └── index.ts              # Workflow definitions
│   │   ├── activities/
│   │   │   └── index.ts              # Activity implementations
│   │   ├── worker.ts                 # Temporal worker
│   │   └── server.ts                 # Main server
├── src/
│   ├── services/
│   │   └── temporalService.js        # Frontend Temporal client
│   └── components/
│       └── workflows/                # React components
├── start-temporal-integration.bat   # Windows startup script
├── start-temporal-integration.sh    # Linux/Mac startup script
└── test-temporal-integration.js     # Integration test
```

### Adding New Workflows

1. **Define Workflow Interface** in `src/workflows/index.ts`
2. **Implement Workflow Logic** with activities
3. **Create Activities** in `src/activities/index.ts`
4. **Add API Support** in `src/controllers/temporalController.ts`
5. **Update UI Components** as needed

### Monitoring and Debugging

#### Temporal UI
- View running workflows
- Check workflow history
- Monitor worker activity
- Debug failed workflows

#### Logs
```bash
# API Server logs
# Check the terminal where API server is running

# Temporal logs
docker-compose -f docker-compose.temporal.yml logs temporal

# Worker logs
# Check the terminal where worker is running
```

#### Health Checks
```bash
# API health
curl http://localhost:3010/health

# Temporal health
curl http://localhost:7233
```

## Troubleshooting

### Common Issues

1. **Temporal server not starting**
   - Ensure Docker Desktop is running
   - Check port conflicts (7233, 8088, 5432, 6379)
   - Restart Docker Desktop

2. **API server connection failed**
   - Check if port 3010 is available
   - Verify environment variables
   - Check MongoDB connection

3. **Worker not connecting**
   - Verify Temporal server is running
   - Check network connectivity
   - Review worker logs

4. **Workflow not starting**
   - Check worker is running
   - Verify workflow definition exists
   - Review API request format

### Resetting the System

To completely reset the Temporal system:

```bash
# Stop all services
docker-compose -f docker-compose.temporal.yml down

# Remove volumes (this deletes all workflow data)
docker-compose -f docker-compose.temporal.yml down -v

# Restart
start-temporal-integration.bat  # or .sh
```

## Production Considerations

### Security
- Enable authentication for Temporal UI
- Use HTTPS in production
- Implement proper access controls
- Secure API endpoints

### Scalability
- Configure multiple workers
- Use load balancers
- Set up monitoring
- Plan for data retention

### Backup and Recovery
- Regular database backups
- Workflow state export/import
- Disaster recovery planning
- Data retention policies

## Support

For issues or questions:

1. Check the logs for error messages
2. Review this documentation
3. Consult the Temporal documentation: https://docs.temporal.io/
4. Contact the development team

## License

Hawaii County Government - Internal Use Only
