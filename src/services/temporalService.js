import axios from 'axios';

// Temporal API configuration
const TEMPORAL_CONFIG = {
  // For Vercel deployment
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://temporal.production.com'
    : 'http://localhost:8080',  // Temporal UI HTTP API for local dev
  
  // Backend API that proxies to Temporal
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? '/api/temporal'  // Vercel serverless functions
    : 'http://localhost:3010/api/temporal',  // Local API server
  
  NAMESPACE: 'default'
};

class TemporalWorkflowService {
  constructor() {
    this.client = axios.create({
      baseURL: TEMPORAL_CONFIG.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Workflow Management
  async listWorkflows(filters = {}) {
    try {
      const response = await this.client.get('/workflows', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to list workflows:', error);
      throw this.handleError(error);
    }
  }

  async getWorkflowDetails(workflowId) {
    try {
      const response = await this.client.get(`/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get workflow details:', error);
      throw this.handleError(error);
    }
  }

  async startWorkflow(workflowType, input, options = {}) {
    try {
      const response = await this.client.post('/workflows/start', {
        workflowType,
        input,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to start workflow:', error);
      throw this.handleError(error);
    }
  }

  async terminateWorkflow(workflowId, reason) {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/terminate`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Failed to terminate workflow:', error);
      throw this.handleError(error);
    }
  }

  async signalWorkflow(workflowId, signalName, data) {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/signal`, {
        signalName,
        signalInput: data
      });
      return response.data;
    } catch (error) {
      console.error('Failed to signal workflow:', error);
      throw this.handleError(error);
    }
  }

  async queryWorkflow(workflowId, queryType, args = {}) {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/query`, {
        queryName: queryType,
        queryInput: args
      });
      return response.data;
    } catch (error) {
      console.error('Failed to query workflow:', error);
      throw this.handleError(error);
    }
  }

  async getWorkflowHistory(workflowId) {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/history`);
      return response.data;
    } catch (error) {
      console.error('Failed to get workflow history:', error);
      throw this.handleError(error);
    }
  }

  // Task Queue Management
  async listTaskQueues() {
    try {
      const response = await this.client.get('/task-queues');
      return response.data;
    } catch (error) {
      console.error('Failed to list task queues:', error);
      throw this.handleError(error);
    }
  }

  // Workflow Templates/Definitions
  async getWorkflowDefinitions() {
    try {
      const response = await this.client.get('/workflow-definitions');
      return response.data;
    } catch (error) {
      console.error('Failed to get workflow definitions:', error);
      throw this.handleError(error);
    }
  }

  async createWorkflowDefinition(definition) {
    try {
      const response = await this.client.post('/workflow-definitions', definition);
      return response.data;
    } catch (error) {
      console.error('Failed to create workflow definition:', error);
      throw this.handleError(error);
    }
  }

  // Statistics and Monitoring
  async getWorkflowStats(timeRange = '24h') {
    try {
      const response = await this.client.get('/stats', { 
        params: { timeRange } 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get workflow stats:', error);
      throw this.handleError(error);
    }
  }

  // Real-time updates (WebSocket)
  subscribeToWorkflowUpdates(workflowId, callback) {
    const wsUrl = `${TEMPORAL_CONFIG.API_BASE_URL.replace('http', 'ws')}/workflows/${workflowId}/subscribe`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`Connected to workflow updates for ${workflowId}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log(`Disconnected from workflow updates for ${workflowId}`);
    };

    return ws;
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Authentication required. Please log in.');
        case 403:
          return new Error('Insufficient permissions to access this resource.');
        case 404:
          return new Error('Workflow not found.');
        case 409:
          return new Error('Workflow already exists or conflict detected.');
        case 429:
          return new Error('Too many requests. Please try again later.');
        case 500:
          return new Error('Internal server error. Please try again later.');
        default:
          return new Error(data.message || `Server error: ${status}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }

  // Utility methods
  formatWorkflowStatus(status) {
    const statusMap = {
      'RUNNING': 'running',
      'COMPLETED': 'completed',
      'FAILED': 'failed',
      'CANCELED': 'canceled',
      'TERMINATED': 'terminated',
      'CONTINUED_AS_NEW': 'continued',
      'TIMED_OUT': 'timeout'
    };
    return statusMap[status] || status.toLowerCase();
  }

  formatWorkflowType(workflowType) {
    // Convert CamelCase to readable format
    return workflowType
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  calculateProgress(workflow) {
    if (!workflow.history || !workflow.history.events) {
      return 0;
    }

    const events = workflow.history.events;
    const totalEvents = events.length;
    const completedEvents = events.filter(event => 
      event.eventType === 'WorkflowExecutionCompleted' ||
      event.eventType === 'ActivityTaskCompleted'
    ).length;

    return Math.min(100, Math.round((completedEvents / totalEvents) * 100));
  }

  estimateTimeRemaining(workflow) {
    if (!workflow.startedAt) return null;

    const started = new Date(workflow.startedAt);
    const now = new Date();
    const elapsed = now - started;
    
    // Use historical data or workflow type averages
    const averages = {
      'TVRRegistrationWorkflow': 14 * 24 * 60 * 60 * 1000, // 14 days
      'ComplaintInvestigationWorkflow': 7 * 24 * 60 * 60 * 1000, // 7 days
      'ViolationAppealWorkflow': 21 * 24 * 60 * 60 * 1000, // 21 days
      'AnnualInspectionWorkflow': 3 * 24 * 60 * 60 * 1000, // 3 days
    };

    const estimated = averages[workflow.workflowType] || 7 * 24 * 60 * 60 * 1000;
    const remaining = estimated - elapsed;
    
    return remaining > 0 ? new Date(now.getTime() + remaining) : null;
  }
}

// Create singleton instance
const temporalService = new TemporalWorkflowService();

export default temporalService;
