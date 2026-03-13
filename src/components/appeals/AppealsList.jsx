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

            pending: { color: 'bg-[#F2E7A1] text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending Review' },

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

        <div className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="bg-white shadow-sm border-b border-slate-200">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between h-16">

                        <div className="flex items-center">

                            <div className="w-8 h-8 bg-hawaii-ocean rounded-lg flex items-center justify-center">

                                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">

                                    <div className="w-4 h-4 bg-hawaii-coral rounded-full"></div>

                                </div>

                            </div>

                            <h1 className="ml-4 text-xl font-bold text-slate-800">Appeals Management</h1>

                        </div>

                        <div className="flex items-center gap-4">

                            <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">

                                <Plus className="w-4 h-4" />

                                New Appeal

                            </button>

                        </div>

                    </div>

                </div>

            </div>



            {/* Main Content */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{background: 'transparent linear-gradient(110deg, #7AD9DB 0%, #8AD3B8 47%, #9DCD9100 100%) 0% 0% no-repeat padding-box'}}>

                

                {/* Stats Cards */}

                <div className="grid grid-cols-12 md:grid-cols-4 gap-2 mb-8">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">

                    <div className="flex-1">

                    <p className="text-sm text-slate-500 mb-1">Total Appeals</p>

                        <p className="text-3xl font-bold text-slate-800">{appeals.length}</p>

                    </div>

                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-hawaii-ocean">

                        <img src="/appeals.png" alt="View all" className="w-20 h-16" />

                    </div>

                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">

                    <div className="flex-1">

                    <p className="text-sm text-slate-500 mb-1">Pending Review</p>

                    <p className="text-3xl font-bold text-yellow-600">

                        {appeals.filter(a => a.status === 'pending').length}

                    </p>

                    </div>

                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-hawaii-ocean">

                        <img src="/pending_review.png" alt="Pending" className="w-20 h-16" />

                    </div>

                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">

                    <div className="flex-1">

                    <p className="text-sm text-slate-500 mb-1">Hearings Scheduled</p>

                    <p className="text-3xl font-bold text-blue-600">

                        {appeals.filter(a => a.status === 'scheduled').length}

                    </p>

                    </div>

                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-hawaii-ocean">

                        <img src="/hearing.png" alt="Hearings Scheduled" className="w-20 h-16" />

                    </div>

                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">

                    <div className="flex-1">

                    <p className="text-sm text-slate-500 mb-1">Decided</p>

                    <p className="text-3xl font-bold text-green-600">

                        {appeals.filter(a => a.status === 'decided').length}

                    </p>

                    </div>

                    <div className="w-28 h-16 rounded-2xl flex items-center justify-center text-hawaii-ocean">

                        <img src="/decided.png" alt="Decided" className="w-20 h-16" />

                    </div>

                </div>

            </div>



            {/* Filters */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                    <div className="md:col-span-8">

                        <div className="relative">

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



                    <div className="md:col-span-4">

                        <button className="w-full px-4 py-3 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">

                            <Plus className="w-4 h-4" />

                            New Appeal

                        </button>

                    </div>

                </div>

            </div>



            {/* Appeals Table */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-slate-50 border-b border-slate-200">

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Appeal Number</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Case Number</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Property</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Appellant</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Filed</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Hearing</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Fine Amount</th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredAppeals.map((appeal, idx) => (

                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">

                                    <td className="px-6 py-4">

                                        <Link

                                            to={`/appeal/${appeal.id}`}

                                            className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"

                                        >

                                            <FileText className="w-4 h-4" />

                                            Review

                                        </Link>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="font-medium text-slate-900">{appeal.caseNumber}</span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="text-slate-700">{appeal.property}</span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="text-slate-700">{appeal.appellant}</span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="text-slate-700">{appeal.filed}</span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="text-slate-700">{appeal.hearing || '-'}</span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-2">

                                            {getStatusBadge(appeal.status)}

                                            <span className="text-xs font-medium text-slate-700 capitalize">{appeal.status}</span>

                                        </div>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="text-slate-700">${appeal.fineAmount?.toLocaleString()}</span>

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

                            ))}

                        </tbody>

                    </table>



                    {filteredAppeals.length === 0 && (

                        <div className="p-12 text-center text-slate-500">

                            <p>No appeals found matching your criteria.</p>

                        </div>

                    )}

                </div>



            </div>



        </div>

    );

};



export default AppealsList;

