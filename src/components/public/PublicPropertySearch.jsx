import React, { useState } from 'react';
import { Search, MapPin, Building2, ShieldCheck, ShieldAlert, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicPropertySearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Mock property data for public search (subset of private data)
    const allProperties = [
        { id: 1, address: '75-5660 Palani Rd, Kailua-Kona', registration: 'STR-2025-001', status: 'Compliant', zone: 'Hotel-Resort' },
        { id: 2, address: '69-425 Waikoloa Beach Dr, Waikoloa', registration: 'STR-2024-142', status: 'Compliant', zone: 'Resort' },
        { id: 3, address: '77-6425 Ali\'i Dr, Kailua-Kona', registration: 'STR-2025-089', status: 'Non-Compliant', zone: 'Multi-Family' },
        { id: 4, address: '12-345 Ocean View Pkwy, Ocean View', registration: 'Unregistered', status: 'Inquiry Pending', zone: 'Agricultural' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const filtered = allProperties.filter(p =>
            p.address.toLowerCase().includes(query.toLowerCase()) ||
            p.registration.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setHasSearched(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">

            {/* Intro */}
            <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-hawaii-ocean/10 text-hawaii-ocean rounded-2xl mb-2">
                    <Search className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Public Rental Registry</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Verify the registration status of any Short-Term Vacation Rental (STVR) in the County of Hawai'i.
                    Enter an address or registration number to begin.
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Enter property address or STR-YYYY-XXX..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-5 bg-transparent border-none focus:ring-0 text-xl text-slate-800 placeholder:text-slate-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-5 bg-hawaii-ocean text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold text-slate-800">Search Results ({results.length})</h2>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
                            <Filter className="w-4 h-4" /> Filter results
                        </button>
                    </div>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {results.map((prop) => (
                                <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between hover:border-hawaii-ocean/30 transition-colors shadow-sm group">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${prop.status === 'Compliant' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-hawaii-ocean transition-colors">{prop.address}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm font-medium text-slate-400">Reg: {prop.registration}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-sm font-medium text-slate-400">{prop.zone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className={`flex items-center gap-1 justify-end font-bold text-sm ${prop.status === 'Compliant' ? 'text-green-600' : 'text-red-600'}`}>
                                                {prop.status === 'Compliant' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                {prop.status.toUpperCase()}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Status verified as of Jan 2026</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-hawaii-ocean group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-600">No properties found</h3>
                            <p className="text-slate-500 mt-1">Try a different address or check for typos.</p>
                            <button
                                onClick={() => setHasSearched(false)}
                                className="mt-6 font-bold text-hawaii-ocean hover:underline"
                            >
                                Clear search and try again
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Public Notice Footer */}
            {!hasSearched && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-2">Notice a Violation?</h3>
                        <p className="text-sm text-slate-500 mb-4">If you believe a property is operating without a valid registration, you can submit an anonymous complaint.</p>
                        <Link to="/submit-complaint" className="text-hawaii-ocean font-bold text-sm hover:underline flex items-center gap-1">
                            Submit a Complaint <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-2">Need to Register?</h3>
                        <p className="text-sm text-slate-500 mb-4">Are you a property owner looking to register your rental? View the official guidelines and application portal.</p>
                        <Link to="/register" className="text-hawaii-ocean font-bold text-sm hover:underline flex items-center gap-1">
                            Owner Registration <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PublicPropertySearch;
