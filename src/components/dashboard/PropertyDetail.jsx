import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Link as LinkIcon, Calendar, Camera, FileWarning, DollarSign, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetail = () => {
    const { id } = useParams();
    const [noticeSent, setNoticeSent] = useState(false);

    // Mock Data
    const property = {
        address: '75-5660 Palani Rd, Kailua-Kona, HI 96740',
        tmk: '3-7-5-004-001',
        owner: 'Hale Aloha LLC / John Smith',
        status: 'Non-Compliant',
        fineAmount: 15000,
        listings: [
            { platform: 'Airbnb', id: 'abnb_29384', url: 'airbnb.com/rooms/29384', price: '$450/night', lastScraped: '2 hrs ago' },
            { platform: 'VRBO', id: 'vrbo_99283', url: 'vrbo.com/99283', price: '$465/night', lastScraped: '5 hrs ago' },
        ],
        evidence: [
            { type: 'listing', date: '2026-01-28', title: 'Listing Active on Airbnb', desc: 'Calendar shows available dates in Feb 2026.', icon: Camera, color: 'text-blue-600 bg-blue-50' },
            { type: 'complaint', date: '2026-01-25', title: 'Neighbor Complaint #22-01', desc: 'Report of noise and illegal parking.', icon: FileWarning, color: 'text-orange-600 bg-orange-50' },
            { type: 'booking', date: '2026-01-20', title: 'Confirmed Booking', desc: 'Guest review confirms stay Jan 15-20.', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
        ]
    };

    const handleSendNotice = () => {
        setNoticeSent(true);
        setTimeout(() => setNoticeSent(false), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-hawaii-ocean transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex justify-between items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-slate-900">{property.address}</h1>
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full border border-red-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Non-Compliant
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-slate-500 text-sm">
                        <span>TMK: <span className="font-mono text-slate-700 font-medium">{property.tmk}</span></span>
                        <span>Owner: <span className="text-slate-700 font-medium">{property.owner}</span></span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Accumulated Fines</p>
                    <p className="text-3xl font-bold text-slate-900">${property.fineAmount.toLocaleString()}</p>
                    <p className="text-xs text-red-600 font-medium mt-1">+ $500/day (Recidivism Multiplier)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Entity Resolution */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-purple-600" />
                                Entity Resolution
                            </h2>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Match 98%</span>
                        </div>

                        <div className="space-y-4">
                            {property.listings.map((listing, i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100 relative group hover:border-hawaii-ocean transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-700">{listing.platform}</span>
                                        <span className="text-xs text-slate-400">{listing.lastScraped}</span>
                                    </div>
                                    <p className="text-sm text-hawaii-ocean font-medium mb-1 truncate">{listing.url}</p>
                                    <p className="text-sm text-slate-600">{listing.price}</p>

                                    {i < property.listings.length - 1 && (
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
                                            <LinkIcon className="w-4 h-4 text-purple-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-xs text-purple-800 leading-relaxed">
                                <strong>System Logic:</strong> These listings were merged based on image hash similarity (0.94) and fuzzy address matching. Confirmed by human review.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Evidence & Action */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Center */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Enforcement Action
                        </h2>
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div>
                                <p className="font-medium text-slate-900">Recommended Action: Issue Notice of Violation</p>
                                <p className="text-sm text-slate-500">Based on evidence chain and Ordinance §19-7.2</p>
                            </div>
                            <button
                                onClick={handleSendNotice}
                                disabled={noticeSent}
                                className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${noticeSent
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'bg-hawaii-ocean text-white hover:bg-blue-800 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {noticeSent ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" /> Notice Sent
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Generate NOV
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Evidence Timeline */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FileWarning className="w-5 h-5 text-slate-600" />
                            Evidence Chain of Custody
                        </h2>

                        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-8 pb-4">
                            {property.evidence.map((ev, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[41px] top-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${ev.color}`}>
                                        <ev.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{ev.title}</h3>
                                            <p className="text-sm text-slate-600 mt-1">{ev.desc}</p>
                                        </div>
                                        <span className="text-sm font-medium text-slate-400">{ev.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
