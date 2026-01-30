import React, { useState } from 'react';
import { Book, Search, ShieldAlert, Info, ExternalLink, ChevronRight } from 'lucide-react';

const ViolationCatalog = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Operational Standards Violations Catalog (KFR-2K)
    const standards = [
        {
            id: 'OP-001',
            title: 'NCUC Availability (PVR)',
            category: 'Documentation',
            description: 'Owner/operator shall make a copy of the NCUC available to the Department or guests upon request.',
            fine: '$500 per day',
            reference: 'HCC 25-4-13.1(e)(1)',
        },
        {
            id: 'OP-002',
            title: 'Registration Number Display',
            category: 'Advertising',
            description: 'Registration number must be clearly displayed on all print and electronic advertisements.',
            fine: '$1,000 per violation',
            reference: 'HCC 25-4-13.1(g)(2)',
        },
        {
            id: 'OP-003',
            title: 'Quiet Hours Compliance',
            category: 'Operational Standards',
            description: 'Quiet hours must be observed between 9:00 PM and 8:00 AM. Noise shall not disturb neighbors.',
            fine: '$2,500 per incident',
            reference: 'HCC 25-4-13.1(h)(5)',
        },
        {
            id: 'OP-004',
            title: 'Designated Parking',
            category: 'Operational Standards',
            description: 'All guest parking shall be on-site. Street parking by guests is prohibited.',
            fine: '$500 per vehicle',
            reference: 'HCC 25-4-13.1(h)(2)',
        },
        {
            id: 'OP-005',
            title: 'Local Contact Information',
            category: 'Management',
            description: 'Local contact information must be posted in the unit and provided to neighbors within 300ft.',
            fine: '$1,000 per violation',
            reference: 'HCC 25-4-13.1(h)(3)',
        }
    ];

    const filteredStandards = standards.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-hawaii-ocean text-white rounded-xl shadow-sm">
                    <Book className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Violation Standards Catalog</h1>
                    <p className="text-slate-500">Official operational standards and penalty schedule (KFR-2K)</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search standards, keywords, or references..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-lg"
                />
            </div>

            {/* Grid of Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStandards.map((std) => (
                    <div key={std.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold font-mono">
                                    {std.id}
                                </span>
                                <span className="text-xs font-medium text-hawaii-ocean px-2 py-1 bg-blue-50 rounded italic">
                                    {std.reference}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{std.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                {std.description}
                            </p>
                            <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg inline-flex">
                                <ShieldAlert className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">Penalty: {std.fine}</span>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Info className="w-3 h-3" /> {std.category}
                            </span>
                            <button className="text-hawaii-ocean text-xs font-bold flex items-center gap-1 hover:underline">
                                Full Text <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStandards.length === 0 && (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No matching standards found in the catalog.</p>
                </div>
            )}

            {/* Guide Card */}
            <div className="bg-[url('/bg-hawaii.jpg')] bg-cover bg-center rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Comprehensive Guide</h2>
                        <p className="text-blue-100 max-w-md">Download the complete County of Hawai'i Short-Term Rental compliance handbook for owners and operators.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap">
                        Download Handbook <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

        </div>
    );
};

export default ViolationCatalog;
