import React from 'react';
import { DollarSign, FileText, ArrowUpRight, TrendingUp, AlertCircle, PieChart } from 'lucide-react';

const FinanceOverview = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Finance Department Overview</h2>
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase">Revenue Tracking Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-hawaii-ocean/10 flex items-center justify-center text-hawaii-ocean">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Collections</p>
                        <p className="text-2xl font-bold text-slate-800">$842,500</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-hawaii-coral/10 flex items-center justify-center text-hawaii-coral">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Assessments</p>
                        <p className="text-2xl font-bold text-slate-800">124</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <PieChart className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Audit Match Rate</p>
                        <p className="text-2xl font-bold text-slate-800">94.2%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-hawaii-ocean" /> Recent RPT Extracts
                    </h3>
                    <div className="space-y-3">
                        {['RPT_Master_Jan2026.csv', 'Tax_Variance_Report.json', 'Kona_Zone_Audit.csv'].map((file, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                <span className="text-sm font-medium text-slate-700">{file}</span>
                                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-hawaii-ocean" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Departmental Tasks</h3>
                    <div className="space-y-3">
                        <p className="text-sm text-slate-600 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hawaii-coral mt-2"></div> Verify Q4 TAT matching for AirBnB</p>
                        <p className="text-sm text-slate-600 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hawaii-ocean mt-2"></div> Generate iaSWorld sync log</p>
                        <p className="text-sm text-slate-600 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2"></div> Archive 2024 tax rolls</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;
