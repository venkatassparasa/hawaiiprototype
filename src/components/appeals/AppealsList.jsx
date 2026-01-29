import React, { useState } from 'react';
import { Search, Scale, Calendar, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppealsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock appeals data
    const appeals = [
        { id: 1, appealNumber: 'APP-2026-001', caseNumber: 'VC-2026-001', property: '74-5599 Alii Dr', appellant: 'John Doe', filed: '2026-01-20', hearing: '2026-02-15', status: 'pending', fineAmount: 1000 },
        { id: 2, appealNumber: 'APP-2026-002', caseNumber: 'VC-2026-002', property: '69-425 Waikoloa Beach Dr', appellant: 'Jane Smith', filed: '2026-01-22', hearing: '2026-02-20', status: 'scheduled', fineAmount: 2000 },
        { id: 3, appealNumber: 'APP-2025-045', caseNumber: 'VC-2025-089', property: '77-6425 Alii Dr', appellant: 'Bob Johnson', filed: '2025-12-10', hearing: '2026-01-15', status: 'decided', fineAmount: 1500, decision: 'Upheld' },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending Review' },
            scheduled: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar, label: 'Hearing Scheduled' },
            heard: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Scale, label: 'Heard' },
            decided: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Decided' },
            closed: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: CheckCircle, label: 'Closed' },
        };
        return badges[status] || badges.pending;
    };

    const filteredAppeals = appeals.filter(a => {
        const matchesSearch = a.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.appealNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.appellant.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Appeals Management</h1>
                    <p className="text-slate-500">Track and manage violation appeals</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Appeals</p>
                    <p className="text-3xl font-bold text-slate-800">{appeals.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {appeals.filter(a => a.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Hearings Scheduled</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {appeals.filter(a => a.status === 'scheduled').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Decided</p>
                    <p className="text-3xl font-bold text-green-600">
                        {appeals.filter(a => a.status === 'decided').length}
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
                                placeholder="Search by property, appeal number, or appellant..."
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
                            <option value="pending">Pending Review</option>
                            <option value="scheduled">Hearing Scheduled</option>
                            <option value="heard">Heard</option>
                            <option value="decided">Decided</option>
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
                            <th className="px-6 py-4">Appeal #</th>
                            <th className="px-6 py-4">Case #</th>
                            <th className="px-6 py-4">Property / Appellant</th>
                            <th className="px-6 py-4">Fine Amount</th>
                            <th className="px-6 py-4">Filed Date</th>
                            <th className="px-6 py-4">Hearing Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAppeals.map((appeal) => {
                            const statusBadge = getStatusBadge(appeal.status);
                            return (
                                <tr key={appeal.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{appeal.appealNumber}</td>
                                    <td className="px-6 py-4 font-mono text-slate-700">{appeal.caseNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{appeal.property}</div>
                                        <div className="text-xs text-slate-500">{appeal.appellant}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">${appeal.fineAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-700">{new Date(appeal.filed).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {appeal.hearing ? new Date(appeal.hearing).toLocaleDateString() : 'Not Scheduled'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                        {appeal.decision && (
                                            <div className="text-xs text-slate-600 mt-1">{appeal.decision}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/appeal/${appeal.id}`}
                                            className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredAppeals.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No appeals found matching your criteria.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AppealsList;
