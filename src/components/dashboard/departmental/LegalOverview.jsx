import React from 'react';
import { Scale, ShieldCheck, AlertTriangle, FileText, Clock, ArrowRight } from 'lucide-react';

const LegalOverview = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Legal & Enforcement Overview</h2>
                <div className="px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase">Enforcement Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Open Violations</p>
                    <p className="text-3xl font-bold text-slate-800">1,242</p>
                    <AlertTriangle className="absolute -right-2 -bottom-2 w-16 h-16 text-hawaii-coral opacity-5" />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Appeals</p>
                    <p className="text-3xl font-bold text-slate-800">41</p>
                    <Scale className="absolute -right-2 -bottom-2 w-16 h-16 text-hawaii-ocean opacity-5" />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Closure Rate</p>
                    <p className="text-3xl font-bold text-slate-800">76%</p>
                    <ShieldCheck className="absolute -right-2 -bottom-2 w-16 h-16 text-green-500 opacity-5" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-hawaii-ocean" /> Cases Awaiting Opinion
                    </h3>
                    <div className="space-y-4">
                        {[
                            { id: 'VC-2026-001', address: '75-5660 Palani Rd', priority: 'High' },
                            { id: 'VC-2026-004', address: '69-123 Alii Dr', priority: 'Medium' },
                        ].map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
                                <div>
                                    <p className="text-xs font-bold text-hawaii-ocean font-mono">{c.id}</p>
                                    <p className="text-sm font-bold text-slate-800">{c.address}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${c.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {c.priority} Priority
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-hawaii-ocean" /> Legal Library
                    </h3>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-hawaii-ocean transition-all text-sm group">
                            <span>Violation Notice Templates</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-hawaii-ocean" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-hawaii-ocean transition-all text-sm group">
                            <span>HRS §103D Compliance Guide</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-hawaii-ocean" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-hawaii-ocean transition-all text-sm group">
                            <span>Appeal Process Workflow</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-hawaii-ocean" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalOverview;
