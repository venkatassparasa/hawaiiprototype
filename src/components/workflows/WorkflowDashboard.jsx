import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Pause, Play, RotateCcw, FileText, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkflowDashboard = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([
    {
      id: 'tvr-registration-001',
      type: 'TVR Registration',
      status: 'running',
      progress: 65,
      startedAt: '2024-01-15T10:30:00Z',
      estimatedCompletion: '2024-02-20T17:00:00Z',
      currentStep: 'NCUC Review',
      assignee: 'Planning Department',
      priority: 'high'
    },
    {
      id: 'complaint-investigation-002',
      type: 'Complaint Investigation',
      status: 'waiting',
      progress: 30,
      startedAt: '2024-01-18T14:15:00Z',
      estimatedCompletion: '2024-01-25T17:00:00Z',
      currentStep: 'Evidence Collection',
      assignee: 'Enforcement Officer',
      priority: 'medium'
    },
    {
      id: 'violation-appeal-003',
      type: 'Violation Appeal',
      status: 'completed',
      progress: 100,
      startedAt: '2024-01-10T09:00:00Z',
      completedAt: '2024-01-22T16:30:00Z',
      currentStep: 'Completed',
      assignee: 'Legal Department',
      priority: 'low'
    },
    {
      id: 'inspection-scheduling-004',
      type: 'Annual Inspection',
      status: 'failed',
      progress: 45,
      startedAt: '2024-01-12T11:00:00Z',
      currentStep: 'Scheduling Conflict',
      assignee: 'Planning Department',
      priority: 'high',
      error: 'Property owner unavailable on scheduled dates'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'waiting': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'paused': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'waiting': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesFilter = filter === 'all' || workflow.status === filter;
    const matchesSearch = workflow.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: workflows.length,
    running: workflows.filter(w => w.status === 'running').length,
    completed: workflows.filter(w => w.status === 'completed').length,
    failed: workflows.filter(w => w.status === 'failed').length,
    waiting: workflows.filter(w => w.status === 'waiting').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflow Management</h1>
          <p className="text-slate-600">Monitor and manage long-running compliance workflows</p>
        </div>
        <button 
          onClick={() => navigate('/workflows/new')}
          className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          New Workflow
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Workflows</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Running</p>
              <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
            </div>
            <Play className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Waiting</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'running', 'completed', 'waiting', 'failed', 'paused'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-hawaii-ocean text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Workflow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Step</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredWorkflows.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{workflow.type}</div>
                      <div className="text-sm text-slate-500">{workflow.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {getStatusIcon(workflow.status)}
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-hawaii-ocean h-2 rounded-full transition-all duration-300"
                          style={{ width: `${workflow.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600">{workflow.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{workflow.currentStep}</div>
                    {workflow.error && (
                      <div className="text-sm text-red-600">{workflow.error}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {workflow.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                      {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-hawaii-ocean hover:text-blue-800">View</button>
                      {workflow.status === 'running' && (
                        <button className="text-yellow-600 hover:text-yellow-800">Pause</button>
                      )}
                      {workflow.status === 'paused' && (
                        <button className="text-green-600 hover:text-green-800">Resume</button>
                      )}
                      {workflow.status === 'failed' && (
                        <button className="text-blue-600 hover:text-blue-800">Retry</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDashboard;
