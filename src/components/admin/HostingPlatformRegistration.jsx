import React, { useState } from 'react';
import { Database, Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HostingPlatformRegistration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
    // Hosting Platform Registration Data
    const [hostingPlatform, setHostingPlatform] = useState({
        platformName: '',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        apiEndpoint: '',
        apiKey: '',
        commissionRate: 0,
        listingFee: 0,
        complianceFeatures: {
            autoReporting: false,
            taxCollection: false,
            verification: false,
            monitoring: false
        },
        isActive: false
    });

    // Hosting Platform Handlers
    const handleHostingPlatformChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setHostingPlatform(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setHostingPlatform(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSaveHostingPlatform = () => {
        // Validate required fields
        if (!hostingPlatform.platformName || !hostingPlatform.companyName || !hostingPlatform.email) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Save hosting platform configuration
        console.log('Saving hosting platform:', hostingPlatform);
        alert('Hosting Platform registration saved successfully!');
    };

    return (
        <div className="min-h-screen" style={{background: 'transparent linear-gradient(180deg, #2D6065 0%, #19484D 100%) 0% 0% no-repeat padding-box'}}>
            {/* Header */}
            <div style={{background: '#4D7833 0% 0% no-repeat padding-box'}} className="border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Login</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <img
                                src="/h_logo.png"
                                alt="County of Hawaii"
                                className="h-8 w-auto object-contain filter sepia-[30%] saturate-150 brightness-110 contrast-105"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Hosting Platform Registration</h1>
                        <p className="text-white/90">Register your hosting platform with Hawaii County</p>
                    </div>

                {/* Registration Form */}
                <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Platform Information</h2>
                            <button 
                                onClick={handleSaveHostingPlatform} 
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Save className="w-4 h-4" />
                                Save Registration
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Platform Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Platform Details</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name *</label>
                                    <input
                                        type="text"
                                        value={hostingPlatform.platformName}
                                        onChange={(e) => handleHostingPlatformChange('platformName', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Airbnb, VRBO, Booking.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                                    <input
                                        type="text"
                                        value={hostingPlatform.companyName}
                                        onChange={(e) => handleHostingPlatformChange('companyName', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Legal company name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                                    <input
                                        type="url"
                                        value={hostingPlatform.website}
                                        onChange={(e) => handleHostingPlatformChange('website', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                            
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Contact Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Person</label>
                                    <input
                                        type="text"
                                        value={hostingPlatform.contactPerson}
                                        onChange={(e) => handleHostingPlatformChange('contactPerson', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Primary contact name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={hostingPlatform.email}
                                        onChange={(e) => handleHostingPlatformChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={hostingPlatform.phone}
                                        onChange={(e) => handleHostingPlatformChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                            
                            {/* Address Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Address Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Business Address</label>
                                    <textarea
                                        value={hostingPlatform.address}
                                        onChange={(e) => handleHostingPlatformChange('address', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Full business address"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            
                            {/* Technical Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Technical Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">API Endpoint</label>
                                    <input
                                        type="url"
                                        value={hostingPlatform.apiEndpoint}
                                        onChange={(e) => handleHostingPlatformChange('apiEndpoint', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://api.example.com/v1"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={hostingPlatform.apiKey}
                                            onChange={(e) => handleHostingPlatformChange('apiKey', e.target.value)}
                                            className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="API authentication key"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Financial Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Financial Information</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Commission Rate (%)</label>
                                    <input
                                        type="number"
                                        value={hostingPlatform.commissionRate}
                                        onChange={(e) => handleHostingPlatformChange('commissionRate', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Listing Fee ($)</label>
                                    <input
                                        type="number"
                                        value={hostingPlatform.listingFee}
                                        onChange={(e) => handleHostingPlatformChange('listingFee', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                            
                            {/* Compliance Features */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">Compliance Features</h3>
                                
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={hostingPlatform.complianceFeatures.autoReporting}
                                            onChange={(e) => handleHostingPlatformChange('complianceFeatures.autoReporting', e.target.checked)}
                                            className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">Automatic Reporting to County</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={hostingPlatform.complianceFeatures.taxCollection}
                                            onChange={(e) => handleHostingPlatformChange('complianceFeatures.taxCollection', e.target.checked)}
                                            className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">Tax Collection Services</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={hostingPlatform.complianceFeatures.verification}
                                            onChange={(e) => handleHostingPlatformChange('complianceFeatures.verification', e.target.checked)}
                                            className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">Property Verification System</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={hostingPlatform.complianceFeatures.monitoring}
                                            onChange={(e) => handleHostingPlatformChange('complianceFeatures.monitoring', e.target.checked)}
                                            className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-slate-700">Compliance Monitoring</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        {/* Platform Status */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-800">Platform Status</h3>
                                    <p className="text-sm text-slate-600 mt-1">Enable or disable this hosting platform</p>
                                </div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={hostingPlatform.isActive}
                                        onChange={(e) => handleHostingPlatformChange('isActive', e.target.checked)}
                                        className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Active Platform</span>
                                </label>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveHostingPlatform}
                                disabled={!hostingPlatform.platformName || !hostingPlatform.companyName || !hostingPlatform.email}
                                className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Save className="w-4 h-4" />
                                Submit Registration
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center text-sm text-white/70">
                    <p>For assistance with hosting platform registration, contact:</p>
                    <p className="font-medium text-white/90 mt-1">planning@hawaiicounty.gov | (808) 961-8285</p>
                </div>
                </div>
            </div>
        </div>
    );
};

export default HostingPlatformRegistration;
