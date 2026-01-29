import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle, Download, ExternalLink } from 'lucide-react';

const AppealDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on ID
    const appeals = {
        '1': { id: 1, appealNumber: 'APP-2026-001', caseNumber: 'VC-2026-001', property: '74-5599 Alii Dr', appellant: 'John Doe', filed: '2026-01-20', hearing: '2026-02-15', status: 'pending', fineAmount: 1000, description: 'Owner claims the noise was from a neighboring property, not theirs.' },
        '2': { id: 2, appealNumber: 'APP-2026-002', caseNumber: 'VC-2026-002', property: '69-425 Waikoloa Beach Dr', appellant: 'Jane Smith', filed: '2026-01-22', hearing: '2026-02-20', status: 'scheduled', fineAmount: 2000, description: 'Disputing the validity of the operational standards violation regarding signage.' },
        '3': { id: 3, appealNumber: 'APP-2025-045', caseNumber: 'VC-2025-089', property: '77-6425 Alii Dr', appellant: 'Bob Johnson', filed: '2025-12-10', hearing: '2026-01-15', status: 'decided', fineAmount: 1500, decision: 'Upheld', description: 'Appeal against unpermitted operation. Evidence confirmed violation.' },
    };

    const appeal = appeals[id] || appeals['1'];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/appeals')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Appeal Review</h1>
                        <p className="text-slate-500">#{appeal.appealNumber}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                        <Download className="w-4 h-4" /> Export Case File
                    </button>
                    <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 font-medium text-sm">
                        Schedule Hearing
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-800">Appeal Information</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${appeal.status === 'decided' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                {appeal.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-6 text-sm">
                            <div>
                                <span className="text-slate-500 block mb-1">Appellant</span>
                                <div className="flex items-center gap-2 text-slate-900 font-medium">
                                    <User className="w-4 h-4 text-slate-400" />
                                    {appeal.appellant}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Property</span>
                                <div className="text-slate-900 font-medium">{appeal.property}</div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Case #</span>
                                <div className="flex items-center gap-1 text-hawaii-ocean font-mono font-medium hover:underline cursor-pointer">
                                    {appeal.caseNumber} <ExternalLink className="w-3 h-3" />
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Fine Amount</span>
                                <div className="text-red-600 font-bold text-lg">${appeal.fineAmount.toLocaleString()}</div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Date Filed</span>
                                <div className="flex items-center gap-2 text-slate-900">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(appeal.filed).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Hearing Date</span>
                                <div className="flex items-center gap-2 text-slate-900 font-bold text-hawaii-ocean">
                                    <Scale className="w-4 h-4" />
                                    {appeal.hearing ? new Date(appeal.hearing).toLocaleDateString() : 'TBD'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Basis for Appeal</h2>
                        <div className="p-4 bg-slate-50 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                            {appeal.description}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/10">
                            Uphold Violation
                        </button>
                        <button className="py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                            Dismiss Violation
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Appeal Timeline</h2>
                        <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                <p className="text-xs font-bold text-slate-800">Appeal Filed</p>
                                <p className="text-[10px] text-slate-500">{new Date(appeal.filed).toLocaleDateString()}</p>
                            </div>
                            <div className="relative pl-8">
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${appeal.hearing ? 'bg-blue-500' : 'bg-slate-200'} border-2 border-white`}></div>
                                <p className="text-xs font-bold text-slate-800">Hearing Scheduled</p>
                                <p className="text-[10px] text-slate-500">{appeal.hearing ? new Date(appeal.hearing).toLocaleDateString() : 'Pending'}</p>
                            </div>
                            <div className="relative pl-8">
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${appeal.decision ? 'bg-purple-500' : 'bg-slate-200'} border-2 border-white`}></div>
                                <p className="text-xs font-bold text-slate-800">Decision Issued</p>
                                <p className="text-[10px] text-slate-500">{appeal.decision ? 'Completed' : 'Pending'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Decision info if exists */}
                    {appeal.decision && (
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Decision: {appeal.decision}
                            </h3>
                            <p className="text-sm text-purple-700">The Board of Appeals has finalized the decision on this case.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppealDetail;
