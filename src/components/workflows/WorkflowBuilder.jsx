import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, Users, FileText, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState('');
  const [workflowType, setWorkflowType] = useState('tvr-registration');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [expandedSections, setExpandedSections] = useState(['steps', 'triggers', 'notifications']);

  const [steps, setSteps] = useState([
    {
      id: 1,
      name: 'Application Submitted',
      type: 'manual',
      assignee: 'Applicant',
      duration: '5 minutes',
      description: 'Initial TVR registration application submitted',
      required: true
    },
    {
      id: 2,
      name: 'Initial Review',
      type: 'automated',
      assignee: 'Planning Department',
      duration: '2 hours',
      description: 'Application reviewed for completeness',
      required: true
    },
    {
      id: 3,
      name: 'Zoning Verification',
      type: 'manual',
      assignee: 'Zoning Officer',
      duration: '1 day',
      description: 'Property zoning verification',
      required: true
    }
  ]);

  const [triggers, setTriggers] = useState([
    {
      id: 1,
      name: 'Application Received',
      type: 'webhook',
      description: 'Triggered when new TVR application is submitted',
      enabled: true
    },
    {
      id: 2,
      name: 'Manual Start',
      type: 'manual',
      description: 'Manually started by authorized user',
      enabled: true
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      event: 'workflow_started',
      recipients: ['applicant', 'planning_dept'],
      method: ['email', 'sms'],
      template: 'workflow_started_template'
    },
    {
      id: 2,
      event: 'step_completed',
      recipients: ['applicant'],
      method: ['email'],
      template: 'step_completed_template'
    }
  ]);

  const workflowTypes = [
    { value: 'tvr-registration', label: 'TVR Registration', description: 'Complete TVR registration process' },
    { value: 'complaint-investigation', label: 'Complaint Investigation', description: 'Investigate TVR complaints' },
    { value: 'violation-appeal', label: 'Violation Appeal', description: 'Handle violation appeals' },
    { value: 'annual-inspection', label: 'Annual Inspection', description: 'Schedule and conduct annual inspections' },
    { value: 'ncuc-processing', label: 'NCUC Processing', description: 'Nonconforming Use Certificate processing' }
  ];

  const stepTypes = [
    { value: 'manual', label: 'Manual', description: 'Requires human intervention' },
    { value: 'automated', label: 'Automated', description: 'Automatically executed' },
    { value: 'approval', label: 'Approval', description: 'Requires approval step' },
    { value: 'notification', label: 'Notification', description: 'Send notifications' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const addStep = () => {
    const newStep = {
      id: Math.max(...steps.map(s => s.id)) + 1,
      name: 'New Step',
      type: 'manual',
      assignee: '',
      duration: '',
      description: '',
      required: false
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id, field, value) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const addTrigger = () => {
    const newTrigger = {
      id: Math.max(...triggers.map(t => t.id)) + 1,
      name: 'New Trigger',
      type: 'webhook',
      description: '',
      enabled: true
    };
    setTriggers([...triggers, newTrigger]);
  };

  const updateTrigger = (id, field, value) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === id ? { ...trigger, [field]: value } : trigger
    ));
  };

  const removeTrigger = (id) => {
    setTriggers(triggers.filter(trigger => trigger.id !== id));
  };

  const generateTemporalConfig = () => {
    const config = {
      workflowName,
      workflowType,
      priority,
      description,
      steps: steps.map(step => ({
        name: step.name,
        type: step.type,
        assignee: step.assignee,
        duration: step.duration,
        description: step.description,
        required: step.required
      })),
      triggers,
      notifications,
      temporal: {
        workflowType: `${workflowType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Workflow`,
        taskQueue: `${workflowType}-queue`,
        executionTimeout: '30d',
        runTimeout: '7d',
        retryPolicy: {
          maximumAttempts: 3,
          initialInterval: '1s',
          maximumInterval: '1m',
          backoffCoefficient: 2.0
        }
      }
    };
    
    console.log('Temporal Workflow Configuration:', JSON.stringify(config, null, 2));
    alert('Workflow configuration generated! Check console for Temporal config.');
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
          <h1 className="text-2xl font-bold text-slate-900">Create Workflow</h1>
          <p className="text-slate-600">Design a new Temporal workflow for TVR compliance processes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateTemporalConfig}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Temporal Config
          </button>
          <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors">
            Save Workflow
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Workflow Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Workflow Type</label>
            <select
              value={workflowType}
              onChange={(e) => setWorkflowType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
            >
              {workflowTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the workflow purpose"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
            />
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div
          className="p-6 border-b border-slate-200 cursor-pointer hover:bg-slate-50"
          onClick={() => toggleSection('steps')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {expandedSections.includes('steps') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <h2 className="text-lg font-semibold text-slate-900">Workflow Steps</h2>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{steps.length}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addStep();
              }}
              className="px-3 py-1 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>
        </div>

        {expandedSections.includes('steps') && (
          <div className="p-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-hawaii-ocean text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                      className="font-medium text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 rounded px-2 py-1"
                    />
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select
                      value={step.type}
                      onChange={(e) => updateStep(step.id, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    >
                      {stepTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={step.assignee}
                      onChange={(e) => updateStep(step.id, 'assignee', e.target.value)}
                      placeholder="Department or role"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={step.duration}
                      onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                      placeholder="e.g., 2 hours, 1 day"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                    placeholder="Describe what happens in this step"
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                  />
                </div>

                <div className="mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={step.required}
                      onChange={(e) => updateStep(step.id, 'required', e.target.checked)}
                      className="w-4 h-4 text-hawaii-ocean border-slate-300 rounded focus:ring-hawaii-ocean/20"
                    />
                    <span className="text-sm text-slate-700">Required step</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Triggers */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div
          className="p-6 border-b border-slate-200 cursor-pointer hover:bg-slate-50"
          onClick={() => toggleSection('triggers')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {expandedSections.includes('triggers') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <h2 className="text-lg font-semibold text-slate-900">Triggers</h2>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{triggers.length}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addTrigger();
              }}
              className="px-3 py-1 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Trigger
            </button>
          </div>
        </div>

        {expandedSections.includes('triggers') && (
          <div className="p-6 space-y-4">
            {triggers.map((trigger) => (
              <div key={trigger.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="text"
                    value={trigger.name}
                    onChange={(e) => updateTrigger(trigger.id, 'name', e.target.value)}
                    className="font-medium text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 rounded px-2 py-1"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={trigger.enabled}
                        onChange={(e) => updateTrigger(trigger.id, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-hawaii-ocean border-slate-300 rounded focus:ring-hawaii-ocean/20"
                      />
                      <span className="text-sm text-slate-700">Enabled</span>
                    </label>
                    <button
                      onClick={() => removeTrigger(trigger.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select
                      value={trigger.type}
                      onChange={(e) => updateTrigger(trigger.id, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    >
                      <option value="webhook">Webhook</option>
                      <option value="manual">Manual</option>
                      <option value="schedule">Schedule</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={trigger.description}
                      onChange={(e) => updateTrigger(trigger.id, 'description', e.target.value)}
                      placeholder="Describe when this trigger fires"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div
          className="p-6 border-b border-slate-200 cursor-pointer hover:bg-slate-50"
          onClick={() => toggleSection('notifications')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {expandedSections.includes('notifications') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{notifications.length}</span>
            </div>
          </div>
        </div>

        {expandedSections.includes('notifications') && (
          <div className="p-6">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Event</label>
                      <select
                        value={notification.event}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                      >
                        <option value="workflow_started">Workflow Started</option>
                        <option value="workflow_completed">Workflow Completed</option>
                        <option value="step_completed">Step Completed</option>
                        <option value="workflow_failed">Workflow Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
                      <input
                        type="text"
                        value={notification.recipients.join(', ')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                        placeholder="applicant, planning_dept"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
                      <select
                        value={notification.method.join(', ')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="email, sms">Email & SMS</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
