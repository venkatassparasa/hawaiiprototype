import React, { useState } from 'react';
import { Settings, Info, Eye, EyeOff } from 'lucide-react';

const PublicSettings = () => {
    const [activeTab, setActiveTab] = useState('standards');
    const [showPassword, setShowPassword] = useState(false);

    // Get operational standards from localStorage or use defaults
    const [operationalStandards, setOperationalStandards] = useState(() => {
        const saved = localStorage.getItem('operationalStandards');
        return saved ? JSON.parse(saved) : {
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00',
            maxOccupancyPerBedroom: 2,
            parkingSpacesRequired: 1,
            trashCollectionDays: ['Monday', 'Thursday'],
            noiseLimit: 55,
        };
    });

    // Get contact info from localStorage or use defaults
    const [contactInfo, setContactInfo] = useState(() => {
        const saved = localStorage.getItem('contactInfo');
        return saved ? JSON.parse(saved) : {
            departmentName: 'County of Hawaii Planning Department',
            address: '101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720',
            phone: '(808) 961-8285',
            email: 'planning@hawaiicounty.gov',
            website: 'www.hawaiicounty.gov/planning',
            emergencyContact: '(808) 935-3333',
        };
    });

    const handleSaveStandards = () => {
        localStorage.setItem('operationalStandards', JSON.stringify(operationalStandards));
        alert('Operational standards saved successfully!');
    };

    const handleSaveContactInfo = () => {
        localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
        alert('Contact information saved successfully!');
    };

    const tabs = [
        { id: 'standards', label: 'Operational Standards', icon: Settings },
        { id: 'contact', label: 'Contact Information', icon: Info },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Public Settings & Information</h1>
                <p className="text-slate-600 mb-6">View operational standards and contact information for County compliance requirements.</p>
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

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                {/* Operational Standards Tab */}
                {activeTab === 'standards' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Operational Standards</h2>
                            <button
                                onClick={handleSaveStandards}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Settings className="w-4 h-4" />
                                Save Standards
                            </button>
                        </div>
                        
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
                                            <span className="text-sm text-slate-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Information Tab */}
                {activeTab === 'contact' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Contact Information</h2>
                            <button
                                onClick={handleSaveContactInfo}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Settings className="w-4 h-4" />
                                Save Contact Info
                            </button>
                        </div>
                        
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
                                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                <textarea
                                    value={contactInfo.address}
                                    onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicSettings;
