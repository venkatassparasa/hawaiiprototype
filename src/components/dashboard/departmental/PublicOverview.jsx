import React from 'react';
import { Search, Info, MapPin, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicOverview = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            {/* <div className="bg-gradient-to-r from-hawaii-ocean to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"> */}
            <div className="bg-[url('/bg-hawaii.jpg')] bg-cover bg-center rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Welcome to the Public Compliance Portal</h2>
                    <p className="text-blue-100 text-lg mb-6">
                        The County of Hawaii is committed to transparency in short-term rental compliance.
                        Search for registered properties, report concerns, or access helpful resources.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/public-search"
                            className="bg-[#B54848] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" /> Search Properties
                        </Link>
                        <Link
                            to="/submit-complaint"
                            className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors flex items-center gap-2 border border-white/30"
                        >
                            <Info className="w-5 h-5" /> Report a Concern
                        </Link>
                    </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Compliance Map</h3>
                    <p className="text-slate-500 text-sm mb-4">View a geospatial representation of permitted short-term rentals and overall compliance status across the island.</p>
                    <Link to="/map" className="text-hawaii-ocean font-bold text-sm flex items-center gap-1 hover:underline">
                        Explore Map <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Public Resources</h3>
                    <p className="text-slate-500 text-sm mb-4">Access STVR regulations, compliance guides, fee schedules, and official County announcements.</p>
                    <Link to="/public-resources" className="text-hawaii-ocean font-bold text-sm flex items-center gap-1 hover:underline">
                        View Resources <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                        <Info className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Registration Status</h3>
                    <p className="text-slate-500 text-sm mb-4">Check the status of an active application or verify the validity of a specific Certificate number.</p>
                    <Link to="/registration-status" className="text-hawaii-ocean font-bold text-sm flex items-center gap-1 hover:underline">
                        Check Status <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Information Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex gap-4 items-start text-slate-600">
                <Info className="w-6 h-6 text-slate-400 mt-1 shrink-0" />
                <div className="text-sm">
                    <p className="font-bold text-slate-800 mb-1">Notice to the Public</p>
                    <p>The information provided on this portal is for general informational purposes and reflects the most recent data available to the County of Hawaii. Official records for legal or financial purposes should be requested through the appropriate County Department.</p>
                </div>
            </div>
        </div>
    );
};

export default PublicOverview;
