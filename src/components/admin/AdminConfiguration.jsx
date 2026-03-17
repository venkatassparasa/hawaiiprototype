import React, { useState } from 'react';
import { Settings, DollarSign, Clock, Mail, FileText, Building, Save, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const AdminConfiguration = () => {
    const [activeTab, setActiveTab] = useState('fees');
    const [showPassword, setShowPassword] = useState(false);

    // Mock data for demonstration
    const [fees, setFees] = useState([
        { id: 1, name: 'TVR Registration Fee', amount: 150.00, type: 'annual', description: 'Initial registration for all TVR operators' },
        { id: 2, name: 'Per-Night Tax', amount: 4.00, type: 'per-night', description: 'Transient accommodation tax per night' },
        { id: 3, name: 'Processing Fee', amount: 25.00, type: 'one-time', description: 'Application processing fee' },
    ]);

    const [useTypes, setUseTypes] = useState([
        { id: 1, name: 'Single Family Home', maxOccupancy: 6, minStay: 3, description: 'Detached single-family residence' },
        { id: 2, name: 'Condominium', maxOccupancy: 4, minStay: 2, description: 'Individual condo unit' },
        { id: 3, name: 'Vacation Rental', maxOccupancy: 8, minStay: 1, description: 'Dedicated vacation rental property' },
    ]);

    const [operationalStandards, setOperationalStandards] = useState({
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        maxOccupancyPerBedroom: 2,
        parkingSpacesRequired: 1,
        trashCollectionDays: ['Monday', 'Thursday'],
        noiseLimit: 55,
    });

    const [contactInfo, setContactInfo] = useState({
        departmentName: 'County of Hawaii Planning Department',
        address: '101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720',
        phone: '(808) 961-8285',
        email: 'planning@hawaiicounty.gov',
        website: 'www.hawaiicounty.gov/planning',
        emergencyContact: '(808) 935-3333',
    });

    const [letterTemplates, setLetterTemplates] = useState([
        { id: 1, name: 'Compliance Notice', type: 'violation', subject: 'TVR Compliance Notice', active: true },
        { id: 2, name: 'Approval Letter', type: 'approval', subject: 'TVR Registration Approved', active: true },
        { id: 3, name: 'Rejection Letter', type: 'rejection', subject: 'TVR Registration Denied', active: true },
        { id: 4, name: 'Renewal Reminder', type: 'reminder', subject: 'TVR Registration Renewal Due', active: false },
    ]);

    const tabs = [
        { id: 'fees', label: 'Fee Management', icon: DollarSign },
        { id: 'useTypes', label: 'Use Types', icon: Building },
        { id: 'standards', label: 'Operational Standards', icon: Clock },
        { id: 'contact', label: 'Contact Info', icon: Mail },
        { id: 'templates', label: 'Letter Templates', icon: FileText },
    ];

    const handleSave = () => {
        // Save configuration logic here
        alert('Configuration saved successfully!');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Configuration & Admin Controls</h1>
                <p className="text-slate-600">Manage system settings, fees, operational standards, and templates</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-hawaii-ocean text-hawaii-ocean'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                {/* Fee Management */}
                {activeTab === 'fees' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Fee Management</h2>
                            <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            <Plus className="w-4 h-4" />
                            Add New Fee
                        </button>
                        </div>
                        
                        <div className="space-y-4">
                            {fees.map((fee) => (
                                <div key={fee.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-800">{fee.name}</h3>
                                            <p className="text-sm text-slate-600 mt-1">{fee.description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-lg font-semibold text-hawaii-ocean">${fee.amount.toFixed(2)}</span>
                                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{fee.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Use Types */}
                {activeTab === 'useTypes' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Use Types</h2>
                            <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            <Plus className="w-4 h-4" />
                            Add Use Type
                        </button>
                        </div>
                        
                        <div className="space-y-4">
                            {useTypes.map((useType) => (
                                <div key={useType.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-800">{useType.name}</h3>
                                            <p className="text-sm text-slate-600 mt-1">{useType.description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-sm text-slate-500">Max Occupancy: <strong>{useType.maxOccupancy}</strong></span>
                                                <span className="text-sm text-slate-500">Min Stay: <strong>{useType.minStay} nights</strong></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Operational Standards */}
                {activeTab === 'standards' && (
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Operational Standards</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours Start</label>
                                <input
                                    type="time"
                                    value={operationalStandards.quietHoursStart}
                                    onChange={(e) => setOperationalStandards({...operationalStandards, quietHoursStart: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours End</label>
                                <input
                                    type="time"
                                    value={operationalStandards.quietHoursEnd}
                                    onChange={(e) => setOperationalStandards({...operationalStandards, quietHoursEnd: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Max Occupancy Per Bedroom</label>
                                <input
                                    type="number"
                                    value={operationalStandards.maxOccupancyPerBedroom}
                                    onChange={(e) => setOperationalStandards({...operationalStandards, maxOccupancyPerBedroom: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Parking Spaces Required</label>
                                <input
                                    type="number"
                                    value={operationalStandards.parkingSpacesRequired}
                                    onChange={(e) => setOperationalStandards({...operationalStandards, parkingSpacesRequired: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Noise Limit (dB)</label>
                                <input
                                    type="number"
                                    value={operationalStandards.noiseLimit}
                                    onChange={(e) => setOperationalStandards({...operationalStandards, noiseLimit: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Trash Collection Days</label>
                                <div className="space-y-2">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                        <label key={day} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={operationalStandards.trashCollectionDays.includes(day)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setOperationalStandards({
                                                            ...operationalStandards,
                                                            trashCollectionDays: [...operationalStandards.trashCollectionDays, day]
                                                        });
                                                    } else {
                                                        setOperationalStandards({
                                                            ...operationalStandards,
                                                            trashCollectionDays: operationalStandards.trashCollectionDays.filter(d => d !== day)
                                                        });
                                                    }
                                                }}
                                                className="mr-2"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                {activeTab === 'contact' && (
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Contact Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Department Name</label>
                                <input
                                    type="text"
                                    value={contactInfo.departmentName}
                                    onChange={(e) => setContactInfo({...contactInfo, departmentName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                                <input
                                    type="url"
                                    value={contactInfo.website}
                                    onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                                <input
                                    type="tel"
                                    value={contactInfo.emergencyContact}
                                    onChange={(e) => setContactInfo({...contactInfo, emergencyContact: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                <textarea
                                    value={contactInfo.address}
                                    onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Letter Templates */}
                {activeTab === 'templates' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Letter Templates</h2>
                            <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            <Plus className="w-4 h-4" />
                            Add Template
                        </button>
                        </div>
                        
                        <div className="space-y-4">
                            {letterTemplates.map((template) => (
                                <div key={template.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-800">{template.name}</h3>
                                            <p className="text-sm text-slate-600 mt-1">Subject: {template.subject}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{template.type}</span>
                                                <span className={`text-sm px-2 py-1 rounded ${
                                                    template.active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {template.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                >
                    <Save className="w-4 h-4" />
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default AdminConfiguration;
