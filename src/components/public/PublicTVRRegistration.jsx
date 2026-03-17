import React, { useState } from 'react';
import { Home, MapPin, Users, FileText, DollarSign, ShieldCheck, CheckCircle, AlertCircle, Clock, ArrowRight, ArrowLeft, Eye, EyeOff, Upload, Info, X, FileImage, FileText as FileIcon, Shield } from 'lucide-react';

const PublicTVRRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({
        sitePlan: 100,
        ownershipProof: 100,
        taxClearanceCertificate: 100,
        propertyPhotos: 100,
        businessLicense: 100,
        insuranceCertificate: 100,
    });
    
    // Create mock files for demonstration
    const createMockFile = (name, size, type) => {
        const mockFile = new File(['mock content'], name, { type });
        Object.defineProperty(mockFile, 'size', { value: size });
        return mockFile;
    };
    
    const [formData, setFormData] = useState({
        // Step 1: Property Information
        propertyName: 'Oceanview Paradise Villa',
        propertyAddress: '123 Beach Road, Hilo, HI 96720',
        propertyType: 'single-family',
        bedrooms: '3',
        bathrooms: '2',
        maxOccupancy: '6',
        squareFootage: '1500',
        parkingSpaces: '2',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Air Conditioning', 'Beach Access'],
        
        // Step 2: Owner Information
        ownerName: 'John Smith',
        ownerEmail: 'john.smith@example.com',
        ownerPhone: '(808) 123-4567',
        ownerAddress: '456 Main Street',
        ownerCity: 'Hilo',
        ownerState: 'HI',
        ownerZip: '96720',
        ownerCountry: 'US',
        
        // Step 3: Business Information
        businessName: 'Hawaii Vacation Rentals LLC',
        businessLicense: 'GE-123456-7890',
        taxId: '12-3456789',
        taxFilingStatus: 'current',
        taxCompliance: true,
        taxExempt: false,
        insuranceProvider: 'State Farm Insurance',
        insurancePolicyNumber: 'POL-123456789',
        insuranceExpiry: '2024-12-31',
        
        // Step 4: Tax & Compliance
        taxDocuments: [],
        complianceCertificate: null,
        sitePlan: createMockFile('site-plan.pdf', 1024 * 512, 'application/pdf'), // 512KB
        ownershipProof: createMockFile('ownership-deed.pdf', 1024 * 256, 'application/pdf'), // 256KB
        taxClearanceCertificate: createMockFile('tax-clearance-2024.pdf', 1024 * 128, 'application/pdf'), // 128KB
        
        // Step 5: Operational Details
        checkInTime: '15:00',
        checkOutTime: '11:00',
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        cleaningFrequency: 'every-stay',
        trashCollection: 'twice-weekly',
        emergencyContact: 'Jane Smith',
        emergencyPhone: '(808) 987-6543',
        
        // Step 6: Documents
        propertyPhotos: [
            createMockFile('exterior-view.jpg', 1024 * 2048, 'image/jpeg'), // 2MB
            createMockFile('living-room.jpg', 1024 * 1536, 'image/jpeg'), // 1.5MB
            createMockFile('bedroom.jpg', 1024 * 1024, 'image/jpeg'), // 1MB
        ],
        businessLicense: createMockFile('business-license.pdf', 1024 * 256, 'application/pdf'), // 256KB
        insuranceCertificate: createMockFile('insurance-policy.pdf', 1024 * 512, 'application/pdf'), // 512KB
        complianceCertificate: null,
        agreedToTerms: false,
        agreedToCompliance: false,
    });

    const [errors, setErrors] = useState({});

    const propertyTypes = [
        { id: 'single-family', name: 'Single Family Home', description: 'Detached single-family residence' },
        { id: 'condo', name: 'Condominium', description: 'Individual condo unit in multi-family building' },
        { id: 'vacation-rental', name: 'Vacation Rental', description: 'Dedicated vacation rental property' },
        { id: 'b-and-b', name: 'Bed & Breakfast', description: 'Bed and breakfast establishment' },
        { id: 'hostel', name: 'Hostel', description: 'Shared accommodation facility' },
    ];

    const amenities = [
        'WiFi', 'Kitchen', 'Parking', 'Pool', 'Hot Tub', 'Air Conditioning', 
        'Heating', 'Washer/Dryer', 'TV', 'Beach Access', 'Mountain View', 'Ocean View'
    ];

    const steps = [
        { id: 1, title: 'Property Information', icon: Home },
        { id: 2, title: 'Owner Information', icon: Users },
        { id: 3, title: 'Business Information', icon: FileText },
        { id: 4, title: 'Tax & Compliance', icon: ShieldCheck },
        { id: 5, title: 'Operational Details', icon: Clock },
        { id: 6, title: 'Review & Submit', icon: CheckCircle },
    ];

    // File upload handler
    const handleFileUpload = (category, files) => {
        const newFiles = Array.from(files);
        const fileArray = category === 'propertyPhotos' || category === 'taxDocuments' ? newFiles : newFiles[0];
        
        setFormData(prev => ({
            ...prev,
            [category]: category === 'propertyPhotos' || category === 'taxDocuments' ? [...prev[category], ...newFiles] : fileArray
        }));

        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [category]: 0 }));
        
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                const currentProgress = prev[category] || 0;
                if (currentProgress >= 100) {
                    clearInterval(progressInterval);
                    return { ...prev, [category]: 100 };
                }
                return { ...prev, [category]: currentProgress + 10 };
            });
        }, 100);
    };

    // File removal handler
    const handleFileRemove = (category, index) => {
        if (category === 'propertyPhotos' || category === 'taxDocuments') {
            setFormData(prev => ({
                ...prev,
                [category]: prev[category].filter((_, i) => i !== index)
            }));
        } else {
            setFormData(prev => ({ ...prev, [category]: null }));
        }
        setUploadProgress(prev => ({ ...prev, [category]: 0 }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!formData.propertyName) newErrors.propertyName = 'Property name is required';
            if (!formData.propertyAddress) newErrors.propertyAddress = 'Property address is required';
            if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
            if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
            if (!formData.bathrooms) newErrors.bathrooms = 'Number of bathrooms is required';
            if (!formData.maxOccupancy) newErrors.maxOccupancy = 'Maximum occupancy is required';
        }
        
        if (step === 2) {
            if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
            if (!formData.ownerEmail) newErrors.ownerEmail = 'Email is required';
            if (!formData.ownerPhone) newErrors.ownerPhone = 'Phone number is required';
            if (!formData.ownerAddress) newErrors.ownerAddress = 'Address is required';
        }
        
        if (step === 3) {
            if (!formData.businessName) newErrors.businessName = 'Business name is required';
            if (!formData.businessLicense) newErrors.businessLicense = 'Business license is required';
            if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
        }
        
        if (step === 4) {
            if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
            if (!formData.taxCompliance) newErrors.taxCompliance = 'You must confirm tax compliance';
        }
        
        if (step === 5) {
            // No required validation for Operational Details step
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        // Final validation and submission logic
        if (formData.agreedToTerms && formData.agreedToCompliance) {
            alert('Registration submitted successfully! You will receive a confirmation email within 2-3 business days.');
            // Reset form or redirect to confirmation page
        } else {
            setErrors({ ...errors, terms: 'You must agree to all terms and conditions' });
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Property Information</h2>
                        <p className="text-slate-600">Tell us about your vacation rental property</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Name *</label>
                                <input
                                    type="text"
                                    value={formData.propertyName}
                                    onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.propertyName ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="e.g., Oceanview Paradise"
                                />
                                {errors.propertyName && <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Address *</label>
                                <input
                                    type="text"
                                    value={formData.propertyAddress}
                                    onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.propertyAddress ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="123 Beach Road, Hilo, HI 96720"
                                />
                                {errors.propertyAddress && <p className="text-red-500 text-sm mt-1">{errors.propertyAddress}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Type *</label>
                                <select
                                    value={formData.propertyType}
                                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.propertyType ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                >
                                    <option value="">Select property type</option>
                                    {propertyTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms *</label>
                                <input
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.bedrooms ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="3"
                                />
                                {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms *</label>
                                <input
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.bathrooms ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="2"
                                />
                                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Maximum Occupancy *</label>
                                <input
                                    type="number"
                                    value={formData.maxOccupancy}
                                    onChange={(e) => setFormData({...formData, maxOccupancy: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.maxOccupancy ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="6"
                                />
                                {errors.maxOccupancy && <p className="text-red-500 text-sm mt-1">{errors.maxOccupancy}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Square Footage</label>
                                <input
                                    type="number"
                                    value={formData.squareFootage}
                                    onChange={(e) => setFormData({...formData, squareFootage: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="1500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Parking Spaces</label>
                                <input
                                    type="number"
                                    value={formData.parkingSpaces}
                                    onChange={(e) => setFormData({...formData, parkingSpaces: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="2"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {amenities.map(amenity => (
                                    <label key={amenity} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({...formData, amenities: [...formData.amenities, amenity]});
                                                } else {
                                                    setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        {amenity}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
                
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Owner Information</h2>
                        <p className="text-slate-600">Tell us about yourself as the property owner</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.ownerName ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="John Doe"
                                />
                                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={formData.ownerEmail}
                                    onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.ownerEmail ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="john.doe@example.com"
                                />
                                {errors.ownerEmail && <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.ownerPhone}
                                    onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.ownerPhone ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="(808) 123-4567"
                                />
                                {errors.ownerPhone && <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                                <select
                                    value={formData.ownerCountry}
                                    onChange={(e) => setFormData({...formData, ownerCountry: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    value={formData.ownerAddress}
                                    onChange={(e) => setFormData({...formData, ownerAddress: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.ownerAddress ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="123 Main Street"
                                />
                                {errors.ownerAddress && <p className="text-red-500 text-sm mt-1">{errors.ownerAddress}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.ownerCity}
                                    onChange={(e) => setFormData({...formData, ownerCity: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Hilo"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                                <input
                                    type="text"
                                    value={formData.ownerState}
                                    onChange={(e) => setFormData({...formData, ownerState: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="HI"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                                <input
                                    type="text"
                                    value={formData.ownerZip}
                                    onChange={(e) => setFormData({...formData, ownerZip: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="96720"
                                />
                            </div>
                        </div>
                    </div>
                );
                
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Business Information</h2>
                        <p className="text-slate-600">Provide your business and licensing details</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Business Name *</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.businessName ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="Hawaii Vacation Rentals LLC"
                                />
                                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Business License Number *</label>
                                <input
                                    type="text"
                                    value={formData.businessLicense}
                                    onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.businessLicense ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="GE-123456-7890"
                                />
                                {errors.businessLicense && <p className="text-red-500 text-sm mt-1">{errors.businessLicense}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID Number *</label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.taxId ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="12-3456789"
                                />
                                {errors.taxId && <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Provider</label>
                                <input
                                    type="text"
                                    value={formData.insuranceProvider}
                                    onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="State Farm Insurance"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Policy Number</label>
                                <input
                                    type="text"
                                    value={formData.insurancePolicyNumber}
                                    onChange={(e) => setFormData({...formData, insurancePolicyNumber: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="POL-123456789"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.insuranceExpiry}
                                    onChange={(e) => setFormData({...formData, insuranceExpiry: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );
                
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Tax & Compliance</h2>
                        <p className="text-slate-600">Provide tax information and upload required compliance documents</p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Required Documents</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Site drawing/floor plan</li>
                                <li>• Property photos (exterior and interior)</li>
                                <li>• Proof of ownership or lease agreement</li>
                                <li>• County tax clearance certificate</li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2">All documents will be uploaded in this step</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID Number *</label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent ${
                                        errors.taxId ? 'border-red-500' : 'border-slate-300'
                                    }`}
                                    placeholder="12-3456789"
                                />
                                {errors.taxId && <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tax Filing Status</label>
                                <select
                                    value={formData.taxFilingStatus || ''}
                                    onChange={(e) => setFormData({...formData, taxFilingStatus: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="">Select status</option>
                                    <option value="current">Current</option>
                                    <option value="pending">Pending</option>
                                    <option value="exempt">Exempt</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tax Compliance Declaration</label>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.taxCompliance || false}
                                            onChange={(e) => setFormData({...formData, taxCompliance: e.target.checked})}
                                            className="mt-1"
                                        />
                                        <span className="text-sm text-slate-600">
                                            I confirm that all tax information provided is accurate and up-to-date
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.taxExempt || false}
                                            onChange={(e) => setFormData({...formData, taxExempt: e.target.checked})}
                                            className="mt-1"
                                        />
                                        <span className="text-sm text-slate-600">
                                            I am tax-exempt and will provide documentation if requested
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">Required Documents</h3>
                            <p className="text-sm text-slate-600">Upload the following required documents for your TVR registration</p>
                            
                            {/* Site Drawing/Floor Plan */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                            <FileImage className="w-5 h-5 text-blue-600" />
                                            Site Drawing/Floor Plan
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">Upload your site drawing or floor plan</p>
                                    </div>
                                    {formData.sitePlan && (
                                        <span className="text-sm text-green-600">✓ Uploaded</span>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('sitePlan', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.sitePlan && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileImage className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-slate-700">{formData.sitePlan.name}</span>
                                            <span className="text-xs text-slate-500">({(formData.sitePlan.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleFileRemove('sitePlan')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {(uploadProgress.sitePlan > 0 && uploadProgress.sitePlan < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.sitePlan}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.sitePlan}%</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Property Photos */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                            <FileImage className="w-5 h-5 text-green-600" />
                                            Property Photos (exterior and interior)
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">Upload exterior and interior photos of your property</p>
                                    </div>
                                    <span className="text-sm text-slate-500">
                                        {formData.propertyPhotos.length}/3 minimum
                                    </span>
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload('propertyPhotos', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.propertyPhotos.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.propertyPhotos.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileImage className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-slate-700">{file.name}</span>
                                                    <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                </div>
                                                <button
                                                    onClick={() => handleFileRemove('propertyPhotos', index)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {(uploadProgress.propertyPhotos > 0 && uploadProgress.propertyPhotos < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.propertyPhotos}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.propertyPhotos}%</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Proof of Ownership/Lease Agreement */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                            Proof of Ownership or Lease Agreement
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">Upload proof of ownership or lease agreement</p>
                                    </div>
                                    {formData.ownershipProof && (
                                        <span className="text-sm text-green-600">✓ Uploaded</span>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('ownershipProof', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.ownershipProof && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm text-slate-700">{formData.ownershipProof.name}</span>
                                            <span className="text-xs text-slate-500">({(formData.ownershipProof.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleFileRemove('ownershipProof')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {(uploadProgress.ownershipProof > 0 && uploadProgress.ownershipProof < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.ownershipProof}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.ownershipProof}%</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* County Tax Clearance Certificate */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-medium text-slate-800 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-orange-600" />
                                            County Tax Clearance Certificate
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">Upload your county tax clearance certificate</p>
                                    </div>
                                    {formData.taxClearanceCertificate && (
                                        <span className="text-sm text-green-600">✓ Uploaded</span>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('taxClearanceCertificate', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.taxClearanceCertificate && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm text-slate-700">{formData.taxClearanceCertificate.name}</span>
                                            <span className="text-xs text-slate-500">({(formData.taxClearanceCertificate.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleFileRemove('taxClearanceCertificate')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {(uploadProgress.taxClearanceCertificate > 0 && uploadProgress.taxClearanceCertificate < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.taxClearanceCertificate}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.taxClearanceCertificate}%</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            case 5:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Operational Details</h2>
                        <p className="text-slate-600">Tell us about your property operations and guest management</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Time</label>
                                <input
                                    type="time"
                                    value={formData.checkInTime}
                                    onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Time</label>
                                <input
                                    type="time"
                                    value={formData.checkOutTime}
                                    onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours Start</label>
                                <input
                                    type="time"
                                    value={formData.quietHoursStart}
                                    onChange={(e) => setFormData({...formData, quietHoursStart: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours End</label>
                                <input
                                    type="time"
                                    value={formData.quietHoursEnd}
                                    onChange={(e) => setFormData({...formData, quietHoursEnd: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Cleaning Frequency</label>
                                <select
                                    value={formData.cleaningFrequency}
                                    onChange={(e) => setFormData({...formData, cleaningFrequency: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="">Select frequency</option>
                                    <option value="daily">Daily</option>
                                    <option value="every-stay">Every Stay</option>
                                    <option value="every-other-stay">Every Other Stay</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Trash Collection</label>
                                <select
                                    value={formData.trashCollection}
                                    onChange={(e) => setFormData({...formData, trashCollection: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="">Select schedule</option>
                                    <option value="daily">Daily</option>
                                    <option value="twice-weekly">Twice Weekly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="bi-weekly">Bi-weekly</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact Name</label>
                                <input
                                    type="text"
                                    value={formData.emergencyContact}
                                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Jane Smith"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact Phone</label>
                                <input
                                    type="tel"
                                    value={formData.emergencyPhone}
                                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="(808) 987-6543"
                                />
                            </div>
                        </div>
                    </div>
                );
                
            case 6:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Review & Submit</h2>
                        <p className="text-slate-600">Please review your information before submitting</p>
                        
                        <div className="bg-slate-50 rounded-lg p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Property Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Property Name</p>
                                    <p className="font-medium text-slate-800">{formData.propertyName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Address</p>
                                    <p className="font-medium text-slate-800">{formData.propertyAddress || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Property Type</p>
                                    <p className="font-medium text-slate-800">{propertyTypes.find(t => t.id === formData.propertyType)?.name || 'Not selected'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Bedrooms/Bathrooms</p>
                                    <p className="font-medium text-slate-800">{formData.bedrooms || '0'} bed, {formData.bathrooms || '0'} bath</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Max Occupancy</p>
                                    <p className="font-medium text-slate-800">{formData.maxOccupancy || '0'} guests</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Owner</p>
                                    <p className="font-medium text-slate-800">{formData.ownerName || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Business Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Business Name</p>
                                    <p className="font-medium text-slate-800">{formData.businessName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Business License</p>
                                    <p className="font-medium text-slate-800">{formData.businessLicense ? formData.businessLicense.name : 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Tax ID</p>
                                    <p className="font-medium text-slate-800">{formData.taxId || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Insurance Provider</p>
                                    <p className="font-medium text-slate-800">{formData.insuranceProvider || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Documents Uploaded</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-600">Property Photos</p>
                                    <p className="font-medium text-slate-800">{formData.propertyPhotos.length} photos uploaded</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Business License</p>
                                    <p className="font-medium text-slate-800">{formData.businessLicense ? formData.businessLicense.name : 'Not uploaded'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Insurance Certificate</p>
                                    <p className="font-medium text-slate-800">{formData.insuranceCertificate ? formData.insuranceCertificate.name : 'Not uploaded'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Site Plan</p>
                                    <p className="font-medium text-slate-800">{formData.sitePlan ? formData.sitePlan.name : 'Not uploaded'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Ownership Proof</p>
                                    <p className="font-medium text-slate-800">{formData.ownershipProof ? formData.ownershipProof.name : 'Not uploaded'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Tax Clearance Certificate</p>
                                    <p className="font-medium text-slate-800">{formData.taxClearanceCertificate ? formData.taxClearanceCertificate.name : 'Not uploaded'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.agreedToTerms}
                                    onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                                    className="mt-1"
                                />
                                <label className="text-sm text-slate-600">
                                    I agree to the County of Hawaii TVR registration terms and conditions, including compliance with all local ordinances and regulations.
                                </label>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.agreedToCompliance}
                                    onChange={(e) => setFormData({...formData, agreedToCompliance: e.target.checked})}
                                    className="mt-1"
                                />
                                <label className="text-sm text-slate-600">
                                    I understand that I must comply with all operational standards, including quiet hours, occupancy limits, and other requirements as specified by County of Hawaii regulations.
                                </label>
                            </div>
                            
                            {errors.terms && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{errors.terms}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                                        currentStep === step.id
                                            ? 'border-hawaii-ocean bg-hawaii-ocean text-white'
                                            : currentStep > step.id
                                            ? 'border-green-500 bg-green-500 text-white'
                                            : 'border-slate-300 bg-white text-slate-600'
                                    }`}>
                                        {currentStep > step.id ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <step.icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-800 mt-1 text-center">{step.title}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`hidden sm:block w-16 h-0.5 ${
                                        currentStep > step.id ? 'bg-green-500' : 'bg-slate-300'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 min-h-[500px]">
                    {renderStepContent()}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center justify-center sm:justify-start gap-2 px-6 py-3 rounded-lg transition-colors ${
                            currentStep === 1
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </button>
                    
                    {currentStep === 6 ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center justify-center sm:justify-end gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            Submit Registration
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center justify-center sm:justify-end gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicTVRRegistration;
