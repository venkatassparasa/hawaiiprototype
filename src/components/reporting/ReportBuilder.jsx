import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import DataSourceSelector from './DataSourceSelector';
import FieldSelector from './FieldSelector';
import FilterBuilder from './FilterBuilder';
import { mockReportingService } from '../../services/mockReportingService';

const ReportBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    dataSource: '',
    fields: [],
    filters: []
  });

  const [availableFields, setAvailableFields] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadReport(id);
    }
  }, [id, isEditing]);

  const loadReport = async (reportId) => {
    try {
      setLoading(true);
      const result = await mockReportingService.getReport(reportId);
      if (result.success) {
        const report = result.data;
        setReportConfig({
          name: report.name,
          description: report.description,
          dataSource: report.dataSource,
          fields: report.fields,
          filters: report.filters || []
        });
        
        // Load fields for the data source
        const dataSourceResult = await mockReportingService.getDataSource(report.dataSource);
        if (dataSourceResult.success) {
          setAvailableFields(dataSourceResult.data.fields);
        }
      } else {
        setErrors({ load: result.error || 'Failed to load report' });
      }
    } catch (error) {
      console.error('Failed to load report:', error);
      setErrors({ load: 'Failed to load report' });
    } finally {
      setLoading(false);
    }
  };

  const validateReport = () => {
    const newErrors = {};
    
    if (!reportConfig.name.trim()) {
      newErrors.name = 'Report name is required';
    }
    
    if (!reportConfig.dataSource) {
      newErrors.dataSource = 'Data source is required';
    }
    
    if (reportConfig.fields.length === 0) {
      newErrors.fields = 'At least one field must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateReport()) {
      return;
    }

    try {
      setSaving(true);
      setSaveStatus(null);

      const reportData = {
        name: reportConfig.name,
        description: reportConfig.description,
        dataSource: reportConfig.dataSource,
        fields: reportConfig.fields.map(field => ({
          id: field.id,
          label: field.label
        })),
        filters: reportConfig.filters
      };

      let result;
      if (isEditing) {
        result = await mockReportingService.updateReport(id, reportData);
      } else {
        result = await mockReportingService.saveReport(reportData);
      }

      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Report saved successfully!' });
        setTimeout(() => {
          navigate('/reports');
        }, 1500);
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Failed to save report' });
      }
    } catch (error) {
      console.error('Failed to save report:', error);
      setSaveStatus({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!validateReport()) {
      return;
    }
    
    // Save current config to sessionStorage for preview
    sessionStorage.setItem('reportPreviewConfig', JSON.stringify(reportConfig));
    // Store the return URL to navigate back to custom reports
    sessionStorage.setItem('reportReturnUrl', '/custom-reports');
    navigate('/reports/preview');
  };

  const handleDataSourceChange = (dataSource) => {
    setReportConfig(prev => ({ ...prev, dataSource, fields: [], filters: [] }));
    setErrors(prev => ({ ...prev, dataSource: null }));
  };

  const handleFieldsLoaded = (fields) => {
    setAvailableFields(fields);
  };

  const handleFieldsChange = (fields) => {
    setReportConfig(prev => ({ ...prev, fields }));
    setErrors(prev => ({ ...prev, fields: null }));
  };

  const handleFiltersChange = (filters) => {
    setReportConfig(prev => ({ ...prev, filters }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-hawaii-ocean" />
          <span className="text-slate-600">Loading report...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isEditing ? 'Edit Report' : 'Create New Report'}
            </h1>
            <p className="text-slate-500">
              {isEditing ? 'Modify your custom report configuration' : 'Build a custom report from your data'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Update' : 'Save'} Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {saveStatus.message}
        </div>
      )}

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800">Report Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Report Name *
              </label>
              <input
                type="text"
                value={reportConfig.name}
                onChange={(e) => {
                  setReportConfig(prev => ({ ...prev, name: e.target.value }));
                  setErrors(prev => ({ ...prev, name: null }));
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Enter report name..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent resize-none"
                placeholder="Describe what this report shows..."
              />
            </div>
          </div>

          {/* Data Source Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800">Data Source</h3>
            <DataSourceSelector
              selectedSource={reportConfig.dataSource}
              onSourceChange={handleDataSourceChange}
              onFieldsLoaded={handleFieldsLoaded}
            />
            {errors.dataSource && (
              <p className="mt-1 text-sm text-red-600">{errors.dataSource}</p>
            )}
          </div>

          {/* Field Selection */}
          {reportConfig.dataSource && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800">Field Selection</h3>
              <FieldSelector
                availableFields={availableFields}
                selectedFields={reportConfig.fields}
                onFieldsChange={handleFieldsChange}
              />
              {errors.fields && (
                <p className="mt-1 text-sm text-red-600">{errors.fields}</p>
              )}
            </div>
          )}

          {/* Filters */}
          {reportConfig.dataSource && availableFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800">Filters (Optional)</h3>
              <FilterBuilder
                fields={availableFields}
                filters={reportConfig.filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Load Error */}
      {errors.load && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {errors.load}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;
