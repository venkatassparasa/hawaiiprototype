import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Pause, Play, RotateCcw, Activity, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkflowStatusBadge = ({ 
  recordId, 
  recordType, 
  compact = false, 
  showProgress = true,
  className = '' 
}) => {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock workflow data - this would come from Temporal API
  const mockWorkflows = {
    'TVR-2026-001': {
      id: 'tvr-registration-001',
      type: 'tvr-registration',
      status: 'running',
      progress: 65,
      currentStep: 'NCUC Review',
      assignee: 'Planning Department',
      startedAt: '2024-01-15T10:30:00Z',
      estimatedCompletion: '2024-02-20T17:00:00Z'
    },
    'TVR-2026-002': {
      id: 'tvr-registration-002',
      type: 'tvr-registration',
      status: 'completed',
      progress: 100,
      currentStep: 'Completed',
      assignee: 'Planning Department',
      startedAt: '2024-01-10T09:00:00Z',
      completedAt: '2024-01-22T16:30:00Z'
    },
    'TVR-2026-003': {
      id: 'tvr-registration-003',
      type: 'tvr-registration',
      status: 'waiting',
      progress: 30,
      currentStep: 'Initial Review',
      assignee: 'Planning Department',
      startedAt: '2024-01-18T14:15:00Z',
      estimatedCompletion: '2024-01-25T17:00:00Z'
    },
    'COMP-2026-001': {
      id: 'complaint-investigation-001',
      type: 'complaint-investigation',
      status: 'running',
      progress: 45,
      currentStep: 'Evidence Collection',
      assignee: 'Enforcement Officer',
      startedAt: '2024-01-20T11:00:00Z',
      estimatedCompletion: '2024-01-28T17:00:00Z'
    },
    'COMP-2026-002': {
      id: 'complaint-investigation-002',
      type: 'complaint-investigation',
      status: 'failed',
      progress: 20,
      currentStep: 'Site Visit',
      assignee: 'Enforcement Officer',
      startedAt: '2024-01-21T09:30:00Z',
      error: 'Property owner unavailable on scheduled dates'
    },
    'VC-2026-001': {
      id: 'violation-appeal-001',
      type: 'violation-appeal',
      status: 'running',
      progress: 35,
      currentStep: 'Document Review',
      assignee: 'Legal Department',
      startedAt: '2024-01-17T14:00:00Z',
      estimatedCompletion: '2024-02-10T17:00:00Z'
    },
    'VC-2026-002': {
      id: 'violation-appeal-002',
      type: 'violation-appeal',
      status: 'waiting',
      progress: 15,
      currentStep: 'Appeal Filed',
      assignee: 'Legal Department',
      startedAt: '2024-01-22T10:30:00Z',
      estimatedCompletion: '2024-02-15T17:00:00Z'
    }
  };

  useEffect(() => {
    const fetchWorkflowStatus = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const workflowData = mockWorkflows[recordId];
        if (workflowData) {
          setWorkflow(workflowData);
        } else {
          // No active workflow for this record
          setWorkflow(null);
        }
      } catch (err) {
        setError('Failed to load workflow status');
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchWorkflowStatus();
    }
  }, [recordId]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'running':
        return {
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: Activity,
          label: 'In Progress'
        };
      case 'completed':
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'failed':
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: AlertCircle,
          label: 'Failed'
        };
      case 'paused':
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: Pause,
          label: 'Paused'
        };
      case 'waiting':
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: Clock,
          label: 'Waiting'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: Clock,
          label: 'No Workflow'
        };
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-600 text-xs ${className}`}>
        Error loading status
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className={`text-slate-500 text-xs ${className}`}>
        No workflow
      </div>
    );
  }

  const statusInfo = getStatusInfo(workflow.status);
  const StatusIcon = statusInfo.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <StatusIcon className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-600">{statusInfo.label}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
            <StatusIcon className="w-3 h-3" />
            {statusInfo.label}
          </span>
          <span className="text-xs text-slate-500">{workflow.progress}%</span>
        </div>
        <Link
          to={`/workflows/${workflow.id}`}
          className="text-hawaii-ocean hover:text-blue-800 transition-colors"
          title="View workflow details"
        >
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {showProgress && workflow.status === 'running' && (
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-hawaii-ocean h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${workflow.progress}%` }}
          ></div>
        </div>
      )}

      <div className="text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span>Current: {workflow.currentStep}</span>
          {workflow.assignee && (
            <span className="text-slate-500">{workflow.assignee}</span>
          )}
        </div>
        {workflow.error && (
          <div className="text-red-600 mt-1">{workflow.error}</div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStatusBadge;
