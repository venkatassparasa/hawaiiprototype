import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, Clock, CheckCircle, AlertTriangle, Upload, Download, Eye, Edit2, Plus, Search, Filter, Calendar, DollarSign, ShieldCheck, Users, Building2, RefreshCw, Bell, Home } from 'lucide-react';

const PublicPortalDashboard = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // User Applications
    const [applications, setApplications] = useState([
        {
            id: 1,
            type: 'TVR Registration',
            propertyAddress: '123 Beach Road, Hilo, HI 96720',
            submittedDate: '2024-03-10',
            status: 'pending',
            fees: {
                registration: 150.00,
                tax: 4.00,
                total: 154.00
            },
            documents: {
                businessLicense: 'business_license.pdf',
                insurance: 'insurance_certificate.pdf',
                sitePlan: 'site_plan.pdf'
            },
            payments: {
                paid: false,
                amount: 154.00,
                dueDate: '2024-03-25'
            }
        },
        {
            id: 2,
            type: 'Renewal',
            propertyAddress: '456 Ocean View, Kona, HI 96740',
            submittedDate: '2024-02-15',
            status: 'approved',
            fees: {
                renewal: 100.00,
                tax: 4.00,
                total: 104.00
            },
            documents: {
                updatedInsurance: 'insurance_2024.pdf'
            },
            payments: {
                paid: true,
                amount: 104.00,
                paidDate: '2024-02-20'
            }
        },
        {
            id: 3,
            type: 'Nonconforming Use Certificate',
            propertyAddress: '789 Mountain Drive, Waimea, HI 96743',
            submittedDate: '2024-01-20',
            status: 'under_review',
            fees: {
                application: 250.00,
                inspection: 150.00,
                total: 400.00
            },
            documents: {
                application: 'nonconforming_app.pdf',
                supporting: 'supporting_docs.pdf'
            },
            payments: {
                paid: false,
                amount: 400.00,
                dueDate: '2024-02-15'
            }
        }
    ]);

    // Registration Types
    const registrationTypes = [
        { id: 'tvr', name: 'TVR Registration', description: 'Transient Vacation Rental Registration', fees: { base: 150.00, tax: 4.00 } },
        { id: 'renewal', name: 'Registration Renewal', description: 'Annual TVR Registration Renewal', fees: { base: 100.00, tax: 4.00 } },
        { id: 'nonconforming', name: 'Nonconforming Use Certificate', description: 'Certificate for Nonconforming Properties', fees: { base: 250.00, inspection: 150.00 } },
        { id: 'exemption', name: 'Tax Exemption Application', description: 'Property Tax Exemption Application', fees: { base: 50.00 } }
    ];

    const tabs = [
        { id: 'applications', label: 'My Applications', icon: FileText },
        { id: 'new', label: 'New Application', icon: Plus },
        { id: 'renewals', label: 'Renewals', icon: RefreshCw },
        { id: 'certificates', label: 'Certificates', icon: ShieldCheck },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'documents', label: 'Documents', icon: Upload }
    ];

    const handleStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'under_review': return 'bg-blue-100 text-blue-800';
            case 'requires_action': return 'bg-orange-100 text-orange-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const handleStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <AlertTriangle className="w-4 h-4" />;
            case 'under_review': return <Eye className="w-4 h-4" />;
            case 'requires_action': return <AlertTriangle className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const handlePayment = (applicationId) => {
        const application = applications.find(a => a.id === applicationId);
        if (application) {
            alert(`Processing payment of $${application.payments.amount.toFixed(2)} for ${application.type}`);
            // Update payment status
            setApplications(applications.map(app => 
                app.id === applicationId 
                    ? { ...app, payments: { ...app.payments, paid: true, paidDate: new Date().toISOString().split('T')[0] } }
                    : app
            ));
        }
    };

    const handleRenewal = (applicationId) => {
        const application = applications.find(a => a.id === applicationId);
        if (application) {
            alert(`Initiating renewal for ${application.propertyAddress}`);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Navigation Header */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-slate-800">Public Portal Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Welcome back!</span>
                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                            <Home className="w-4 h-4" />
                            Public Portal Home
                        </Link>
                    </div>
                </div>
            </div>
            
            <p className="text-slate-600 mb-6">Manage your TVR registrations, applications, payments, and certificates.</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Applications</p>
                            <p className="text-2xl font-bold text-slate-800">{applications.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Approved</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {applications.filter(a => a.status === 'approved').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pending</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {applications.filter(a => a.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Unpaid</p>
                            <p className="text-2xl font-bold text-slate-800">
                                ${applications.filter(a => !a.payments.paid).reduce((sum, a) => sum + a.payments.amount, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-hawaii-ocean text-hawaii-ocean'
                                    : 'border-transparent text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* My Applications Tab */}
            {activeTab === 'applications' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">My Applications</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="under_review">Under Review</option>
                                <option value="requires_action">Requires Action</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {filteredApplications.map((application) => (
                            <div key={application.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-medium text-slate-800">{application.type}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${handleStatusColor(application.status)}`}>
                                                {handleStatusIcon(application.status)}
                                                {application.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 mb-2">{application.propertyAddress}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span>Submitted: {application.submittedDate}</span>
                                            {application.payments.paid && <span className="text-green-600">✓ Paid</span>}
                                            {!application.payments.paid && <span className="text-red-600">Payment Due: {application.payments.dueDate}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-slate-800">
                                            ${application.fees.total.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-slate-600">Total Fees</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Fee Breakdown</h4>
                                        <div className="space-y-1 text-sm">
                                            {Object.entries(application.fees).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-slate-600">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                                    <span className="font-medium">${value.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Documents</h4>
                                        <div className="space-y-1 text-sm">
                                            {Object.entries(application.documents).map(([key, value]) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <FileText className="w-3 h-3 text-slate-400" />
                                                    <span className="text-slate-600">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Payment Status</h4>
                                        <div className="space-y-2">
                                            <div className={`text-sm ${application.payments.paid ? 'text-green-600' : 'text-red-600'}`}>
                                                {application.payments.paid ? 'Paid' : 'Unpaid'}
                                            </div>
                                            {application.payments.paid ? (
                                                <div className="text-xs text-slate-500">Paid: {application.payments.paidDate}</div>
                                            ) : (
                                                <button
                                                    onClick={() => handlePayment(application.id)}
                                                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                                >
                                                    <CreditCard className="w-3 h-3" />
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    {application.status === 'approved' && (
                                        <button 
                                            onClick={() => handleRenewal(application.id)}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Renew
                                        </button>
                                    )}
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Application Tab */}
            {activeTab === 'new' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Start New Application</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registrationTypes.map((type) => (
                            <div key={type.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 bg-hawaii-ocean/10 rounded-lg">
                                        <FileText className="w-6 h-6 text-hawaii-ocean" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800 mb-1">{type.name}</h3>
                                        <p className="text-sm text-slate-600">{type.description}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="text-sm font-medium text-slate-700">Estimated Fees:</div>
                                    <div className="space-y-1 text-sm">
                                        {Object.entries(type.fees).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-slate-600">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                                <span className="font-medium">${value.toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between font-semibold text-slate-800 pt-2 border-t">
                                            <span>Total:</span>
                                            <span>${Object.values(type.fees).reduce((sum, val) => sum + val, 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-opacity-90 transition-opacity">
                                    <Plus className="w-4 h-4" />
                                    Start Application
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Renewals Tab */}
            {activeTab === 'renewals' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Renewals</h2>
                    
                    <div className="space-y-4">
                        {applications.filter(a => a.status === 'approved').length > 0 ? (
                            applications.filter(a => a.status === 'approved').map((application) => (
                                <div key={application.id} className="bg-white border border-slate-200 rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-medium text-slate-800 mb-1">{application.propertyAddress}</h3>
                                            <p className="text-slate-600">Current Registration: {application.submittedDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-slate-800">
                                                ${(registrationTypes.find(t => t.id === 'renewal')?.fees.total || 104.00).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-slate-600">Renewal Fee</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">
                                            <span className="font-medium">Next Renewal Due:</span> 2025-03-10
                                        </div>
                                        <button
                                            onClick={() => handleRenewal(application.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Renew Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <RefreshCw className="w-12 h-12 text-slate-400" />
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">No Renewals Available</h3>
                                        <p className="text-slate-600">You don't have any approved registrations that are ready for renewal.</p>
                                        <p className="text-sm text-slate-500 mt-2">Renewals become available once your initial registration is approved.</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('applications')}
                                        className="flex items-center gap-2 px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-opacity-90 transition-opacity"
                                    >
                                        <FileText className="w-4 h-4" />
                                        View Applications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Nonconforming Use Certificates</h2>
                    
                    <div className="space-y-4">
                        {applications.filter(a => a.type === 'Nonconforming Use Certificate').map((application) => (
                            <div key={application.id} className="bg-white border border-slate-200 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-medium text-slate-800 mb-1">{application.propertyAddress}</h3>
                                        <p className="text-slate-600">Certificate Application: {application.submittedDate}</p>
                                    </div>
                                    <div className={`px-2 py-1 text-xs rounded-full ${handleStatusColor(application.status)}`}>
                                        {application.status.replace('_', ' ')}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Application Details</h4>
                                        <div className="space-y-1 text-sm">
                                            <div>Application Fee: ${application.fees.application.toFixed(2)}</div>
                                            <div>Inspection Fee: ${application.fees.inspection.toFixed(2)}</div>
                                            <div>Total: ${application.fees.total.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Required Documents</h4>
                                        <div className="space-y-1 text-sm">
                                            {Object.entries(application.documents).map(([key, value]) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <FileText className="w-3 h-3 text-slate-400" />
                                                    <span className="text-slate-600">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Download Certificate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Payment History</h2>
                    
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Application</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {applications.map((application) => (
                                    <tr key={application.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm text-slate-900">{application.propertyAddress}</td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{application.type}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">${application.payments.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                application.payments.paid 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {application.payments.paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {application.payments.paid ? application.payments.paidDate : application.payments.dueDate}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {!application.payments.paid && (
                                                <button
                                                    onClick={() => handlePayment(application.id)}
                                                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                                >
                                                    <CreditCard className="w-3 h-3" />
                                                    Pay Now
                                                </button>
                                            )}
                                            {application.payments.paid && (
                                                <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 transition-colors">
                                                    <Download className="w-3 h-3" />
                                                    Receipt
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Document Management</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h3 className="font-medium text-slate-800 mb-4">Required Documents</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border border-slate-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">Business License</div>
                                            <div className="text-xs text-slate-600">Required for TVR Registration</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-hawaii-ocean text-white text-sm rounded hover:bg-opacity-90 transition-opacity">
                                        <Upload className="w-3 h-3" />
                                        Upload
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border border-slate-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">Insurance Certificate</div>
                                            <div className="text-xs text-slate-600">Liability insurance required</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-hawaii-ocean text-white text-sm rounded hover:bg-opacity-90 transition-opacity">
                                        <Upload className="w-3 h-3" />
                                        Upload
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border border-slate-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">Site Plan</div>
                                            <div className="text-xs text-slate-600">Property layout and parking</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-hawaii-ocean text-white text-sm rounded hover:bg-opacity-90 transition-opacity">
                                        <Upload className="w-3 h-3" />
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h3 className="font-medium text-slate-800 mb-4">Uploaded Documents</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">business_license.pdf</div>
                                            <div className="text-xs text-slate-600">Uploaded on 2024-03-10</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 transition-colors">
                                        <Eye className="w-3 h-3" />
                                        View
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">insurance_certificate.pdf</div>
                                            <div className="text-xs text-slate-600">Uploaded on 2024-03-10</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 transition-colors">
                                        <Eye className="w-3 h-3" />
                                        View
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">site_plan.pdf</div>
                                            <div className="text-xs text-slate-600">Expiring on 2024-04-01</div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors">
                                        <RefreshCw className="w-3 h-3" />
                                        Renew
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicPortalDashboard;
