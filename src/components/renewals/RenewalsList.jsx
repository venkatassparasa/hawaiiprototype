import React, { useState } from 'react';
import { Search, RefreshCw, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RenewalsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock renewals data
    const renewals = [
        { id: 1, registrationNumber: 'TVR-2025-001', property: '74-5599 Alii Dr', owner: 'John Doe', expirationDate: '2026-03-15', status: 'upcoming', daysUntilExpiry: 45, renewalFee: 500 },
        { id: 2, registrationNumber: 'TVR-2025-002', property: '69-425 Waikoloa Beach Dr', owner: 'Jane Smith', expirationDate: '2026-02-28', status: 'pending', daysUntilExpiry: 30, renewalFee: 500 },
        { id: 3, registrationNumber: 'TVR-2024-089', property: '77-6425 Alii Dr', owner: 'Bob Johnson', expirationDate: '2026-01-15', status: 'expired', daysUntilExpiry: -13, renewalFee: 500 },
        { id: 4, registrationNumber: 'TVR-2025-034', property: '78-7070 Alii Dr', owner: 'Alice Williams', expirationDate: '2026-04-20', status: 'renewed', daysUntilExpiry: 82, renewalFee: 500 },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            upcoming: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Upcoming' },
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'Pending Renewal' },
            expired: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle, label: 'Expired' },
            renewed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Renewed' },
        };
        return badges[status] || badges.upcoming;
    };

    const filteredRenewals = renewals.filter(r => {
        const matchesSearch = r.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.owner.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Renewal Management</h1>
                    <p className="text-slate-500">Track and manage TVR registration renewals</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Renewals</p>
                    <p className="text-3xl font-bold text-slate-800">{renewals.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Upcoming (60 days)</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {renewals.filter(r => r.daysUntilExpiry > 0 && r.daysUntilExpiry <= 60).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {renewals.filter(r => r.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Expired</p>
                    <p className="text-3xl font-bold text-red-600">
                        {renewals.filter(r => r.status === 'expired').length}
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
                                placeholder="Search by property, registration number, or owner..."
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
                            <option value="upcoming">Upcoming</option>
                            <option value="pending">Pending Renewal</option>
                            <option value="expired">Expired</option>
                            <option value="renewed">Renewed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Registration #</th>
                            <th className="px-6 py-4">Property / Owner</th>
                            <th className="px-6 py-4">Expiration Date</th>
                            <th className="px-6 py-4">Days Until Expiry</th>
                            <th className="px-6 py-4">Renewal Fee</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRenewals.map((renewal) => {
                            const statusBadge = getStatusBadge(renewal.status);
                            return (
                                <tr key={renewal.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{renewal.registrationNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{renewal.property}</div>
                                        <div className="text-xs text-slate-500">{renewal.owner}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">{new Date(renewal.expirationDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${renewal.daysUntilExpiry < 0 ? 'text-red-600' :
                                                renewal.daysUntilExpiry <= 30 ? 'text-yellow-600' :
                                                    'text-green-600'
                                            }`}>
                                            {renewal.daysUntilExpiry < 0 ?
                                                `${Math.abs(renewal.daysUntilExpiry)} days overdue` :
                                                `${renewal.daysUntilExpiry} days`
                                            }
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">${renewal.renewalFee}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {renewal.status !== 'renewed' && (
                                            <Link
                                                to={`/renewal/${renewal.id}`}
                                                className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Process Renewal
                                            </Link>
                                        )}
                                        {renewal.status === 'renewed' && (
                                            <Link
                                                to={`/registration/${renewal.id}`}
                                                className="text-green-600 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                View Certificate
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredRenewals.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No renewals found matching your criteria.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default RenewalsList;
