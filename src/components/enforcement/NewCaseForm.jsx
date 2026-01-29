import React, { useState } from 'react';
import { ArrowLeft, Building2, User, FileText, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewCaseForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        property: '',
        tmk: '',
        owner: '',
        ownerEmail: '',
        ownerPhone: '',
        violationType: '',
        description: '',
        priority: 'medium',
        discoverySource: '',
        discoveryDate: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState({});

    const violationTypes = [
        'Unregistered Operation',
        'Unpermitted Operation',
        'Operational Standards',
        'Safety Violation',
        'Occupancy Violation',
        'Noise Complaint',
        'Parking Violation',
        'Other',
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.property.trim()) newErrors.property = 'Property address is required';
        if (!formData.tmk.trim()) newErrors.tmk = 'TMK is required';
        if (!formData.owner.trim()) newErrors.owner = 'Owner name is required';
        if (!formData.violationType) newErrors.violationType = 'Violation type is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.discoverySource.trim()) newErrors.discoverySource = 'Discovery source is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Creating new case:', formData);
            const newCaseNumber = 'VC-2026-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
            alert(`New violation case created: ${newCaseNumber}`);
            navigate('/violations');
        }
    };

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/violations')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Create New Violation Case</h1>
                    <p className="text-slate-500">Document a new compliance violation</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">

                {/* Property Information */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-hawaii-ocean" />
                        <h2 className="font-bold text-slate-800">Property Information</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Property Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.property}
                                onChange={(e) => updateFormData('property', e.target.value)}
                                placeholder="123 Alii Drive, Kailua-Kona, HI 96740"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.property ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                    }`}
                            />
                            {errors.property && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.property}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                TMK (Tax Map Key) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.tmk}
                                onChange={(e) => updateFormData('tmk', e.target.value)}
                                placeholder="3-7-4-008-002-0000"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono ${errors.tmk ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                    }`}
                            />
                            {errors.tmk && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.tmk}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Priority Level <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => updateFormData('priority', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Owner Information */}
                <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-hawaii-ocean" />
                        <h2 className="font-bold text-slate-800">Owner Information</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Owner Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.owner}
                                onChange={(e) => updateFormData('owner', e.target.value)}
                                placeholder="John Doe"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.owner ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                    }`}
                            />
                            {errors.owner && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.owner}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                value={formData.ownerEmail}
                                onChange={(e) => updateFormData('ownerEmail', e.target.value)}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.ownerPhone}
                                onChange={(e) => updateFormData('ownerPhone', e.target.value)}
                                placeholder="(808) 555-0123"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Violation Details */}
                <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-hawaii-ocean" />
                        <h2 className="font-bold text-slate-800">Violation Details</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Violation Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.violationType}
                                onChange={(e) => updateFormData('violationType', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.violationType ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                    }`}
                            >
                                <option value="">Select violation type</option>
                                {violationTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.violationType && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.violationType}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateFormData('description', e.target.value)}
                                placeholder="Provide detailed description of the violation..."
                                rows="4"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                    }`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Discovery Source <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.discoverySource}
                                    onChange={(e) => updateFormData('discoverySource', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.discoverySource ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                >
                                    <option value="">Select source</option>
                                    <option value="complaint">Public Complaint</option>
                                    <option value="inspection">Routine Inspection</option>
                                    <option value="platform">Platform Monitoring (Airbnb/VRBO)</option>
                                    <option value="tax">Tax Records</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.discoverySource && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.discoverySource}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Discovery Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.discoveryDate}
                                    onChange={(e) => updateFormData('discoveryDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800"
                    >
                        Create Violation Case
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/violations')}
                        className="px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>

            </form>

        </div>
    );
};

export default NewCaseForm;
