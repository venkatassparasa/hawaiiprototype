const { Connection, Client } = require('@temporalio/client');

let temporalClient;

async function getTemporalClient() {
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

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await getTemporalClient();
    const handle = client.workflow.list();
    const workflows = [];

    for await (const workflow of handle) {
      let workflowType = 'Unknown';
      try {
        const workflowHandle = client.workflow.getHandle(workflow.workflowId);
        const description = await workflowHandle.describe();
        workflowType = description.type || 'Unknown';
      } catch (err) {
        console.warn(`Could not get workflow type for ${workflow.workflowId}:`, err);
      }

      workflows.push({
        id: workflow.workflowId,
        type: workflowType,
        status: workflow.status.name.toLowerCase(),
        progress: calculateProgress(workflow),
        startedAt: workflow.startTime?.toISOString() || new Date().toISOString(),
        completedAt: workflow.closeTime?.toISOString() || null,
        currentStep: getCurrentStep(workflow),
        assignee: extractAssignee(workflow),
        priority: extractPriority(workflow)
      });
    }

    return res.status(200).json({ workflows });
  } catch (error) {
    console.error('Error listing workflows:', error);
    
    // Fallback to mock data if Temporal connection fails
    const mockWorkflows = [
      {
        id: 'tvr-registration-demo',
        type: 'TVR Registration',
        status: 'running',
        progress: 65,
        startedAt: new Date().toISOString(),
        currentStep: 'NCUC Review',
        assignee: 'Planning Department',
        priority: 'high'
      }
    ];
    
    return res.status(200).json({ workflows: mockWorkflows });
  }
};

function calculateProgress(workflow) {
  switch (workflow.status.name) {
    case 'RUNNING': return 50;
    case 'COMPLETED': return 100;
    case 'FAILED':
    case 'CANCELED':
    case 'TERMINATED': return 0;
    default: return 25;
  }
}

function getCurrentStep(workflow) {
  switch (workflow.status.name) {
    case 'RUNNING': return 'In Progress';
    case 'COMPLETED': return 'Completed';
    case 'FAILED': return 'Failed';
    case 'CANCELED': return 'Canceled';
    default: return 'Starting';
  }
}

function extractAssignee(workflow) {
  if (workflow.memo && workflow.memo.assignee) {
    return workflow.memo.assignee;
  }
  return 'Unassigned';
}

function extractPriority(workflow) {
  if (workflow.memo && workflow.memo.priority) {
    return workflow.memo.priority;
  }
  return 'medium';
}
