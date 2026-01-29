import React, { useState } from 'react';
import { FileText, Download, Send, Eye, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoticeGenerator = ({ caseId }) => {
    const [noticeType, setNoticeType] = useState('warning');
    const [selectedTemplate, setSelectedTemplate] = useState('unregistered-operation');
    const [fineAmount, setFineAmount] = useState(1000);
    const [dueDate, setDueDate] = useState('');
    const navigate = useNavigate();

    const noticeTypes = [
        { value: 'warning', label: 'Warning Notice', color: 'yellow' },
        { value: 'violation', label: 'Notice of Violation (NOV)', color: 'orange' },
        { value: 'fine', label: 'Fine Assessment', color: 'red' },
        { value: 'cease-desist', label: 'Cease & Desist', color: 'red' },
    ];

    const templates = {
        'unregistered-operation': {
            name: 'Unregistered Short-Term Rental Operation',
            ordinance: 'HCC § 25-5-10',
            description: 'Operating a transient vacation rental without valid registration',
            baseFine: 1000,
        },
        'operational-standards': {
            name: 'Operational Standards Violation',
            ordinance: 'HCC § 25-5-15',
            description: 'Violation of operational requirements (occupancy, parking, quiet hours)',
            baseFine: 500,
        },
        'safety-violation': {
            name: 'Safety Code Violation',
            ordinance: 'HCC § 25-5-20',
            description: 'Failure to meet safety and building code requirements',
            baseFine: 2000,
        },
    };

    const handleGenerate = () => {
        console.log('Generating notice:', { noticeType, selectedTemplate, fineAmount, dueDate });
        alert(`Notice generated successfully! Document ready for review.`);
    };

    const handleSend = () => {
        console.log('Sending notice via mail and email');
        alert('Notice sent to property owner via certified mail and email.');
        navigate('/violations');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Generate Violation Notice</h1>
                <p className="text-slate-500">Create and send enforcement notices with ordinance citations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Notice Type Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Notice Type</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {noticeTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setNoticeType(type.value)}
                                    className={`p-4 border-2 rounded-lg text-left transition-all ${noticeType === type.value
                                            ? 'border-hawaii-ocean bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <h3 className="font-bold text-slate-800 text-sm">{type.label}</h3>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Violation Template</h2>
                        <div className="space-y-3">
                            {Object.entries(templates).map(([key, template]) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setSelectedTemplate(key);
                                        setFineAmount(template.baseFine);
                                    }}
                                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedTemplate === key
                                            ? 'border-hawaii-ocean bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-slate-800">{template.name}</h3>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            {template.ordinance}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{template.description}</p>
                                    <p className="text-xs text-slate-500 mt-2">Base Fine: ${template.baseFine.toLocaleString()}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fine & Due Date */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 mb-4">Notice Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Fine Amount
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        value={fineAmount}
                                        onChange={(e) => setFineAmount(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Response Due Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerate}
                            className="flex-1 px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800 flex items-center justify-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Generate Notice
                        </button>
                        <button
                            onClick={handleSend}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Notice
                        </button>
                    </div>

                </div>

                {/* Right: Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-20">
                        <h2 className="font-bold text-slate-800 mb-4">Preview</h2>

                        <div className="bg-slate-50 rounded-lg p-4 mb-4 min-h-[400px] border border-slate-200">
                            <div className="text-center mb-4">
                                <h3 className="font-bold text-slate-800">COUNTY OF HAWAII</h3>
                                <p className="text-xs text-slate-600">Planning Department</p>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="border-b border-slate-300 pb-2">
                                    <p className="font-bold text-slate-700">
                                        {noticeTypes.find(t => t.value === noticeType)?.label}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Date:</p>
                                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Violation:</p>
                                    <p className="font-medium">{templates[selectedTemplate]?.name}</p>
                                </div>

                                <div>
                                    <p className="text-slate-500">Ordinance Citation:</p>
                                    <p className="font-mono font-medium">{templates[selectedTemplate]?.ordinance}</p>
                                </div>

                                {noticeType === 'fine' && (
                                    <div>
                                        <p className="text-slate-500">Fine Amount:</p>
                                        <p className="font-bold text-lg text-red-700">${fineAmount.toLocaleString()}</p>
                                    </div>
                                )}

                                {dueDate && (
                                    <div>
                                        <p className="text-slate-500">Response Due:</p>
                                        <p className="font-medium">{new Date(dueDate).toLocaleDateString()}</p>
                                    </div>
                                )}

                                <div className="mt-4 pt-3 border-t border-slate-300">
                                    <p className="text-slate-600 leading-relaxed">
                                        This notice is issued pursuant to Hawaii County Code Chapter 25, Article 5.
                                        You are required to respond within the specified timeframe.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                                <Eye className="w-4 h-4" />
                                Full Preview
                            </button>
                            <button className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                PDF
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default NoticeGenerator;
