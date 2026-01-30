import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, Users, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewWorkflow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowData, setWorkflowData] = useState({
    name: '',
    type: '',
    description: '',
    priority: 'medium',
    assignee: '',
    estimatedDuration: '',
    triggers: [],
    notifications: []
  });

  const workflowTypes = [
    {
      id: 'tvr-registration',
      name: 'TVR Registration',
      description: 'Complete TVR registration process including application review, zoning verification, NCUC processing, and final approval',
      estimatedDuration: '2-10 weeks',
      icon: '📋',
      color: 'blue'
    },
    {
      id: 'complaint-investigation',
      name: 'Complaint Investigation',
      description: 'Investigate TVR complaints including evidence collection, site visits, and violation determination',
      estimatedDuration: '1-4 weeks',
      icon: '🔍',
      color: 'yellow'
    },
    {
      id: 'violation-appeal',
      name: 'Violation Appeal',
      description: 'Handle violation appeals including document review, legal assessment, and decision making',
      estimatedDuration: '2-6 weeks',
      icon: '⚖️',
      color: 'purple'
    },
    {
      id: 'annual-inspection',
      name: 'Annual Inspection',
      description: 'Schedule and conduct annual TVR inspections with follow-up and compliance verification',
      estimatedDuration: '1-2 weeks',
      icon: '🔎',
      color: 'green'
    },
    {
      id: 'ncuc-processing',
      name: 'NCUC Processing',
      description: 'Process Nonconforming Use Certificate applications including public notice and commission review',
      estimatedDuration: '2-4 weeks',
      icon: '🏛️',
      color: 'orange'
    }
  ];

  const [selectedType, setSelectedType] = useState(null);
  const [initialData, setInitialData] = useState({
    applicationId: '',
    propertyId: '',
    applicantId: '',
    complaintId: '',
    violationId: '',
    appealId: '',
    inspectionId: ''
  });

  const steps = [
    { id: 1, title: 'Select Workflow Type', description: 'Choose the type of workflow you want to create' },
    { id: 2, title: 'Basic Information', description: 'Provide basic details about the workflow' },
    { id: 3, title: 'Initial Data', description: 'Enter initial data required to start the workflow' },
    { id: 4, title: 'Review & Create', description: 'Review your workflow configuration and create it' }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setWorkflowData(prev => ({
      ...prev,
      type: type.id,
      name: `${type.name} - ${new Date().toLocaleDateString()}`,
      estimatedDuration: type.estimatedDuration
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      // This would connect to the Temporal API
      const workflowPayload = {
        workflowType: workflowData.type,
        input: {
          ...initialData,
          workflowName: workflowData.name,
          description: workflowData.description,
          priority: workflowData.priority,
          assignee: workflowData.assignee
        }
      };

      console.log('Creating workflow:', workflowPayload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to workflow details
      navigate('/workflows');
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select Workflow Type</h3>
              <p className="text-slate-600">Choose the type of workflow you want to create from the available templates.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflowTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedType?.id === type.id
                      ? 'border-hawaii-ocean bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-${type.color}-100`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{type.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{type.estimatedDuration}</span>
                      </div>
                    </div>
                  </div>
                  {selectedType?.id === type.id && (
                    <div className="mt-3 flex items-center gap-2 text-hawaii-ocean">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Basic Information</h3>
              <p className="text-slate-600">Provide the basic details for your {selectedType?.name} workflow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Workflow Name *</label>
                <input
                  type="text"
                  value={workflowData.name}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
                <select
                  value={workflowData.priority}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={workflowData.description}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this workflow"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                <input
                  type="text"
                  value={workflowData.assignee}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Department or person responsible"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Duration</label>
                <input
                  type="text"
                  value={workflowData.estimatedDuration}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                  placeholder="e.g., 2-4 weeks"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Initial Data</h3>
              <p className="text-slate-600">Provide the initial data required to start the {selectedType?.name} workflow.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-hawaii-ocean" />
                <h4 className="font-medium text-slate-900">Required Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedType?.id === 'tvr-registration' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Application ID *</label>
                      <input
                        type="text"
                        value={initialData.applicationId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, applicationId: e.target.value }))}
                        placeholder="e.g., APP-2024-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Property ID *</label>
                      <input
                        type="text"
                        value={initialData.propertyId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, propertyId: e.target.value }))}
                        placeholder="e.g., PROP-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Applicant ID *</label>
                      <input
                        type="text"
                        value={initialData.applicantId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, applicantId: e.target.value }))}
                        placeholder="e.g., USER-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                  </>
                )}

                {selectedType?.id === 'complaint-investigation' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Complaint ID *</label>
                      <input
                        type="text"
                        value={initialData.complaintId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, complaintId: e.target.value }))}
                        placeholder="e.g., COMP-2024-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Property ID</label>
                      <input
                        type="text"
                        value={initialData.propertyId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, propertyId: e.target.value }))}
                        placeholder="e.g., PROP-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                  </>
                )}

                {selectedType?.id === 'violation-appeal' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Appeal ID *</label>
                      <input
                        type="text"
                        value={initialData.appealId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, appealId: e.target.value }))}
                        placeholder="e.g., APPEAL-2024-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Violation ID *</label>
                      <input
                        type="text"
                        value={initialData.violationId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, violationId: e.target.value }))}
                        placeholder="e.g., VIOL-2024-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                  </>
                )}

                {selectedType?.id === 'annual-inspection' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Inspection ID *</label>
                      <input
                        type="text"
                        value={initialData.inspectionId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, inspectionId: e.target.value }))}
                        placeholder="e.g., INSPECT-2024-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Property ID *</label>
                      <input
                        type="text"
                        value={initialData.propertyId}
                        onChange={(e) => setInitialData(prev => ({ ...prev, propertyId: e.target.value }))}
                        placeholder="e.g., PROP-001"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Review & Create</h3>
              <p className="text-slate-600">Review your workflow configuration before creating it.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-blue-100">
                  {selectedType?.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{workflowData.name}</h4>
                  <p className="text-sm text-slate-600">{selectedType?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Workflow Details</h5>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-600">Type:</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedType?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-600">Priority:</dt>
                      <dd className="text-sm font-medium text-slate-900 capitalize">{workflowData.priority}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-600">Assignee:</dt>
                      <dd className="text-sm font-medium text-slate-900">{workflowData.assignee || 'Unassigned'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-600">Duration:</dt>
                      <dd className="text-sm font-medium text-slate-900">{workflowData.estimatedDuration}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h5 className="font-medium text-slate-900 mb-3">Initial Data</h5>
                  <dl className="space-y-2">
                    {initialData.applicationId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Application ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.applicationId}</dd>
                      </div>
                    )}
                    {initialData.propertyId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Property ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.propertyId}</dd>
                      </div>
                    )}
                    {initialData.applicantId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Applicant ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.applicantId}</dd>
                      </div>
                    )}
                    {initialData.complaintId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Complaint ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.complaintId}</dd>
                      </div>
                    )}
                    {initialData.violationId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Violation ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.violationId}</dd>
                      </div>
                    )}
                    {initialData.appealId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Appeal ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.appealId}</dd>
                      </div>
                    )}
                    {initialData.inspectionId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-600">Inspection ID:</dt>
                        <dd className="text-sm font-medium text-slate-900">{initialData.inspectionId}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {workflowData.description && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h5 className="font-medium text-slate-900 mb-2">Description</h5>
                  <p className="text-sm text-slate-700">{workflowData.description}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900">Ready to Create</h5>
                  <p className="text-sm text-blue-700 mt-1">
                    Once created, this workflow will start immediately and can be monitored from the Workflow Dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedType !== null;
      case 2:
        return workflowData.name.trim() !== '' && workflowData.priority !== '';
      case 3:
        // Validate required fields based on workflow type
        if (selectedType?.id === 'tvr-registration') {
          return initialData.applicationId && initialData.propertyId && initialData.applicantId;
        }
        if (selectedType?.id === 'complaint-investigation') {
          return initialData.complaintId;
        }
        if (selectedType?.id === 'violation-appeal') {
          return initialData.appealId && initialData.violationId;
        }
        if (selectedType?.id === 'annual-inspection') {
          return initialData.inspectionId && initialData.propertyId;
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workflows')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Workflow</h1>
            <p className="text-slate-600">Set up a new Temporal workflow for TVR compliance processes</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/workflows/builder')}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Advanced Builder
        </button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-hawaii-ocean text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-green-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {currentStep === 4 ? (
            <button
              onClick={handleCreateWorkflow}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Workflow
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewWorkflow;
