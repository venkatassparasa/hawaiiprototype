import React from 'react';
import { ArrowLeft, CheckCircle, Calendar, User, MapPin } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock complaint data based on ID
    const complaints = {
        '1': {
            id: '1',
            number: 'COMP-2026-001',
            property: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
            type: 'Noise',
            status: 'investigating',
            priority: 'High',
            submitted: '2026-01-25',
            anonymous: false,
            complainant: { name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '(808) 555-0199' },
            description: 'Excessive noise from the property late at night.',
            resolution: null,
        },
        '4': {
            id: '4',
            number: 'COMP-2025-112',
            property: '78-7070 Ali\'i Dr',
            type: 'Parking',
            status: 'resolved',
            priority: 'Low',
            submitted: '2025-11-20',
            anonymous: true,
            description: 'Guests are parking on the street blocking neighbors.',
            resolution: 'Warning letter sent to owner. Guests moved vehicles to designated stalls.',
        }
    };

    const complaint = complaints[id] || complaints['1'];

    const isResolved = complaint.status === 'resolved' || complaint.status === 'closed';

    if (isResolved) {
        // Show resolved complaint page
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/complaints')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Complaint Resolved</h1>
                        <p className="text-slate-500">Complaint #{complaint.number}</p>
                    </div>
                </div>

                {/* Resolved Status Card */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Complaint Resolved</h2>
                    <p className="text-green-700 mb-6">This complaint has been successfully investigated and resolved.</p>

                    <div className="bg-white rounded-lg p-6 text-left space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Property:</span>
                                <p className="font-medium text-slate-900">{complaint.property}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Complaint Type:</span>
                                <p className="font-medium text-slate-900">{complaint.type}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Submitted:</span>
                                <p className="font-medium text-slate-900">{new Date(complaint.submitted).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Status:</span>
                                <p className="font-medium text-green-600">Resolved</p>
                            </div>
                        </div>

                        {complaint.resolution && (
                            <div className="pt-3 border-t border-slate-200">
                                <span className="text-slate-500 text-sm">Resolution:</span>
                                <p className="text-slate-900 mt-1">{complaint.resolution}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/complaints')}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                        >
                            Back to Complaints
                        </button>
                        <Link
                            to={`/property/${id}`}
                            className="px-6 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50"
                        >
                            View Property
                        </Link>
                    </div>
                </div>

            </div>
        );
    }

    // Show active complaint investigation page
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/complaints')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Complaint Investigation</h1>
                        <p className="text-slate-500">Complaint #{complaint.number}</p>
                    </div>
                </div>
                <span className={`px-4 py-2 rounded-lg font-medium ${complaint.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {complaint.status === 'investigating' ? 'Under Investigation' : 'Received'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Complaint Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Complaint Details</h2>

                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-slate-500">Property Address</span>
                                <div className="flex items-start gap-2 mt-1">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                                    <p className="font-medium text-slate-900">{complaint.property}</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-500">Complaint Type</span>
                                <p className="font-medium text-slate-900 mt-1">{complaint.type}</p>
                            </div>

                            <div>
                                <span className="text-sm text-slate-500">Description</span>
                                <p className="text-slate-700 mt-1">{complaint.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-slate-500">Priority</span>
                                    <p className={`font-bold mt-1 ${complaint.priority === 'High' ? 'text-red-600' :
                                        complaint.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {complaint.priority}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-500">Submitted</span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <p className="font-medium text-slate-900">{new Date(complaint.submitted).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Complainant Information */}
                    {!complaint.anonymous && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-hawaii-ocean" />
                                <h2 className="font-bold text-slate-800">Complainant Information</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500">Name:</span>
                                    <p className="font-medium text-slate-900">{complaint.complainant.name}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Email:</span>
                                    <p className="font-medium text-slate-900">{complaint.complainant.email}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Phone:</span>
                                    <p className="font-medium text-slate-900">{complaint.complainant.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Investigation Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Investigation Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800 text-left">
                                Create Violation Case
                            </button>
                            <button className="w-full px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-left">
                                Schedule Inspection
                            </button>
                            <button className="w-full px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-left">
                                Request Additional Information
                            </button>
                            <button className="w-full px-4 py-3 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50 text-left">
                                Mark as Resolved
                            </button>
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Quick Links */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Quick Links</h2>
                        <div className="space-y-2">
                            <Link
                                to={`/property/${id}`}
                                className="block w-full px-4 py-2 text-center border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-sm"
                            >
                                View Property Details
                            </Link>
                            <Link
                                to="/violations"
                                className="block w-full px-4 py-2 text-center border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 text-sm"
                            >
                                View Violations
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ComplaintDetail;
