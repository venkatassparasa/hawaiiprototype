import React, { useState } from 'react';
import { Search, Filter, Download, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegistrationList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock registrations data
    const registrations = [
        { id: 1, number: 'TVR-2026-001', address: '74-5599 Alii Dr, Kailua-Kona', tmk: '7-7-4-008-002-0000', owner: 'John Doe', type: 'Hosted', status: 'approved', submitted: '2026-01-15', fee: '$250' },
        { id: 2, number: 'TVR-2026-002', address: '69-425 Waikoloa Beach Dr', tmk: '3-6-9-007-034', owner: 'Jane Smith', type: 'Un-hosted', status: 'under-review', submitted: '2026-01-20', fee: '$500' },
        { id: 3, number: 'TVR-2026-003', address: '77-6425 Alii Dr', tmk: '3-7-7-012-005', owner: 'Bob Johnson', type: 'Hosted', status: 'pending', submitted: '2026-01-22', fee: '$250' },
        { id: 4, number: 'TVR-2026-004', address: '78-7070 Alii Dr', tmk: '3-7-8-015-008', owner: 'Alice Williams', type: 'Un-hosted', status: 'rejected', submitted: '2026-01-18', fee: '$500' },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'highlight text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending' },
            'under-review': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Under Review' },
            approved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Rejected' },
        };
        return badges[status] || badges.pending;
    };

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.tmk.includes(searchTerm) ||
            reg.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">TVR Registrations</h1>
                    <p className="text-slate-500">Manage transient vacation rental registration applications</p>
                </div>
                <Link
                    to="/register"
                    className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800"
                >
                    New Registration
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
                                placeholder="Search by address, TMK, owner, or registration number..."
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
                            <option value="pending">Pending</option>
                            <option value="under-review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <button className="w-full px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Registrations</p>
                    <p className="text-3xl font-bold text-slate-800">{registrations.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {registrations.filter(r => r.status === 'pending' || r.status === 'under-review').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Approved</p>
                    <p className="text-3xl font-bold text-green-600">
                        {registrations.filter(r => r.status === 'approved').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">
                        {registrations.filter(r => r.status === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Registration #</th>
                            <th className="px-6 py-4">Property Address</th>
                            <th className="px-6 py-4">TMK</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Submitted</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRegistrations.map((reg) => {
                            const statusBadge = getStatusBadge(reg.status);
                            return (
                                <tr key={reg.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{reg.number}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{reg.address}</td>
                                    <td className="px-6 py-4 font-mono text-slate-500">{reg.tmk}</td>
                                    <td className="px-6 py-4 text-slate-700">{reg.owner}</td>
                                    <td className="px-6 py-4 text-slate-700">{reg.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(reg.submitted).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/registration/${reg.id}`}
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

                {filteredRegistrations.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No registrations found matching your criteria.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default RegistrationList;
