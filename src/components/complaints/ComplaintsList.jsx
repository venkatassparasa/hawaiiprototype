import React, { useState } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComplaintsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
            investigating: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'Investigating' },
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
                >
                    New Complaint
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Complaints</p>
                    <p className="text-3xl font-bold text-slate-800">{complaints.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Under Investigation</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {complaints.filter(c => c.status === 'investigating').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-green-600">
                        {complaints.filter(c => c.status === 'resolved').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">High Priority</p>
                    <p className="text-3xl font-bold text-red-600">
                        {complaints.filter(c => c.priority === 'High').length}
                    </p>
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
                                    <td className="px-6 py-4 text-slate-500">{new Date(complaint.submitted).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/complaint/${complaint.id}`}
                                            className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Review
                                        </Link>
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

        </div>
    );
};

export default ComplaintsList;
