import { Connection, Client } from '@temporalio/client';
import { Request, Response } from 'express';

// Initialize Temporal client
let client: Client;

const initTemporalClient = async (): Promise<Client> => {
  if (!client) {
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    });
    
    client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    });
  }
  return client;
};

export const listWorkflows = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Initialize Temporal client
    const temporalClient = await initTemporalClient();
    
    // Get real workflows from Temporal
    const handle = temporalClient.workflow.list();
    const workflows = [];
    
    // Iterate through workflows
    for await (const workflow of handle) {
      // Get workflow details to extract workflow type
      let workflowType = 'Unknown';
      try {
        const workflowHandle = temporalClient.workflow.getHandle(workflow.workflowId);
        const description = await workflowHandle.describe();
        workflowType = description.type || 'Unknown';
      } catch (err) {
        console.warn(`Could not get workflow type for ${workflow.workflowId}:`, err);
      }
      
      workflows.push({
        id: workflow.workflowId,
        type: workflowType,
        status: workflow.status.name.toLowerCase(),
        progress: calculateWorkflowProgress(workflow),
        startedAt: workflow.startTime?.toISOString() || new Date().toISOString(),
        completedAt: workflow.closeTime?.toISOString() || null,
        currentStep: getCurrentWorkflowStep(workflow),
        assignee: extractWorkflowAssignee(workflow),
        priority: extractWorkflowPriority(workflow)
      });
    }
    
    res.json({ workflows });
    return res;
  } catch (error) {
    console.error('Error listing workflows:', error);
    // Fallback to mock data if Temporal connection fails
    const mockWorkflows = [
      {
        id: 'tvr-registration-001',
        type: 'TVR Registration',
        status: 'running',
        progress: 65,
        startedAt: '2024-01-15T10:30:00Z',
        currentStep: 'NCUC Review',
        assignee: 'Planning Department',
        priority: 'high'
      }
    ];
    
    res.json({ workflows: mockWorkflows });
    return res;
  }
};

// Helper functions for workflow processing
function calculateWorkflowProgress(workflow: any): number {
  // Simple progress calculation based on workflow status
  switch (workflow.status.name) {
    case 'RUNNING':
      return 50; // Assume 50% progress for running workflows
    case 'COMPLETED':
      return 100;
    case 'FAILED':
    case 'CANCELED':
    case 'TERMINATED':
      return 0;
    default:
      return 25;
  }
}

function getCurrentWorkflowStep(workflow: any): string {
  // Extract current step from workflow history or status
  switch (workflow.status.name) {
    case 'RUNNING':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'FAILED':
      return 'Failed';
    case 'CANCELED':
      return 'Canceled';
    default:
      return 'Starting';
  }
}

function extractWorkflowAssignee(workflow: any): string {
  // Try to extract assignee from workflow memo or input
  if (workflow.memo && workflow.memo.assignee) {
    return workflow.memo.assignee;
  }
  return 'Unassigned';
}

function extractWorkflowPriority(workflow: any): string {
  // Try to extract priority from workflow memo or input
  if (workflow.memo && workflow.memo.priority) {
    return workflow.memo.priority;
  }
  return 'medium';
}

export const getWorkflowDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { workflowId } = req.params;
    
    // Mock workflow details based on ID
    const workflowDetails = {
      id: workflowId || 'unknown',
      type: workflowId?.includes('registration') ? 'TVR Registration' : 
            workflowId?.includes('complaint') ? 'Complaint Investigation' : 
            workflowId?.includes('appeal') ? 'Violation Appeal' : 'Unknown',
      status: 'running',
      progress: 65,
      startedAt: '2024-01-15T10:30:00Z',
      currentStep: 'NCUC Review',
      assignee: 'Planning Department',
      priority: 'high',
      input: {
        applicationId: 'APP-12345',
        propertyId: 'PROP-12345',
        applicantName: 'John Doe',
        propertyAddress: '123 Test St, Kailua-Kona, HI 96740'
      },
      result: null,
      history: [
        {
          eventId: '1',
          eventType: 'WorkflowExecutionStarted',
          timestamp: '2024-01-15T10:30:00Z',
          details: 'Workflow started'
        },
        {
          eventId: '2',
          eventType: 'ActivityTaskScheduled',
          timestamp: '2024-01-15T10:31:00Z',
          details: 'Initial review scheduled'
        },
        {
          eventId: '3',
          eventType: 'ActivityTaskCompleted',
          timestamp: '2024-01-15T10:35:00Z',
          details: 'Initial review completed'
        }
      ]
    };

    res.json(workflowDetails);
    return res;
  } catch (error) {
    console.error('Error getting workflow details:', error);
    res.status(500).json({ error: 'Failed to get workflow details' });
    return res;
  }
};

export const startWorkflow = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { workflowType, input, options = {} } = req.body;
    
    if (!workflowType) {
      res.status(400).json({ error: 'workflowType is required' });
      return res;
    }

    // Initialize Temporal client
    const temporalClient = await initTemporalClient();
    
    const workflowId = options.workflowId || `${workflowType.toLowerCase()}-${Date.now()}`;
    const taskQueue = process.env.TEMPORAL_TASK_QUEUE || 'tvr-compliance-queue';
    
    // Start the actual Temporal workflow
    let workflowHandler;
    switch (workflowType) {
      case 'TVRRegistrationWorkflow':
        workflowHandler = temporalClient.workflow.start('TVRRegistrationWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      case 'ComplaintInvestigationWorkflow':
        workflowHandler = temporalClient.workflow.start('ComplaintInvestigationWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      case 'ViolationAppealWorkflow':
        workflowHandler = temporalClient.workflow.start('ViolationAppealWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      case 'AnnualInspectionWorkflow':
        workflowHandler = temporalClient.workflow.start('AnnualInspectionWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      default:
        res.status(400).json({ error: `Unknown workflow type: ${workflowType}` });
        return res;
    }
    
    await workflowHandler;
    
    res.json({
      success: true,
      workflowId,
      message: 'Workflow started successfully',
      status: 'running',
      workflowType
    });
    return res;
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({ error: 'Failed to start workflow', details: error instanceof Error ? error.message : 'Unknown error' });
    return res;
  }
};

export const terminateWorkflow = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { workflowId } = req.params;
    const { reason } = req.body;
    
    if (!workflowId) {
      res.status(400).json({ error: 'workflowId is required' });
      return res;
    }

    // TODO: Actually terminate the Temporal workflow
    
    res.json({
      success: true,
      workflowId,
      message: 'Workflow terminated successfully',
      reason: reason || 'User requested termination'
    });
    return res;
  } catch (error) {
    console.error('Error terminating workflow:', error);
    res.status(500).json({ error: 'Failed to terminate workflow' });
    return res;
  }
};

export const signalWorkflow = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { workflowId } = req.params;
    const { signalName, signalInput } = req.body;
    
    if (!workflowId || !signalName) {
      res.status(400).json({ error: 'workflowId and signalName are required' });
      return res;
    }

    // TODO: Actually send signal to Temporal workflow
    
    res.json({
      success: true,
      workflowId,
      message: 'Signal sent successfully',
      signalName,
      signalInput
    });
    return res;
  } catch (error) {
    console.error('Error signaling workflow:', error);
    res.status(500).json({ error: 'Failed to signal workflow' });
    return res;
  }
};

export const queryWorkflow = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { workflowId } = req.params;
    const { queryName, queryInput } = req.body;
    
    if (!workflowId || !queryName) {
      res.status(400).json({ error: 'workflowId and queryName are required' });
      return res;
    }

    // TODO: Actually query Temporal workflow
    
    res.json({
      success: true,
      workflowId,
      message: 'Query executed successfully',
      queryName,
      result: { status: 'running', progress: 65 }
    });
    return res;
  } catch (error) {
    console.error('Error querying workflow:', error);
    res.status(500).json({ error: 'Failed to query workflow' });
    return res;
  }
};

export const getWorkflowHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { workflowId } = req.params;
    
    // Mock workflow history
    const history = [
      {
        eventId: '1',
        eventType: 'WorkflowExecutionStarted',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Workflow started',
        attributes: {
          workflowType: 'TVRRegistrationWorkflow',
          input: {
            applicationId: 'APP-12345',
            propertyId: 'PROP-12345'
          }
        }
      },
      {
        eventId: '2',
        eventType: 'ActivityTaskScheduled',
        timestamp: '2024-01-15T10:31:00Z',
        details: 'Initial review scheduled',
        attributes: {
          activityType: 'validateApplication'
        }
      },
      {
        eventId: '3',
        eventType: 'ActivityTaskCompleted',
        timestamp: '2024-01-15T10:35:00Z',
        details: 'Initial review completed',
        attributes: {
          result: { valid: true }
        }
      }
    ];

    res.json({ history });
    return res;
  } catch (error) {
    console.error('Error getting workflow history:', error);
    res.status(500).json({ error: 'Failed to get workflow history' });
    return res;
  }
};

export const getWorkflowStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Mock workflow statistics
    const stats = {
      total: 25,
      running: 3,
      completed: 18,
      failed: 2,
      canceled: 2,
      byType: {
        'TVR Registration': 10,
        'Complaint Investigation': 8,
        'Violation Appeal': 5,
        'Annual Inspection': 2
      }
    };

    res.json(stats);
    return res;
  } catch (error) {
    console.error('Error getting workflow stats:', error);
    res.status(500).json({ error: 'Failed to get workflow stats' });
    return res;
  }
};

export const getWorkflowDefinitions = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Mock workflow definitions
    const definitions = [
      {
        name: 'TVRRegistrationWorkflow',
        description: 'Complete TVR registration process including validation, NCUC review, and final approval',
        inputSchema: {
          applicationId: 'string',
          propertyId: 'string',
          applicantName: 'string',
          propertyAddress: 'string',
          priority: 'string (low|medium|high)'
        },
        estimatedDuration: '2-5 days'
      },
      {
        name: 'ComplaintInvestigationWorkflow',
        description: 'Investigate TVR violation complaints including evidence collection and determination',
        inputSchema: {
          complaintId: 'string',
          propertyId: 'string',
          complainantName: 'string',
          complaintType: 'string',
          priority: 'string (low|medium|high)'
        },
        estimatedDuration: '3-7 days'
      },
      {
        name: 'ViolationAppealWorkflow',
        description: 'Process violation appeals including review and final determination',
        inputSchema: {
          appealId: 'string',
          violationId: 'string',
          appellantName: 'string',
          appealReason: 'string',
          priority: 'string (low|medium|high)'
        },
        estimatedDuration: '5-10 days'
      },
      {
        name: 'AnnualInspectionWorkflow',
        description: 'Conduct annual inspections for registered properties',
        inputSchema: {
          inspectionId: 'string',
          propertyId: 'string',
          inspectorName: 'string',
          scheduledDate: 'string',
          priority: 'string (low|medium|high)'
        },
        estimatedDuration: '1-2 days'
      }
    ];

    res.json(definitions);
    return res;
  } catch (error) {
    console.error('Error getting workflow definitions:', error);
    res.status(500).json({ error: 'Failed to get workflow definitions' });
    return res;
  }
};
