import React, { useState } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertTriangle, Eye, OctagonAlert, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkflowStatusBadge from '../workflows/WorkflowStatusBadge';

const ComplaintsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Case creation state
    const [showCaseModal, setShowCaseModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [newCase, setNewCase] = useState({
        propertyAddress: '',
        ownerName: '',
        violationType: 'Other',
        severity: 'medium',
        description: '',
        source: 'complaint'
    });

    // Mock complaints data
    const complaints = [
        { id: 1, number: 'COMP-2026-001', property: '74-5599 Alii Dr', type: 'Noise', status: 'investigating', submitted: '2026-01-25', priority: 'High', anonymous: false },
        { id: 2, number: 'COMP-2026-002', property: '69-425 Waikoloa Beach Dr', type: 'Occupancy Violation', status: 'received', submitted: '2026-01-26', priority: 'Medium', anonymous: true },
        { id: 3, number: 'COMP-2026-003', property: '77-6425 Alii Dr', type: 'Parking', status: 'resolved', submitted: '2026-01-20', priority: 'Low', anonymous: false },
        { id: 4, number: 'COMP-2026-004', property: '78-7070 Alii Dr', type: 'Illegal Event', status: 'investigating', submitted: '2026-01-24', priority: 'High', anonymous: false },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            received: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Received' },
            investigating: { color: 'bg-[#F2E7A1] text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'Investigating' },
            resolved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Resolved' },
            closed: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: CheckCircle, label: 'Closed' },
        };
        return badges[status] || badges.received;
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openCaseModal = (complaint) => {
        setSelectedComplaint(complaint);
        setNewCase({
            propertyAddress: complaint.property,
            ownerName: 'Property Owner', // In real app, this would come from property data
            violationType: complaint.type,
            severity: complaint.priority === 'High' ? 'high' : complaint.priority === 'Medium' ? 'medium' : 'low',
            description: `Based on complaint ${complaint.number}: ${complaint.type} reported.`,
            source: 'complaint'
        });
        setShowCaseModal(true);
    };

    const handleCreateCase = () => {
        const caseNumber = `VC-2024-${Math.floor(Math.random() * 1000)}`;
        
        const caseData = {
            ...newCase,
            caseNumber,
            status: 'reported',
            createdDate: new Date().toISOString().split('T')[0],
            estimatedFine: newCase.severity === 'high' ? 1000 : newCase.severity === 'medium' ? 500 : 250,
            complaintId: selectedComplaint?.id,
            complaintNumber: selectedComplaint?.number
        };
        
        // Format for ViolationCases
        const caseToSave = {
            id: Date.now(),
            caseNumber,
            property: newCase.propertyAddress,
            tmk: 'Pending',
            owner: newCase.ownerName,
            violationType: newCase.violationType,
            status: 'under-investigation',
            priority: newCase.severity,
            created: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            fine: `$${newCase.severity === 'high' ? '1,000' : newCase.severity === 'medium' ? '500' : '250'}`,
            slaStatus: 'on-track'
        };

        // Persist to session storage
        const existingCases = JSON.parse(sessionStorage.getItem('newViolationCases') || '[]');
        sessionStorage.setItem('newViolationCases', JSON.stringify([caseToSave, ...existingCases]));
        
        console.log('Creating case from complaint:', caseData);
        alert(`Case ${caseNumber} created successfully from complaint!`);
        
        setNewCase({
            propertyAddress: '',
            ownerName: '',
            violationType: 'Other',
            severity: 'medium',
            description: '',
            source: 'complaint'
        });
        setSelectedComplaint(null);
        setShowCaseModal(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Complaint Management</h1>
                    <p className="text-slate-500">Track and investigate public complaints</p>
                </div>
                <Link
                    to="/submit-complaint"
                    className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800"
                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                >
                    New Complaint
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Complaints</p>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-3xl font-bold text-slate-800">{complaints.length}</p>
                        <img src="/total_count.png" alt="Total complaints" className="w-12 h-full" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Under Investigation</p>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-3xl font-bold text-blue-600">
                            {complaints.filter(c => c.status !== 'investigating').length}
                        </p>
                        <img src="/active_cases.png" alt="Active Cases" className="w-12 h-full" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Resolved</p>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-3xl font-bold text-green-600">
                            {complaints.filter(c => c.status === 'resolved').length}
                        </p>
                        <img src="/decided.png" alt="Resolved" className="w-12 h-full" />
                    </div>

                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">High Priority</p>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-3xl font-bold text-red-600">
                            {complaints.filter(c => c.priority === 'High').length}
                        </p>
                        <OctagonAlert className='w-12 h-full text-red-600' />
                    </div>

                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by property, complaint number, or type..."
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                        >
                            <option value="all">All Statuses</option>
                            <option value="received">Received</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Complaint #</th>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Workflow Progress</th>
                            <th className="px-6 py-4">Submitted</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredComplaints.map((complaint) => {
                            const statusBadge = getStatusBadge(complaint.status);
                            return (
                                <tr key={complaint.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                                        {complaint.number}
                                        {complaint.anonymous && (
                                            <span className="ml-2 text-xs text-slate-500">(Anonymous)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{complaint.property}</td>
                                    <td className="px-6 py-4 text-slate-700">{complaint.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold text-xs ${complaint.priority === 'High' ? 'text-red-600' :
                                            complaint.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                            }`}>
                                            {complaint.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <WorkflowStatusBadge 
                                            recordId={complaint.number}
                                            recordType="complaint-investigation"
                                            compact={false}
                                            showProgress={true}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(complaint.submitted).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/complaint/${complaint.id}`}
                                                className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Review
                                            </Link>
                                            <button
                                                onClick={() => openCaseModal(complaint)}
                                                className="text-orange-600 font-medium hover:text-orange-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Create Case
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredComplaints.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No complaints found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Case Creation Modal */}
            {showCaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Create Case from Complaint</h2>
                            <button
                                onClick={() => setShowCaseModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {selectedComplaint && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h3 className="font-medium text-blue-900 mb-2">Complaint Details</h3>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p><strong>Complaint #:</strong> {selectedComplaint.number}</p>
                                    <p><strong>Property:</strong> {selectedComplaint.property}</p>
                                    <p><strong>Type:</strong> {selectedComplaint.type}</p>
                                    <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Property Address *
                                </label>
                                <input
                                    type="text"
                                    value={newCase.propertyAddress}
                                    onChange={(e) => setNewCase({...newCase, propertyAddress: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Enter property address"
                                />
                            </div>
                             
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Owner Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCase.ownerName}
                                    onChange={(e) => setNewCase({...newCase, ownerName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Enter owner name"
                                />
                            </div>
                             
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Violation Type *
                                </label>
                                <select
                                    value={newCase.violationType}
                                    onChange={(e) => setNewCase({...newCase, violationType: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="Noise">Noise</option>
                                    <option value="Occupancy Violation">Occupancy Violation</option>
                                    <option value="Parking">Parking</option>
                                    <option value="Illegal Event">Illegal Event</option>
                                    <option value="Safety Violation">Safety Violation</option>
                                    <option value="Zoning Violation">Zoning Violation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                             
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Severity *
                                </label>
                                <select
                                    value={newCase.severity}
                                    onChange={(e) => setNewCase({...newCase, severity: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                             
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={newCase.description}
                                    onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Describe the case finding..."
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                            <p className="text-sm text-amber-800">
                                <strong>Source:</strong> Public Complaint
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                This case will be linked to the complaint selected.
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCaseModal(false)}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCase}
                                disabled={!newCase.propertyAddress || !newCase.ownerName || !newCase.description}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Case
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ComplaintsList;
