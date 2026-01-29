import React, { useState } from 'react';
import { ArrowLeft, Link as LinkIcon, Calendar, FileText, Camera, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CaseReview = () => {
    const [fineAmount, setFineAmount] = useState(1000);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSaveAndContinue = () => {
        // In a real app, this would save the case data to backend
        console.log('Saving case data...');
        // Navigate to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="bg-hawaii-ocean text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold">Case #2026-001: Unregistered Operation</h1>
                </div>
                <button
                    onClick={handleSaveAndContinue}
                    className="px-6 py-2 bg-white text-hawaii-ocean rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                    Save & Continue
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Sidebar - Property Profile */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">Property Profile</h2>
                        </div>

                        <div className="p-4 space-y-4">
                            <img
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
                                alt="Property"
                                className="w-full h-32 object-cover rounded-lg"
                            />

                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-slate-500 text-xs">Property Address</p>
                                    <p className="font-medium text-slate-800">74-5599 Alii Dr, Kailua-Kona, HI 96740</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                        Status: Non-Compliant
                                    </span>
                                </div>

                                <div>
                                    <p className="text-slate-500 text-xs">Parcel ID</p>
                                    <p className="font-mono text-slate-800">7-7-4-008-002-0000</p>
                                </div>

                                <div>
                                    <p className="text-slate-500 text-xs">Owner</p>
                                    <p className="text-slate-800">John Doe</p>
                                </div>
                            </div>

                            <Link
                                to={`/property/${id}`}
                                className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-center block"
                            >
                                View Full Property Details
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Center - Violation Case Review */}
                <div className="lg:col-span-6 space-y-4">

                    {/* Linked Listings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 bg-hawaii-ocean text-white">
                            <h2 className="font-bold">Linked Listings</h2>
                        </div>

                        <div className="p-4">
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-3">Merged Record - Multi-Platform Activity</h3>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 bg-white rounded-lg p-3 border border-slate-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">A</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Airbnb</p>
                                                <p className="text-xs text-slate-500">ID: 456</p>
                                            </div>
                                        </div>
                                    </div>

                                    <LinkIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />

                                    <div className="flex-1 bg-white rounded-lg p-3 border border-slate-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">V</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">VRBO</p>
                                                <p className="text-xs text-slate-500">VR-456</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    Both listings are linked to this property address and have been successfully merged into a single violation record.
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Merged on: 2026-05-10 14:25 PM
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Evidence Chain */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800">Evidence Chain</h2>
                            <button className="text-sm text-hawaii-ocean font-medium hover:underline">
                                View All Evidence
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                                {/* Evidence Card 1 */}
                                <div className="bg-red-50 rounded-lg p-3 border border-red-100 relative group cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-red-100 rounded mb-2 flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-red-400" />
                                    </div>
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Timestamp
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 mt-1">2026-05-12 08:30 AM</p>
                                    <p className="text-xs text-slate-600 mt-1">Listing Active on Airbnb (Snapshot)</p>
                                </div>

                                {/* Evidence Card 2 */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 relative group cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-white rounded mb-2 flex items-center justify-center border border-slate-200">
                                        <Calendar className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 mt-1">Active Booking Availability</p>
                                    <p className="text-xs text-slate-600 mt-1">(Snapshot) - 2026-05-12</p>
                                </div>

                                {/* Evidence Card 3 */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 relative group cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-white rounded mb-2 flex items-center justify-center border border-slate-200">
                                        <FileText className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 mt-1">Neighbor Complaint Form</p>
                                    <p className="text-xs text-slate-600 mt-1">2026-05-08</p>
                                </div>

                                {/* Evidence Card 4 */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 relative group cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-white rounded mb-2 flex items-center justify-center border border-slate-200">
                                        <Camera className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <button className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-6 h-6 text-hawaii-ocean" />
                                    </button>
                                    <p className="text-xs font-bold text-slate-800 mt-1">View All Evidence</p>
                                    <p className="text-xs text-slate-600 mt-1">Field Inspection Photo - 2026-05-13</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Fine Calculator */}
                <div className="lg:col-span-3">
                    <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden sticky top-20">
                        <div className="p-4 border-b border-blue-100">
                            <h2 className="font-bold text-slate-800">Fine Calculator</h2>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">Violation Type</label>
                                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                    <option>Unregistered Short-Term Rental (Tier 1)</option>
                                    <option>Unpermitted Operation (Tier 2)</option>
                                    <option>Safety Violation (Tier 3)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">Highest Advertised Rate</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                    <input
                                        type="number"
                                        value={500}
                                        className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">Multiplier</label>
                                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                    <option>2x (Recidivism)</option>
                                    <option>1x (First Offense)</option>
                                    <option>3x (Repeat Offender)</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-blue-200">
                                <p className="text-sm font-medium text-slate-600 mb-2">Proposed Fine: <span className="text-2xl font-bold text-slate-900">${fineAmount.toLocaleString()}</span></p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Calculation based on Hawaii County Code § 19-7.2. Previous violation confirmed.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                                    Recalculate
                                </button>
                                <button className="flex-1 px-4 py-2 bg-hawaii-ocean text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                                    Approve Fine
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CaseReview;
