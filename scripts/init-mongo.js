// MongoDB initialization script for Hawaii TVR Dashboard
// This script runs when the MongoDB container starts for the first time

// Switch to dashboard database
db = db.getSiblingDB('hawaii-tvr-dashboard');

// Create collections
db.createCollection('users');
db.createCollection('registrations');
db.createCollection('complaints');
db.createCollection('violation_cases');
db.createCollection('properties');
db.createCollection('inspections');
db.createCollection('enforcement_actions');
db.createCollection('audit_logs');
db.createCollection('notifications');
db.createCollection('settings');
db.createCollection('reports');

// Create indexes for better performance
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "createdAt": 1 });

// Registrations collection
db.registrations.createIndex({ "registrationId": 1 }, { unique: true });
db.registrations.createIndex({ "propertyId": 1 });
db.registrations.createIndex({ "ownerId": 1 });
db.registrations.createIndex({ "status": 1 });
db.registrations.createIndex({ "registrationNumber": 1 }, { unique: true });
db.registrations.createIndex({ "address": "text", "ownerName": "text" });

// Complaints collection
db.complaints.createIndex({ "complaintId": 1 }, { unique: true });
db.complaints.createIndex({ "propertyId": 1 });
db.complaints.createIndex({ "complainantId": 1 });
db.complaints.createIndex({ "status": 1 });
db.complaints.createIndex({ "complaintDate": 1 });
db.complaints.createIndex({ "priority": 1 });

// Violation cases collection
db.violation_cases.createIndex({ "caseId": 1 }, { unique: true });
db.violation_cases.createIndex({ "propertyId": 1 });
db.violation_cases.createIndex({ "registrationId": 1 });
db.violation_cases.createIndex({ "status": 1 });
db.violation_cases.createIndex({ "severity": 1 });
db.violation_cases.createIndex({ "openedDate": 1 });
db.violation_cases.createIndex({ "assignedTo": 1 });

// Properties collection
db.properties.createIndex({ "propertyId": 1 }, { unique: true });
db.properties.createIndex({ "address": "text" });
db.properties.createIndex({ "coordinates": "2dsphere" });
db.properties.createIndex({ "ownerId": 1 });
db.properties.createIndex({ "zoningType": 1 });
db.properties.createIndex({ "status": 1 });

// Inspections collection
db.inspections.createIndex({ "inspectionId": 1 }, { unique: true });
db.inspections.createIndex({ "propertyId": 1 });
db.inspections.createIndex({ "inspectorId": 1 });
db.inspections.createIndex({ "inspectionDate": 1 });
db.inspections.createIndex({ "status": 1 });

// Enforcement actions collection
db.enforcement_actions.createIndex({ "actionId": 1 }, { unique: true });
db.enforcement_actions.createIndex({ "caseId": 1 });
db.enforcement_actions.createIndex({ "propertyId": 1 });
db.enforcement_actions.createIndex({ "actionDate": 1 });
db.enforcement_actions.createIndex({ "actionType": 1 });

// Audit logs collection
db.audit_logs.createIndex({ "logId": 1 }, { unique: true });
db.audit_logs.createIndex({ "userId": 1 });
db.audit_logs.createIndex({ "action": 1 });
db.audit_logs.createIndex({ "timestamp": 1 });
db.audit_logs.createIndex({ "resourceType": 1 });
db.audit_logs.createIndex({ "resourceId": 1 });

// Notifications collection
db.notifications.createIndex({ "notificationId": 1 }, { unique: true });
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "type": 1 });
db.notifications.createIndex({ "status": 1 });
db.notifications.createIndex({ "createdAt": 1 });

// Settings collection
db.settings.createIndex({ "key": 1 }, { unique: true });
db.settings.createIndex({ "category": 1 });

// Reports collection
db.reports.createIndex({ "reportId": 1 }, { unique: true });
db.reports.createIndex({ "type": 1 });
db.reports.createIndex({ "generatedBy": 1 });
db.reports.createIndex({ "generatedAt": 1 });

// Create user with admin role
db.users.insertOne({
  userId: "admin-001",
  email: "admin@hawaiicounty.gov",
  firstName: "System",
  lastName: "Administrator",
  role: "admin",
  status: "active",
  permissions: [
    "users.read",
    "users.write",
    "registrations.read",
    "registrations.write",
    "complaints.read",
    "complaints.write",
    "violations.read",
    "violations.write",
    "inspections.read",
    "inspections.write",
    "enforcement.read",
    "enforcement.write",
    "reports.read",
    "reports.write",
    "settings.read",
    "settings.write",
    "system.admin"
  ],
  lastLogin: null,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create sample settings
db.settings.insertMany([
  {
    key: "system.name",
    value: "Hawaii TVR Compliance Dashboard",
    category: "system",
    description: "System name displayed in header and emails",
    updatedAt: new Date()
  },
  {
    key: "system.version",
    value: "1.0.0",
    category: "system",
    description: "Current system version",
    updatedAt: new Date()
  },
  {
    key: "complaint.auto_assign",
    value: true,
    category: "complaints",
    description: "Automatically assign complaints to inspectors",
    updatedAt: new Date()
  },
  {
    key: "violation.sla_days",
    value: 30,
    category: "violations",
    description: "SLA for resolving violations in days",
    updatedAt: new Date()
  },
  {
    key: "notification.email_enabled",
    value: true,
    category: "notifications",
    description: "Enable email notifications",
    updatedAt: new Date()
  },
  {
    key: "registration.auto_expire_days",
    value: 365,
    category: "registrations",
    description: "Number of days before registration expires",
    updatedAt: new Date()
  }
]);

// Create sample property for testing
db.properties.insertOne({
  propertyId: "PROP-DEMO-001",
  address: "1234 Kamehameha Hwy, Honolulu, HI 96813",
  coordinates: [21.3099, -157.8581],
  ownerId: "owner-001",
  zoningType: "Residential",
  maxOccupancy: 6,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create sample registration
db.registrations.insertOne({
  registrationId: "REG-DEMO-001",
  propertyId: "PROP-DEMO-001",
  registrationNumber: "TVR-2023-DEMO-001",
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
      url: "/documents/applications/TVR-2023-DEMO-001.pdf",
      uploadedAt: new Date("2023-01-15")
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create sample complaint
db.complaints.insertOne({
  complaintId: "COMP-DEMO-001",
  propertyId: "PROP-DEMO-001",
  registrationId: "REG-DEMO-001",
  complainantId: "citizen-001",
  type: "noise_complaint",
  priority: "medium",
  status: "open",
  description: "Excessive noise from vacation rental guests during late hours",
  complaintDate: new Date("2023-12-01"),
  assignedTo: "inspector-001",
  notes: [
    {
      note: "Initial complaint received via phone call",
      addedBy: "system",
      addedAt: new Date("2023-12-01")
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create sample violation case
db.violation_cases.createIndex({ "caseId": 1 }, { unique: true });
db.violation_cases.createIndex({ "propertyId": 1 });
db.violation_cases.createIndex({ "registrationId": 1 });
db.violation_cases.createIndex({ "status": 1 });
db.violation_cases.createIndex({ "severity": 1 });
db.violation_cases.createIndex({ "openedDate": 1 });
db.violation_cases.createIndex({ "assignedTo": 1 });

db.violation_cases.insertOne({
  caseId: "CASE-DEMO-001",
  propertyId: "PROP-DEMO-001",
  registrationId: "REG-DEMO-001",
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
    }
  ],
  violations: [
    {
      code: "TVR-001",
      description: "Operating without TVR registration",
      fine: 1000
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create database user for the application
db.createUser({
  user: 'dashboard_user',
  pwd: 'dashboard_password',
  roles: [
    {
      role: 'readWrite',
      db: 'hawaii-tvr-dashboard'
    }
  ]
});

print('MongoDB initialization completed for Hawaii TVR Dashboard');
print('Collections created and indexed');
print('Sample data seeded');
print('Application user created: dashboard_user');
