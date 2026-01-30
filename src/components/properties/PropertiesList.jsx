import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, MoreHorizontal, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PropertiesList = () => {
    const location = useLocation();

    // Check if status filter is passed via query param (e.g. from Map View cluster)
    const initialStatus = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('status') || 'All';
    }, [location.search]);

    const [filterStatus, setFilterStatus] = useState(initialStatus);

    // Mock Data
    const properties = [
        { id: 1, address: '75-5660 Palani Rd', tmk: '3-7-5-004-001', owner: 'Hale Aloha LLC', status: 'Non-Compliant', lastAction: 'Nov 12, 2025', risk: 'High' },
        { id: 2, address: '69-425 Waikoloa Beach Dr', tmk: '3-6-9-007-034', owner: 'John Smith', status: 'Under Review', lastAction: 'Jan 20, 2026', risk: 'Medium' },
        { id: 3, address: '77-6425 Ali\'i Dr', tmk: '3-7-7-012-005', owner: 'Sea Breeze Rentals', status: 'Non-Compliant', lastAction: 'Dec 05, 2025', risk: 'High' },
        { id: 4, address: '99-234 Old Kone Rd', tmk: '3-2-1-009-008', owner: 'Sarah Connor', status: 'Compliant', lastAction: 'Jan 15, 2026', risk: 'Low' },
        { id: 5, address: '12-345 Ocean View Pkwy', tmk: '3-5-4-002-001', owner: 'Pacific Blue Inc', status: 'Compliant', lastAction: 'Jan 10, 2026', risk: 'Low' },
        { id: 6, address: '45-678 Volcano Rd', tmk: '3-9-8-001-022', owner: 'Lava Rock Stay', status: 'Non-Compliant', lastAction: 'Jan 28, 2026', risk: 'High' },
    ];

    const filteredProperties = filterStatus === 'All'
        ? properties
        : properties.filter(p => p.status === filterStatus);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Property Registry</h1>
                    <p className="text-slate-500">Manage and monitor all short-term rental units.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <Link
                        to="/register"
                        className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 text-sm font-medium shadow-sm"
                    >
                        + Register New
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Address, TMK, or Owner..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {['All', 'Compliant', 'Non-Compliant', 'Under Review'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status
                                ? 'bg-hawaii-ocean text-white'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Property Address</th>
                            <th className="px-6 py-4">TMK / Owner</th>
                            <th className="px-6 py-4">Last Action</th>
                            <th className="px-6 py-4">Risk Level</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProperties.map((prop) => (
                            <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${prop.status === 'Non-Compliant' ? 'bg-red-50 text-red-700 border border-red-100' :
                                        prop.status === 'Under Review' ? 'bg-[#F2E7A1] text-yellow-700 border border-yellow-100' :
                                            'bg-green-50 text-green-700 border border-green-100'
                                        }`}>
                                        {prop.status === 'Non-Compliant' ? <AlertTriangle className="w-3 h-3" /> :
                                            prop.status === 'Under Review' ? <AlertCircle className="w-3 h-3" /> :
                                                <CheckCircle className="w-3 h-3" />}
                                        {prop.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{prop.address}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-mono text-slate-500 text-xs">{prop.tmk}</p>
                                    <p className="text-slate-600 text-xs truncate max-w-[150px]">{prop.owner}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{prop.lastAction}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold text-xs ${prop.risk === 'High' ? 'text-red-600' :
                                        prop.risk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {prop.risk.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={prop.status === 'Compliant' ? `/property/${prop.id}` : `/case/${prop.id}`}
                                        className="text-hawaii-ocean font-medium hover:underline text-xs mr-3"
                                    >
                                        {prop.status === 'Compliant' ? 'View Details' : 'View Case'}
                                    </Link>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertiesList;
