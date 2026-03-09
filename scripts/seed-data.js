// Seed data script for Hawaii TVR Dashboard
// This script populates the database with sample data for development and testing

db = db.getSiblingDB('hawaii-tvr-dashboard');

// Sample users
var sampleUsers = [
  {
    userId: "admin-001",
    email: "admin@hawaiicounty.gov",
    firstName: "System",
    lastName: "Administrator",
    role: "admin",
    status: "active",
    permissions: [
      "users.read", "users.write",
      "registrations.read", "registrations.write",
      "complaints.read", "complaints.write",
      "violations.read", "violations.write",
      "inspections.read", "inspections.write",
      "enforcement.read", "enforcement.write",
      "reports.read", "reports.write",
      "settings.read", "settings.write",
      "system.admin"
    ],
    lastLogin: null,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01")
  },
  {
    userId: "inspector-001",
    email: "j.inspector@hawaiicounty.gov",
    firstName: "John",
    lastName: "Inspector",
    role: "inspector",
    status: "active",
    permissions: [
      "registrations.read", "registrations.write",
      "complaints.read", "complaints.write",
      "violations.read", "violations.write",
      "inspections.read", "inspections.write",
      "enforcement.read", "enforcement.write",
      "reports.read"
    ],
    lastLogin: new Date("2023-12-01"),
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-12-01")
  },
  {
    userId: "clerk-001",
    email: "m.clerk@hawaiicounty.gov",
    firstName: "Mary",
    lastName: "Clerk",
    role: "clerk",
    status: "active",
    permissions: [
      "registrations.read", "registrations.write",
      "complaints.read", "complaints.write",
      "reports.read"
    ],
    lastLogin: new Date("2023-12-02"),
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-12-02")
  },
  {
    userId: "supervisor-001",
    email: "s.supervisor@hawaiicounty.gov",
    firstName: "Sarah",
    lastName: "Supervisor",
    role: "supervisor",
    status: "active",
    permissions: [
      "users.read",
      "registrations.read", "registrations.write",
      "complaints.read", "complaints.write",
      "violations.read", "violations.write",
      "inspections.read", "inspections.write",
      "enforcement.read", "enforcement.write",
      "reports.read", "reports.write",
      "settings.read"
    ],
    lastLogin: new Date("2023-12-01"),
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-12-01")
  }
];

// Sample properties
var sampleProperties = [
  {
    propertyId: "PROP-001",
    address: "1234 Kamehameha Hwy, Honolulu, HI 96813",
    coordinates: [21.3099, -157.8581],
    ownerId: "owner-001",
    zoningType: "Residential",
    maxOccupancy: 6,
    status: "active",
    parcelId: "1-2-345-678-9012",
    assessedValue: 850000,
    landArea: 8500,
    buildingArea: 2200,
    yearBuilt: 1985,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01")
  },
  {
    propertyId: "PROP-002",
    address: "5678 Kalanianaole Hwy, Kailua, HI 96734",
    coordinates: [21.3954, -157.7395],
    ownerId: "owner-002",
    zoningType: "Residential",
    maxOccupancy: 4,
    status: "active",
    parcelId: "1-2-345-678-9013",
    assessedValue: 1200000,
    landArea: 12000,
    buildingArea: 2800,
    yearBuilt: 1992,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15")
  },
  {
    propertyId: "PROP-003",
    address: "9012 Waikiki Beach Walk, Honolulu, HI 96815",
    coordinates: [21.2787, -157.8318],
    ownerId: "owner-003",
    zoningType: "Hotel/Resort",
    maxOccupancy: 8,
    status: "active",
    parcelId: "1-2-345-678-9014",
    assessedValue: 2500000,
    landArea: 3500,
    buildingArea: 1800,
    yearBuilt: 2005,
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01")
  },
  {
    propertyId: "PROP-004",
    address: "3456 Diamond Head Rd, Honolulu, HI 96816",
    coordinates: [21.2616, -157.8066],
    ownerId: "owner-004",
    zoningType: "Residential",
    maxOccupancy: 5,
    status: "inactive",
    parcelId: "1-2-345-678-9015",
    assessedValue: 1800000,
    landArea: 15000,
    buildingArea: 3200,
    yearBuilt: 1998,
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-03-01")
  }
];

// Sample registrations
var sampleRegistrations = [
  {
    registrationId: "REG-001",
    propertyId: "PROP-001",
    registrationNumber: "TVR-2023-001",
    ownerId: "owner-001",
    status: "active",
    applicationDate: new Date("2023-01-15"),
    approvalDate: new Date("2023-02-01"),
    expiryDate: new Date("2024-02-01"),
    maxOccupancy: 6,
    registrationType: "short_term_rental",
    fees: {
      application: 100,
      annual: 250,
      inspection: 75
    },
    documents: [
      {
        type: "application_form",
        url: "/documents/applications/TVR-2023-001.pdf",
        uploadedAt: new Date("2023-01-15")
      },
      {
        type: "proof_of_insurance",
        url: "/documents/insurance/TVR-2023-001.pdf",
        uploadedAt: new Date("2023-01-20")
      }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-02-01")
  },
  {
    registrationId: "REG-002",
    propertyId: "PROP-002",
    registrationNumber: "TVR-2023-002",
    ownerId: "owner-002",
    status: "active",
    applicationDate: new Date("2023-02-15"),
    approvalDate: new Date("2023-03-01"),
    expiryDate: new Date("2024-03-01"),
    maxOccupancy: 4,
    registrationType: "short_term_rental",
    fees: {
      application: 100,
      annual: 250,
      inspection: 75
    },
    documents: [
      {
        type: "application_form",
        url: "/documents/applications/TVR-2023-002.pdf",
        uploadedAt: new Date("2023-02-15")
      }
    ],
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-03-01")
  },
  {
    registrationId: "REG-003",
    propertyId: "PROP-003",
    registrationNumber: "TVR-2023-003",
    ownerId: "owner-003",
    status: "expired",
    applicationDate: new Date("2022-03-01"),
    approvalDate: new Date("2022-03-15"),
    expiryDate: new Date("2023-03-15"),
    maxOccupancy: 8,
    registrationType: "vacation_rental",
    fees: {
      application: 100,
      annual: 500,
      inspection: 100
    },
    documents: [
      {
        type: "application_form",
        url: "/documents/applications/TVR-2023-003.pdf",
        uploadedAt: new Date("2022-03-01")
      }
    ],
    createdAt: new Date("2022-03-01"),
    updatedAt: new Date("2023-03-15")
  }
];

// Sample complaints
var sampleComplaints = [
  {
    complaintId: "COMP-001",
    propertyId: "PROP-001",
    registrationId: "REG-001",
    complainantId: "citizen-001",
    type: "noise_complaint",
    priority: "medium",
    status: "open",
    description: "Excessive noise from vacation rental guests during late hours (11 PM - 2 AM)",
    complaintDate: new Date("2023-12-01"),
    assignedTo: "inspector-001",
    notes: [
      {
        note: "Initial complaint received via phone call",
        addedBy: "system",
        addedAt: new Date("2023-12-01")
      },
      {
        note: "Contacted complainant for additional details",
        addedBy: "inspector-001",
        addedAt: new Date("2023-12-02")
      }
    ],
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-02")
  },
  {
    complaintId: "COMP-002",
    propertyId: "PROP-002",
    registrationId: "REG-002",
    complainantId: "citizen-002",
    type: "parking_violation",
    priority: "low",
    status: "closed",
    description: "Guests parking in resident-only parking spaces",
    complaintDate: new Date("2023-11-15"),
    assignedTo: "inspector-001",
    resolution: "Warning issued to property owner",
    resolutionDate: new Date("2023-11-20"),
    notes: [
      {
        note: "Investigation completed - found evidence of parking violations",
        addedBy: "inspector-001",
        addedAt: new Date("2023-11-18")
      },
      {
        note: "Property owner contacted and issued warning",
        addedBy: "inspector-001",
        addedAt: new Date("2023-11-20")
      }
    ],
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2023-11-20")
  },
  {
    complaintId: "COMP-003",
    propertyId: "PROP-003",
    registrationId: "REG-003",
    complainantId: "citizen-003",
    type: "occupancy_violation",
    priority: "high",
    status: "investigating",
    description: "Property appears to have more than 8 guests at a time",
    complaintDate: new Date("2023-12-05"),
    assignedTo: "inspector-001",
    notes: [
      {
        note: "High priority complaint - potential over-occupancy",
        addedBy: "system",
        addedAt: new Date("2023-12-05")
      }
    ],
    createdAt: new Date("2023-12-05"),
    updatedAt: new Date("2023-12-05")
  }
];

// Sample violation cases
var sampleViolationCases = [
  {
    caseId: "CASE-001",
    propertyId: "PROP-001",
    registrationId: "REG-001",
    type: "unregistered_operation",
    severity: "high",
    status: "active",
    description: "Property operating without valid TVR registration",
    openedDate: new Date("2023-11-15"),
    assignedTo: "inspector-001",
    evidence: [
      {
        type: "screenshot",
        url: "/evidence/screenshots/airbnb-listing-001.png",
        description: "Airbnb listing showing active rental",
        capturedAt: new Date("2023-11-15")
      },
      {
        type: "photo",
        url: "/evidence/photos/property-001-1.jpg",
        description: "Photo of property with multiple guests",
        capturedAt: new Date("2023-11-16")
      }
    ],
    violations: [
      {
        code: "TVR-001",
        description: "Operating without TVR registration",
        fine: 1000
      }
    ],
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2023-11-16")
  },
  {
    caseId: "CASE-002",
    propertyId: "PROP-002",
    registrationId: "REG-002",
    type: "occupancy_violation",
    severity: "medium",
    status: "resolved",
    description: "Property exceeding maximum occupancy limits",
    openedDate: new Date("2023-10-01"),
    assignedTo: "inspector-001",
    resolvedDate: new Date("2023-10-25"),
    resolution: "Warning issued and compliance verified",
    evidence: [
      {
        type: "video",
        url: "/evidence/videos/occupancy-check-002.mp4",
        description: "Video evidence of over-occupancy",
        capturedAt: new Date("2023-10-01")
      }
    ],
    violations: [
      {
        code: "TVR-002",
        description: "Exceeding maximum occupancy",
        fine: 500
      }
    ],
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2023-10-25")
  },
  {
    caseId: "CASE-003",
    propertyId: "PROP-003",
    registrationId: "REG-003",
    type: "zoning_violation",
    severity: "high",
    status: "active",
    description: "Property operating in non-residential zone",
    openedDate: new Date("2023-12-01"),
    assignedTo: "inspector-001",
    evidence: [
      {
        type: "document",
        url: "/evidence/documents/zoning-report-003.pdf",
        description: "Zoning verification report",
        capturedAt: new Date("2023-12-01")
      }
    ],
    violations: [
      {
        code: "TVR-003",
        description: "Operating in prohibited zone",
        fine: 2000
      }
    ],
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01")
  }
];

// Sample inspections
var sampleInspections = [
  {
    inspectionId: "INSP-001",
    propertyId: "PROP-001",
    inspectorId: "inspector-001",
    type: "complaint_follow_up",
    status: "completed",
    scheduledDate: new Date("2023-12-05"),
    completedDate: new Date("2023-12-05"),
    findings: "Evidence of noise violations found",
    recommendations: "Issue warning to property owner",
    photos: [
      {
        url: "/inspections/photos/INSP-001-1.jpg",
        description: "Property exterior",
        takenAt: new Date("2023-12-05")
      }
    ],
    createdAt: new Date("2023-12-03"),
    updatedAt: new Date("2023-12-05")
  },
  {
    inspectionId: "INSP-002",
    propertyId: "PROP-002",
    inspectorId: "inspector-001",
    type: "routine",
    status: "scheduled",
    scheduledDate: new Date("2023-12-15"),
    completedDate: null,
    findings: null,
    recommendations: null,
    photos: [],
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01")
  }
];

// Sample enforcement actions
var sampleEnforcementActions = [
  {
    actionId: "ENF-001",
    caseId: "CASE-001",
    propertyId: "PROP-001",
    actionType: "warning",
    description: "Warning issued for unregistered operation",
    actionDate: new Date("2023-11-20"),
    issuedBy: "inspector-001",
    status: "complied",
    complianceDate: new Date("2023-11-25"),
    documents: [
      {
        type: "warning_letter",
        url: "/enforcement/warnings/ENF-001.pdf",
        uploadedAt: new Date("2023-11-20")
      }
    ],
    createdAt: new Date("2023-11-20"),
    updatedAt: new Date("2023-11-25")
  },
  {
    actionId: "ENF-002",
    caseId: "CASE-002",
    propertyId: "PROP-002",
    actionType: "fine",
    description: "Fine issued for occupancy violation",
    actionDate: new Date("2023-10-05"),
    issuedBy: "inspector-001",
    status: "paid",
    paymentDate: new Date("2023-10-15"),
    amount: 500,
    documents: [
      {
        type: "fine_notice",
        url: "/enforcement/fines/ENF-002.pdf",
        uploadedAt: new Date("2023-10-05")
      }
    ],
    createdAt: new Date("2023-10-05"),
    updatedAt: new Date("2023-10-15")
  }
];

// Insert sample data
print("Inserting sample users...");
db.users.insertMany(sampleUsers);

print("Inserting sample properties...");
db.properties.insertMany(sampleProperties);

print("Inserting sample registrations...");
db.registrations.insertMany(sampleRegistrations);

print("Inserting sample complaints...");
db.complaints.insertMany(sampleComplaints);

print("Inserting sample violation cases...");
db.violation_cases.insertMany(sampleViolationCases);

print("Inserting sample inspections...");
db.inspections.insertMany(sampleInspections);

print("Inserting sample enforcement actions...");
db.enforcement_actions.insertMany(sampleEnforcementActions);

// Create sample audit logs
var sampleAuditLogs = [
  {
    logId: "AUDIT-001",
    userId: "admin-001",
    action: "user_created",
    resourceType: "user",
    resourceId: "inspector-001",
    details: "Created new inspector account",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    timestamp: new Date("2023-01-15T10:30:00Z")
  },
  {
    logId: "AUDIT-002",
    userId: "clerk-001",
    action: "registration_created",
    resourceType: "registration",
    resourceId: "REG-001",
    details: "Created new TVR registration",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    timestamp: new Date("2023-01-15T14:20:00Z")
  },
  {
    logId: "AUDIT-003",
    userId: "inspector-001",
    action: "complaint_assigned",
    resourceType: "complaint",
    resourceId: "COMP-001",
    details: "Assigned noise complaint to inspector",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0...",
    timestamp: new Date("2023-12-01T09:15:00Z")
  }
];

print("Inserting sample audit logs...");
db.audit_logs.insertMany(sampleAuditLogs);

// Create sample notifications
var sampleNotifications = [
  {
    notificationId: "NOTIF-001",
    userId: "inspector-001",
    type: "complaint_assigned",
    title: "New Complaint Assigned",
    message: "You have been assigned a new noise complaint (COMP-001)",
    status: "read",
    createdAt: new Date("2023-12-01T09:15:00Z"),
    readAt: new Date("2023-12-01T10:30:00Z")
  },
  {
    notificationId: "NOTIF-002",
    userId: "clerk-001",
    type: "registration_approved",
    title: "Registration Approved",
    message: "TVR registration TVR-2023-001 has been approved",
    status: "unread",
    createdAt: new Date("2023-12-02T11:45:00Z"),
    readAt: null
  },
  {
    notificationId: "NOTIF-003",
    userId: "admin-001",
    type: "system_alert",
    title: "System Maintenance",
    message: "Scheduled maintenance on December 15, 2023",
    status: "read",
    createdAt: new Date("2023-12-01T08:00:00Z"),
    readAt: new Date("2023-12-01T08:30:00Z")
  }
];

print("Inserting sample notifications...");
db.notifications.insertMany(sampleNotifications);

print("Sample data seeding completed successfully!");
print("Summary:");
print("- Users: " + sampleUsers.length);
print("- Properties: " + sampleProperties.length);
print("- Registrations: " + sampleRegistrations.length);
print("- Complaints: " + sampleComplaints.length);
print("- Violation Cases: " + sampleViolationCases.length);
print("- Inspections: " + sampleInspections.length);
print("- Enforcement Actions: " + sampleEnforcementActions.length);
print("- Audit Logs: " + sampleAuditLogs.length);
print("- Notifications: " + sampleNotifications.length);
