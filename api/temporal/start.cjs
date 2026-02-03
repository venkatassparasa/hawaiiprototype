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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflowType, input, options = {} } = req.body;
    
    if (!workflowType) {
      return res.status(400).json({ error: 'workflowType is required' });
    }

    const client = await getTemporalClient();
    const workflowId = options.workflowId || `${workflowType.toLowerCase()}-${Date.now()}`;
    const taskQueue = process.env.TEMPORAL_TASK_QUEUE || 'tvr-compliance-queue';
    
    // Start the actual Temporal workflow
    let workflowHandler;
    switch (workflowType) {
      case 'TVRRegistrationWorkflow':
        workflowHandler = client.workflow.start('TVRRegistrationWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      case 'ComplaintInvestigationWorkflow':
        workflowHandler = client.workflow.start('ComplaintInvestigationWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      case 'ViolationAppealWorkflow':
        workflowHandler = client.workflow.start('ViolationAppealWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      case 'AnnualInspectionWorkflow':
        workflowHandler = client.workflow.start('AnnualInspectionWorkflow', {
          workflowId,
          taskQueue,
          args: [input]
        });
        break;
      default:
        return res.status(400).json({ error: `Unknown workflow type: ${workflowType}` });
    }
    
    await workflowHandler;
    
    return res.status(200).json({
      success: true,
      workflowId,
      message: 'Workflow started successfully',
      status: 'running',
      workflowType
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    return res.status(500).json({ 
      error: 'Failed to start workflow', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
