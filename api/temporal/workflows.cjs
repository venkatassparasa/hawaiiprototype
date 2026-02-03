const https = require('https');

// Configuration
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080';

async function fetchFromWorker(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, WORKER_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-API'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
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
    console.log(`🔄 Fetching workflows from worker: ${WORKER_URL}`);
    
    // Try to get workflows from our Java worker
    const workerResponse = await fetchFromWorker('/api/temporal/workflows');
    
    if (workerResponse.workflows) {
      // Transform worker data to match frontend expectations
      const transformedWorkflows = workerResponse.workflows.map(workflow => ({
        id: workflow.workflowId,
        type: workflow.workflowType.replace('Workflow', ''),
        status: workflow.status.toLowerCase(),
        progress: calculateProgress(workflow.status),
        startedAt: workflow.startTime,
        completedAt: workflow.endTime || null,
        currentStep: getCurrentStep(workflow.status),
        assignee: extractAssignee(workflow),
        priority: extractPriority(workflow),
        input: workflow.input
      }));

      console.log(`✅ Successfully fetched ${transformedWorkflows.length} workflows from worker`);
      return res.status(200).json({ workflows: transformedWorkflows });
    }
  } catch (error) {
    console.error('❌ Error fetching from worker:', error.message);
    
    // Fallback to mock data if worker is unavailable
    console.log('🔄 Using fallback mock data');
    const mockWorkflows = [
      {
        id: 'tvr-registration-demo',
        type: 'TVR Registration',
        status: 'running',
        progress: 65,
        startedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        currentStep: 'NCUC Review',
        assignee: 'Planning Department',
        priority: 'high',
        input: {
          applicationId: 'APP-001',
          propertyId: 'PROP-001',
          applicantName: 'John Doe'
        }
      },
      {
        id: 'complaint-investigation-demo',
        type: 'Complaint Investigation',
        status: 'completed',
        progress: 100,
        startedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        completedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        currentStep: 'Completed',
        assignee: 'Compliance Officer',
        priority: 'medium',
        input: {
          complaintId: 'COMP-001',
          priority: 2
        }
      },
      {
        id: 'violation-appeal-demo',
        type: 'Violation Appeal',
        status: 'pending',
        progress: 25,
        startedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        currentStep: 'Document Review',
        assignee: 'Legal Department',
        priority: 'low',
        input: {
          appealId: 'APPEAL-001'
        }
      }
    ];
    
    return res.status(200).json({ workflows: mockWorkflows });
  }
};

function calculateProgress(status) {
  switch (status.toUpperCase()) {
    case 'RUNNING': return 50;
    case 'COMPLETED': return 100;
    case 'FAILED':
    case 'CANCELED':
    case 'TERMINATED': return 0;
    default: return 25;
  }
}

function getCurrentStep(status) {
  switch (status.toUpperCase()) {
    case 'RUNNING': return 'In Progress';
    case 'COMPLETED': return 'Completed';
    case 'FAILED': return 'Failed';
    case 'CANCELED': return 'Canceled';
    default: return 'Starting';
  }
}

function extractAssignee(workflow) {
  // Try to extract assignee from workflow input or use defaults
  if (workflow.input && workflow.input.applicantName) {
    return 'Processing Department';
  }
  if (workflow.workflowType && workflow.workflowType.includes('TVR')) {
    return 'Planning Department';
  }
  if (workflow.workflowType && workflow.workflowType.includes('Complaint')) {
    return 'Compliance Officer';
  }
  if (workflow.workflowType && workflow.workflowType.includes('Appeal')) {
    return 'Legal Department';
  }
  return 'Unassigned';
}

function extractPriority(workflow) {
  // Try to extract priority from workflow input
  if (workflow.input && workflow.input.priority) {
    return workflow.input.priority === 1 ? 'high' : workflow.input.priority === 2 ? 'medium' : 'low';
  }
  if (workflow.workflowType && workflow.workflowType.includes('TVR')) {
    return 'high';
  }
  return 'medium';
}
