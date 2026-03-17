import React, { useState } from 'react';
import { Calendar, Search, Filter, Clock, CheckCircle, AlertTriangle, User, Binoculars, CalendarCheck, CheckLine, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const InspectionScheduler = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCaseModal, setShowCaseModal] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [newCase, setNewCase] = useState({
        propertyAddress: '',
        ownerName: '',
        violationType: 'Inspection Finding',
        severity: 'medium',
        description: '',
        source: 'inspection'
    });

    // Mock inspection data
    const inspections = [
        { id: 1, property: '74-5599 Alii Dr', inspector: 'John Smith', date: '2026-02-01', time: '10:00 AM', status: 'scheduled', type: 'Initial Inspection' },
        { id: 2, property: '69-425 Waikoloa Beach Dr', inspector: 'Jane Doe', date: '2026-02-02', time: '2:00 PM', status: 'scheduled', type: 'Follow-up' },
        { id: 3, property: '77-6425 Alii Dr', inspector: 'Bob Johnson', date: '2026-01-28', time: '9:00 AM', status: 'completed', type: 'Compliance Check' },
        { id: 4, property: '78-7070 Alii Dr', inspector: 'Alice Williams', date: '2026-01-29', time: '1:00 PM', status: 'in-progress', type: 'Safety Inspection' },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            scheduled: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Scheduled' },
            'in-progress': { color: 'bg-[#F2E7A1] text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'In Progress' },
            completed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Completed' },
            cancelled: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: AlertTriangle, label: 'Cancelled' },
        };
        return badges[status] || badges.scheduled;
    };

    const filteredInspections = inspections.filter(i =>
        statusFilter === 'all' || i.status === statusFilter
    );

    const handleCreateCase = () => {
        // Generate case number
        const caseNumber = `VC-2024-${Math.floor(Math.random() * 1000)}`;
        
        // Create new case object
        const caseData = {
            ...newCase,
            caseNumber,
            status: 'reported',
            createdDate: new Date().toISOString().split('T')[0],
            estimatedFine: newCase.severity === 'high' ? 1000 : newCase.severity === 'medium' ? 500 : 250,
            inspectionId: selectedInspection?.id,
            inspectionType: selectedInspection?.type,
            inspector: selectedInspection?.inspector
        };
        
        // In a real app, this would save to a database
        console.log('Creating case from inspection:', caseData);
        
        // Show success message
        alert(`Case ${caseNumber} created successfully from inspection!`);
        
        // Reset form and close modal
        setNewCase({
            propertyAddress: '',
            ownerName: '',
            violationType: 'Inspection Finding',
            severity: 'medium',
            description: '',
            source: 'inspection'
        });
        setSelectedInspection(null);
        setShowCaseModal(false);
    };

    const openCaseModal = (inspection) => {
        setSelectedInspection(inspection);
        setNewCase({
            propertyAddress: inspection.property,
            ownerName: 'Property Owner', // In real app, this would come from property data
            violationType: 'Inspection Finding',
            severity: 'medium',
            description: `Issues found during ${inspection.type} on ${inspection.date}`,
            source: 'inspection'
        });
        setShowCaseModal(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Inspection Scheduler</h1>
                    <p className="text-slate-500">Schedule and manage property inspections</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setNewCase({
                                propertyAddress: '',
                                ownerName: '',
                                violationType: 'Inspection Finding',
                                severity: 'medium',
                                description: '',
                                source: 'inspection'
                            });
                            setSelectedInspection(null);
                            setShowCaseModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Case from Inspection
                    </button>
                    <button className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800"
                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                        Schedule Inspection
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className='flex-1'>
                        <p className="text-sm text-slate-500 mb-1">Total Inspections</p>
                        <p className="text-3xl font-bold text-slate-800">{inspections.length}</p>
                    </div>
                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-hawaii-ocean">
                        <Binoculars className="w-12 h-full"/>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className='flex-1'>
                    <p className="text-sm text-slate-500 mb-1">Scheduled</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {inspections.filter(i => i.status === 'scheduled').length}
                    </p>
                    </div>
                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-blue-600">
                        <CalendarCheck className="w-12 h-full"/>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className='flex-1'>
                    <p className="text-sm text-slate-500 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {inspections.filter(i => i.status === 'in-progress').length}
                    </p>
                    </div>
                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-yellow-600">
                        <Clock className="w-12 h-full"/>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className='flex-1'> 
                    <p className="text-sm text-slate-500 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                        {inspections.filter(i => i.status === 'completed').length}
                    </p>
                    </div>
                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-green-600">
                        <CheckLine className="w-12 h-full"/>
                    </div>

                </div>
            </div>

            {/* View Toggle & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'list' ? 'bg-hawaii-ocean text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'calendar' ? 'bg-hawaii-ocean text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                        >
                            Calendar View
                        </button>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                    >
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Inspections List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Inspector</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredInspections.map((inspection) => {
                            const statusBadge = getStatusBadge(inspection.status);
                            return (
                                <tr key={inspection.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900">{inspection.property}</td>
                                    <td className="px-6 py-4 text-slate-700">{inspection.type}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-700">{inspection.inspector}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900">{new Date(inspection.date).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-500">{inspection.time}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/inspection/${inspection.id}`}
                                                className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                View Details
                                            </Link>
                                            {(inspection.status === 'completed' || inspection.status === 'in-progress') && (
                                                <button
                                                    onClick={() => openCaseModal(inspection)}
                                                    className="text-orange-600 font-medium hover:text-orange-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Create Case
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredInspections.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No inspections found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Case Creation Modal */}
            {showCaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Create Case from Inspection</h2>
                            <button
                                onClick={() => setShowCaseModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {selectedInspection && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h3 className="font-medium text-blue-900 mb-2">Inspection Details</h3>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p><strong>Property:</strong> {selectedInspection.property}</p>
                                    <p><strong>Type:</strong> {selectedInspection.type}</p>
                                    <p><strong>Inspector:</strong> {selectedInspection.inspector}</p>
                                    <p><strong>Date:</strong> {selectedInspection.date} at {selectedInspection.time}</p>
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
                                    <option value="Inspection Finding">Inspection Finding</option>
                                    <option value="Safety Violation">Safety Violation</option>
                                    <option value="Zoning Violation">Zoning Violation</option>
                                    <option value="Noise Complaint">Noise Complaint</option>
                                    <option value="Parking Violation">Parking Violation</option>
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
                                    placeholder="Describe the inspection findings..."
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                            <p className="text-sm text-amber-800">
                                <strong>Source:</strong> Inspection Report
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                This case will be created based on inspection findings
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

export default InspectionScheduler;
