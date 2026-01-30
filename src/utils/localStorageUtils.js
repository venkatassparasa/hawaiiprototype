// Utility functions for localStorage management

export const clearCustomReports = () => {
  localStorage.removeItem('customReports');
};

export const getStoredReports = () => {
  try {
    const stored = localStorage.getItem('customReports');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing stored reports:', error);
    return [];
  }
};

export const saveStoredReports = (reports) => {
  try {
    localStorage.setItem('customReports', JSON.stringify(reports));
  } catch (error) {
    console.error('Failed to save reports to localStorage:', error);
  }
};

export const initializeDefaultReports = () => {
  const existingReports = getStoredReports();
  
  if (existingReports.length === 0) {
    const defaultReports = [
      {
        id: '1',
        name: 'Active TVR Registrations',
        description: 'All currently active TVR registrations',
        dataSource: 'tvr_registry',
        fields: [
          { id: 'property_id', label: 'Property ID' },
          { id: 'owner_name', label: 'Owner Name' },
          { id: 'property_address', label: 'Address' },
          { id: 'registration_date', label: 'Registration Date' },
          { id: 'expiry_date', label: 'Expiry Date' }
        ],
        filters: [
          { field: 'status', operator: 'equals', value: 'Active' }
        ],
        createdBy: 'Admin',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'High Priority Complaints',
        description: 'Complaints marked as high priority',
        dataSource: 'complaints',
        fields: [
          { id: 'complaint_id', label: 'Complaint ID' },
          { id: 'property_id', label: 'Property ID' },
          { id: 'complainant_name', label: 'Complainant' },
          { id: 'complaint_date', label: 'Date' },
          { id: 'complaint_type', label: 'Type' },
          { id: 'status', label: 'Status' }
        ],
        filters: [
          { field: 'priority', operator: 'equals', value: 'High' },
          { field: 'status', operator: 'notEquals', value: 'Closed' }
        ],
        createdBy: 'Enforcement Officer',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22'
      },
      {
        id: '3',
        name: 'Non-Compliant Inspections',
        description: 'Properties with non-compliant inspection results',
        dataSource: 'inspections',
        fields: [
          { id: 'inspection_id', label: 'Inspection ID' },
          { id: 'property_id', label: 'Property ID' },
          { id: 'inspector_name', label: 'Inspector' },
          { id: 'inspection_date', label: 'Date' },
          { id: 'result', label: 'Result' },
          { id: 'violations_found', label: 'Violations' }
        ],
        filters: [
          { field: 'result', operator: 'equals', value: 'Non-Compliant' }
        ],
        createdBy: 'Planning',
        createdAt: '2024-01-25',
        updatedAt: '2024-01-25'
      }
    ];
    
    saveStoredReports(defaultReports);
    return defaultReports;
  } else {
    return existingReports;
  }
};

// Initialize default reports on import
initializeDefaultReports();
