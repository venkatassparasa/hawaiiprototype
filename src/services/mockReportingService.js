import { mockDataSources, mockRecords } from './mockData.js';
import { getStoredReports, saveStoredReports, initializeDefaultReports } from '../utils/localStorageUtils';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize default reports on load
initializeDefaultReports();

// Mock reporting service
export const mockReportingService = {
  // Get all available data sources
  async getDataSources() {
    await delay(500);
    return {
      success: true,
      data: mockDataSources
    };
  },

  // Get data source by ID
  async getDataSource(id) {
    await delay(300);
    const dataSource = mockDataSources.find(ds => ds.id === id);
    if (!dataSource) {
      return { success: false, error: 'Data source not found' };
    }
    return { success: true, data: dataSource };
  },

  // Get all saved reports
  async getReports() {
    await delay(400);
    const reports = getStoredReports();
    return {
      success: true,
      data: reports
    };
  },

  // Get report by ID
  async getReport(id) {
    await delay(300);
    const reports = getStoredReports();
    const report = reports.find(r => r.id === id);
    if (!report) {
      return { success: false, error: 'Report not found' };
    }
    return { success: true, data: report };
  },

  // Save new report
  async saveReport(reportData) {
    await delay(800);
    const reports = getStoredReports();
    const newReport = {
      id: String(Date.now()), // Use timestamp for unique ID
      ...reportData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    reports.push(newReport);
    saveStoredReports(reports);
    return { success: true, data: newReport };
  },

  // Update existing report
  async updateReport(id, reportData) {
    await delay(600);
    const reports = getStoredReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: 'Report not found' };
    }
    
    reports[index] = {
      ...reports[index],
      ...reportData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    saveStoredReports(reports);
    return { success: true, data: reports[index] };
  },

  // Delete report
  async deleteReport(id) {
    await delay(400);
    const reports = getStoredReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: 'Report not found' };
    }
    
    reports.splice(index, 1);
    saveStoredReports(reports);
    return { success: true };
  },

  // Preview report with filters and pagination
  async previewReport(reportConfig, page = 1, limit = 50) {
    await delay(1000);
    
    const { dataSource, fields, filters } = reportConfig;
    const records = mockRecords[dataSource] || [];
    
    // Apply filters
    let filteredRecords = [...records];
    
    if (filters && filters.length > 0) {
      filteredRecords = filteredRecords.filter(record => {
        return filters.every(filter => {
          const fieldValue = record[filter.field];
          const filterValue = filter.value;
          
          switch (filter.operator) {
            case 'equals':
              return fieldValue === filterValue;
            case 'notEquals':
              return fieldValue !== filterValue;
            case 'contains':
              return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
            case 'startsWith':
              return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
            case 'endsWith':
              return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
            case 'greaterThan':
              return Number(fieldValue) > Number(filterValue);
            case 'lessThan':
              return Number(fieldValue) < Number(filterValue);
            case 'between':
              const [min, max] = filterValue.split(',').map(v => Number(v.trim()));
              return Number(fieldValue) >= min && Number(fieldValue) <= max;
            case 'before':
              return new Date(fieldValue) < new Date(filterValue);
            case 'after':
              return new Date(fieldValue) > new Date(filterValue);
            default:
              return true;
          }
        });
      });
    }
    
    // Apply field selection and rename
    const selectedRecords = filteredRecords.map(record => {
      const selected = {};
      fields.forEach(field => {
        selected[field.label || field.id] = record[field.id];
      });
      return selected;
    });
    
    // Apply pagination
    const total = selectedRecords.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecords = selectedRecords.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        records: paginatedRecords,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        summary: {
          totalRecords: total,
          appliedFilters: filters || [],
          fields: fields.map(f => f.label || f.id)
        }
      }
    };
  },

  // Export report data
  async exportReport(reportConfig, format = 'csv') {
    await delay(1500);
    
    // Get all data (no pagination for export)
    const previewResult = await this.previewReport(reportConfig, 1, 10000);
    
    if (!previewResult.success) {
      return previewResult;
    }
    
    return {
      success: true,
      data: {
        format,
        records: previewResult.data.records,
        filename: `report_${Date.now()}.${format}`,
        summary: previewResult.data.summary
      }
    };
  }
};
