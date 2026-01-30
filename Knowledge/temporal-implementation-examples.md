# Temporal Implementation Examples

## Complete Backend Implementation Examples

### 1. Node.js Temporal Client Setup

```typescript
// src/temporal/client.ts
import { Connection, Client } from '@temporalio/client';
import { TVRRegistrationWorkflow } from './workflows';

// Temporal connection configuration
const connection = await Connection.connect({
  address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  tls: process.env.NODE_ENV === 'production' ? {} : false,
});

// Create Temporal client
export const temporalClient = new Client({
  connection,
  namespace: 'default',
});

// Workflow starter functions
export class WorkflowStarter {
  async startTVRRegistration(applicationData: TVRApplication) {
    const workflowId = `tvr-registration-${applicationData.id}`;
    
    return await temporalClient.workflow.start({
      workflowId,
      taskQueue: 'tvr-registration-queue',
      workflowType: TVRRegistrationWorkflow,
      args: [applicationData],
      retry: {
        maximumAttempts: 3,
        initialInterval: '1s',
        maximumInterval: '60s',
        backoffCoefficient: 2.0,
      },
      workflowExecutionTimeout: '30 days',
      workflowRunTimeout: '7 days',
    });
  }

  async startComplaintInvestigation(complaintData: ComplaintData) {
    const workflowId = `complaint-investigation-${complaintData.id}`;
    
    return await temporalClient.workflow.start({
      workflowId,
      taskQueue: 'complaint-investigation-queue',
      workflowType: 'ComplaintInvestigationWorkflow',
      args: [complaintData],
    });
  }

  async signalWorkflow(workflowId: string, signalName: string, data: any) {
    const handle = temporalClient.workflow.getHandle(workflowId);
    await handle.signal(signalName, data);
  }

  async pauseWorkflow(workflowId: string) {
    const handle = temporalClient.workflow.getHandle(workflowId);
    await handle.signal('pause');
  }

  async resumeWorkflow(workflowId: string) {
    const handle = temporalClient.workflow.getHandle(workflowId);
    await handle.signal('resume');
  }

  async terminateWorkflow(workflowId: string, reason: string) {
    const handle = temporalClient.workflow.getHandle(workflowId);
    await handle.terminate(reason);
  }
}
```

### 2. Express.js API Implementation

```typescript
// src/api/temporal.ts
import express from 'express';
import { WorkflowStarter } from '../temporal/client';
import { WorkflowQueries } from '../temporal/queries';
import { validateStartWorkflowRequest } from '../validation/workflows';

const router = express.Router();
const workflowStarter = new WorkflowStarter();
const workflowQueries = new WorkflowQueries();

// List workflows
router.get('/workflows', async (req, res) => {
  try {
    const {
      status,
      type,
      assignee,
      priority,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const filters = {
      status: status as string,
      type: type as string,
      assignee: assignee as string,
      priority: priority as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    };

    const result = await workflowQueries.listWorkflows(filters);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to list workflows'
      }
    });
  }
});

// Get workflow details
router.get('/workflows/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const workflow = await workflowQueries.getWorkflowDetails(workflowId);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WORKFLOW_NOT_FOUND',
          message: `Workflow with ID '${workflowId}' not found`
        }
      });
    }

    res.json({
      success: true,
      data: workflow
    });
  } catch (error) {
    console.error('Error getting workflow details:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get workflow details'
      }
    });
  }
});

// Start new workflow
router.post('/workflows/start', async (req, res) => {
  try {
    const requestData = req.body;
    
    // Validate request
    const validation = validateStartWorkflowRequest(requestData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error
        }
      });
    }

    let result;
    switch (requestData.workflowType) {
      case 'tvr-registration':
        result = await workflowStarter.startTVRRegistration(requestData.input);
        break;
      case 'complaint-investigation':
        result = await workflowStarter.startComplaintInvestigation(requestData.input);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_WORKFLOW_TYPE',
            message: `Unsupported workflow type: ${requestData.workflowType}`
          }
        });
    }

    res.status(201).json({
      success: true,
      data: {
        workflowId: result.workflowId,
        executionId: result.firstExecutionRunId,
        status: 'running',
        startedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'WORKFLOW_ALREADY_EXISTS',
          message: 'Workflow with this ID already exists'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to start workflow'
      }
    });
  }
});

// Signal workflow
router.post('/workflows/:workflowId/signal', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { signalName, input } = req.body;

    await workflowStarter.signalWorkflow(workflowId, signalName, input);

    res.json({
      success: true,
      data: {
        signalSent: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error signaling workflow:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to signal workflow'
      }
    });
  }
});

// Pause workflow
router.post('/workflows/:workflowId/pause', async (req, res) => {
  try {
    const { workflowId } = req.params;
    await workflowStarter.pauseWorkflow(workflowId);

    res.json({
      success: true,
      data: {
        status: 'paused',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error pausing workflow:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to pause workflow'
      }
    });
  }
});

// Resume workflow
router.post('/workflows/:workflowId/resume', async (req, res) => {
  try {
    const { workflowId } = req.params;
    await workflowStarter.resumeWorkflow(workflowId);

    res.json({
      success: true,
      data: {
        status: 'running',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error resuming workflow:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to resume workflow'
      }
    });
  }
});

// Terminate workflow
router.delete('/workflows/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { reason, terminatedBy } = req.body;

    await workflowStarter.terminateWorkflow(workflowId, reason);

    res.json({
      success: true,
      data: {
        status: 'terminated',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error terminating workflow:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to terminate workflow'
      }
    });
  }
});

export default router;
```

### 3. Workflow Query Implementation

```typescript
// src/temporal/queries.ts
import { temporalClient } from './client';
import { WorkflowExecutionStatus } from '@temporalio/client';

export class WorkflowQueries {
  async listWorkflows(filters: WorkflowFilters) {
    const { status, type, assignee, priority, page = 1, limit = 20, search } = filters;
    
    // Build query
    let query = 'WorkflowType = ""';
    const queryParams: any[] = [];

    if (type) {
      query += ' AND WorkflowType = ?';
      queryParams.push(type);
    }

    if (status) {
      query += ' AND ExecutionStatus = ?';
      queryParams.push(this.mapStatusToTemporal(status));
    }

    if (search) {
      query += ' AND (WorkflowId LIKE ? OR WorkflowType LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Execute list query
    const workflowExecutions = await temporalClient.workflow.list({
      query,
      queryArgs: queryParams,
    });

    // Convert to our format
    const workflows = [];
    for await (const execution of workflowExecutions) {
      const workflow = await this.mapExecutionToWorkflow(execution);
      
      // Apply additional filters
      if (assignee && workflow.assignee !== assignee) continue;
      if (priority && workflow.priority !== priority) continue;
      
      workflows.push(workflow);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedWorkflows = workflows.slice(startIndex, endIndex);

    return {
      workflows: paginatedWorkflows,
      pagination: {
        page,
        limit,
        total: workflows.length,
        totalPages: Math.ceil(workflows.length / limit)
      }
    };
  }

  async getWorkflowDetails(workflowId: string) {
    try {
      const handle = temporalClient.workflow.getHandle(workflowId);
      
      // Get basic workflow info
      const description = await handle.describe();
      
      // Get execution history
      const history = await handle.fetchHistory();
      
      // Get current status
      const status = await this.getWorkflowStatus(handle);
      
      // Get workflow result if completed
      let result = null;
      if (status === WorkflowExecutionStatus.COMPLETED) {
        result = await handle.result();
      }

      // Map to our format
      const workflow = await this.mapDescriptionToWorkflow(description, workflowId);
      workflow.status = this.mapTemporalToStatus(status);
      workflow.result = result;
      workflow.history = this.mapHistoryToEvents(history.events);

      // Get activities from history
      workflow.activities = this.extractActivitiesFromHistory(history.events);

      return workflow;
    } catch (error) {
      if (error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  private mapStatusToTemporal(status: string): WorkflowExecutionStatus {
    switch (status) {
      case 'running': return WorkflowExecutionStatus.RUNNING;
      case 'completed': return WorkflowExecutionStatus.COMPLETED;
      case 'failed': return WorkflowExecutionStatus.FAILED;
      case 'paused': return WorkflowExecutionStatus.RUNNING; // Paused is a signal state
      case 'waiting': return WorkflowExecutionStatus.RUNNING; // Waiting is a signal state
      default: return WorkflowExecutionStatus.RUNNING;
    }
  }

  private mapTemporalToStatus(status: WorkflowExecutionStatus): string {
    switch (status) {
      case WorkflowExecutionStatus.RUNNING: return 'running';
      case WorkflowExecutionStatus.COMPLETED: return 'completed';
      case WorkflowExecutionStatus.FAILED: return 'failed';
      case WorkflowExecutionStatus.CANCELED: return 'failed';
      case WorkflowExecutionStatus.TERMINATED: return 'failed';
      case WorkflowExecutionStatus.TIMED_OUT: return 'failed';
      default: return 'running';
    }
  }

  private async mapExecutionToWorkflow(execution: any): Promise<Workflow> {
    const handle = temporalClient.workflow.getHandle(execution.workflowId);
    const description = await handle.describe();
    return this.mapDescriptionToWorkflow(description, execution.workflowId);
  }

  private async mapDescriptionToWorkflow(description: any, workflowId: string): Promise<Workflow> {
    const status = await this.getWorkflowStatus(temporalClient.workflow.getHandle(workflowId));
    
    return {
      id: workflowId,
      type: description.type.name,
      status: this.mapTemporalToStatus(status),
      progress: await this.calculateProgress(workflowId),
      startedAt: new Date(description.startTime).toISOString(),
      currentStep: await this.getCurrentStep(workflowId),
      assignee: await this.getCurrentAssignee(workflowId),
      priority: 'medium', // Would need to be stored in workflow input or signals
      input: description.input,
      result: null,
      error: null
    };
  }

  private async getWorkflowStatus(handle: any): Promise<WorkflowExecutionStatus> {
    try {
      const description = await handle.describe();
      return description.status;
    } catch (error) {
      return WorkflowExecutionStatus.FAILED;
    }
  }

  private async calculateProgress(workflowId: string): Promise<number> {
    // This would be implemented based on your specific workflow logic
    // Could use workflow queries or track progress in signals
    return 65; // Placeholder
  }

  private async getCurrentStep(workflowId: string): Promise<string> {
    // Query the workflow for current step
    const handle = temporalClient.workflow.getHandle(workflowId);
    try {
      return await handle.query('getCurrentStep');
    } catch (error) {
      return 'Unknown';
    }
  }

  private async getCurrentAssignee(workflowId: string): Promise<string> {
    // Query the workflow for current assignee
    const handle = temporalClient.workflow.getHandle(workflowId);
    try {
      return await handle.query('getCurrentAssignee');
    } catch (error) {
      return 'Unassigned';
    }
  }

  private mapHistoryToEvents(events: any[]): WorkflowHistoryEvent[] {
    return events.map(event => ({
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: new Date(event.timestamp).toISOString(),
      details: event.attributes
    }));
  }

  private extractActivitiesFromHistory(events: any[]): Activity[] {
    const activities: Activity[] = [];
    
    for (const event of events) {
      if (event.eventType === 'ActivityTaskStarted') {
        activities.push({
          id: event.activityId,
          name: event.activityType.name,
          type: 'manual', // Would need to be determined from activity type
          status: 'running',
          assignee: 'Unknown',
          duration: 'Unknown',
          description: '',
          required: true,
          startedAt: new Date(event.timestamp).toISOString()
        });
      } else if (event.eventType === 'ActivityTaskCompleted') {
        const activity = activities.find(a => a.id === event.activityId);
        if (activity) {
          activity.status = 'completed';
          activity.completedAt = new Date(event.timestamp).toISOString();
          activity.result = event.result;
        }
      } else if (event.eventType === 'ActivityTaskFailed') {
        const activity = activities.find(a => a.id === event.activityId);
        if (activity) {
          activity.status = 'failed';
          activity.completedAt = new Date(event.timestamp).toISOString();
          activity.error = event.failure?.message;
        }
      }
    }
    
    return activities;
  }
}
```

### 4. Workflow Implementation Example

```typescript
// src/temporal/workflows/tvr-registration.ts
import { workflow, signal, query } from '@temporalio/workflow';
import { 
  performInitialReview, 
  verifyZoning, 
  processNCUC, 
  scheduleInspection, 
  finalizeRegistration 
} from '../activities/tvr-activities';

export interface TVRApplication {
  id: string;
  propertyId: string;
  applicantId: string;
  property: {
    address: string;
    tmk: string;
    owner: string;
    zone: string;
  };
  configuration: {
    requiresNCUC: boolean;
    inspectionType: string;
    expeditedProcessing: boolean;
  };
}

export interface TVRRegistrationResult {
  status: 'approved' | 'rejected';
  registrationId?: string;
  reason?: string;
  approvedAt?: string;
}

// Signals
export const updatePrioritySignal = signal<[priority: string, reason: string]>();
export const pauseSignal = signal();
export const resumeSignal = signal();

// Queries
export const getCurrentStepQuery = query<string>(() => currentStep);
export const getCurrentAssigneeQuery = query<string>(() => currentAssignee);
export const getProgressQuery = query<number>(() => progress);

// Workflow state
let currentStep = 'Application Submitted';
let currentAssignee = 'Applicant';
let progress = 0;
let isPaused = false;
let priority = 'medium';

export async function TVRRegistrationWorkflow(application: TVRApplication): Promise<TVRRegistrationResult> {
  currentStep = 'Application Submitted';
  currentAssignee = 'Applicant';
  progress = 10;

  try {
    // Step 1: Initial Review
    await waitForResumeIfPaused();
    currentStep = 'Initial Review';
    currentAssignee = 'Planning Department';
    progress = 20;
    
    const initialReview = await performInitialReview(application);
    if (!initialReview.approved) {
      return { status: 'rejected', reason: initialReview.reason };
    }

    // Step 2: Zoning Verification
    await waitForResumeIfPaused();
    currentStep = 'Zoning Verification';
    currentAssignee = 'Zoning Officer';
    progress = 40;
    
    const zoningResult = await verifyZoning(application.propertyId);
    
    // Step 3: NCUC Processing (if required)
    if (zoningResult.requiresNCUC) {
      await waitForResumeIfPaused();
      currentStep = 'NCUC Processing';
      currentAssignee = 'Planning Department';
      progress = 60;
      
      const ncucResult = await processNCUC(application);
      if (!ncucResult.approved) {
        return { status: 'rejected', reason: 'NCUC denied' };
      }
    }

    // Step 4: Inspection Scheduling
    await waitForResumeIfPaused();
    currentStep = 'Inspection Scheduling';
    currentAssignee = 'Inspection Department';
    progress = 80;
    
    const inspection = await scheduleInspection(application);
    if (!inspection.passed) {
      return { status: 'rejected', reason: 'Inspection failed' };
    }

    // Step 5: Final Approval
    await waitForResumeIfPaused();
    currentStep = 'Final Approval';
    currentAssignee = 'Planning Director';
    progress = 100;
    
    const finalApproval = await finalizeRegistration(application, inspection);
    
    return { 
      status: 'approved', 
      registrationId: finalApproval.id,
      approvedAt: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`TVR Registration workflow failed: ${error.message}`);
  }
}

// Signal handlers
updatePrioritySignal.setHandler(async (newPriority: string, reason: string) => {
  priority = newPriority;
  console.log(`Priority updated to ${newPriority}: ${reason}`);
});

pauseSignal.setHandler(async () => {
  isPaused = true;
  console.log('Workflow paused');
});

resumeSignal.setHandler(async () => {
  isPaused = false;
  console.log('Workflow resumed');
});

// Helper function to handle pausing
async function waitForResumeIfPaused(): Promise<void> {
  while (isPaused) {
    await workflow.sleep('1 second');
  }
}
```

### 5. Activity Implementation Example

```typescript
// src/temporal/activities/tvr-activities.ts
import { ApplicationFailure } from '@temporalio/workflow';

export interface InitialReviewResult {
  approved: boolean;
  reason?: string;
  reviewer?: string;
}

export interface ZoningVerificationResult {
  requiresNCUC: boolean;
  zone: string;
  verifiedBy: string;
}

export interface NCUCResult {
  approved: boolean;
  reason?: string;
  approvedBy?: string;
}

export interface InspectionResult {
  passed: boolean;
  reportId: string;
  inspector?: string;
  issues?: string[];
}

export interface FinalApprovalResult {
  id: string;
  approvedBy: string;
  approvedAt: string;
}

// Activities
export async function performInitialReview(application: TVRApplication): Promise<InitialReviewResult> {
  try {
    // Simulate API call to planning system
    console.log(`Performing initial review for application ${application.id}`);
    
    // Business logic for initial review
    const hasRequiredDocuments = await checkRequiredDocuments(application);
    const meetsBasicRequirements = await checkBasicRequirements(application);
    
    if (!hasRequiredDocuments) {
      return {
        approved: false,
        reason: 'Missing required documents'
      };
    }
    
    if (!meetsBasicRequirements) {
      return {
        approved: false,
        reason: 'Does not meet basic requirements'
      };
    }
    
    return {
      approved: true,
      reviewer: 'Planning Department'
    };
    
  } catch (error) {
    throw ApplicationFailure.nonRetryable(
      `Initial review failed: ${error.message}`,
      'INITIAL_REVIEW_ERROR'
    );
  }
}

export async function verifyZoning(propertyId: string): Promise<ZoningVerificationResult> {
  try {
    console.log(`Verifying zoning for property ${propertyId}`);
    
    // Call zoning service
    const zoningInfo = await getZoningInfo(propertyId);
    
    return {
      requiresNCUC: ['R-1', 'R-2', 'R-3'].includes(zoningInfo.zone),
      zone: zoningInfo.zone,
      verifiedBy: 'Zoning Officer'
    };
    
  } catch (error) {
    throw ApplicationFailure.nonRetryable(
      `Zoning verification failed: ${error.message}`,
      'ZONING_VERIFICATION_ERROR'
    );
  }
}

export async function processNCUC(application: TVRApplication): Promise<NCUCResult> {
  try {
    console.log(`Processing NCUC for application ${application.id}`);
    
    // Simulate NCUC processing
    const ncucApplication = await submitNCUCApplication(application);
    const ncucReview = await reviewNCUCApplication(ncucApplication.id);
    
    return {
      approved: ncucReview.approved,
      reason: ncucReview.reason,
      approvedBy: ncucReview.reviewedBy
    };
    
  } catch (error) {
    throw ApplicationFailure.nonRetryable(
      `NCUC processing failed: ${error.message}`,
      'NCUC_PROCESSING_ERROR'
    );
  }
}

export async function scheduleInspection(application: TVRApplication): Promise<InspectionResult> {
  try {
    console.log(`Scheduling inspection for application ${application.id}`);
    
    // Schedule inspection
    const inspection = await createInspection(application);
    const result = await conductInspection(inspection.id);
    
    return {
      passed: result.passed,
      reportId: result.reportId,
      inspector: result.inspector,
      issues: result.issues
    };
    
  } catch (error) {
    throw ApplicationFailure.nonRetryable(
      `Inspection scheduling failed: ${error.message}`,
      'INSPECTION_ERROR'
    );
  }
}

export async function finalizeRegistration(
  application: TVRApplication, 
  inspection: InspectionResult
): Promise<FinalApprovalResult> {
  try {
    console.log(`Finalizing registration for application ${application.id}`);
    
    // Generate registration
    const registration = await generateRegistration(application, inspection);
    
    return {
      id: registration.id,
      approvedBy: 'Planning Director',
      approvedAt: registration.approvedAt
    };
    
  } catch (error) {
    throw ApplicationFailure.nonRetryable(
      `Final approval failed: ${error.message}`,
      'FINAL_APPROVAL_ERROR'
    );
  }
}

// Helper functions (these would connect to your actual services)
async function checkRequiredDocuments(application: TVRApplication): Promise<boolean> {
  // Implementation would check document repository
  return true;
}

async function checkBasicRequirements(application: TVRApplication): Promise<boolean> {
  // Implementation would check business rules
  return true;
}

async function getZoningInfo(propertyId: string): Promise<any> {
  // Implementation would call zoning service
  return { zone: 'R-2' };
}

async function submitNCUCApplication(application: TVRApplication): Promise<any> {
  // Implementation would submit to NCUC system
  return { id: 'ncuc-001' };
}

async function reviewNCUCApplication(ncucId: string): Promise<any> {
  // Implementation would get NCUC review result
  return { approved: true, reviewedBy: 'Planning Commission' };
}

async function createInspection(application: TVRApplication): Promise<any> {
  // Implementation would create inspection record
  return { id: 'inspection-001' };
}

async function conductInspection(inspectionId: string): Promise<any> {
  // Implementation would conduct inspection
  return { passed: true, reportId: 'report-001', inspector: 'Inspector Smith' };
}

async function generateRegistration(
  application: TVRApplication, 
  inspection: InspectionResult
): Promise<any> {
  // Implementation would generate registration
  return { 
    id: `tvr-${Date.now()}`, 
    approvedAt: new Date().toISOString() 
  };
}
```

### 6. Worker Setup

```typescript
// src/temporal/worker.ts
import { Worker } from '@temporalio/worker';
import * as activities from './activities/tvr-activities';

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'tvr-registration-queue',
  });

  console.log('Worker started for task queue: tvr-registration-queue');
  
  await worker.run();
}

runWorker().catch((err) => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
```

### 7. Environment Configuration

```typescript
// src/config/temporal.ts
export const temporalConfig = {
  address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'tvr-registration-queue',
  clientTimeout: process.env.TEMPORAL_CLIENT_TIMEOUT || '30000',
  workflowExecutionTimeout: process.env.TEMPORAL_WORKFLOW_TIMEOUT || '2592000s', // 30 days
  workflowRunTimeout: process.env.TEMPORAL_WORKFLOW_RUN_TIMEOUT || '604800s', // 7 days
};
```

### 8. Docker Compose for Development

```yaml
# docker-compose.temporal.yml
version: '3.8'

services:
  temporal:
    image: temporalio/auto-setup:latest
    environment:
      - DB=postgresql
      - DB_PORT=5432
      - DB_HOST postgres
      - DB_USER temporal
      - DB_PASSWORD temporal
      - DB_NAME temporal
    ports:
      - "7233:7233"
    depends_on:
      - postgres
      - prometheus
      - grafana

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_USER=temporal
      - POSTGRES_PASSWORD=temporal
      - POSTGRES_DB=temporal
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  temporal-web:
    image: temporalio/web:latest
    environment:
      - TEMPORAL_ADDRESS=temporal:7233
    ports:
      - "8088:8088"
    depends_on:
      - temporal

volumes:
  postgres_data:
  grafana_data:
```

This comprehensive implementation provides everything needed to connect the UI components to Temporal workflows with proper error handling, monitoring, and scalability considerations.
