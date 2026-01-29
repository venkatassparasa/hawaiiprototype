import React, { useState } from 'react';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComplaintSubmission = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        propertyAddress: '',
        complaintType: '',
        description: '',
        anonymous: false,
        name: '',
        email: '',
        phone: '',
        photos: [],
    });
    const [errors, setErrors] = useState({});

    const complaintTypes = [
        'Noise Violation',
        'Occupancy Violation',
        'Parking Issues',
        'Illegal Event',
        'Safety Concerns',
        'Unauthorized Operation',
        'Other',
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
        if (!formData.complaintType) newErrors.complaintType = 'Complaint type is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        if (!formData.anonymous) {
            if (!formData.name.trim()) newErrors.name = 'Name is required for non-anonymous complaints';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Submitting complaint:', formData);
            alert('Thank you! Your complaint has been submitted. Reference number: COMP-2026-' + Math.floor(Math.random() * 1000));
            navigate('/registration-status');
        }
    };

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Submit a Complaint</h1>
                    <p className="text-slate-500">Report violations or concerns about short-term rentals</p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Note:</strong> All complaints are taken seriously and will be investigated. You may submit anonymously, but providing contact information helps us follow up if needed.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">

                {/* Property Information */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Property Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.propertyAddress}
                        onChange={(e) => updateFormData('propertyAddress', e.target.value)}
                        placeholder="123 Alii Drive, Kailua-Kona, HI 96740"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.propertyAddress ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                            }`}
                    />
                    {errors.propertyAddress && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.propertyAddress}
                        </p>
                    )}
                </div>

                {/* Complaint Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Complaint Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.complaintType}
                        onChange={(e) => updateFormData('complaintType', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.complaintType ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                            }`}
                    >
                        <option value="">Select a complaint type</option>
                        {complaintTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.complaintType && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.complaintType}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Please provide details about the violation or concern..."
                        rows="5"
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

                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Supporting Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-hawaii-ocean transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</p>
                    </div>
                </div>

                {/* Anonymous Option */}
                <div className="border-t border-slate-200 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={(e) => updateFormData('anonymous', e.target.checked)}
                            className="w-4 h-4 text-hawaii-ocean border-slate-300 rounded focus:ring-hawaii-ocean"
                        />
                        <span className="text-sm font-medium text-slate-700">Submit anonymously</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-7">
                        Anonymous complaints will still be investigated, but we won't be able to follow up with you.
                    </p>
                </div>

                {/* Contact Information (if not anonymous) */}
                {!formData.anonymous && (
                    <div className="space-y-4 border-t border-slate-200 pt-6">
                        <h3 className="font-medium text-slate-800">Contact Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateFormData('name', e.target.value)}
                                placeholder="John Doe"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData('phone', e.target.value)}
                                    placeholder="(808) 555-0123"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800"
                    >
                        Submit Complaint
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>

            </form>

        </div>
    );
};

export default ComplaintSubmission;
