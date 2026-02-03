import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Pause, Play, RotateCcw, FileText, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import temporalService from '../../services/temporalService';

const WorkflowDashboard = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load workflows from Temporal
  useEffect(() => {
    loadWorkflows();
  }, [filter]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await temporalService.listWorkflows(
        filter !== 'all' ? { status: filter } : {}
      );
      setWorkflows(response.workflows || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load workflows:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkflowAction = async (workflowId, action) => {
    try {
      switch (action) {
        case 'terminate':
          await temporalService.terminateWorkflow(workflowId, 'User requested termination');
          break;
        case 'signal':
          // Add signal handling as needed
          break;
        case 'query':
          // Add query handling as needed
          break;
        default:
          break;
      }
      // Reload workflows after action
      loadWorkflows();
    } catch (err) {
      console.error(`Failed to ${action} workflow:`, err);
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'waiting': return 'text-yellow-600 bg-[#F2E7A1]';
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
      case 'medium': return 'text-yellow-600 bg-[#F2E7A1]';
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={loadWorkflows}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hawaii-ocean"></div>
          <span className="ml-2 text-slate-600">Loading workflows...</span>
        </div>
      )}

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
                      <button 
                        onClick={() => navigate(`/workflows/${workflow.id}`)}
                        className="text-hawaii-ocean hover:text-blue-800"
                      >
                        View
                      </button>
                      {workflow.status === 'running' && (
                        <button 
                          onClick={() => handleWorkflowAction(workflow.id, 'terminate')}
                          className="text-red-600 hover:text-red-800"
                        >
                          Terminate
                        </button>
                      )}
                      {workflow.status === 'failed' && (
                        <button 
                          onClick={() => handleWorkflowAction(workflow.id, 'retry')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Retry
                        </button>
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
