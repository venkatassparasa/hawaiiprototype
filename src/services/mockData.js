// Mock data sources for reporting
export const mockDataSources = [
  {
    id: 'tvr_registry',
    name: 'TVR Registry',
    description: 'Transient Vacation Rental registration records',
    fields: [
      { id: 'property_id', name: 'Property ID', type: 'string', description: 'Unique property identifier' },
      { id: 'owner_name', name: 'Owner Name', type: 'string', description: 'Property owner name' },
      { id: 'owner_email', name: 'Owner Email', type: 'string', description: 'Owner contact email' },
      { id: 'property_address', name: 'Property Address', type: 'string', description: 'Full property address' },
      { id: 'registration_date', name: 'Registration Date', type: 'date', description: 'Initial registration date' },
      { id: 'expiry_date', name: 'Expiry Date', type: 'date', description: 'Registration expiry date' },
      { id: 'status', name: 'Status', type: 'string', description: 'Registration status', options: ['Active', 'Expired', 'Pending', 'Suspended'] },
      { id: 'max_occupancy', name: 'Max Occupancy', type: 'number', description: 'Maximum allowed occupants' },
      { id: 'parcel_id', name: 'Parcel ID', type: 'string', description: 'Tax parcel identifier' },
      { id: 'zoning_district', name: 'Zoning District', type: 'string', description: 'Zoning classification' }
    ]
  },
  {
    id: 'complaints',
    name: 'Complaints',
    description: 'Public complaints about TVR violations',
    fields: [
      { id: 'complaint_id', name: 'Complaint ID', type: 'string', description: 'Unique complaint identifier' },
      { id: 'property_id', name: 'Property ID', type: 'string', description: 'Related property' },
      { id: 'complainant_name', name: 'Complainant Name', type: 'string', description: 'Person who filed complaint' },
      { id: 'complaint_date', name: 'Complaint Date', type: 'date', description: 'Date complaint was filed' },
      { id: 'complaint_type', name: 'Complaint Type', type: 'string', description: 'Type of violation', options: ['Noise', 'Parking', 'Occupancy', 'Unauthorized', 'Other'] },
      { id: 'description', name: 'Description', type: 'text', description: 'Detailed complaint description' },
      { id: 'status', name: 'Status', type: 'string', description: 'Complaint status', options: ['Open', 'Under Investigation', 'Closed', 'Dismissed'] },
      { id: 'priority', name: 'Priority', type: 'string', description: 'Complaint priority', options: ['Low', 'Medium', 'High'] }
    ]
  },
  {
    id: 'inspections',
    name: 'Inspections',
    description: 'Property inspection records',
    fields: [
      { id: 'inspection_id', name: 'Inspection ID', type: 'string', description: 'Unique inspection identifier' },
      { id: 'property_id', name: 'Property ID', type: 'string', description: 'Inspected property' },
      { id: 'inspector_name', name: 'Inspector Name', type: 'string', description: 'Inspector who conducted review' },
      { id: 'inspection_date', name: 'Inspection Date', type: 'date', description: 'Date of inspection' },
      { id: 'inspection_type', name: 'Inspection Type', type: 'string', description: 'Type of inspection', options: ['Routine', 'Complaint', 'Follow-up', 'Initial'] },
      { id: 'result', name: 'Result', type: 'string', description: 'Inspection outcome', options: ['Compliant', 'Non-Compliant', 'Requires Follow-up'] },
      { id: 'violations_found', name: 'Violations Found', type: 'number', description: 'Number of violations identified' },
      { id: 'next_inspection', name: 'Next Inspection', type: 'date', description: 'Scheduled follow-up date' }
    ]
  },
  {
    id: 'enforcement_actions',
    name: 'Enforcement Actions',
    description: 'Legal enforcement actions taken',
    fields: [
      { id: 'action_id', name: 'Action ID', type: 'string', description: 'Unique action identifier' },
      { id: 'property_id', name: 'Property ID', type: 'string', description: 'Related property' },
      { id: 'action_type', name: 'Action Type', type: 'string', description: 'Type of enforcement', options: ['Notice', 'Fine', 'Suspension', 'Revocation'] },
      { id: 'issue_date', name: 'Issue Date', type: 'date', description: 'Date action was issued' },
      { id: 'amount', name: 'Amount', type: 'number', description: 'Fine amount if applicable' },
      { id: 'status', name: 'Status', type: 'string', description: 'Action status', options: ['Issued', 'Paid', 'Appealed', 'Dismissed'] },
      { id: 'due_date', name: 'Due Date', type: 'date', description: 'Response due date' }
    ]
  },
  {
    id: 'users',
    name: 'Users',
    description: 'System users and staff',
    fields: [
      { id: 'user_id', name: 'User ID', type: 'string', description: 'Unique user identifier' },
      { id: 'name', name: 'Name', type: 'string', description: 'Full name' },
      { id: 'email', name: 'Email', type: 'string', description: 'Email address' },
      { id: 'role', name: 'Role', type: 'string', description: 'User role', options: ['Admin', 'Enforcement Officer', 'Finance', 'Planning', 'Legal', 'Public'] },
      { id: 'department', name: 'Department', type: 'string', description: 'Department assignment' },
      { id: 'created_date', name: 'Created Date', type: 'date', description: 'Account creation date' },
      { id: 'last_login', name: 'Last Login', type: 'date', description: 'Last login date' }
    ]
  }
];

// Generate mock records for each data source
const generateMockRecords = () => {
  const records = {};
  
  // TVR Registry records
  records.tvr_registry = Array.from({ length: 150 }, (_, i) => ({
    property_id: `TVR-${String(i + 1).padStart(4, '0')}`,
    owner_name: `Owner ${i + 1}`,
    owner_email: `owner${i + 1}@example.com`,
    property_address: `${100 + i} Main St, Hilo, HI ${96720 + i}`,
    registration_date: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    expiry_date: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: ['Active', 'Expired', 'Pending', 'Suspended'][Math.floor(Math.random() * 4)],
    max_occupancy: Math.floor(Math.random() * 10) + 2,
    parcel_id: `PAR-${String(i + 1).padStart(6, '0')}`,
    zoning_district: ['R-1', 'R-2', 'R-3', 'Commercial'][Math.floor(Math.random() * 4)]
  }));

  // Complaints records
  records.complaints = Array.from({ length: 200 }, (_, i) => ({
    complaint_id: `COMP-${String(i + 1).padStart(4, '0')}`,
    property_id: `TVR-${String(Math.floor(Math.random() * 150) + 1).padStart(4, '0')}`,
    complainant_name: `Complainant ${i + 1}`,
    complaint_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    complaint_type: ['Noise', 'Parking', 'Occupancy', 'Unauthorized', 'Other'][Math.floor(Math.random() * 5)],
    description: `Complaint description ${i + 1}`,
    status: ['Open', 'Under Investigation', 'Closed', 'Dismissed'][Math.floor(Math.random() * 4)],
    priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
  }));

  // Inspections records
  records.inspections = Array.from({ length: 100 }, (_, i) => ({
    inspection_id: `INS-${String(i + 1).padStart(4, '0')}`,
    property_id: `TVR-${String(Math.floor(Math.random() * 150) + 1).padStart(4, '0')}`,
    inspector_name: `Inspector ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`,
    inspection_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    inspection_type: ['Routine', 'Complaint', 'Follow-up', 'Initial'][Math.floor(Math.random() * 4)],
    result: ['Compliant', 'Non-Compliant', 'Requires Follow-up'][Math.floor(Math.random() * 3)],
    violations_found: Math.floor(Math.random() * 5),
    next_inspection: new Date(2024, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }));

  // Enforcement actions records
  records.enforcement_actions = Array.from({ length: 75 }, (_, i) => ({
    action_id: `ACT-${String(i + 1).padStart(4, '0')}`,
    property_id: `TVR-${String(Math.floor(Math.random() * 150) + 1).padStart(4, '0')}`,
    action_type: ['Notice', 'Fine', 'Suspension', 'Revocation'][Math.floor(Math.random() * 4)],
    issue_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    amount: Math.floor(Math.random() * 5000) + 500,
    status: ['Issued', 'Paid', 'Appealed', 'Dismissed'][Math.floor(Math.random() * 4)],
    due_date: new Date(2024, Math.floor(Math.random() * 12) + 2, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }));

  // Users records
  records.users = Array.from({ length: 25 }, (_, i) => ({
    user_id: `USR-${String(i + 1).padStart(3, '0')}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@hawaii.gov`,
    role: ['Admin', 'Enforcement Officer', 'Finance', 'Planning', 'Legal', 'Public'][Math.floor(Math.random() * 6)],
    department: ['Planning', 'Enforcement', 'Finance', 'Legal', 'Administration'][Math.floor(Math.random() * 5)],
    created_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    last_login: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }));

  return records;
};

export const mockRecords = generateMockRecords();

// Mock saved reports
export const mockReports = [
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
