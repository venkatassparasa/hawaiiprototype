import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, FileText, Download, Calendar, DollarSign, Home, User } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import WorkflowDetailPanel from '../workflows/WorkflowDetailPanel';

const RegistrationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('under-review');

    // Mock registration data
    const registration = {
        id: id,
        number: 'TVR-2026-001',
        status: status,
        submittedDate: '2026-01-15',
        lastUpdated: '2026-01-25',
        property: {
            address: '74-5599 Alii Dr, Kailua-Kona, HI 96740',
            tmk: '7-7-4-008-002-0000',
            zoningDistrict: 'Resort',
            parcelSize: '5000',
            bedrooms: '3',
            maxOccupants: '6',
            parkingSpaces: '2',
            type: 'Hosted (B&B)',
        },
        owner: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '(808) 555-0123',
            mailingAddress: 'PO Box 123, Kailua-Kona, HI 96740',
        },
        compliance: {
            countyTaxClearance: 'CTC-2026-12345',
            stateGE: 'GE-123-456-7890',
            stateTAT: 'TA-123-456-7890',
        },
        fee: '$250',
        timeline: [
            { date: '2026-01-15', status: 'submitted', description: 'Application submitted' },
            { date: '2026-01-18', status: 'under-review', description: 'Application under review by staff' },
        ],
    };

    const handleApprove = () => {
        setStatus('approved');
        alert('Registration approved! Certificate will be generated and sent to applicant.');
    };

    const handleReject = () => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            setStatus('rejected');
            alert('Registration rejected. Notification sent to applicant.');
        }
    };

    const handleRequestInfo = () => {
        alert('Additional information request sent to applicant.');
    };

    const getStatusBadge = (statusType) => {
        const badges = {
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Calendar, label: 'Pending' },
            'under-review': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText, label: 'Under Review' },
            approved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Rejected' },
        };
        return badges[statusType] || badges.pending;
    };

    const statusBadge = getStatusBadge(status);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/registrations" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Registration #{registration.number}</h1>
                        <p className="text-slate-500">Submitted on {new Date(registration.submittedDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-full border ${statusBadge.color} flex items-center gap-2 font-medium`}>
                    <statusBadge.icon className="w-5 h-5" />
                    {statusBadge.label}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Property Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Home className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Property Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Address:</span>
                                <p className="font-medium text-slate-800">{registration.property.address}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">TMK:</span>
                                <p className="font-mono font-medium text-slate-800">{registration.property.tmk}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Zoning District:</span>
                                <p className="font-medium text-slate-800">{registration.property.zoningDistrict}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Parcel Size:</span>
                                <p className="font-medium text-slate-800">{registration.property.parcelSize} sq ft</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Property Type:</span>
                                <p className="font-medium text-slate-800">{registration.property.type}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Bedrooms:</span>
                                <p className="font-medium text-slate-800">{registration.property.bedrooms}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Max Occupants:</span>
                                <p className="font-medium text-slate-800">{registration.property.maxOccupants}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Parking Spaces:</span>
                                <p className="font-medium text-slate-800">{registration.property.parkingSpaces}</p>
                            </div>
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Owner Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">Name:</span>
                                <p className="font-medium text-slate-800">{registration.owner.name}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Email:</span>
                                <p className="font-medium text-slate-800">{registration.owner.email}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Phone:</span>
                                <p className="font-medium text-slate-800">{registration.owner.phone}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">Mailing Address:</span>
                                <p className="font-medium text-slate-800">{registration.owner.mailingAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tax & Compliance */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Tax & Compliance</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">County Tax Clearance:</span>
                                <p className="font-medium text-slate-800">{registration.compliance.countyTaxClearance}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">State GE Number:</span>
                                <p className="font-medium text-slate-800">{registration.compliance.stateGE}</p>
                            </div>
                            <div>
                                <span className="text-slate-500">State TAT Number:</span>
                                <p className="font-medium text-slate-800">{registration.compliance.stateTAT}</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Uploaded Documents</h2>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Site Drawing</p>
                                        <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                    <Download className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Property Photos</p>
                                        <p className="text-xs text-slate-500">ZIP • 8.1 MB</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                    <Download className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Fee Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-5 h-5 text-hawaii-ocean" />
                            <h2 className="font-bold text-slate-800">Registration Fee</h2>
                        </div>
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-slate-800">{registration.fee}</p>
                            <p className="text-sm text-slate-500 mt-1">{registration.property.type} - New Registration</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Timeline</h2>
                        <div className="space-y-4">
                            {registration.timeline.map((event, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === registration.timeline.length - 1
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        {index < registration.timeline.length - 1 && (
                                            <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-6">
                                        <p className="font-medium text-slate-800 text-sm">{event.description}</p>
                                        <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Workflow Progress */}
                    <WorkflowDetailPanel 
                        recordId={registration.number}
                        recordType="tvr-registration"
                        title="TVR Registration Workflow"
                        showFullDetails={true}
                        className="mb-6"
                    />

                    {/* Actions */}
                    {status === 'under-review' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-3">
                            <h2 className="font-bold text-slate-800 mb-4">Actions</h2>
                            <button
                                onClick={handleApprove}
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve Registration
                            </button>
                            <button
                                onClick={handleRequestInfo}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                Request Additional Info
                            </button>
                            <button
                                onClick={handleReject}
                                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject Application
                            </button>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default RegistrationDetail;
