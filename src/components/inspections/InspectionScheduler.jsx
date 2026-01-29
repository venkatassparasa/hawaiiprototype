import React, { useState } from 'react';
import { Calendar, Search, Filter, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const InspectionScheduler = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [statusFilter, setStatusFilter] = useState('all');

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
            'in-progress': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'In Progress' },
            completed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Completed' },
            cancelled: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: AlertTriangle, label: 'Cancelled' },
        };
        return badges[status] || badges.scheduled;
    };

    const filteredInspections = inspections.filter(i =>
        statusFilter === 'all' || i.status === statusFilter
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Inspection Scheduler</h1>
                    <p className="text-slate-500">Schedule and manage property inspections</p>
                </div>
                <button className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800">
                    Schedule Inspection
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Total Inspections</p>
                    <p className="text-3xl font-bold text-slate-800">{inspections.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Scheduled</p>
                    <p className="text-3xl font-bold text-blue-600">
                        {inspections.filter(i => i.status === 'scheduled').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {inspections.filter(i => i.status === 'in-progress').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <p className="text-sm text-slate-500 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                        {inspections.filter(i => i.status === 'completed').length}
                    </p>
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
                                        <Link
                                            to={`/inspection/${inspection.id}`}
                                            className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View Details
                                        </Link>
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

        </div>
    );
};

export default InspectionScheduler;
