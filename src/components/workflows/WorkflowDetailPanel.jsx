import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Pause, Play, RotateCcw, Activity, ExternalLink, User, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkflowDetailPanel = ({ 
  recordId, 
  recordType,
  title = "Workflow Progress",
  showFullDetails = true,
  className = ''
}) => {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

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
      estimatedCompletion: '2024-02-20T17:00:00Z',
      history: [
        {
          id: 1,
          step: 'Application Submitted',
          status: 'completed',
          assignee: 'John Doe',
          completedAt: '2024-01-15T10:35:00Z',
          duration: '5 minutes'
        },
        {
          id: 2,
          step: 'Initial Review',
          status: 'completed',
          assignee: 'Planning Department',
          completedAt: '2024-01-15T12:35:00Z',
          duration: '2 hours'
        },
        {
          id: 3,
          step: 'Zoning Verification',
          status: 'completed',
          assignee: 'Zoning Officer',
          completedAt: '2024-01-16T15:00:00Z',
          duration: '1 day'
        },
        {
          id: 4,
          step: 'NCUC Processing',
          status: 'completed',
          assignee: 'Planning Department',
          completedAt: '2024-01-19T17:00:00Z',
          duration: '3 days'
        },
        {
          id: 5,
          step: 'NCUC Review',
          status: 'running',
          assignee: 'Planning Commission',
          startedAt: '2024-01-22T10:00:00Z',
          duration: 'In progress'
        }
      ]
    },
    'COMP-2026-001': {
      id: 'complaint-investigation-001',
      type: 'complaint-investigation',
      status: 'running',
      progress: 45,
      currentStep: 'Evidence Collection',
      assignee: 'Enforcement Officer',
      startedAt: '2024-01-20T11:00:00Z',
      estimatedCompletion: '2024-01-28T17:00:00Z',
      history: [
        {
          id: 1,
          step: 'Complaint Received',
          status: 'completed',
          assignee: 'System',
          completedAt: '2024-01-20T11:00:00Z',
          duration: 'Immediate'
        },
        {
          id: 2,
          step: 'Initial Assessment',
          status: 'completed',
          assignee: 'Enforcement Officer',
          completedAt: '2024-01-20T14:00:00Z',
          duration: '3 hours'
        },
        {
          id: 3,
          step: 'Evidence Collection',
          status: 'running',
          assignee: 'Enforcement Officer',
          startedAt: '2024-01-21T09:00:00Z',
          duration: 'In progress'
        }
      ]
    },
    'VC-2026-001': {
      id: 'violation-appeal-001',
      type: 'violation-appeal',
      status: 'running',
      progress: 35,
      currentStep: 'Document Review',
      assignee: 'Legal Department',
      startedAt: '2024-01-17T14:00:00Z',
      estimatedCompletion: '2024-02-10T17:00:00Z',
      history: [
        {
          id: 1,
          step: 'Appeal Filed',
          status: 'completed',
          assignee: 'Property Owner',
          completedAt: '2024-01-17T14:00:00Z',
          duration: '15 minutes'
        },
        {
          id: 2,
          step: 'Document Review',
          status: 'running',
          assignee: 'Legal Department',
          startedAt: '2024-01-18T09:00:00Z',
          duration: 'In progress'
        }
      ]
    }
  };

  useEffect(() => {
    const fetchWorkflowDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const workflowData = mockWorkflows[recordId];
        if (workflowData) {
          setWorkflow(workflowData);
        } else {
          setWorkflow(null);
        }
      } catch (err) {
        setError('Failed to load workflow details');
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchWorkflowDetails();
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
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load workflow: {error}</span>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <div className="text-center text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>No active workflow for this record</p>
          <Link
            to="/workflows/new"
            className="inline-flex items-center gap-2 mt-3 text-hawaii-ocean hover:text-blue-800 text-sm"
          >
            Start Workflow
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(workflow.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </span>
            <Link
              to={`/workflows/${workflow.id}`}
              className="text-hawaii-ocean hover:text-blue-800 transition-colors"
              title="View full workflow details"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Overall Progress</span>
            <span className="font-medium text-slate-900">{workflow.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-hawaii-ocean to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${workflow.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Current Step</p>
            <p className="font-medium text-slate-900">{workflow.currentStep}</p>
          </div>
          <div>
            <p className="text-slate-600">Assignee</p>
            <p className="font-medium text-slate-900">{workflow.assignee}</p>
          </div>
          <div>
            <p className="text-slate-600">Started</p>
            <p className="font-medium text-slate-900">
              {new Date(workflow.startedAt).toLocaleDateString()}
            </p>
          </div>
          {workflow.estimatedCompletion && (
            <div>
              <p className="text-slate-600">Est. Completion</p>
              <p className="font-medium text-slate-900">
                {new Date(workflow.estimatedCompletion).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Expandable History */}
        {showFullDetails && workflow.history && (
          <div className="mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm text-hawaii-ocean hover:text-blue-800 transition-colors"
            >
              <span>{expanded ? 'Hide' : 'Show'} Workflow History</span>
              <FileText className="w-4 h-4" />
            </button>

            {expanded && (
              <div className="mt-4 space-y-3">
                {workflow.history.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : step.status === 'running' ? (
                        <Activity className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900">{step.step}</p>
                        <span className="text-xs text-slate-500">{step.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span>{step.assignee}</span>
                        {step.completedAt && (
                          <>
                            <Calendar className="w-3 h-3 ml-2" />
                            <span>{new Date(step.completedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to={`/workflows/${workflow.id}`}
              className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
            >
              View Full Details
            </Link>
            {workflow.status === 'running' && (
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                Pause Workflow
              </button>
            )}
            {workflow.status === 'paused' && (
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                Resume Workflow
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailPanel;
