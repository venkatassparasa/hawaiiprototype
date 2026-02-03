import { Router } from 'express';
import {
  listWorkflows,
  getWorkflowDetails,
  startWorkflow,
  terminateWorkflow,
  signalWorkflow,
  queryWorkflow,
  getWorkflowHistory,
  getWorkflowStats,
  getWorkflowDefinitions
} from '../controllers/temporalControllerWorking';

const router = Router();

// Workflow Management Routes
router.get('/workflows', listWorkflows);
router.get('/workflows/:workflowId', getWorkflowDetails);
router.post('/workflows/start', startWorkflow);
router.post('/workflows/:workflowId/terminate', terminateWorkflow);
router.post('/workflows/:workflowId/signal', signalWorkflow);
router.post('/workflows/:workflowId/query', queryWorkflow);
router.get('/workflows/:workflowId/history', getWorkflowHistory);

// Statistics and Monitoring Routes
router.get('/stats', getWorkflowStats);

// Workflow Definitions Routes
router.get('/workflow-definitions', getWorkflowDefinitions);

export default router;
