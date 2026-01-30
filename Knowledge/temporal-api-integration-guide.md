# Temporal API Integration Guide

## Overview
This guide provides detailed instructions for integrating the TVR Compliance Dashboard UI components with Temporal workflows, including API endpoints, JSON payloads, and OpenAPI specifications.

## Architecture Overview

```
Frontend (React) → Backend API → Temporal Client → Temporal Server
     ↓                    ↓               ↓               ↓
UI Components → REST APIs → Workflow Client → Workflow Execution
```

## API Endpoints

### 1. Workflow Management APIs

#### List Workflows
```http
GET /api/temporal/workflows
```

**Query Parameters:**
- `status` (optional): Filter by workflow status (running, completed, failed, paused, waiting)
- `type` (optional): Filter by workflow type (tvr-registration, complaint-investigation, etc.)
- `assignee` (optional): Filter by assignee
- `priority` (optional): Filter by priority (low, medium, high, critical)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term for workflow ID or type

**Response:**
```json
{
  "success": true,
  "data": {
    "workflows": [
      {
        "id": "tvr-registration-001",
        "type": "tvr-registration",
        "status": "running",
        "progress": 65,
        "startedAt": "2024-01-15T10:30:00Z",
        "estimatedCompletion": "2024-02-20T17:00:00Z",
        "currentStep": "NCUC Review",
        "assignee": "Planning Department",
        "priority": "high",
        "input": {
          "applicationId": "APP-2024-001",
          "propertyId": "PROP-001",
          "applicantId": "USER-001"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### Get Workflow Details
```http
GET /api/temporal/workflows/{workflowId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tvr-registration-001",
    "type": "tvr-registration",
    "status": "running",
    "progress": 65,
    "startedAt": "2024-01-15T10:30:00Z",
    "estimatedCompletion": "2024-02-20T17:00:00Z",
    "currentStep": "NCUC Review",
    "assignee": "Planning Department",
    "priority": "high",
    "input": {
      "applicationId": "APP-2024-001",
      "propertyId": "PROP-001",
      "applicantId": "USER-001",
      "property": {
        "address": "123-4567 Kamehameha Hwy, Kailua-Kona, HI 96740",
        "tmk": "3-4-005-025-0000",
        "owner": "John Doe",
        "zone": "R-2"
      }
    },
    "result": null,
    "error": null,
    "history": [
      {
        "eventId": 1,
        "eventType": "WorkflowExecutionStarted",
        "timestamp": "2024-01-15T10:30:00Z",
        "details": {
          "workflowType": "TVRRegistrationWorkflow",
          "taskQueue": "tvr-registration-queue"
        }
      },
      {
        "eventId": 2,
        "eventType": "ActivityTaskScheduled",
        "timestamp": "2024-01-15T10:30:05Z",
        "details": {
          "activityType": "InitialReview",
          "assignee": "Planning Department"
        }
      }
    ],
    "activities": [
      {
        "id": 1,
        "name": "Application Submitted",
        "type": "manual",
        "status": "completed",
        "assignee": "John Doe",
        "duration": "5 minutes",
        "startedAt": "2024-01-15T10:30:00Z",
        "completedAt": "2024-01-15T10:35:00Z",
        "result": {
          "approved": true,
          "reviewer": "Planning Department"
        }
      }
    ]
  }
}
```

#### Start New Workflow
```http
POST /api/temporal/workflows/start
```

**Request Body:**
```json
{
  "workflowType": "tvr-registration",
  "workflowId": "tvr-registration-002",
  "taskQueue": "tvr-registration-queue",
  "input": {
    "applicationId": "APP-2024-002",
    "propertyId": "PROP-002",
    "applicantId": "USER-002",
    "priority": "medium",
    "property": {
      "address": "456-7890 Alii Dr, Kailua-Kona, HI 96740",
      "tmk": "3-4-005-026-0000",
      "owner": "Jane Smith",
      "zone": "R-1"
    },
    "configuration": {
      "requiresNCUC": true,
      "inspectionType": "annual",
      "expeditedProcessing": false
    }
  },
  "options": {
    "executionTimeout": "2592000s", // 30 days
    "runTimeout": "604800s", // 7 days
    "retryPolicy": {
      "maximumAttempts": 3,
      "initialInterval": "1s",
      "maximumInterval": "60s",
      "backoffCoefficient": 2.0
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workflowId": "tvr-registration-002",
    "executionId": "1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
    "runId": "run-123456789",
    "status": "running",
    "startedAt": "2024-01-20T14:30:00Z"
  }
}
```

#### Signal Workflow
```http
POST /api/temporal/workflows/{workflowId}/signal
```

**Request Body:**
```json
{
  "signalName": "updatePriority",
  "input": {
    "priority": "high",
    "reason": "Expedited processing requested by applicant",
    "requestedBy": "admin-user"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signalSent": true,
    "timestamp": "2024-01-20T15:00:00Z"
  }
}
```

#### Pause/Resume Workflow
```http
POST /api/temporal/workflows/{workflowId}/pause
POST /api/temporal/workflows/{workflowId}/resume
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "paused",
    "timestamp": "2024-01-20T15:30:00Z"
  }
}
```

#### Terminate Workflow
```http
DELETE /api/temporal/workflows/{workflowId}
```

**Request Body:**
```json
{
  "reason": "Application withdrawn by applicant",
  "terminatedBy": "admin-user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "terminated",
    "timestamp": "2024-01-20T16:00:00Z"
  }
}
```

### 2. Workflow Builder APIs

#### Get Workflow Templates
```http
GET /api/temporal/workflows/templates
```

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "tvr-registration",
        "name": "TVR Registration",
        "description": "Complete TVR registration process",
        "category": "registration",
        "estimatedDuration": "2-10 weeks",
        "steps": [
          {
            "id": "application-submitted",
            "name": "Application Submitted",
            "type": "manual",
            "required": true,
            "assignee": "Applicant",
            "duration": "5 minutes"
          }
        ]
      }
    ]
  }
}
```

#### Save Workflow Definition
```http
POST /api/temporal/workflows/definitions
```

**Request Body:**
```json
{
  "name": "Custom TVR Registration",
  "type": "custom-tvr-registration",
  "description": "Customized TVR registration workflow",
  "priority": "medium",
  "steps": [
    {
      "id": "step-1",
      "name": "Application Submitted",
      "type": "manual",
      "assignee": "Applicant",
      "duration": "5 minutes",
      "description": "Initial TVR registration application",
      "required": true,
      "configuration": {
        "formId": "tvr-application-form",
        "validationRules": ["required-fields", "zoning-check"]
      }
    }
  ],
  "triggers": [
    {
      "id": "trigger-1",
      "name": "Application Received",
      "type": "webhook",
      "description": "Triggered when new TVR application is submitted",
      "enabled": true,
      "configuration": {
        "endpoint": "/webhooks/tvr-application",
        "authentication": "jwt"
      }
    }
  ],
  "notifications": [
    {
      "id": "notif-1",
      "event": "workflow_started",
      "recipients": ["applicant", "planning_dept"],
      "method": ["email", "sms"],
      "template": "workflow-started-template"
    }
  ],
  "temporal": {
    "workflowType": "CustomTVRRegistrationWorkflow",
    "taskQueue": "custom-tvr-registration-queue",
    "executionTimeout": "2592000s",
    "runTimeout": "604800s"
  }
}
```

### 3. Activity APIs

#### Get Activity Status
```http
GET /api/temporal/activities/{activityId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "activity-001",
    "workflowId": "tvr-registration-001",
    "name": "Initial Review",
    "type": "manual",
    "status": "completed",
    "assignee": "Planning Department",
    "startedAt": "2024-01-15T10:35:00Z",
    "completedAt": "2024-01-15T12:35:00Z",
    "duration": "2 hours",
    "input": {
      "applicationId": "APP-2024-001",
      "reviewType": "initial"
    },
    "result": {
      "approved": true,
      "reviewerId": "reviewer-001",
      "comments": "Application complete and meets requirements"
    }
  }
}
```

#### Complete Activity
```http
POST /api/temporal/activities/{activityId}/complete
```

**Request Body:**
```json
{
  "result": {
    "approved": true,
    "reviewerId": "reviewer-002",
    "comments": "All documents verified and approved",
    "nextSteps": ["Proceed to zoning verification"]
  }
}
```

## Frontend Integration Examples

### 1. Workflow Service Class

```typescript
// src/services/temporalWorkflowService.ts
import axios from 'axios';

export class TemporalWorkflowService {
  private baseURL = '/api/temporal';

  async listWorkflows(filters?: WorkflowFilters): Promise<WorkflowListResponse> {
    const response = await axios.get(`${this.baseURL}/workflows`, {
      params: filters
    });
    return response.data;
  }

  async getWorkflowDetails(workflowId: string): Promise<WorkflowDetails> {
    const response = await axios.get(`${this.baseURL}/workflows/${workflowId}`);
    return response.data.data;
  }

  async startWorkflow(request: StartWorkflowRequest): Promise<StartWorkflowResponse> {
    const response = await axios.post(`${this.baseURL}/workflows/start`, request);
    return response.data.data;
  }

  async signalWorkflow(workflowId: string, signalName: string, input: any): Promise<void> {
    await axios.post(`${this.baseURL}/workflows/${workflowId}/signal`, {
      signalName,
      input
    });
  }

  async pauseWorkflow(workflowId: string): Promise<void> {
    await axios.post(`${this.baseURL}/workflows/${workflowId}/pause`);
  }

  async resumeWorkflow(workflowId: string): Promise<void> {
    await axios.post(`${this.baseURL}/workflows/${workflowId}/resume`);
  }

  async terminateWorkflow(workflowId: string, reason: string): Promise<void> {
    await axios.delete(`${this.baseURL}/workflows/${workflowId}`, {
      data: { reason }
    });
  }

  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    const response = await axios.get(`${this.baseURL}/workflows/templates`);
    return response.data.data.templates;
  }

  async saveWorkflowDefinition(definition: WorkflowDefinition): Promise<void> {
    await axios.post(`${this.baseURL}/workflows/definitions`, definition);
  }
}

// Types
export interface WorkflowFilters {
  status?: string;
  type?: string;
  assignee?: string;
  priority?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface StartWorkflowRequest {
  workflowType: string;
  workflowId?: string;
  taskQueue?: string;
  input: any;
  options?: {
    executionTimeout?: string;
    runTimeout?: string;
    retryPolicy?: {
      maximumAttempts: number;
      initialInterval: string;
      maximumInterval: string;
      backoffCoefficient: number;
    };
  };
}
```

### 2. React Hook for Workflow Management

```typescript
// src/hooks/useTemporalWorkflows.ts
import { useState, useEffect } from 'react';
import { TemporalWorkflowService, WorkflowFilters } from '../services/temporalWorkflowService';

export const useTemporalWorkflows = (filters?: WorkflowFilters) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workflowService = new TemporalWorkflowService();

  const fetchWorkflows = async (newFilters?: WorkflowFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await workflowService.listWorkflows(newFilters || filters);
      setWorkflows(response.workflows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const startWorkflow = async (request: StartWorkflowRequest) => {
    try {
      const result = await workflowService.startWorkflow(request);
      await fetchWorkflows(); // Refresh list
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start workflow');
      throw err;
    }
  };

  const pauseWorkflow = async (workflowId: string) => {
    try {
      await workflowService.pauseWorkflow(workflowId);
      await fetchWorkflows(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause workflow');
      throw err;
    }
  };

  const resumeWorkflow = async (workflowId: string) => {
    try {
      await workflowService.resumeWorkflow(workflowId);
      await fetchWorkflows(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume workflow');
      throw err;
    }
  };

  const terminateWorkflow = async (workflowId: string, reason: string) => {
    try {
      await workflowService.terminateWorkflow(workflowId, reason);
      await fetchWorkflows(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to terminate workflow');
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [JSON.stringify(filters)]);

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    terminateWorkflow
  };
};
```

### 3. Real-time Updates with WebSocket

```typescript
// src/services/temporalWebSocket.ts
export class TemporalWebSocket {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    this.ws = new WebSocket('ws://localhost:8080/api/temporal/ws');
    
    this.ws.onopen = () => {
      console.log('Connected to Temporal WebSocket');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data.payload);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from Temporal WebSocket');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(callback);
  }

  unsubscribe(eventType: string, callback: (data: any) => void) {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.delete(callback);
    }
  }

  private notifySubscribers(eventType: string, data: any) {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Usage in React component
export const useTemporalWebSocket = () => {
  const [ws] = useState(() => new TemporalWebSocket());

  useEffect(() => {
    ws.connect();
    return () => ws.disconnect();
  }, []);

  const subscribe = (eventType: string, callback: (data: any) => void) => {
    ws.subscribe(eventType, callback);
    return () => ws.unsubscribe(eventType, callback);
  };

  return { subscribe };
};
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "WORKFLOW_NOT_FOUND",
    "message": "Workflow with ID 'tvr-registration-999' not found",
    "details": {
      "workflowId": "tvr-registration-999",
      "timestamp": "2024-01-20T16:30:00Z"
    }
  }
}
```

### Error Codes
- `WORKFLOW_NOT_FOUND`: Workflow does not exist
- `WORKFLOW_ALREADY_RUNNING`: Workflow is already running
- `INVALID_WORKFLOW_TYPE`: Unsupported workflow type
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `TEMPORAL_CONNECTION_ERROR`: Cannot connect to Temporal server
- `ACTIVITY_FAILED`: Activity execution failed

## Testing Examples

### Mock API Responses
```typescript
// src/__mocks__/temporalApi.ts
export const mockWorkflowList = {
  success: true,
  data: {
    workflows: [
      {
        id: "tvr-registration-001",
        type: "tvr-registration",
        status: "running",
        progress: 65,
        startedAt: "2024-01-15T10:30:00Z",
        estimatedCompletion: "2024-02-20T17:00:00Z",
        currentStep: "NCUC Review",
        assignee: "Planning Department",
        priority: "high"
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1
    }
  }
};

export const mockWorkflowDetails = {
  success: true,
  data: {
    id: "tvr-registration-001",
    type: "tvr-registration",
    status: "running",
    progress: 65,
    // ... other fields
  }
};
```

### Integration Tests
```typescript
// src/__tests__/temporalIntegration.test.ts
import { TemporalWorkflowService } from '../services/temporalWorkflowService';

describe('TemporalWorkflowService', () => {
  let service: TemporalWorkflowService;

  beforeEach(() => {
    service = new TemporalWorkflowService();
  });

  test('should list workflows', async () => {
    const result = await service.listWorkflows();
    expect(result.success).toBe(true);
    expect(result.workflows).toHaveLength(1);
  });

  test('should start new workflow', async () => {
    const request = {
      workflowType: 'tvr-registration',
      input: { applicationId: 'APP-001' }
    };
    
    const result = await service.startWorkflow(request);
    expect(result.workflowId).toBeDefined();
    expect(result.status).toBe('running');
  });
});
```

## Performance Considerations

### Pagination
- Always use pagination for workflow lists
- Default page size: 20 items
- Maximum page size: 100 items

### Caching
- Cache workflow templates for 1 hour
- Cache workflow details for 5 minutes
- Use cache invalidation on workflow updates

### Rate Limiting
- API rate limit: 100 requests per minute per user
- WebSocket connections: 5 per user
- Bulk operations: 10 workflows per request

This comprehensive integration guide provides everything needed to connect the UI components to Temporal workflows with proper error handling, real-time updates, and performance optimization.
