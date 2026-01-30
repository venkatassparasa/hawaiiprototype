import React, { useState, useEffect } from 'react';
import { Database, Loader, Info } from 'lucide-react';
import { mockReportingService } from '../../services/mockReportingService';

const DataSourceSelector = ({ selectedSource, onSourceChange, onFieldsLoaded }) => {
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState(null);

  useEffect(() => {
    loadDataSources();
  }, []);

  useEffect(() => {
    if (selectedSource) {
      loadDataSourceDetails(selectedSource);
    }
  }, [selectedSource]);

  const loadDataSources = async () => {
    try {
      setLoading(true);
      const result = await mockReportingService.getDataSources();
      if (result.success) {
        setDataSources(result.data);
      }
    } catch (error) {
      console.error('Failed to load data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDataSourceDetails = async (sourceId) => {
    try {
      setLoading(true);
      const result = await mockReportingService.getDataSource(sourceId);
      if (result.success) {
        setSelectedDataSource(result.data);
        if (onFieldsLoaded) {
          onFieldsLoaded(result.data.fields);
        }
      }
    } catch (error) {
      console.error('Failed to load data source details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceChange = (sourceId) => {
    onSourceChange(sourceId);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Database className="w-4 h-4 inline mr-2" />
          Data Source
        </label>
        <select
          value={selectedSource || ''}
          onChange={(e) => handleSourceChange(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
          disabled={loading}
        >
          <option value="">Select a data source...</option>
          {dataSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
        {loading && (
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <Loader className="w-4 h-4 animate-spin" />
            Loading data source...
          </div>
        )}
      </div>

      {selectedDataSource && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">{selectedDataSource.name}</h4>
              <p className="text-sm text-blue-700 mt-1">{selectedDataSource.description}</p>
              <p className="text-sm text-blue-600 mt-2">
                {selectedDataSource.fields.length} fields available
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedSource && !loading && !selectedDataSource && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Info className="w-4 h-4" />
            <span className="text-sm">Unable to load data source details. Please try again.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourceSelector;
