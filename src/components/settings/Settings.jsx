import React from 'react';
import { ToggleLeft, Save, User, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                    <p className="text-slate-500">Global configuration for compliance rules and integrations.</p>
                </div>
                <button className="px-6 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium shadow-sm">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Navigation Sidebar */}
                <div className="space-y-1 col-span-1">
                    <button className="w-full text-left px-4 py-3 bg-white border-l-4 border-hawaii-ocean shadow-sm font-medium text-hawaii-ocean rounded-r-lg flex items-center gap-3">
                        <Shield className="w-5 h-5" /> Compliance Rules
                    </button>
                    <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                        <User className="w-5 h-5" /> User Management
                    </button>
                    <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                        <Bell className="w-5 h-5" /> Notifications
                    </button>
                    <button className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                        <Database className="w-5 h-5" /> Integrations
                    </button>
                </div>

                {/* Content Area */}
                <div className="col-span-2 space-y-6">

                    {/* Section: Entity Resolution */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">Entity Resolution Logic</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                                <div>
                                    <h3 className="font-medium text-slate-900">Auto-Merge Listings</h3>
                                    <p className="text-sm text-slate-500">Automatically merge properties with &gt;95% image similarity.</p>
                                </div>
                                <ToggleLeft className="w-10 h-10 text-hawaii-ocean cursor-pointer" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-slate-900">Fuzzy Address Matching</h3>
                                    <p className="text-sm text-slate-500">Allow slight variations in address syntax.</p>
                                </div>
                                <ToggleLeft className="w-10 h-10 text-hawaii-ocean cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Smart Fining */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">Ordinance §19-7.2 Configuration</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Base Fine Amount ($)</label>
                                <input type="number" defaultValue={500} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recidivism Multiplier</label>
                                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 bg-white">
                                    <option>2x per offense</option>
                                    <option>3x per offense</option>
                                    <option>Progressive Scale</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">Applies to repeat offenders within a 12-month period.</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Settings;
