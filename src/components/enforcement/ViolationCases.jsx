import React, { useState } from 'react';
import { Search, Filter, Clock, AlertTriangle, CheckCircle, XCircle, FileText, Calendar, DollarSign, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ViolationCases = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock violation cases data
    const cases = [
        {
            id: 1,
            caseNumber: 'VC-2026-001',
            property: '74-5599 Alii Dr, Kailua-Kona',
            tmk: '7-7-4-008-002-0000',
            owner: 'John Doe',
            violationType: 'Unregistered Operation',
            status: 'warning-issued',
            priority: 'high',
            created: '2026-01-15',
            dueDate: '2026-02-15',
            fine: '$1,000',
            slaStatus: 'on-track'
        },
        {
            id: 2,
            caseNumber: 'VC-2026-002',
            property: '69-425 Waikoloa Beach Dr',
            tmk: '3-6-9-007-034',
            owner: 'Jane Smith',
            violationType: 'Operational Standards',
            status: 'under-investigation',
            priority: 'medium',
            created: '2026-01-20',
            dueDate: '2026-02-20',
            fine: '$500',
            slaStatus: 'at-risk'
        },
        {
            id: 3,
            caseNumber: 'VC-2026-003',
            property: '77-6425 Alii Dr',
            tmk: '3-7-7-012-005',
            owner: 'Bob Johnson',
            violationType: 'Unpermitted Operation',
            status: 'fine-assessed',
            priority: 'high',
            created: '2026-01-10',
            dueDate: '2026-02-10',
            fine: '$2,000',
            slaStatus: 'overdue'
        },
        {
            id: 4,
            caseNumber: 'VC-2026-004',
            property: '78-7070 Alii Dr',
            tmk: '3-7-8-015-008',
            owner: 'Alice Williams',
            violationType: 'Safety Violation',
            status: 'resolved',
            priority: 'low',
            created: '2026-01-05',
            dueDate: '2026-01-25',
            fine: '$750',
            slaStatus: 'completed'
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            'under-investigation': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Under Investigation' },
            'warning-issued': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'Warning Issued' },
            'fine-assessed': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: DollarSign, label: 'Fine Assessed' },
            'lien-filed': { color: 'bg-red-100 text-red-700 border-red-200', icon: FileText, label: 'Lien Filed' },
            'suspended': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: XCircle, label: 'Suspended' },
            'resolved': { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Resolved' },
        };
        return badges[status] || badges['under-investigation'];
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            high: 'bg-red-50 text-red-700 border-red-200',
            medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            low: 'bg-slate-50 text-slate-700 border-slate-200',
        };
        return badges[priority] || badges.medium;
    };

    const getSLABadge = (slaStatus) => {
        const badges = {
            'on-track': { color: 'text-green-600', label: 'On Track' },
            'at-risk': { color: 'text-yellow-600', label: 'At Risk' },
            'overdue': { color: 'text-red-600', label: 'Overdue' },
            'completed': { color: 'text-slate-400', label: 'Completed' },
        };
        return badges[slaStatus] || badges['on-track'];
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.tmk.includes(searchTerm) ||
            c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Violation Cases</h1>
                    <p className="text-slate-500">Manage enforcement actions and compliance violations</p>
                </div>
                <Link
                    to="/case/new"
                    className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Case
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by property, TMK, owner, or case number..."
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                        >
                            <option value="all">All Statuses</option>
                            <option value="under-investigation">Under Investigation</option>
                            <option value="warning-issued">Warning Issued</option>
                            <option value="fine-assessed">Fine Assessed</option>
                            <option value="lien-filed">Lien Filed</option>
                            <option value="suspended">Suspended</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <button className="w-full px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Cases</p>
                    <p className="text-3xl font-bold text-slate-800">{cases.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Active</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {cases.filter(c => c.status !== 'resolved').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Overdue</p>
                    <p className="text-3xl font-bold text-red-600">
                        {cases.filter(c => c.slaStatus === 'overdue').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Fines Assessed</p>
                    <p className="text-3xl font-bold text-orange-600">
                        {cases.filter(c => c.status === 'fine-assessed').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-green-600">
                        {cases.filter(c => c.status === 'resolved').length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Case #</th>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Violation Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">SLA</th>
                            <th className="px-6 py-4">Fine</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCases.map((caseItem) => {
                            const statusBadge = getStatusBadge(caseItem.status);
                            const slaBadge = getSLABadge(caseItem.slaStatus);
                            return (
                                <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{caseItem.caseNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{caseItem.property}</div>
                                        <div className="text-xs text-slate-500 font-mono">{caseItem.tmk}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">{caseItem.violationType}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(caseItem.priority)}`}>
                                            {caseItem.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium ${slaBadge.color}`}>
                                            {slaBadge.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{caseItem.fine}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(caseItem.dueDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={caseItem.status === 'resolved' ? `/property/${caseItem.id}` : `/case/${caseItem.id}`}
                                            className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            {caseItem.status === 'resolved' ? 'View Property' : 'View Case'}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredCases.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No violation cases found matching your criteria.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ViolationCases;
