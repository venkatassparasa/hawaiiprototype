import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin, CheckCircle, Clock, FileText, Download } from 'lucide-react';

const InspectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on ID
    const inspections = {
        '1': { id: 1, property: '74-5599 Alii Dr', inspector: 'John Smith', date: '2026-02-01', time: '10:00 AM', status: 'scheduled', type: 'Initial Inspection', tmk: '3-7-4-008-002', notes: 'Standard initial inspection for new registration.' },
        '2': { id: 2, property: '69-425 Waikoloa Beach Dr', inspector: 'Jane Doe', date: '2026-02-02', time: '2:00 PM', status: 'scheduled', type: 'Follow-up', tmk: '3-6-9-007-034', notes: 'Follow-up to verify signage compliance.' },
        '3': { id: 3, property: '77-6425 Alii Dr', inspector: 'Bob Johnson', date: '2026-01-28', time: '9:00 AM', status: 'completed', type: 'Compliance Check', tmk: '3-7-7-012-005', notes: 'Property is fully compliant. No issues found.' },
        '4': { id: 4, property: '78-7070 Alii Dr', inspector: 'Alice Williams', date: '2026-01-29', time: '1:00 PM', status: 'in-progress', type: 'Safety Inspection', tmk: '3-7-8-015-008', notes: 'Checking emergency exits and fire safety equipment.' },
    };

    const inspection = inspections[id] || inspections['1'];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/inspections')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Inspection Details</h1>
                        <p className="text-slate-500">{inspection.type}</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">General Information</h2>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div>
                                <span className="text-slate-500 block mb-1">Property Address</span>
                                <div className="flex items-center gap-2 text-slate-900 font-medium">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {inspection.property}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">TMK Number</span>
                                <div className="text-slate-900 font-mono text-xs">{inspection.tmk}</div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Inspector</span>
                                <div className="flex items-center gap-2 text-slate-900 font-medium">
                                    <User className="w-4 h-4 text-slate-400" />
                                    {inspection.inspector}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Schedule Slot</span>
                                <div className="flex items-center gap-2 text-slate-900 font-medium">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(inspection.date).toLocaleDateString()} at {inspection.time}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Inspection Notes</h2>
                        <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100 italic">
                            "{inspection.notes}"
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Status Control</h2>
                        <div className={`p-4 rounded-xl border text-center mb-4 ${inspection.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                            inspection.status === 'in-progress' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                            {inspection.status === 'completed' ? <CheckCircle className="w-8 h-8 mx-auto mb-2" /> : <Clock className="w-8 h-8 mx-auto mb-2" />}
                            <p className="font-bold uppercase text-xs tracking-wider">{inspection.status}</p>
                        </div>
                        {inspection.status !== 'completed' && (
                            <button className="w-full py-2 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm">
                                Update Status
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Documents</h2>
                        <div className="space-y-2">
                            <div className="p-2 border border-slate-100 rounded flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs text-slate-600">Site_Photos.zip</span>
                                </div>
                                <button className="text-hawaii-ocean opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionDetail;
