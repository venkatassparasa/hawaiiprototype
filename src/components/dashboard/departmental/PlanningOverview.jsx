import React from 'react';
import { Map, Layers, Database, Compass, CheckCircle, Search } from 'lucide-react';

const PlanningOverview = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Planning & Zoning Overview</h2>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase">GIS Layers Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Zoned</p>
                    <p className="text-xl font-bold text-slate-800">14,842</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NCUC Active</p>
                    <p className="text-xl font-bold text-hawaii-ocean">1,215</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New ST Appls</p>
                    <p className="text-xl font-bold text-slate-800">42</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-hawaii-coral">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Zoning Variance</p>
                    <p className="text-xl font-bold text-hawaii-coral">84</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-hawaii-ocean" /> EPIC Tyler Permit Sync
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="pb-4">Permit #</th>
                                    <th className="pb-4">TMK Ref</th>
                                    <th className="pb-4">EPIC Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {[
                                    { id: 'ST-2026-001', tmk: '3-7-4-001', status: 'Approved' },
                                    { id: 'ST-2026-002', tmk: '3-6-9-042', status: 'Pending' },
                                    { id: 'ST-2025-842', tmk: '6-4-1-008', status: 'Denied' },
                                ].map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="py-4 font-bold text-hawaii-ocean uppercase">{p.id}</td>
                                        <td className="py-4 font-mono text-xs">{p.tmk}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-hawaii-coral" /> Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Launch GIS Viewer</button>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Print NCUC Bach</button>
                        <button className="w-full py-2 bg-hawaii-ocean text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all">New Zoning Review</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanningOverview;
