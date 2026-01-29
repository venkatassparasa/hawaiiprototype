import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, Home, User, FileText, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        // Property Info
        streetAddress: '',
        tmk: '',
        zoningDistrict: '',
        parcelSize: '',
        // Owner Info
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        mailingAddress: '',
        // Classification
        propertyType: 'hosted', // hosted or un-hosted
        rentalType: 'str', // str or bnb
        // Property Details
        bedrooms: '',
        maxOccupants: '',
        parkingSpaces: '',
        // Tax & Compliance
        countyTaxClearance: '',
        stateGE: '',
        stateTAT: '',
        // Documents
        siteDrawing: null,
        photos: [],
    });

    const navigate = useNavigate();

    const steps = [
        { num: 1, title: 'Property Info', icon: Home },
        { num: 2, title: 'Owner Details', icon: User },
        { num: 3, title: 'Classification', icon: FileText },
        { num: 4, title: 'Tax & Compliance', icon: DollarSign },
        { num: 5, title: 'Review & Submit', icon: CheckCircle },
    ];

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
            if (!formData.tmk.trim()) newErrors.tmk = 'TMK is required';
            if (!formData.zoningDistrict) newErrors.zoningDistrict = 'Zoning district is required';
        }

        if (step === 2) {
            if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
            if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) newErrors.ownerEmail = 'Email is invalid';
            if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Phone number is required';
            if (!formData.mailingAddress.trim()) newErrors.mailingAddress = 'Mailing address is required';
        }

        if (step === 3) {
            if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
            if (!formData.maxOccupants) newErrors.maxOccupants = 'Maximum occupants is required';
            if (!formData.parkingSpaces && formData.parkingSpaces !== 0) newErrors.parkingSpaces = 'Parking spaces is required';
        }

        if (step === 4) {
            if (!formData.countyTaxClearance.trim()) newErrors.countyTaxClearance = 'County tax clearance is required';
            if (!formData.stateGE.trim()) newErrors.stateGE = 'State GE number is required';
            if (!formData.stateTAT.trim()) newErrors.stateTAT = 'State TAT number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
                setErrors({});
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const handleSubmit = () => {
        console.log('Submitting registration:', formData);
        alert('Registration submitted successfully! You will receive a confirmation email shortly.');
        navigate('/registration-status');
    };

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">TVR Registration Application</h1>
                    <p className="text-slate-500">Complete all required fields to register your transient vacation rental</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-slate-500 hover:text-slate-700 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Cancel
                </button>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.num}>
                            <div className="flex flex-col items-center gap-2 flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.num
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.num
                                            ? 'bg-hawaii-ocean text-white ring-4 ring-blue-100'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {currentStep > step.num ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                                </div>
                                <p className={`text-xs font-medium text-center ${currentStep >= step.num ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded transition-all ${currentStep > step.num ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-red-900">Please fix the following errors:</h3>
                        <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                            {Object.values(errors).map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">

                {/* Step 1: Property Info */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Property Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.streetAddress}
                                    onChange={(e) => updateFormData('streetAddress', e.target.value)}
                                    placeholder="123 Alii Drive, Kailua-Kona, HI 96740"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.streetAddress
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.streetAddress && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.streetAddress}
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
                                    placeholder="7-7-4-008-002-0000"
                                    className={`w-full px-4 py-3 border rounded-lg font-mono focus:outline-none focus:ring-2 ${errors.tmk
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
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
                                    Zoning District <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.zoningDistrict}
                                    onChange={(e) => updateFormData('zoningDistrict', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.zoningDistrict
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                >
                                    <option value="">Select Zoning District</option>
                                    <option value="resort">Resort</option>
                                    <option value="resort-node">Resort Node</option>
                                    <option value="project-district">Project District</option>
                                    <option value="residential">Residential</option>
                                </select>
                                {errors.zoningDistrict && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.zoningDistrict}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Parcel Size (sq ft)
                                </label>
                                <input
                                    type="number"
                                    value={formData.parcelSize}
                                    onChange={(e) => updateFormData('parcelSize', e.target.value)}
                                    placeholder="5000"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Owner Details */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Owner/Contact Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Owner Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.ownerName}
                                    onChange={(e) => updateFormData('ownerName', e.target.value)}
                                    placeholder="John Doe"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.ownerName
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.ownerName && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.ownerName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.ownerEmail}
                                    onChange={(e) => updateFormData('ownerEmail', e.target.value)}
                                    placeholder="owner@example.com"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.ownerEmail
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.ownerEmail && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.ownerEmail}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.ownerPhone}
                                    onChange={(e) => updateFormData('ownerPhone', e.target.value)}
                                    placeholder="(808) 555-0123"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.ownerPhone
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.ownerPhone && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.ownerPhone}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Mailing Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.mailingAddress}
                                    onChange={(e) => updateFormData('mailingAddress', e.target.value)}
                                    placeholder="PO Box 123, Kailua-Kona, HI 96740"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.mailingAddress
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.mailingAddress && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.mailingAddress}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Classification */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Property Classification</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Property Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => updateFormData('propertyType', 'hosted')}
                                        className={`p-6 border-2 rounded-xl text-left transition-all ${formData.propertyType === 'hosted'
                                                ? 'border-hawaii-ocean bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-slate-800">Hosted (B&B)</h3>
                                            {formData.propertyType === 'hosted' && <Check className="w-5 h-5 text-hawaii-ocean" />}
                                        </div>
                                        <p className="text-sm text-slate-600">Owner lives on-site as principal residence</p>
                                        <p className="text-xs text-slate-500 mt-2">Fee: $250 (new) / $100 (renewal)</p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateFormData('propertyType', 'un-hosted')}
                                        className={`p-6 border-2 rounded-xl text-left transition-all ${formData.propertyType === 'un-hosted'
                                                ? 'border-hawaii-ocean bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-slate-800">Un-hosted (STR)</h3>
                                            {formData.propertyType === 'un-hosted' && <Check className="w-5 h-5 text-hawaii-ocean" />}
                                        </div>
                                        <p className="text-sm text-slate-600">Owner does not live on-site</p>
                                        <p className="text-xs text-slate-500 mt-2">Fee: $500 (new) / $250 (renewal)</p>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Bedrooms <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.bedrooms}
                                        onChange={(e) => updateFormData('bedrooms', e.target.value)}
                                        placeholder="3"
                                        min="1"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.bedrooms
                                                ? 'border-red-500 focus:ring-red-200'
                                                : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                            }`}
                                    />
                                    {errors.bedrooms && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.bedrooms}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Max Occupants <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxOccupants}
                                        onChange={(e) => updateFormData('maxOccupants', e.target.value)}
                                        placeholder="6"
                                        min="1"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.maxOccupants
                                                ? 'border-red-500 focus:ring-red-200'
                                                : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                            }`}
                                    />
                                    {errors.maxOccupants && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.maxOccupants}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Parking Spaces <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.parkingSpaces}
                                        onChange={(e) => updateFormData('parkingSpaces', e.target.value)}
                                        placeholder="2"
                                        min="0"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.parkingSpaces
                                                ? 'border-red-500 focus:ring-red-200'
                                                : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                            }`}
                                    />
                                    {errors.parkingSpaces && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.parkingSpaces}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Tax & Compliance */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Tax & Compliance Information</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    County Tax Clearance Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.countyTaxClearance}
                                    onChange={(e) => updateFormData('countyTaxClearance', e.target.value)}
                                    placeholder="CTC-2026-12345"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.countyTaxClearance
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.countyTaxClearance && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.countyTaxClearance}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">Required per HCC Chapter 6</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    State GE (General Excise) Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.stateGE}
                                    onChange={(e) => updateFormData('stateGE', e.target.value)}
                                    placeholder="GE-123-456-7890"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.stateGE
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.stateGE && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.stateGE}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    State TAT (Transient Accommodations Tax) Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.stateTAT}
                                    onChange={(e) => updateFormData('stateTAT', e.target.value)}
                                    placeholder="TA-123-456-7890"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.stateTAT
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-slate-200 focus:ring-hawaii-ocean/20'
                                        }`}
                                />
                                {errors.stateTAT && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.stateTAT}
                                    </p>
                                )}
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-2">Required Documents</h3>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Site drawing/floor plan</li>
                                    <li>• Property photos (exterior and interior)</li>
                                    <li>• Proof of ownership or lease agreement</li>
                                    <li>• County tax clearance certificate</li>
                                </ul>
                                <p className="text-xs text-slate-500 mt-2">Documents will be uploaded in the next step</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Review & Submit */}
                {currentStep === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Review & Submit</h2>

                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-2">Property Information</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-slate-500">Address:</span> <span className="font-medium">{formData.streetAddress || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">TMK:</span> <span className="font-mono font-medium">{formData.tmk || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">Zoning:</span> <span className="font-medium">{formData.zoningDistrict || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">Parcel Size:</span> <span className="font-medium">{formData.parcelSize ? `${formData.parcelSize} sq ft` : 'Not provided'}</span></div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <h3 className="font-bold text-slate-700 mb-2">Owner Information</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-slate-500">Name:</span> <span className="font-medium">{formData.ownerName || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">Email:</span> <span className="font-medium">{formData.ownerEmail || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{formData.ownerPhone || 'Not provided'}</span></div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <h3 className="font-bold text-slate-700 mb-2">Classification</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-slate-500">Type:</span> <span className="font-medium capitalize">{formData.propertyType === 'hosted' ? 'Hosted (B&B)' : 'Un-hosted (STR)'}</span></div>
                                        <div><span className="text-slate-500">Bedrooms:</span> <span className="font-medium">{formData.bedrooms || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">Max Occupants:</span> <span className="font-medium">{formData.maxOccupants || 'Not provided'}</span></div>
                                        <div><span className="text-slate-500">Parking:</span> <span className="font-medium">{formData.parkingSpaces || 'Not provided'} spaces</span></div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <h3 className="font-bold text-slate-700 mb-2">Registration Fee</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">
                                            {formData.propertyType === 'hosted' ? 'Hosted (B&B) - New Registration' : 'Un-hosted (STR) - New Registration'}
                                        </span>
                                        <span className="text-2xl font-bold text-slate-800">
                                            ${formData.propertyType === 'hosted' ? '250' : '500'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="font-medium text-yellow-900 mb-2">⚠️ Attestation Required</h3>
                                <label className="flex items-start gap-3 text-sm text-yellow-800">
                                    <input type="checkbox" className="mt-1" required />
                                    <span>I certify that all information provided is accurate and complete. I understand that providing false information may result in denial or revocation of my TVR registration and potential penalties under Hawaii County Code.</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="text-sm text-slate-500">
                    Step {currentStep} of {steps.length}
                </div>

                {currentStep < steps.length ? (
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-hawaii-ocean text-white rounded-lg font-medium hover:bg-blue-800 flex items-center gap-2"
                    >
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                    >
                        Submit Application
                        <CheckCircle className="w-4 h-4" />
                    </button>
                )}
            </div>

        </div>
    );
};

export default RegistrationForm;
