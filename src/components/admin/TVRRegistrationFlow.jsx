import React, { useState } from 'react';
import { Home, MapPin, Users, FileText, DollarSign, ShieldCheck, CheckCircle, AlertCircle, Clock, ArrowRight, ArrowLeft, Eye, EyeOff, Upload, Info, Play, ChevronRight, User, Building, CreditCard, FileCheck, X, FileImage, Shield } from 'lucide-react';

const TVRRegistrationFlow = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showWalkthrough, setShowWalkthrough] = useState(true);
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
        
        // Step 7: Review & Submit
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
        { id: 6, title: 'Documents', icon: Upload },
        { id: 7, title: 'Review & Submit', icon: CheckCircle },
    ];

    // Walkthrough steps for demo
    const walkthroughSteps = [
        {
            title: "Welcome to TVR Registration",
            description: "Let us guide you through the complete registration process for your vacation rental property in Hawaii County.",
            icon: <Home className="w-8 h-8 text-hawaii-ocean" />,
            whatUserSees: "Welcome screen with overview of 6-step registration process",
            dataCollected: "Initial contact information and registration intent"
        },
        {
            title: "Step 1: Property Information",
            description: "First, tell us about your property - address, type, size, and amenities.",
            icon: <Building className="w-8 h-8 text-blue-600" />,
            whatUserSees: "Form fields for property details including address, type, bedrooms, bathrooms, occupancy, parking, and amenities checklist",
            dataCollected: "Property name, address, type, bedrooms, bathrooms, max occupancy, square footage, parking spaces, amenities list"
        },
        {
            title: "Step 2: Owner Information",
            description: "Next, provide your personal and contact information as the property owner.",
            icon: <User className="w-8 h-8 text-green-600" />,
            whatUserSees: "Contact form with fields for owner name, email, phone, and complete mailing address",
            dataCollected: "Owner full name, email, phone number, complete mailing address (street, city, state, ZIP, country)"
        },
        {
            title: "Step 3: Business Information",
            description: "Now provide your business details, licensing, and insurance information.",
            icon: <FileText className="w-8 h-8 text-purple-600" />,
            whatUserSees: "Business details form with fields for business name, license number, tax ID, and insurance information",
            dataCollected: "Business name, business license number, tax ID, insurance provider, policy number, expiry date"
        },
        {
            title: "Step 4: Operational Details",
            description: "Tell us about how your property operates - check-in times, quiet hours, and emergency contacts.",
            icon: <Clock className="w-8 h-8 text-orange-600" />,
            whatUserSees: "Operational settings form with time pickers and contact information fields",
            dataCollected: "Check-in/out times, quiet hours, cleaning frequency, trash collection schedule, emergency contact name and phone"
        },
        {
            title: "Step 5: Document Upload",
            description: "Upload required documents including property photos, business license, and insurance certificates.",
            icon: <Upload className="w-8 h-8 text-red-600" />,
            whatUserSees: "File upload interface with drag-and-drop areas for different document types",
            dataCollected: "Property photos (minimum 3), business license document, insurance certificate, tax registration documents"
        },
        {
            title: "Step 6: Review & Submit",
            description: "Finally, review all your information and submit your registration for County approval.",
            icon: <CheckCircle className="w-8 h-8 text-green-600" />,
            whatUserSees: "Summary page showing all entered data with terms and conditions checkboxes",
            dataCollected: "Final confirmation, agreement to terms and compliance requirements, submission timestamp"
        }
    ];

    // File upload handler
    const handleFileUpload = (category, files) => {
        const newFiles = Array.from(files);
        const fileArray = category === 'propertyPhotos' ? newFiles : newFiles[0];
        
        setFormData(prev => ({
            ...prev,
            [category]: category === 'propertyPhotos' ? [...prev[category], ...newFiles] : fileArray
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
        if (category === 'propertyPhotos') {
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
            alert('Registration submitted successfully! You will receive a confirmation email.');
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
                
            case 5:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">Documents</h2>
                        <p className="text-slate-600">Upload required documents for your TVR registration</p>
                        
                        <div className="space-y-6">
                            {/* Property Photos */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                            <FileImage className="w-5 h-5 text-blue-600" />
                                            Property Photos
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-1">Upload at least 3 photos of your property</p>
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
                                                    <FileImage className="w-4 h-4 text-blue-600" />
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
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.propertyPhotos}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.propertyPhotos}%</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Business License */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            Business License
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-1">Upload your valid business license</p>
                                    </div>
                                    {formData.businessLicense && (
                                        <span className="text-sm text-green-600">✓ Uploaded</span>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('businessLicense', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.businessLicense && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-slate-700">{formData.businessLicense.name}</span>
                                            <span className="text-xs text-slate-500">({(formData.businessLicense.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleFileRemove('businessLicense')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {(uploadProgress.businessLicense > 0 && uploadProgress.businessLicense < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.businessLicense}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.businessLicense}%</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Insurance Certificate */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-purple-600" />
                                            Insurance Certificate
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-1">Upload your insurance certificate</p>
                                    </div>
                                    {formData.insuranceCertificate && (
                                        <span className="text-sm text-green-600">✓ Uploaded</span>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('insuranceCertificate', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.insuranceCertificate && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm text-slate-700">{formData.insuranceCertificate.name}</span>
                                            <span className="text-xs text-slate-500">({(formData.insuranceCertificate.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleFileRemove('insuranceCertificate')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {(uploadProgress.insuranceCertificate > 0 && uploadProgress.insuranceCertificate < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.insuranceCertificate}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.insuranceCertificate}%</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Tax Documents */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-orange-600" />
                                            Tax Documents
                                        </h3>
                                        <p className="text-sm text-slate-600 mt-1">Upload your tax registration documents</p>
                                    </div>
                                    {formData.taxDocuments && (
                                        <span className="text-sm text-green-600">✓ Uploaded</span>
                                    )}
                                </div>
                                
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('taxDocuments', e.target.files)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    />
                                </div>
                                
                                {formData.taxDocuments && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm text-slate-700">{formData.taxDocuments.name}</span>
                                            <span className="text-xs text-slate-500">({(formData.taxDocuments.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                        <button
                                            onClick={() => handleFileRemove('taxDocuments')}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                
                                {(uploadProgress.taxDocuments > 0 && uploadProgress.taxDocuments < 100) && (
                                    <div className="mt-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress.taxDocuments}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress.taxDocuments}%</p>
                                    </div>
                                )}
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
                                    <p className="font-medium text-slate-800">{formData.businessLicense || 'Not provided'}</p>
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
                {/* Walkthrough Section */}
                {showWalkthrough && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">TVR Registration Walkthrough</h2>
                                <p className="text-slate-600">Complete guide for new TVR operators registering in Hawaii County</p>
                            </div>
                            <button
                                onClick={() => setShowWalkthrough(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-hawaii-ocean" />
                                    Registration Process Overview
                                </h3>
                                <p className="text-sm text-slate-600">
                                    The TVR registration process consists of 6 comprehensive steps designed to collect all necessary information 
                                    for County compliance. Each step builds upon the previous one to create a complete profile of your vacation rental operation.
                                </p>
                                
                                <div className="space-y-3">
                                    {walkthroughSteps.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className="flex-shrink-0 mt-1">
                                                {step.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-800">{step.title}</h4>
                                                <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                    What Users See
                                </h3>
                                <div className="space-y-3">
                                    {walkthroughSteps.map((step, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                                            <h4 className="font-medium text-slate-800 text-sm">{step.title}</h4>
                                            <p className="text-sm text-slate-600 mt-1">{step.whatUserSees}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mt-6">
                                    <FileCheck className="w-5 h-5 text-green-600" />
                                    Data Collected
                                </h3>
                                <div className="space-y-3">
                                    {walkthroughSteps.map((step, index) => (
                                        <div key={index} className="border-l-4 border-green-500 pl-4">
                                            <h4 className="font-medium text-slate-800 text-sm">{step.title}</h4>
                                            <p className="text-sm text-slate-600 mt-1">{step.dataCollected}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-hawaii-ocean/10 border border-hawaii-ocean/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-hawaii-ocean mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-hawaii-ocean">Demo Mode</h4>
                                    <p className="text-sm text-hawaii-ocean/80 mt-1">
                                        This is a demonstration of the registration process. In production, users would fill out actual forms 
                                        and upload real documents. The walkthrough shows exactly what data is collected at each step.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setShowWalkthrough(false)}
                                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                Start Registration Process
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
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
                                <div className="ml-3 hidden sm:block">
                                    <p className="text-sm font-medium text-slate-800">{step.title}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                                        currentStep > step.id ? 'bg-green-500' : 'bg-slate-300'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    {renderStepContent()}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
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
                            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            Submit Registration
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
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

export default TVRRegistrationFlow;
