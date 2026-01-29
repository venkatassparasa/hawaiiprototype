import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, CheckCircle, Download, CreditCard, FileText } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const PaymentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('check');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    // Mock payment data - ID 3 is paid, ID 2 is partial
    const payments = {
        '1': {
            id: '1',
            caseNumber: 'VC-2026-001',
            property: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
            owner: 'John Doe',
            ownerEmail: 'john.doe@example.com',
            ownerPhone: '(808) 555-0123',
            fineAmount: 1000,
            paidAmount: 0,
            balance: 1000,
            status: 'outstanding',
            dueDate: '2026-02-15',
            issuedDate: '2026-01-15',
            paymentPlan: false,
            paymentHistory: [],
        },
        '2': {
            id: '2',
            caseNumber: 'VC-2026-002',
            property: '69-425 Waikoloa Beach Dr',
            owner: 'Jane Smith',
            ownerEmail: 'jane.smith@example.com',
            ownerPhone: '(808) 555-0456',
            fineAmount: 2000,
            paidAmount: 500,
            balance: 1500,
            status: 'partial',
            dueDate: '2026-02-10',
            issuedDate: '2026-01-10',
            paymentPlan: true,
            paymentHistory: [{ amount: 500, method: 'Check', date: '2026-01-15' }],
        },
        '3': {
            id: '3',
            caseNumber: 'VC-2026-003',
            property: '77-6425 Alii Dr',
            owner: 'Bob Johnson',
            ownerEmail: 'bob.j@example.com',
            ownerPhone: '(808) 555-0789',
            fineAmount: 1500,
            paidAmount: 1500,
            balance: 0,
            status: 'paid',
            dueDate: '2026-01-20',
            issuedDate: '2026-01-05',
            paymentPlan: false,
            paymentHistory: [{ amount: 1500, method: 'Check', date: '2026-01-20' }],
        }
    };

    const payment = payments[id] || payments['1'];

    // If payment is already paid in full, show confirmation message
    if (payment.status === 'paid' && payment.balance === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <Link to="/payments" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Payment Already Completed</h1>
                        <p className="text-slate-500">Case #{payment.caseNumber}</p>
                    </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Payment Completed</h2>
                    <p className="text-green-700 mb-6">This fine has been paid in full.</p>

                    <div className="bg-white rounded-lg p-6 text-left space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Property:</span>
                                <p className="font-medium text-slate-900">{payment.property}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Owner:</span>
                                <p className="font-medium text-slate-900">{payment.owner}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Fine Amount:</span>
                                <p className="font-medium text-slate-900">${payment.fineAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Amount Paid:</span>
                                <p className="font-medium text-green-600">${payment.paidAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        {payment.paymentHistory.length > 0 && (
                            <div className="pt-3 border-t border-slate-200">
                                <span className="text-slate-500 text-sm">Payment History:</span>
                                {payment.paymentHistory.map((hist, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mt-2">
                                        <div>
                                            <p className="font-medium text-slate-800">${hist.amount.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500">{hist.method} • {new Date(hist.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/payments')}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                        >
                            Back to Payments
                        </button>
                        <Link
                            to={`/case/${id}`}
                            className="px-6 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50"
                        >
                            View Case Details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleRecordPayment = () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        if (parseFloat(paymentAmount) > payment.balance) {
            alert('Payment amount cannot exceed balance');
            return;
        }

        console.log('Recording payment:', {
            amount: paymentAmount,
            method: paymentMethod,
            date: paymentDate,
            notes: notes,
        });

        alert('Payment recorded successfully!');
        navigate('/payments');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/payments" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Payment Details</h1>
                        <p className="text-slate-500">Case #{payment.caseNumber}</p>
                    </div>
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Receipt
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Case Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Case Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Property:</span>
                                <p className="font-medium text-slate-800">{payment.property}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Owner:</span>
                                <p className="font-medium text-slate-800">{payment.owner}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Email:</span>
                                <p className="font-medium text-slate-800">{payment.ownerEmail}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Phone:</span>
                                <p className="font-medium text-slate-800">{payment.ownerPhone}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Fine Issued:</span>
                                <p className="font-medium text-slate-800">{new Date(payment.issuedDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Due Date:</span>
                                <p className="font-medium text-slate-800">{new Date(payment.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Record Payment Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Record Payment</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Payment Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                            max={payment.balance}
                                            className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Maximum: ${payment.balance.toLocaleString()}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Payment Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                >
                                    <option value="check">Check</option>
                                    <option value="cash">Cash</option>
                                    <option value="credit-card">Credit Card</option>
                                    <option value="wire-transfer">Wire Transfer</option>
                                    <option value="money-order">Money Order</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any relevant notes about this payment..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleRecordPayment}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Record Payment
                                </button>
                                <button
                                    onClick={() => navigate('/payments')}
                                    className="px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    {payment.paymentHistory.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h2 className="font-bold text-slate-800 mb-4">Payment History</h2>
                            <div className="space-y-3">
                                {payment.paymentHistory.map((hist, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-800">${hist.amount.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500">{hist.method} • {new Date(hist.date).toLocaleDateString()}</p>
                                        </div>
                                        <button className="text-hawaii-ocean text-xs hover:underline">View Receipt</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Payment Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Payment Summary</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <span className="text-slate-600">Fine Amount:</span>
                                <span className="font-bold text-slate-800">${payment.fineAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <span className="text-slate-600">Paid to Date:</span>
                                <span className="font-bold text-green-600">${payment.paidAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-slate-800 font-medium">Balance Due:</span>
                                <span className="text-2xl font-bold text-red-600">${payment.balance.toLocaleString()}</span>
                            </div>
                        </div>

                        {payment.paymentPlan && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-xs font-medium text-blue-900">Payment Plan Active</p>
                                <p className="text-xs text-blue-700 mt-1">Installments: $250/month</p>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Status</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600 text-sm">Payment Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                                    payment.status === 'partial' ? 'bg-blue-100 text-blue-700' :
                                        payment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {payment.status === 'paid' ? 'Paid in Full' :
                                        payment.status === 'partial' ? 'Partial Payment' :
                                            payment.status === 'overdue' ? 'Overdue' : 'Outstanding'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600 text-sm">Due Date:</span>
                                <span className="font-medium text-slate-800 text-sm">
                                    {new Date(payment.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <Link
                                to={`/case/${id}`}
                                className="block w-full px-4 py-2 text-center border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-sm"
                            >
                                View Case Details
                            </Link>
                            <button className="w-full px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-sm">
                                Setup Payment Plan
                            </button>
                            <button className="w-full px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-sm">
                                Send Payment Reminder
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default PaymentDetail;
