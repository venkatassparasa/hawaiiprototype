import React, { useState } from 'react';
import { Building2, Users, DollarSign, FileText, CheckCircle, AlertTriangle, Upload, Eye, EyeOff, Save, Plus, Search, Filter, Calendar, Globe, ShieldCheck, Clock } from 'lucide-react';

const HostingPlatformPortal = () => {
    const [activeTab, setActiveTab] = useState('compliance');
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Platform Registration Form
    const [platformData, setPlatformData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        platformType: 'airbnb',
        registrationNumber: '',
        annualListings: 0,
        feePaid: false,
        feeAmount: 1000,
        statutoryAcknowledgments: {
            dataSharing: false,
            compliance: false,
            reporting: false,
            fees: false
        }
    });

    // Registered Platforms
    const [registeredPlatforms, setRegisteredPlatforms] = useState([
        {
            id: 1,
            companyName: 'Airbnb Hawaii',
            contactName: 'John Manager',
            email: 'hawaii@airbnb.com',
            phone: '(808) 555-0101',
            platformType: 'airbnb',
            registrationNumber: 'HP-2024-001',
            registrationDate: '2024-01-15',
            feePaid: true,
            feeAmount: 1000,
            status: 'active',
            annualListings: 1250,
            statutoryAcknowledgments: {
                dataSharing: true,
                compliance: true,
                reporting: true,
                fees: true
            }
        },
        {
            id: 2,
            companyName: 'VRBO Hawaii',
            contactName: 'Jane Coordinator',
            email: 'hawaii@vrbo.com',
            phone: '(808) 555-0102',
            platformType: 'vrbo',
            registrationNumber: 'HP-2024-002',
            registrationDate: '2024-02-10',
            feePaid: false,
            feeAmount: 1000,
            status: 'pending',
            annualListings: 890,
            statutoryAcknowledgments: {
                dataSharing: true,
                compliance: false,
                reporting: true,
                fees: false
            }
        },
        {
            id: 3,
            companyName: 'Booking.com Hawaii',
            contactName: 'Mike Director',
            email: 'hawaii@booking.com',
            phone: '(808) 555-0103',
            platformType: 'booking',
            registrationNumber: 'HP-2024-003',
            registrationDate: '2024-03-01',
            feePaid: true,
            feeAmount: 1000,
            status: 'active',
            annualListings: 2100,
            statutoryAcknowledgments: {
                dataSharing: true,
                compliance: true,
                reporting: true,
                fees: true
            }
        }
    ]);

    const tabs = [
        { id: 'compliance', label: 'Compliance Dashboard', icon: ShieldCheck },
        { id: 'registered', label: 'Registered Platforms', icon: Building2 },
        { id: 'registration', label: 'Platform Registration', icon: Plus }
    ];

    const platformTypes = [
        { value: 'airbnb', label: 'Airbnb' },
        { value: 'vrbo', label: 'VRBO' },
        { value: 'booking', label: 'Booking.com' },
        { value: 'expedia', label: 'Expedia' },
        { value: 'tripadvisor', label: 'TripAdvisor' },
        { value: 'hotels', label: 'Hotels.com' },
        { value: 'aggregator', label: 'Booking Aggregator' },
        { value: 'broker', label: 'Broker/Agent' }
    ];

    const handleInputChange = (field, value) => {
        if (field.startsWith('statutoryAcknowledgments.')) {
            const acknowledgment = field.split('.')[1];
            setPlatformData({
                ...platformData,
                statutoryAcknowledgments: {
                    ...platformData.statutoryAcknowledgments,
                    [acknowledgment]: value
                }
            });
        } else {
            setPlatformData({
                ...platformData,
                [field]: value
            });
        }
    };

    const handleSubmitRegistration = () => {
        // Validate required fields
        const requiredFields = ['companyName', 'contactName', 'email', 'phone', 'address'];
        const missingFields = requiredFields.filter(field => !platformData[field]);
        
        if (missingFields.length > 0) {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Validate statutory acknowledgments
        const acknowledgmentsComplete = Object.values(platformData.statutoryAcknowledgments).every(v => v === true);
        if (!acknowledgmentsComplete) {
            alert('Please acknowledge all statutory requirements before submitting');
            return;
        }

        // Create new platform registration
        const newPlatform = {
            id: Math.max(...registeredPlatforms.map(p => p.id)) + 1,
            ...platformData,
            registrationNumber: `HP-${new Date().getFullYear()}-${String(registeredPlatforms.length + 1).padStart(3, '0')}`,
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        setRegisteredPlatforms([...registeredPlatforms, newPlatform]);
        
        // Reset form
        setPlatformData({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            platformType: 'airbnb',
            registrationNumber: '',
            annualListings: 0,
            feePaid: false,
            feeAmount: 1000,
            statutoryAcknowledgments: {
                dataSharing: false,
                compliance: false,
                reporting: false,
                fees: false
            }
        });

        alert('Platform registration submitted successfully! Registration is pending review.');
    };

    const handleApprovePlatform = (id) => {
        setRegisteredPlatforms(registeredPlatforms.map(platform => 
            platform.id === id 
                ? { ...platform, status: 'active', feePaid: true }
                : platform
        ));
    };

    const handleRejectPlatform = (id) => {
        if (confirm('Are you sure you want to reject this platform registration?')) {
            setRegisteredPlatforms(registeredPlatforms.map(platform => 
                platform.id === id 
                    ? { ...platform, status: 'rejected' }
                    : platform
            ));
        }
    };

    const filteredPlatforms = registeredPlatforms.filter(platform => {
        const matchesSearch = platform.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           platform.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           platform.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || platform.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <AlertTriangle className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Hosting Platform Portal</h1>
                <p className="text-slate-600 mb-6">Registration and compliance management for booking platforms, aggregators, and brokers operating in Hawaii County.</p>
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

            {/* Platform Registration Tab */}
            {activeTab === 'registration' && (
                <div>
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Register New Platform</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Company Information */}
                            <div>
                                <h3 className="font-medium text-slate-700 mb-4">Company Information</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                                        <input
                                            type="text"
                                            value={platformData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="e.g., Airbnb Hawaii"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Name *</label>
                                        <input
                                            type="text"
                                            value={platformData.contactName}
                                            onChange={(e) => handleInputChange('contactName', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="e.g., John Manager"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={platformData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="contact@platform.com"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={platformData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="(808) 555-0101"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                                        <textarea
                                            value={platformData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="Company address"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Platform Details */}
                            <div>
                                <h3 className="font-medium text-slate-700 mb-4">Platform Details</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Platform Type *</label>
                                        <select
                                            value={platformData.platformType}
                                            onChange={(e) => handleInputChange('platformType', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        >
                                            {platformTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                                        <input
                                            type="url"
                                            value={platformData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="https://platform.com"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Annual Listings</label>
                                        <input
                                            type="number"
                                            value={platformData.annualListings}
                                            onChange={(e) => handleInputChange('annualListings', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                            placeholder="Estimated annual listings"
                                        />
                                    </div>
                                    
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                        <h4 className="font-medium text-slate-700 mb-3">Registration Fee</h4>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-600">Required registration fee</p>
                                                <p className="text-lg font-semibold text-slate-800">${platformData.feeAmount.toLocaleString()}</p>
                                            </div>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={platformData.feePaid}
                                                    onChange={(e) => handleInputChange('feePaid', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm text-slate-700">Fee Paid</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Statutory Acknowledgments */}
                        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <h3 className="font-medium text-slate-700 mb-4">Statutory Acknowledgments *</h3>
                            <p className="text-sm text-slate-600 mb-4">Platform must acknowledge all statutory requirements before registration can be processed.</p>
                            
                            <div className="space-y-3">
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={platformData.statutoryAcknowledgments.dataSharing}
                                        onChange={(e) => handleInputChange('statutoryAcknowledgments.dataSharing', e.target.checked)}
                                        className="mt-1 rounded"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-slate-700">Data Sharing Compliance</span>
                                        <p className="text-xs text-slate-600">Agree to share booking data with County as required by Hawaii Revised Statutes</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={platformData.statutoryAcknowledgments.compliance}
                                        onChange={(e) => handleInputChange('statutoryAcknowledgments.compliance', e.target.checked)}
                                        className="mt-1 rounded"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-slate-700">TVR Compliance Requirements</span>
                                        <p className="text-xs text-slate-600">Acknowledge responsibility for ensuring all listed properties comply with TVR regulations</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={platformData.statutoryAcknowledgments.reporting}
                                        onChange={(e) => handleInputChange('statutoryAcknowledgments.reporting', e.target.checked)}
                                        className="mt-1 rounded"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-slate-700">Regular Reporting</span>
                                        <p className="text-xs text-slate-600">Commit to monthly reporting of all TVR listings and booking data</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={platformData.statutoryAcknowledgments.fees}
                                        onChange={(e) => handleInputChange('statutoryAcknowledgments.fees', e.target.checked)}
                                        className="mt-1 rounded"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-slate-700">Fee Structure Compliance</span>
                                        <p className="text-xs text-slate-600">Acknowledge understanding of County fee structure and payment requirements</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSubmitRegistration}
                                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Save className="w-4 h-4" />
                                Submit Registration
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Registered Platforms Tab */}
            {activeTab === 'registered' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Registered Platforms</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search platforms..."
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
                                <option value="active">Active</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredPlatforms.map((platform) => (
                            <div key={platform.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800 mb-1">{platform.companyName}</h3>
                                        <p className="text-sm text-slate-600">{platform.contactName}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(platform.status)}`}>
                                        {getStatusIcon(platform.status)}
                                        {platform.status}
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Registration:</span>
                                        <span className="font-medium">{platform.registrationNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Type:</span>
                                        <span className="font-medium">{platformTypes.find(t => t.value === platform.platformType)?.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Listings:</span>
                                        <span className="font-medium">{platform.annualListings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Fee:</span>
                                        <span className={`font-medium ${platform.feePaid ? 'text-green-600' : 'text-red-600'}`}>
                                            ${platform.feeAmount.toLocaleString()} {platform.feePaid ? '✓' : '✗'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Registered:</span>
                                        <span className="font-medium">{platform.registrationDate}</span>
                                    </div>
                                </div>
                                
                                {platform.status === 'pending' && (
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleApprovePlatform(platform.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectPlatform(platform.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Compliance Dashboard Tab */}
            {activeTab === 'compliance' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Compliance Dashboard</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total Platforms</p>
                                    <p className="text-2xl font-bold text-slate-800">{registeredPlatforms.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Active Platforms</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {registeredPlatforms.filter(p => p.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Pending Review</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {registeredPlatforms.filter(p => p.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h3 className="font-medium text-slate-800 mb-4">Registration Revenue</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Total Collected</span>
                                    <span className="text-lg font-semibold text-green-600">
                                        ${registeredPlatforms.filter(p => p.feePaid).reduce((sum, p) => sum + p.feeAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Pending Collection</span>
                                    <span className="text-lg font-semibold text-yellow-600">
                                        ${registeredPlatforms.filter(p => !p.feePaid).reduce((sum, p) => sum + p.feeAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h3 className="font-medium text-slate-800 mb-4">Total Listings</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">All Platforms</span>
                                    <span className="text-lg font-semibold text-slate-800">
                                        {registeredPlatforms.reduce((sum, p) => sum + p.annualListings, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Average per Platform</span>
                                    <span className="text-lg font-semibold text-slate-800">
                                        {Math.round(registeredPlatforms.reduce((sum, p) => sum + p.annualListings, 0) / registeredPlatforms.length).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostingPlatformPortal;
