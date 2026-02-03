import { Request, Response } from 'express';
import { Connection, Client } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import * as activities from '../activities';
import { TVRRegistrationWorkflow, ComplaintInvestigationWorkflow, ViolationAppealWorkflow, AnnualInspectionWorkflow } from '../workflows';

// Temporal client connection
let temporalClient: Client | null = null;
let worker: Worker | null = null;

// Initialize Temporal client
async function initTemporalClient() {
  if (!temporalClient) {
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    });
    
    temporalClient = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    });
  }
  return temporalClient;
}

// Initialize Temporal worker
async function initWorker() {
  if (!worker) {
    worker = await Worker.create({
      connection: await Connection.connect({
        address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
      }),
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      taskQueue: 'tvr-compliance-queue',
      workflowsPath: require.resolve('../workflows'),
      activities,
    });
    
    worker.run().catch((err) => {
      console.error('Worker error:', err);
    });
  }
  return worker;
}

// Controller methods
export const listWorkflows = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { status, workflowType, limit = 50, nextPageToken } = req.query;

    const workflows = await client.workflow.list({
      query: status ? `WorkflowExecutionStatus = "${status}"` : undefined,
      pageSize: parseInt(limit as string),
      nextPageToken: nextPageToken as string,
    });

    const formattedWorkflows = workflows.executions.map(exec => ({
      id: exec.workflowId,
      type: exec.workflowType,
      status: exec.status?.toLowerCase() || 'unknown',
      progress: calculateProgress(exec),
      startedAt: exec.startTime,
      completedAt: exec.closeTime,
      currentStep: getCurrentStep(exec),
      assignee: getAssignee(exec),
      priority: getPriority(exec),
      input: exec.input,
      result: exec.result,
      error: exec.error,
    }));

    res.json({
      workflows: formattedWorkflows,
      nextPageToken: workflows.nextPageToken,
    });
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({ error: 'Failed to list workflows' });
  }
};

export const getWorkflowDetails = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { workflowId } = req.params;

    const handle = client.workflow.getHandle(workflowId);
    const description = await handle.describe();
    const history = await handle.fetchHistory();

    const workflowDetails = {
      id: description.workflowExecution?.workflowId,
      type: description.workflowType?.name,
      status: description.workflowExecutionInfo?.status?.toLowerCase() || 'unknown',
      progress: calculateProgress(description),
      startedAt: description.workflowExecutionInfo?.startTime,
      completedAt: description.workflowExecutionInfo?.closeTime,
      currentStep: getCurrentStep(description),
      assignee: getAssignee(description),
      priority: getPriority(description),
      input: description.workflowExecutionInfo?.input,
      result: description.workflowExecutionInfo?.result,
      error: description.workflowExecutionInfo?.error,
      history: history.events,
    };

    res.json(workflowDetails);
  } catch (error) {
    console.error('Error getting workflow details:', error);
    res.status(500).json({ error: 'Failed to get workflow details' });
  }
};

export const startWorkflow = async (req: Request, res: Response): Promise<Response> => {
  try {
    const client = await initTemporalClient();
    const { workflowType, input, options = {} } = req.body;

    const workflowId = options.workflowId || `${workflowType.toLowerCase()}-${Date.now()}`;
    const taskQueue = options.taskQueue || 'tvr-compliance-queue';

    let workflowHandler;
    switch (workflowType) {
      case 'TVRRegistrationWorkflow':
        workflowHandler = client.workflow.start(TVRRegistrationWorkflow, {
          workflowId,
          taskQueue,
          args: [input],
        });
        break;
      case 'ComplaintInvestigationWorkflow':
        workflowHandler = client.workflow.start(ComplaintInvestigationWorkflow, {
          workflowId,
          taskQueue,
          args: [input],
        });
        break;
      case 'ViolationAppealWorkflow':
        workflowHandler = client.workflow.start(ViolationAppealWorkflow, {
          workflowId,
          taskQueue,
          args: [input],
        });
        break;
      case 'AnnualInspectionWorkflow':
        workflowHandler = client.workflow.start(AnnualInspectionWorkflow, {
          workflowId,
          taskQueue,
          args: [input],
        });
        break;
      default:
        return res.status(400).json({ error: 'Unknown workflow type' });
    }

    const result = await workflowHandler;

    res.json({
      workflowId,
      workflowType,
      status: 'started',
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({ error: 'Failed to start workflow' });
  }
};

export const terminateWorkflow = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { workflowId } = req.params;
    const { reason } = req.body;

    const handle = client.workflow.getHandle(workflowId);
    await handle.terminate(reason);

    res.json({
      workflowId,
      status: 'terminated',
      terminatedAt: new Date().toISOString(),
      reason,
    });
  } catch (error) {
    console.error('Error terminating workflow:', error);
    res.status(500).json({ error: 'Failed to terminate workflow' });
  }
};

export const signalWorkflow = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { workflowId } = req.params;
    const { signalName, data } = req.body;

    const handle = client.workflow.getHandle(workflowId);
    await handle.signal(signalName, data);

    res.json({
      workflowId,
      signalName,
      status: 'signaled',
      signaledAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error signaling workflow:', error);
    res.status(500).json({ error: 'Failed to signal workflow' });
  }
};

export const queryWorkflow = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { workflowId } = req.params;
    const { queryType, args = {} } = req.body;

    const handle = client.workflow.getHandle(workflowId);
    const result = await handle.query(queryType, args);

    res.json({
      workflowId,
      queryType,
      result,
      queriedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error querying workflow:', error);
    res.status(500).json({ error: 'Failed to query workflow' });
  }
};

export const getWorkflowHistory = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { workflowId } = req.params;

    const handle = client.workflow.getHandle(workflowId);
    const history = await handle.fetchHistory();

    res.json({
      workflowId,
      history: history.events,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting workflow history:', error);
    res.status(500).json({ error: 'Failed to get workflow history' });
  }
};

export const getWorkflowStats = async (req: Request, res: Response) => {
  try {
    const client = await initTemporalClient();
    const { timeRange = '24h' } = req.query;

    // Get workflow statistics
    const workflows = await client.workflow.list({
      query: `CloseTime > "${new Date(Date.now() - parseTimeRange(timeRange as string)).toISOString()}"`,
    });

    const stats = {
      total: workflows.executions.length,
      running: workflows.executions.filter(w => w.status === 'RUNNING').length,
      completed: workflows.executions.filter(w => w.status === 'COMPLETED').length,
      failed: workflows.executions.filter(w => w.status === 'FAILED').length,
      canceled: workflows.executions.filter(w => w.status === 'CANCELED').length,
      timeRange,
      generatedAt: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting workflow stats:', error);
    res.status(500).json({ error: 'Failed to get workflow stats' });
  }
};

export const getWorkflowDefinitions = async (req: Request, res: Response) => {
  try {
    const definitions = [
      {
        id: 'tvr-registration',
        name: 'TVR Registration Workflow',
        description: 'Complete TVR registration process including NCUC approval',
        estimatedDuration: '2-10 weeks',
        steps: [
          'Application Submitted',
          'Initial Review',
          'Zoning Verification',
          'NCUC Processing',
          'NCUC Review',
          'Inspection Scheduling',
          'Final Approval',
        ],
        triggers: ['webhook', 'manual'],
        inputSchema: {
          type: 'object',
          properties: {
            applicationId: { type: 'string' },
            propertyId: { type: 'string' },
            applicantName: { type: 'string' },
            propertyAddress: { type: 'string' },
            zoningCode: { type: 'string' },
            requiresNCUC: { type: 'boolean' },
          },
          required: ['applicationId', 'propertyId', 'applicantName', 'propertyAddress'],
        },
      },
      {
        id: 'complaint-investigation',
        name: 'Complaint Investigation Workflow',
        description: 'Investigate TVR violation complaints',
        estimatedDuration: '1-4 weeks',
        steps: [
          'Complaint Received',
          'Initial Assessment',
          'Evidence Collection',
          'Site Visit',
          'Investigation Report',
          'Violation Determination',
          'Notice Generation',
        ],
        triggers: ['webhook', 'manual'],
        inputSchema: {
          type: 'object',
          properties: {
            complaintId: { type: 'string' },
            propertyId: { type: 'string' },
            complainantName: { type: 'string' },
            complaintType: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          },
          required: ['complaintId', 'propertyId', 'complainantName', 'complaintType'],
        },
      },
      // Add more workflow definitions as needed
    ];

    res.json(definitions);
  } catch (error) {
    console.error('Error getting workflow definitions:', error);
    res.status(500).json({ error: 'Failed to get workflow definitions' });
  }
};

function parseTimeRange(timeRange: string): number {
  const units: { [key: string]: number } = {
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000,
    'w': 7 * 24 * 60 * 60 * 1000,
    'm': 30 * 24 * 60 * 60 * 1000,
  };

  const match = timeRange.match(/^(\d+)([hdwm])$/);
  if (match) {
    const [, value, unit] = match;
    return parseInt(value) * units[unit];
  }

  return 24 * 60 * 60 * 1000; // Default to 24 hours
}

// Initialize worker on startup
initWorker().catch(console.error);
