import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Filter, Plus, Eye, Edit2, Trash2, Clock, CheckCircle, X, Users, FileText, Upload, Download, Calendar, DollarSign, ShieldCheck, MessageSquare, User, Link as LinkIcon, Paperclip, Tag, ChevronDown, ArrowLeft } from 'lucide-react';

const ViolationCaseManagement = () => {
    const [activeTab, setActiveTab] = useState('cases');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [selectedCase, setSelectedCase] = useState(null);

    // Violation Cases with complete case management data
    const [violationCases, setViolationCases] = useState([
        {
            id: 1,
            caseNumber: 'VC-2024-001',
            propertyAddress: '123 Beach Road, Hilo, HI 96720',
            ownerName: 'John Doe',
            violationType: 'Unauthorized TVR Operation',
            severity: 'high',
            status: 'under_investigation',
            priority: 'high',
            dateReported: '2024-03-10',
            assignedTo: 'Officer Jane Smith',
            department: 'Compliance',
            estimatedFine: 1000.00,
            description: 'Property operating as TVR without proper registration',
            propertyStatus: 'unregistered',
            exemptionStatus: 'none',
            exemptionReason: '',
            exemptionDate: null,
            
            // Investigation details
            investigation: {
                initiated: '2024-03-10',
                investigator: 'Officer Jane Smith',
                status: 'active',
                scheduledDate: '2024-03-15',
                findings: 'Preliminary evidence suggests unauthorized operation',
                evidence: [
                    { id: 1, type: 'photo', name: 'property_photo_1.jpg', date: '2024-03-10', uploadedBy: 'Jane Smith' },
                    { id: 2, type: 'document', name: 'neighbor_complaint.pdf', date: '2024-03-09', uploadedBy: 'Anonymous' }
                ]
            },
            
            // Linked TVR Records
            linkedTVRRecords: [
                { id: 1, registrationNumber: 'TVR-2024-001', status: 'pending', submittedDate: '2024-02-15' }
            ],
            
            // Staff assignments
            assignments: [
                { id: 1, staffId: 1, staffName: 'Officer Jane Smith', role: 'Lead Investigator', assignedDate: '2024-03-10', status: 'active' },
                { id: 2, staffId: 2, staffName: 'Officer Mike Johnson', role: 'Support', assignedDate: '2024-03-11', status: 'active' }
            ],
            
            // Internal notes
            internalNotes: [
                { id: 1, author: 'Officer Jane Smith', date: '2024-03-10', content: 'Initial complaint received from neighbor about nightly noise and short-term rentals.', type: 'investigation' },
                { id: 2, author: 'Officer Jane Smith', date: '2024-03-11', content: 'Property inspection scheduled for March 15th. Need to verify occupancy and rental activity.', type: 'planning' },
                { id: 3, author: 'Officer Mike Johnson', date: '2024-03-12', content: 'Reviewed online listings for this address. Found multiple Airbnb and VRBO listings.', type: 'evidence' }
            ],
            
            // Status tracking
            statusHistory: [
                { id: 1, status: 'reported', date: '2024-03-10', changedBy: 'System', notes: 'Case created from complaint' },
                { id: 2, status: 'assigned', date: '2024-03-10', changedBy: 'Officer Jane Smith', notes: 'Case assigned to investigation team' },
                { id: 3, status: 'under_investigation', date: '2024-03-11', changedBy: 'Officer Jane Smith', notes: 'Investigation initiated' }
            ],
            
            // Outcome tracking
            outcomes: {
                warning: false,
                cancellation: false,
                finesPaid: false,
                lienFiled: false,
                suspension: false,
                courtAction: false
            }
        },
        {
            id: 2,
            caseNumber: 'VC-2024-002',
            propertyAddress: '456 Ocean View, Kona, HI 96740',
            ownerName: 'Jane Smith',
            violationType: 'Exceeding Occupancy Limits',
            severity: 'medium',
            status: 'resolved',
            priority: 'medium',
            dateReported: '2024-02-28',
            assignedTo: 'Officer Mike Johnson',
            department: 'Compliance',
            estimatedFine: 500.00,
            description: 'Property exceeding maximum occupancy limits',
            propertyStatus: 'exempt',
            exemptionStatus: 'granted',
            exemptionReason: 'Religious institution exemption',
            exemptionDate: '2024-02-01',
            
            investigation: {
                initiated: '2024-03-01',
                investigator: 'Officer Mike Johnson',
                status: 'completed',
                completedDate: '2024-03-10',
                findings: 'Confirmed occupancy of 8 people in 2-bedroom property (limit is 4)',
                evidence: [
                    { id: 1, type: 'photo', name: 'occupancy_photo.jpg', date: '2024-03-05', uploadedBy: 'Mike Johnson' },
                    { id: 2, type: 'document', name: 'inspection_report.pdf', date: '2024-03-10', uploadedBy: 'Mike Johnson' }
                ]
            },
            
            linkedTVRRecords: [
                { id: 2, registrationNumber: 'TVR-2024-002', status: 'approved', submittedDate: '2024-01-20' }
            ],
            
            assignments: [
                { id: 1, staffId: 2, staffName: 'Officer Mike Johnson', role: 'Lead Investigator', assignedDate: '2024-03-01', status: 'completed' }
            ],
            
            internalNotes: [
                { id: 1, author: 'Officer Mike Johnson', date: '2024-03-01', content: 'Complaint received about overcrowding at property.', type: 'investigation' },
                { id: 2, author: 'Officer Mike Johnson', date: '2024-03-05', content: 'Site inspection conducted. Found 8 occupants in 2-bedroom unit.', type: 'evidence' },
                { id: 3, author: 'Officer Mike Johnson', date: '2024-03-10', content: 'Owner issued warning and given 30 days to comply.', type: 'resolution' }
            ],
            
            statusHistory: [
                { id: 1, status: 'reported', date: '2024-02-28', changedBy: 'System', notes: 'Case created from complaint' },
                { id: 2, status: 'assigned', date: '2024-03-01', changedBy: 'Officer Mike Johnson', notes: 'Case assigned to investigation team' },
                { id: 3, status: 'under_investigation', date: '2024-03-01', changedBy: 'Officer Mike Johnson', notes: 'Investigation initiated' },
                { id: 4, status: 'warning_issued', date: '2024-03-10', changedBy: 'Officer Mike Johnson', notes: 'Warning issued to property owner' },
                { id: 5, status: 'resolved', date: '2024-03-10', changedBy: 'Officer Mike Johnson', notes: 'Case resolved with warning' }
            ],
            
            outcomes: {
                warning: true,
                warningDate: '2024-03-10',
                cancellation: false,
                finesPaid: false,
                lienFiled: false,
                suspension: false,
                courtAction: false
            }
        },
        {
            id: 3,
            caseNumber: 'VC-2024-003',
            propertyAddress: '789 Mountain Drive, Waimea, HI 96743',
            ownerName: 'Bob Johnson',
            violationType: 'Nonconforming Use',
            severity: 'medium',
            status: 'under_review',
            priority: 'medium',
            dateReported: '2024-01-20',
            assignedTo: 'Officer Sarah Wilson',
            department: 'Compliance',
            estimatedFine: 250.00,
            description: 'Property operating under nonconforming use without proper certificate',
            propertyStatus: 'pending',
            exemptionStatus: 'none',
            exemptionReason: '',
            exemptionDate: null,
            
            investigation: {
                initiated: '2024-01-22',
                investigator: 'Officer Sarah Wilson',
                status: 'active',
                scheduledDate: '2024-02-01',
                findings: 'Property appears to be operating as TVR in residential zone',
                evidence: [
                    { id: 1, type: 'document', name: 'zoning_verification.pdf', date: '2024-01-21', uploadedBy: 'Sarah Wilson' },
                    { id: 2, type: 'photo', name: 'property_exterior.jpg', date: '2024-01-20', uploadedBy: 'Sarah Wilson' }
                ]
            },
            
            linkedTVRRecords: [
                { id: 3, registrationNumber: 'TVR-2024-003', status: 'pending', submittedDate: '2024-01-15' }
            ],
            
            assignments: [
                { id: 1, staffId: 3, staffName: 'Officer Sarah Wilson', role: 'Lead Investigator', assignedDate: '2024-01-22', status: 'active' }
            ],
            
            internalNotes: [
                { id: 1, author: 'Officer Sarah Wilson', date: '2024-01-22', content: 'Initial investigation started for nonconforming use violation.', type: 'investigation' },
                { id: 2, author: 'Officer Sarah Wilson', date: '2024-01-23', content: 'Zoning review required. Property may qualify for exemption.', type: 'planning' },
                { id: 3, author: 'Officer Sarah Wilson', date: '2024-01-25', content: 'Owner contacted regarding exemption application process.', type: 'communication' }
            ],
            
            statusHistory: [
                { id: 1, status: 'reported', date: '2024-01-20', changedBy: 'System', notes: 'Case created from complaint' },
                { id: 2, status: 'assigned', date: '2024-01-22', changedBy: 'Officer Sarah Wilson', notes: 'Case assigned to investigation team' },
                { id: 3, status: 'under_review', date: '2024-01-25', changedBy: 'Officer Sarah Wilson', notes: 'Case under review for exemption eligibility' }
            ],
            
            outcomes: {
                warning: false,
                cancellation: false,
                finesPaid: false,
                lienFiled: false,
                suspension: false,
                courtAction: false
            }
        }
    ]);

    // Staff members for assignment
    const [staffMembers] = useState([
        { id: 1, name: 'Officer Jane Smith', role: 'Lead Investigator', department: 'Compliance', active: true },
        { id: 2, name: 'Officer Mike Johnson', role: 'Investigator', department: 'Compliance', active: true },
        { id: 3, name: 'Officer Sarah Wilson', role: 'Legal Counsel', department: 'Legal', active: true },
        { id: 4, name: 'Officer Tom Brown', role: 'Evidence Technician', department: 'Compliance', active: true }
    ]);

    const tabs = [
        { id: 'cases', label: 'Violation Cases', icon: AlertTriangle },
        { id: 'investigations', label: 'Investigations', icon: Search },
        { id: 'evidence', label: 'Evidence Management', icon: FileText },
        { id: 'outcomes', label: 'Outcomes', icon: CheckCircle }
    ];

    const handleStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'under_investigation': return 'bg-blue-100 text-blue-800';
            case 'warning_issued': return 'bg-yellow-100 text-yellow-800';
            case 'court_action': return 'bg-red-100 text-red-800';
            case 'suspended': return 'bg-purple-100 text-purple-800';
            case 'pending': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const handleStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle className="w-4 h-4" />;
            case 'under_investigation': return <Eye className="w-4 h-4" />;
            case 'warning_issued': return <AlertTriangle className="w-4 h-4" />;
            case 'court_action': return <X className="w-4 h-4" />;
            case 'suspended': return <ShieldCheck className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const handleInitiateInvestigation = (caseId) => {
        setViolationCases(violationCases.map(case_ => 
            case_.id === caseId 
                ? { 
                    ...case_, 
                    status: 'under_investigation',
                    investigation: {
                        ...case_.investigation,
                        initiated: new Date().toISOString().split('T')[0],
                        status: 'active'
                    }
                }
                : case_
        ));
    };

    const handleAssignStaff = (caseId, staffId) => {
        const staff = staffMembers.find(s => s.id === staffId);
        if (staff) {
            setViolationCases(violationCases.map(case_ => 
                case_.id === caseId 
                    ? { 
                        ...case_, 
                        assignedTo: staff.name,
                        assignments: [
                            ...case_.assignments,
                            {
                                id: case_.assignments.length + 1,
                                staffId: staffId,
                                staffName: staff.name,
                                role: staff.role,
                                assignedDate: new Date().toISOString().split('T')[0],
                                status: 'active'
                            }
                        ]
                    }
                : case_
            ));
        }
    };

    const handleAddInternalNote = (caseId, note) => {
        setViolationCases(violationCases.map(case_ => 
            case_.id === caseId 
                ? { 
                    ...case_, 
                    internalNotes: [
                        ...case_.internalNotes,
                        {
                            id: case_.internalNotes.length + 1,
                            author: 'Current User',
                            date: new Date().toISOString().split('T')[0],
                            content: note,
                            type: 'investigation'
                        }
                    ]
                }
                : case_
        ));
    };

    const handleUpdateExemption = (caseId, exemptionStatus, exemptionReason) => {
        setViolationCases(violationCases.map(case_ => 
            case_.id === caseId 
                ? { 
                    ...case_, 
                    exemptionStatus: exemptionStatus,
                    exemptionReason: exemptionReason,
                    exemptionDate: exemptionStatus === 'granted' ? new Date().toISOString().split('T')[0] : null,
                    propertyStatus: exemptionStatus === 'granted' ? 'exempt' : case_.propertyStatus
                }
                : case_
        ));
    };

    const filteredCases = violationCases.filter(case_ => {
        const matchesSearch = case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           case_.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           case_.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Navigation Header */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        to="/violations"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Violation Cases
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Violation Case Management</h1>
                        <p className="text-slate-600">Complete case management system for TVR violations with investigations, evidence tracking, and outcomes.</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-hawaii-ocean text-hawaii-ocean'
                                    : 'border-transparent text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Violation Cases Tab */}
            {activeTab === 'cases' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Violation Cases</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search cases..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="under_investigation">Under Investigation</option>
                                <option value="warning_issued">Warning Issued</option>
                                <option value="resolved">Resolved</option>
                                <option value="court_action">Court Action</option>
                            </select>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                            >
                                <option value="all">All Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {filteredCases.map((case_) => (
                            <div key={case_.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-medium text-slate-800">{case_.caseNumber}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${handleStatusColor(case_.status)}`}>
                                                {handleStatusIcon(case_.status)}
                                                {case_.status.replace('_', ' ')}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                case_.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                case_.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {case_.priority} priority
                                            </span>
                                        </div>
                                        <p className="text-slate-600 mb-1">{case_.propertyAddress}</p>
                                        <p className="text-slate-600 mb-1">Owner: {case_.ownerName}</p>
                                        <p className="text-sm text-slate-600">Violation: {case_.violationType}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                            <span>Reported: {case_.dateReported}</span>
                                            <span>Assigned: {case_.assignedTo}</span>
                                            <span>Est. Fine: ${case_.estimatedFine.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setSelectedCase(case_)}
                                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                        {case_.status === 'pending' && (
                                            <button 
                                                onClick={() => handleInitiateInvestigation(case_.id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                            >
                                                <Search className="w-4 h-4" />
                                                Start Investigation
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Investigations Tab */}
            {activeTab === 'investigations' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Investigations</h2>
                    
                    <div className="space-y-4">
                        {violationCases.filter(c => c.investigation).map((case_) => (
                            <div key={case_.id} className="bg-white border border-slate-200 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">{case_.caseNumber}</h3>
                                        <p className="text-slate-600">{case_.propertyAddress}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                            <span>Investigator: {case_.investigation.investigator}</span>
                                            <span>Status: {case_.investigation.status}</span>
                                            <span>Initiated: {case_.investigation.initiated}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-2">Investigation Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><strong>Status:</strong> {case_.investigation.status}</div>
                                            <div><strong>Findings:</strong> {case_.investigation.findings}</div>
                                            {case_.investigation.scheduledDate && (
                                                <div><strong>Scheduled:</strong> {case_.investigation.scheduledDate}</div>
                                            )}
                                            {case_.investigation.completedDate && (
                                                <div><strong>Completed:</strong> {case_.investigation.completedDate}</div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-2">Staff Assignments</h4>
                                        <div className="space-y-2">
                                            {case_.assignments.map(assignment => (
                                                <div key={assignment.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                                    <div>
                                                        <div className="text-sm font-medium">{assignment.staffName}</div>
                                                        <div className="text-xs text-slate-600">{assignment.role}</div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {assignment.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-slate-700 mb-2">Internal Notes</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {case_.internalNotes.map(note => (
                                            <div key={note.id} className="p-3 bg-slate-50 rounded">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-sm font-medium">{note.author}</span>
                                                    <span className="text-xs text-slate-500">{note.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{note.content}</p>
                                                <span className="text-xs text-slate-500 mt-1">Type: {note.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Evidence Management Tab */}
            {activeTab === 'evidence' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Evidence Management</h2>
                    
                    <div className="space-y-4">
                        {violationCases.filter(c => c.investigation?.evidence).map((case_) => (
                            <div key={case_.id} className="bg-white border border-slate-200 rounded-lg p-6">
                                <h3 className="text-lg font-medium text-slate-800 mb-4">{case_.caseNumber} - {case_.propertyAddress}</h3>
                                
                                <div className="space-y-3">
                                    {case_.investigation.evidence.map(evidence => (
                                        <div key={evidence.id} className="flex items-center justify-between p-3 border border-slate-200 rounded">
                                            <div className="flex items-center gap-3">
                                                {evidence.type === 'photo' ? (
                                                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                                                        <Eye className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                ) : (
                                                    <FileText className="w-10 h-10 text-slate-600" />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium">{evidence.name}</div>
                                                    <div className="text-xs text-slate-600">
                                                        {evidence.type} • {evidence.date} • {evidence.uploadedBy}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                                                    <Eye className="w-3 h-3" />
                                                    View
                                                </button>
                                                <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                                                    <Download className="w-3 h-3" />
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Outcomes Tab */}
            {activeTab === 'outcomes' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Case Outcomes</h2>
                    
                    <div className="space-y-4">
                        {violationCases.map((case_) => (
                            <div key={case_.id} className="bg-white border border-slate-200 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-medium text-slate-800 mb-1">{case_.caseNumber}</h3>
                                        <p className="text-slate-600 mb-1">{case_.propertyAddress}</p>
                                        <p className="text-sm text-slate-600">Owner: {case_.ownerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-slate-800">
                                            ${case_.estimatedFine.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-slate-600">Est. Fine</div>
                                    </div>
                                </div>
                                
                                {/* Property Status and Exemption */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Property Status:</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            case_.propertyStatus === 'exempt' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : case_.propertyStatus === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {case_.propertyStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Exemption Status:</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            case_.exemptionStatus === 'granted'
                                                ? 'bg-green-100 text-green-800'
                                                : case_.exemptionStatus === 'pending'
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-slate-100 text-slate-800'
                                        }`}>
                                            {case_.exemptionStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    {case_.exemptionDate && (
                                        <div className="text-xs text-slate-500">
                                            Exemption Date: {case_.exemptionDate}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Warning</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.outcomes.warning}
                                                onChange={(e) => handleUpdateOutcome(case_.id, 'warning', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.outcomes.warning ? 'Issued on ' + (case_.outcomes.warningDate || 'TBD') : 'Not issued'}
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Property Exemption</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.exemptionStatus === 'granted'}
                                                onChange={(e) => handleUpdateExemption(case_.id, e.target.checked ? 'granted' : 'none', '')}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.exemptionStatus === 'granted' ? 'Granted on ' + (case_.exemptionDate || 'TBD') : 'Not exempt'}
                                            </span>
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="Exemption reason (if granted)"
                                                value={case_.exemptionReason || ''}
                                                onChange={(e) => handleUpdateExemption(case_.id, case_.exemptionStatus, e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent text-sm"
                                                disabled={case_.exemptionStatus !== 'granted'}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Cancellation</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.outcomes.cancellation}
                                                onChange={(e) => handleUpdateOutcome(case_.id, 'cancellation', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.outcomes.cancellation ? 'Registration cancelled' : 'Not cancelled'}
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Fines Paid</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.outcomes.finesPaid}
                                                onChange={(e) => handleUpdateOutcome(case_.id, 'finesPaid', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.outcomes.finesPaid ? 'Fines paid' : 'Fines outstanding'}
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Lien Filed</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.outcomes.lienFiled}
                                                onChange={(e) => handleUpdateOutcome(case_.id, 'lienFiled', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.outcomes.lienFiled ? 'Lien filed' : 'No lien filed'}
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Suspension</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.outcomes.suspension}
                                                onChange={(e) => handleUpdateOutcome(case_.id, 'suspension', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.outcomes.suspension ? 'Registration suspended' : 'Not suspended'}
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Court Action</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={case_.outcomes.courtAction}
                                                onChange={(e) => handleUpdateOutcome(case_.id, 'courtAction', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                {case_.outcomes.courtAction ? 'Court action initiated' : 'No court action'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViolationCaseManagement;
