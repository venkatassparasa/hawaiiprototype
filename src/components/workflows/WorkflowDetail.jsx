import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Users, Calendar, FileText, MessageSquare, Activity, Pause, Play, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const WorkflowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock workflow data - this would come from Temporal API
  const workflow = {
    id: 'tvr-registration-001',
    type: 'TVR Registration',
    status: 'running',
    progress: 65,
    startedAt: '2024-01-15T10:30:00Z',
    estimatedCompletion: '2024-02-20T17:00:00Z',
    currentStep: 'NCUC Review',
    assignee: 'Planning Department',
    priority: 'high',
    description: 'Complete TVR registration process for property located at 123-4567 Kamehameha Hwy, Kailua-Kona',
    property: {
      address: '123-4567 Kamehameha Hwy, Kailua-Kona, HI 96740',
      tmk: '3-4-005-025-0000',
      owner: 'John Doe',
      zone: 'R-2'
    }
  };

  const timeline = [
    {
      id: 1,
      timestamp: '2024-01-15T10:30:00Z',
      step: 'Application Submitted',
      status: 'completed',
      assignee: 'John Doe',
      duration: '5 minutes',
      details: 'Initial TVR registration application submitted online'
    },
    {
      id: 2,
      timestamp: '2024-01-15T11:00:00Z',
      step: 'Initial Review',
      status: 'completed',
      assignee: 'Planning Department',
      duration: '2 hours',
      details: 'Application reviewed for completeness and basic requirements'
    },
    {
      id: 3,
      timestamp: '2024-01-17T09:00:00Z',
      step: 'Zoning Verification',
      status: 'completed',
      assignee: 'Zoning Officer',
      duration: '1 day',
      details: 'Property zoning verified as R-2, NCUC required'
    },
    {
      id: 4,
      timestamp: '2024-01-18T14:00:00Z',
      step: 'NCUC Processing',
      status: 'completed',
      assignee: 'Planning Department',
      duration: '3 days',
      details: 'Nonconforming Use Certificate application processed'
    },
    {
      id: 5,
      timestamp: '2024-01-22T10:00:00Z',
      step: 'NCUC Review',
      status: 'running',
      assignee: 'Planning Commission',
      duration: 'In progress',
      details: 'NCUC under review by Planning Commission'
    },
    {
      id: 6,
      timestamp: 'Pending',
      step: 'Inspection Scheduling',
      status: 'pending',
      assignee: 'Inspection Department',
      duration: 'Estimated 2-3 days',
      details: 'Property inspection to be scheduled after NCUC approval'
    },
    {
      id: 7,
      timestamp: 'Pending',
      step: 'Final Approval',
      status: 'pending',
      assignee: 'Planning Director',
      duration: 'Estimated 1-2 days',
      details: 'Final TVR registration approval'
    }
  ];

  const activities = [
    {
      id: 1,
      timestamp: '2024-01-22T15:30:00Z',
      type: 'status_update',
      user: 'Planning Commission',
      message: 'NCUC review in progress, additional documentation requested'
    },
    {
      id: 2,
      timestamp: '2024-01-22T14:15:00Z',
      type: 'comment',
      user: 'John Doe',
      message: 'Submitted additional property documentation as requested'
    },
    {
      id: 3,
      timestamp: '2024-01-22T11:00:00Z',
      type: 'notification',
      user: 'System',
      message: 'Workflow assigned to Planning Commission for NCUC review'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'running': return <Activity className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/workflows')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{workflow.type}</h1>
          <p className="text-slate-600">Workflow ID: {workflow.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {workflow.status === 'running' && (
            <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          {workflow.status === 'paused' && (
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              Resume
            </button>
          )}
          <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Overall Progress</h2>
          <span className="text-2xl font-bold text-hawaii-ocean">{workflow.progress}%</span>
        </div>
        <div className="bg-slate-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-hawaii-ocean to-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${workflow.progress}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Started</p>
            <p className="font-medium text-slate-900">Jan 15, 2024 10:30 AM</p>
          </div>
          <div>
            <p className="text-slate-600">Current Step</p>
            <p className="font-medium text-slate-900">{workflow.currentStep}</p>
          </div>
          <div>
            <p className="text-slate-600">Assignee</p>
            <p className="font-medium text-slate-900">{workflow.assignee}</p>
          </div>
          <div>
            <p className="text-slate-600">Est. Completion</p>
            <p className="font-medium text-slate-900">Feb 20, 2024</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'timeline', 'activities', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-hawaii-ocean text-hawaii-ocean'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Property Information</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Address</p>
                      <p className="font-medium text-slate-900">{workflow.property.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Tax Map Key</p>
                      <p className="font-medium text-slate-900">{workflow.property.tmk}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Property Owner</p>
                      <p className="font-medium text-slate-900">{workflow.property.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Zoning</p>
                      <p className="font-medium text-slate-900">{workflow.property.zone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
                <p className="text-slate-700">{workflow.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Total Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">5 days</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Steps Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">4 of 7</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-600 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Team Members</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">3</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                      {getStatusIcon(step.status)}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-slate-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{step.step}</h4>
                        <p className="text-sm text-slate-600 mt-1">{step.details}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {step.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {step.duration}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        {step.timestamp === 'Pending' ? (
                          'Pending'
                        ) : (
                          new Date(step.timestamp).toLocaleString()
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'status_update' && <Activity className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-green-600" />}
                    {activity.type === 'notification' && <FileText className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{activity.user}</p>
                        <p className="text-slate-700 mt-1">{activity.message}</p>
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Workflow Configuration</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <pre className="text-sm text-slate-700 overflow-x-auto">
{`{
  "workflowId": "${workflow.id}",
  "type": "${workflow.type}",
  "priority": "${workflow.priority}",
  "temporal": {
    "workflowType": "TVRRegistrationWorkflow",
    "taskQueue": "tvr-registration-queue",
    "executionTimeout": "30d",
    "runTimeout": "7d"
  },
  "steps": [
    "ApplicationSubmitted",
    "InitialReview", 
    "ZoningVerification",
    "NCUCProcessing",
    "NCUCReview",
    "InspectionScheduling",
    "FinalApproval"
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
