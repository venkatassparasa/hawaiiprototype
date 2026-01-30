import React, { useState } from 'react';
import { Search, DollarSign, Download, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentTracking = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock payment data
    const payments = [
        {
            id: 1,
            caseNumber: 'VC-2026-001',
            property: '74-5599 Alii Dr',
            owner: 'John Doe',
            fineAmount: 1000,
            paidAmount: 0,
            balance: 1000,
            status: 'outstanding',
            dueDate: '2026-02-15',
            daysOverdue: 0,
            paymentPlan: false
        },
        {
            id: 2,
            caseNumber: 'VC-2026-002',
            property: '69-425 Waikoloa Beach Dr',
            owner: 'Jane Smith',
            fineAmount: 2000,
            paidAmount: 500,
            balance: 1500,
            status: 'partial',
            dueDate: '2026-02-10',
            daysOverdue: 0,
            paymentPlan: true
        },
        {
            id: 3,
            caseNumber: 'VC-2026-003',
            property: '77-6425 Alii Dr',
            owner: 'Bob Johnson',
            fineAmount: 1500,
            paidAmount: 1500,
            balance: 0,
            status: 'paid',
            dueDate: '2026-01-20',
            daysOverdue: 0,
            paymentPlan: false
        },
        {
            id: 4,
            caseNumber: 'VC-2025-089',
            property: '78-7070 Alii Dr',
            owner: 'Alice Williams',
            fineAmount: 3000,
            paidAmount: 0,
            balance: 3000,
            status: 'overdue',
            dueDate: '2025-12-15',
            daysOverdue: 44,
            paymentPlan: false
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            outstanding: { color: 'bg-[#F2E7A1] text-yellow-700 border-yellow-200', icon: Clock, label: 'Outstanding' },
            partial: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: TrendingUp, label: 'Partial Payment' },
            paid: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Paid in Full' },
            overdue: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle, label: 'Overdue' },
        };
        return badges[status] || badges.outstanding;
    };

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalOutstanding = payments.reduce((sum, p) => sum + p.balance, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.balance, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Payment Tracking</h1>
                    <p className="text-slate-500">Monitor fine assessments, payments, and collections</p>
                </div>
                <button className="px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export A/R Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Total Outstanding</p>
                        <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">${totalOutstanding.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">{payments.filter(p => p.balance > 0).length} cases</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Total Collected</p>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">{payments.filter(p => p.status === 'paid').length} paid in full</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Overdue</p>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">${totalOverdue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">{payments.filter(p => p.status === 'overdue').length} cases</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Payment Plans</p>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{payments.filter(p => p.paymentPlan).length}</p>
                    <p className="text-xs text-slate-500 mt-1">Active agreements</p>
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
                                placeholder="Search by property, owner, or case number..."
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
                            <option value="outstanding">Outstanding</option>
                            <option value="partial">Partial Payment</option>
                            <option value="paid">Paid in Full</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Case #</th>
                            <th className="px-6 py-4">Property / Owner</th>
                            <th className="px-6 py-4">Fine Amount</th>
                            <th className="px-6 py-4">Paid</th>
                            <th className="px-6 py-4">Balance</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPayments.map((payment) => {
                            const statusBadge = getStatusBadge(payment.status);
                            return (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{payment.caseNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{payment.property}</div>
                                        <div className="text-xs text-slate-500">{payment.owner}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">${payment.fineAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">${payment.paidAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${payment.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            ${payment.balance.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                            <statusBadge.icon className="w-3 h-3" />
                                            {statusBadge.label}
                                        </span>
                                        {payment.paymentPlan && (
                                            <div className="text-xs text-blue-600 mt-1">Payment Plan</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-700">{new Date(payment.dueDate).toLocaleDateString()}</div>
                                        {payment.daysOverdue > 0 && (
                                            <div className="text-xs text-red-600 font-medium">{payment.daysOverdue} days overdue</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/payment/${payment.id}`}
                                            className="text-hawaii-ocean font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Record Payment
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredPayments.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <p>No payment records found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Aging Report Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Aging Report Summary</h2>
                <div className="grid grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Current</p>
                        <p className="text-xl font-bold text-slate-800">
                            ${payments.filter(p => p.daysOverdue === 0 && p.balance > 0).reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">1-30 Days</p>
                        <p className="text-xl font-bold text-yellow-700">
                            ${payments.filter(p => p.daysOverdue > 0 && p.daysOverdue <= 30).reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">31-60 Days</p>
                        <p className="text-xl font-bold text-orange-700">
                            ${payments.filter(p => p.daysOverdue > 30 && p.daysOverdue <= 60).reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">61-90 Days</p>
                        <p className="text-xl font-bold text-red-700">$0</p>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">90+ Days</p>
                        <p className="text-xl font-bold text-red-800">$0</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PaymentTracking;
