import React, { useState } from 'react';
import { Search, Filter, Download, FileText, CheckCircle, AlertCircle, Clock, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const NCUCList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock NCUC data (Nonconforming Use Certificates)
    const certificates = [
        { id: 1, certNumber: 'NCUC-KONA-2025-001', address: '75-5660 Palani Rd', tmk: '3-7-5-004-001', owner: 'Hale Aloha LLC', status: 'Active', issuedDate: '2025-03-12', expiryDate: '2027-03-12' },
        { id: 2, certNumber: 'NCUC-HILO-2024-045', address: '12-345 Ocean View Pkwy', tmk: '3-5-4-002-001', owner: 'Pacific Blue Inc', status: 'Expiring Soon', issuedDate: '2024-02-10', expiryDate: '2026-02-10' },
        { id: 3, certNumber: 'NCUC-KONA-2023-089', address: '77-6425 Ali\'i Dr', tmk: '3-7-7-012-005', owner: 'Sea Breeze Rentals', status: 'Expired', issuedDate: '2023-01-05', expiryDate: '2025-01-05' },
        { id: 4, certNumber: 'NCUC-KOHA-2025-012', address: '68-1330 Mauna Lani Dr', tmk: '3-6-8-022-041', owner: 'Sunset Haven', status: 'Active', issuedDate: '2025-06-15', expiryDate: '2027-06-15' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Expiring Soon': return 'bg-[#F2E7A1] text-yellow-700 border-yellow-200';
            case 'Expired': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredCerts = certificates.filter(cert => {
        const matchesSearch = cert.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.tmk.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Nonconforming Use Certificates (NCUC)</h1>
                    <p className="text-slate-500">Manage and track KFR-2J compliant certificates</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 text-sm font-medium">
                        + Issue New NCUC
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">Active Certificates</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">142</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">Expiring (90 Days)</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">18</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">Expired/Revoked</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">5</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Cert #, Address, or TMK..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm bg-white"
                >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Certificate #</th>
                            <th className="px-6 py-4">Property Address</th>
                            <th className="px-6 py-4">TMK</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Expiry Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCerts.map((cert) => (
                            <tr key={cert.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-mono font-medium text-slate-900">{cert.certNumber}</td>
                                <td className="px-6 py-4 text-slate-700">{cert.address}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cert.tmk}</td>
                                <td className="px-6 py-4 text-slate-700">{cert.owner}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(cert.status)}`}>
                                        {cert.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{new Date(cert.expiryDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="View Details">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Manage Certificate">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCerts.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No certificates found matching your filters.
                    </div>
                )}
            </div>

        </div>
    );
};

export default NCUCList;
