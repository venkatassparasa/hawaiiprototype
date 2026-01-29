import React, { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';

const RegistrationStatus = () => {
    const [regNumber, setRegNumber] = useState('');
    const [status, setStatus] = useState(null);

    // Mock registration data
    const mockRegistration = {
        number: 'TVR-2026-001',
        status: 'approved', // pending, under-review, approved, rejected
        submittedDate: '2026-01-15',
        lastUpdated: '2026-01-25',
        property: {
            address: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
            tmk: '7-7-4-008-002-0000',
            type: 'Hosted (B&B)',
        },
        owner: {
            name: 'John Doe',
            email: 'john.doe@example.com',
        },
        fee: '$250',
        timeline: [
            { date: '2026-01-15', status: 'submitted', description: 'Application submitted' },
            { date: '2026-01-18', status: 'under-review', description: 'Application under review by staff' },
            { date: '2026-01-22', status: 'documents-verified', description: 'All documents verified' },
            { date: '2026-01-25', status: 'approved', description: 'Registration approved' },
        ],
    };

    const handleLookup = () => {
        // In real app, would query backend
        if (regNumber) {
            setStatus(mockRegistration);
        }
    };

    const getStatusBadge = (statusType) => {
        const badges = {
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending' },
            'under-review': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertTriangle, label: 'Under Review' },
            approved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Rejected' },
        };
        return badges[statusType] || badges.pending;
    };

    const statusInfo = status ? getStatusBadge(status.status) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Check Registration Status</h1>
                <p className="text-slate-500">Enter your registration number to view the current status of your application</p>
            </div>

            {/* Lookup Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            placeholder="Enter Registration Number (e.g., TVR-2026-001)"
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                        />
                    </div>
                    <button
                        onClick={handleLookup}
                        className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800 flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Lookup
                    </button>
                </div>
            </div>

            {/* Status Display */}
            {status && (
                <>
                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className={`p-6 border-b ${statusInfo.color.replace('bg-', 'bg-').replace('100', '50')}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Registration #{status.number}</h2>
                                    <p className="text-sm text-slate-600">Submitted on {new Date(status.submittedDate).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full border ${statusInfo.color} flex items-center gap-2 font-medium`}>
                                    <statusInfo.icon className="w-5 h-5" />
                                    {statusInfo.label}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Property Info */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-3">Property Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Address:</span>
                                        <p className="font-medium text-slate-800">{status.property.address}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">TMK:</span>
                                        <p className="font-mono font-medium text-slate-800">{status.property.tmk}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Property Type:</span>
                                        <p className="font-medium text-slate-800">{status.property.type}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Registration Fee:</span>
                                        <p className="font-medium text-slate-800">{status.fee}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-slate-800 mb-3">Owner Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Name:</span>
                                        <p className="font-medium text-slate-800">{status.owner.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Email:</span>
                                        <p className="font-medium text-slate-800">{status.owner.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {status.status === 'approved' && (
                                <div className="border-t border-slate-100 pt-6">
                                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download Certificate
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 mb-6">Application Timeline</h3>
                        <div className="space-y-4">
                            {status.timeline.map((event, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === status.timeline.length - 1
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            {index === status.timeline.length - 1 ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <FileText className="w-5 h-5" />
                                            )}
                                        </div>
                                        {index < status.timeline.length - 1 && (
                                            <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <p className="font-medium text-slate-800">{event.description}</p>
                                        <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Help Text */}
            {!status && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-blue-800 mb-3">
                        Your registration number was provided in the confirmation email sent after submitting your application.
                    </p>
                    <p className="text-sm text-blue-800">
                        For assistance, contact the Planning Department at (808) 961-8288 or email planning@hawaiicounty.gov
                    </p>
                </div>
            )}

        </div>
    );
};

export default RegistrationStatus;
