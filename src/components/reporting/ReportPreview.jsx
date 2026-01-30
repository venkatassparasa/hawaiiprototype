import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader, ChevronLeft, ChevronRight, FileText, Filter, Calendar } from 'lucide-react';
import { mockReportingService } from '../../services/mockReportingService';
import { exportToCSV, exportTableToPDF, exportDataToPDF, formatDataForExport } from '../../utils/exportUtils';

const ReportPreview = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [reportConfig, setReportConfig] = useState(null);

  useEffect(() => {
    loadReportConfig();
  }, []);

  useEffect(() => {
    if (reportConfig) {
      loadPreviewData();
    }
  }, [reportConfig, currentPage, pageSize]);

  const loadReportConfig = () => {
    const config = sessionStorage.getItem('reportPreviewConfig');
    if (config) {
      try {
        const parsedConfig = JSON.parse(config);
        setReportConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse report config:', error);
        const returnUrl = sessionStorage.getItem('reportReturnUrl') || '/custom-reports';
        navigate(returnUrl);
      }
    } else {
      // Get return URL from sessionStorage or default to custom reports
      const returnUrl = sessionStorage.getItem('reportReturnUrl') || '/custom-reports';
      navigate(returnUrl);
    }
  };

  const loadPreviewData = async () => {
    try {
      setLoading(true);
      const result = await mockReportingService.previewReport(reportConfig, currentPage, pageSize);
      if (result.success) {
        setReportData(result.data);
      } else {
        console.error('Failed to load preview data:', result.error);
      }
    } catch (error) {
      console.error('Failed to load preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const exportResult = await mockReportingService.exportReport(reportConfig, 'csv');
      if (exportResult.success) {
        const formattedData = formatDataForExport(exportResult.data.records, reportConfig.fields);
        exportToCSV(formattedData, exportResult.data.filename);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      
      // Option 1: Export table as image (better formatting)
      if (tableRef.current) {
        await exportTableToPDF(
          tableRef.current,
          `${reportConfig.name || 'report'}.pdf`,
          {
            title: reportConfig.name || 'Report Preview',
            includeSummary: true,
            summaryData: {
              totalRecords: reportData?.pagination?.total,
              generatedAt: new Date().toISOString(),
              appliedFilters: reportConfig.filters || []
            }
          }
        );
      }
      
      // Option 2: Export data as formatted table (more reliable for large datasets)
      /*
      const exportResult = await mockReportingService.exportReport(reportConfig, 'pdf');
      if (exportResult.success) {
        await exportDataToPDF(
          exportResult.data.records,
          `${reportConfig.name || 'report'}.pdf`,
          {
            title: reportConfig.name || 'Report Preview',
            includeHeaders: true,
            headers: reportConfig.fields,
            includeSummary: true,
            summaryData: {
              totalRecords: exportResult.data.summary.totalRecords,
              generatedAt: new Date().toISOString(),
              appliedFilters: exportResult.data.summary.appliedFilters
            }
          }
        );
      }
      */
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const totalPages = reportData?.pagination?.totalPages || 0;
  const totalRecords = reportData?.pagination?.total || 0;

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-hawaii-ocean" />
          <span className="text-slate-600">Loading report preview...</span>
        </div>
      </div>
    );
  }

  if (!reportConfig) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No report configuration found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const returnUrl = sessionStorage.getItem('reportReturnUrl') || '/custom-reports';
              navigate(returnUrl);
            }}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {reportConfig.name || 'Report Preview'}
            </h1>
            <p className="text-slate-500">
              {reportConfig.description || 'Preview of your custom report'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={exporting || !reportData}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting || !reportData}
            className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exporting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Data Source</p>
              <p className="font-medium text-slate-800">
                {reportConfig.dataSource?.replace('_', ' ').toUpperCase() || 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Records</p>
              <p className="font-medium text-slate-800">{totalRecords.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Applied Filters</p>
              <p className="font-medium text-slate-800">
                {reportConfig.filters?.length || 0} filter{((reportConfig.filters?.length || 0) !== 1) ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Generated</p>
              <p className="font-medium text-slate-800">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Applied Filters */}
        {reportConfig.filters && reportConfig.filters.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-medium text-slate-800 mb-3">Applied Filters</h4>
            <div className="flex flex-wrap gap-2">
              {reportConfig.filters.map((filter, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {filter.field} {filter.operator} {filter.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div ref={tableRef} className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-hawaii-ocean" />
                <span className="text-slate-600">Loading data...</span>
              </div>
            </div>
          ) : reportData?.records && reportData.records.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {reportConfig.fields.map((field, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      {field.label || field.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {reportData.records.map((record, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50">
                    {reportConfig.fields.map((field, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-600"
                      >
                        {record[field.label || field.id] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No data found</h3>
              <p className="text-slate-500">
                No records match the current filters. Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} results
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                >
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-hawaii-ocean text-white'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPreview;
