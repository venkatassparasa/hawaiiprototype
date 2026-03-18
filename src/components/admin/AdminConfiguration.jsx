import React, { useState, useEffect } from 'react';

import { Settings, DollarSign, Clock, Mail, FileText, Building, Save, Plus, Edit2, Trash2, Eye, EyeOff, AlertTriangle, Database, X, Check, Globe } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';



const AdminConfiguration = () => {

    const [activeTab, setActiveTab] = useState('fees');

    const [showPassword, setShowPassword] = useState(false);

    const [searchParams] = useSearchParams();



    // Handle URL parameter for direct tab access

    useEffect(() => {

        const tabParam = searchParams.get('tab');

        if (tabParam === 'hosting') {

            setActiveTab('hosting');

        }

    }, [searchParams]);



    // Mock data for demonstration

    const [fees, setFees] = useState([

        { id: 1, name: 'TVR Registration Fee', amount: 150.00, type: 'annual', description: 'Initial registration for all TVR operators' },

        { id: 2, name: 'Per-Night Tax', amount: 4.00, type: 'per-night', description: 'Transient accommodation tax per night' },

        { id: 3, name: 'Processing Fee', amount: 25.00, type: 'one-time', description: 'Application processing fee' },

    ]);



    const [useTypes, setUseTypes] = useState([

        { id: 1, name: 'Single Family Home', maxOccupancy: 6, minStay: 3, description: 'Detached single-family residence' },

        { id: 2, name: 'Condominium', maxOccupancy: 4, minStay: 2, description: 'Individual condo unit' },

        { id: 3, name: 'Vacation Rental', maxOccupancy: 8, minStay: 1, description: 'Dedicated vacation rental property' },

    ]);



    const [operationalStandards, setOperationalStandards] = useState({

        quietHoursStart: '22:00',

        quietHoursEnd: '07:00',

        maxOccupancyPerBedroom: 2,

        parkingSpacesRequired: 1,

        trashCollectionDays: ['Monday', 'Thursday'],

        noiseLimit: 55,

    });



    const [contacts, setContacts] = useState([
        {
            id: 1,
            departmentName: 'County of Hawaii Planning Department',
            address: '101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720',
            phone: '(808) 961-8285',
            email: 'planning@hawaiicounty.gov',
            website: 'www.hawaiicounty.gov/planning',
            emergencyContact: '(808) 935-3333',
        }
    ]);



    // Violation Payment Thresholds
    const [violationThresholds, setViolationThresholds] = useState([
        { id: 1, name: 'Warning Threshold', amount: 500, description: 'Amount to trigger first warning notice' },
        { id: 2, name: 'Fine Threshold', amount: 1000, description: 'Amount to trigger official fine assessment' },
        { id: 3, name: 'Lien Threshold', amount: 5000, description: 'Amount to initiate property lien procedures' },
        { id: 4, name: 'Suspension Threshold', amount: 10000, description: 'Amount to trigger automatic registration suspension' }
    ]);



    const [letterTemplates, setLetterTemplates] = useState([
        { 
            id: 1, 
            name: 'Compliance Notice', 
            type: 'violation', 
            subject: 'TVR Compliance Notice - [Property Address]',
            content: 'Dear [Owner Name],\n\nThis is to notify you of a compliance issue regarding your TVR registration at [Property Address] (Registration #[Registration Number]).\n\n[Violation Details]\n\nPlease address these issues by [Due Date] to avoid further enforcement action.\n\nIf you have any questions, please contact our office at (808) 961-8285.\n\nSincerely,\nCounty of Hawaii Planning Department',
            active: true,
            usageCount: 45
        },
        { 
            id: 2, 
            name: 'Approval Letter', 
            type: 'approval', 
            subject: 'TVR Registration Approved - [Registration Number]',
            content: 'Dear [Owner Name],\n\nCongratulations! Your TVR registration for [Property Address] has been approved.\n\nRegistration Details:\n- Registration Number: [Registration Number]\n- Property Type: [Property Type]\n- Maximum Occupancy: [Max Occupancy]\n- Registration Date: [Registration Date]\n- Expiry Date: [Expiry Date]\n\nPlease ensure compliance with all county regulations. Your registration will expire on [Expiry Date].\n\nSincerely,\nCounty of Hawaii Planning Department',
            active: true,
            usageCount: 32
        },
        { 
            id: 3, 
            name: 'Rejection Letter', 
            type: 'rejection', 
            subject: 'TVR Registration Denied - [Registration Number]',
            content: 'Dear [Owner Name],\n\nWe regret to inform you that your TVR registration for [Property Address] has been denied.\n\n[Rejection Reason]\n\nYou may appeal this decision within 30 days by submitting a written appeal to our office.\n\nSincerely,\nCounty of Hawaii Planning Department',
            active: true,
            usageCount: 18
        },
        { 
            id: 4, 
            name: 'Renewal Reminder', 
            type: 'reminder', 
            subject: 'TVR Registration Renewal Due - [Registration Number]',
            content: 'Dear [Owner Name],\n\nThis is a reminder that your TVR registration for [Property Address] is due for renewal.\n\nCurrent Registration: [Registration Number]\nExpiry Date: [Expiry Date]\n\nPlease submit your renewal application at least 30 days before the expiry date to avoid interruption.\n\nSincerely,\nCounty of Hawaii Planning Department',
            active: false,
            usageCount: 0
        }
    ]);



    // Modal state management

    const [feeModal, setFeeModal] = useState({ isOpen: false, editingFee: null });

    const [useTypeModal, setUseTypeModal] = useState({ isOpen: false, editingUseType: null });

    const [templateModal, setTemplateModal] = useState({ isOpen: false, editingTemplate: null });

    const [thresholdModal, setThresholdModal] = useState({ isOpen: false, editingThreshold: null });

    const [contactModal, setContactModal] = useState({ isOpen: false, editingContact: null });

    const [operationalModal, setOperationalModal] = useState({ isOpen: false, editingOperational: null });



    // Hosting Platform Registration Data

    const [hostingPlatform, setHostingPlatform] = useState({

        platformName: '',

        companyName: '',

        contactPerson: '',

        email: '',

        phone: '',

        address: '',

        website: '',

        apiEndpoint: '',

        apiKey: '',

        supportedCities: [],

        commissionRate: 0,

        listingFee: 0,

        complianceFeatures: {

            autoReporting: false,

            taxCollection: false,

            verification: false,

            monitoring: false

        },

        isActive: false

    });

    const [isSaving, setIsSaving] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    // Load from SessionStorage
    useEffect(() => {
        const savedData = sessionStorage.getItem('adminConfigSettings');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.fees) setFees(parsed.fees);
                if (parsed.useTypes) setUseTypes(parsed.useTypes);
                if (parsed.operationalStandards) setOperationalStandards(parsed.operationalStandards);
                if (parsed.letterTemplates) setLetterTemplates(parsed.letterTemplates);
                if (parsed.violationThresholds) {
                    if (Array.isArray(parsed.violationThresholds)) {
                        setViolationThresholds(parsed.violationThresholds);
                    } else {
                        setViolationThresholds([
                            { id: 1, name: 'Warning Threshold', amount: parsed.violationThresholds.warningThreshold || 500, description: 'Amount to trigger first warning notice' },
                            { id: 2, name: 'Fine Threshold', amount: parsed.violationThresholds.fineThreshold || 1000, description: 'Amount to trigger official fine assessment' },
                            { id: 3, name: 'Lien Threshold', amount: parsed.violationThresholds.lienThreshold || 5000, description: 'Amount to initiate property lien procedures' },
                            { id: 4, name: 'Suspension Threshold', amount: parsed.violationThresholds.suspensionThreshold || 10000, description: 'Amount to trigger automatic registration suspension' }
                        ]);
                    }
                }
                if (parsed.contacts && parsed.contacts.length > 0) {
                    setContacts(parsed.contacts);
                } else if (parsed.contactInfo) {
                    setContacts([{
                        id: 1,
                        ...parsed.contactInfo,
                        active: true
                    }]);
                }

                if (parsed.hostingPlatform) setHostingPlatform(parsed.hostingPlatform);
            } catch (error) {
                console.error('Error loading admin settings from session:', error);
            }
        }
    }, []);



    const tabs = [
        { id: 'fees', label: 'Fee Management', icon: DollarSign },
        { id: 'useTypes', label: 'Use Types', icon: Building },
        { id: 'operational', label: 'Operational Standards', icon: Settings },
        { id: 'contact', label: 'Contact Info', icon: Mail },
        { id: 'thresholds', label: 'Violation Thresholds', icon: AlertTriangle },
        { id: 'templates', label: 'Letter Templates', icon: FileText }
    ];



    const handleSave = () => {
        setIsSaving(true);
        
        const configData = {
            fees,
            useTypes,
            operationalStandards,
            letterTemplates,
            violationThresholds,
            contacts,
            hostingPlatform
        };

        // Persist to session storage
        sessionStorage.setItem('adminConfigSettings', JSON.stringify(configData));

        // Simulate API call and provide feedback
        setTimeout(() => {
            setIsSaving(false);
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        }, 800);
    };



    // Fee Management Handlers

    const handleAddFee = () => {

        setFeeModal({ isOpen: true, editingFee: null });

    };



    const handleEditFee = (id) => {

        const feeToEdit = fees.find(f => f.id === id);

        setFeeModal({ isOpen: true, editingFee: { ...feeToEdit } });

    };



    const handleSaveFee = (feeData) => {

        if (feeModal.editingFee) {

            // Update existing fee

            setFees(fees.map(f => 

                f.id === feeModal.editingFee.id 

                    ? { ...f, ...feeData }

                    : f

            ));

        } else {

            // Add new fee

            const newFee = {

                id: Math.max(...fees.map(f => f.id)) + 1,

                ...feeData,

                active: true

            };

            setFees([...fees, newFee]);

        }

        setFeeModal({ isOpen: false, editingFee: null });

    };



    const handleDeleteFee = (id) => {

        if (confirm('Are you sure you want to delete this fee?')) {

            setFees(fees.filter(f => f.id !== id));

        }

    };



    // Use Type Management Handlers

    const handleAddUseType = () => {

        setUseTypeModal({ isOpen: true, editingUseType: null });

    };



    const handleEditUseType = (id) => {

        const useTypeToEdit = useTypes.find(u => u.id === id);

        setUseTypeModal({ isOpen: true, editingUseType: { ...useTypeToEdit } });

    };



    const handleSaveUseType = (useTypeData) => {

        if (useTypeModal.editingUseType) {

            // Update existing use type

            setUseTypes(useTypes.map(u => 

                u.id === useTypeModal.editingUseType.id 

                    ? { ...u, ...useTypeData }

                    : u

            ));

        } else {

            // Add new use type

            const newUseType = {

                id: Math.max(...useTypes.map(u => u.id)) + 1,

                ...useTypeData,

                active: true

            };

            setUseTypes([...useTypes, newUseType]);

        }

        setUseTypeModal({ isOpen: false, editingUseType: null });

    };



    const handleDeleteUseType = (id) => {

        if (confirm('Are you sure you want to delete this use type?')) {

            setUseTypes(useTypes.filter(t => t.id !== id));

        }

    };



    // Template Management Handlers

    const handleAddTemplate = () => {

        setTemplateModal({ isOpen: true, editingTemplate: null });

    };



    const handleEditTemplate = (id) => {

        const templateToEdit = letterTemplates.find(t => t.id === id);

        setTemplateModal({ isOpen: true, editingTemplate: { ...templateToEdit } });

    };



    const handleSaveTemplate = (templateData) => {

        if (templateModal.editingTemplate) {

            // Update existing template

            setLetterTemplates(letterTemplates.map(t => 

                t.id === templateModal.editingTemplate.id 

                    ? { ...t, ...templateData }

                    : t

            ));

        } else {

            // Add new template

            const newTemplate = {

                id: Math.max(...letterTemplates.map(t => t.id)) + 1,

                ...templateData,

                active: true

            };

            setLetterTemplates([...letterTemplates, newTemplate]);

        }

        setTemplateModal({ isOpen: false, editingTemplate: null });

    };



    // Threshold Handlers
    const handleAddThreshold = () => {
        setThresholdModal({ isOpen: true, editingThreshold: null });
    };

    const handleEditThreshold = (id) => {
        const thresholdToEdit = violationThresholds.find(t => t.id === id);
        setThresholdModal({ isOpen: true, editingThreshold: thresholdToEdit });
    };

    const handleDeleteThreshold = (id) => {
        if (window.confirm('Are you sure you want to delete this threshold setting?')) {
            setViolationThresholds(violationThresholds.filter(t => t.id !== id));
        }
    };

    const handleSaveThreshold = (thresholdData) => {
        if (thresholdModal.editingThreshold) {
            setViolationThresholds(violationThresholds.map(t => 
                t.id === thresholdModal.editingThreshold.id ? { ...thresholdData, id: t.id } : t
            ));
        } else {
            setViolationThresholds([...violationThresholds, { ...thresholdData, id: Date.now() }]);
        }
        setThresholdModal({ isOpen: false, editingThreshold: null });
    };

    // Contact Info Handlers

    const handleAddContact = () => {
        setContactModal({ isOpen: true, editingContact: null });
    };

    const handleEditContact = (id) => {
        const contactToEdit = contacts.find(c => c.id === id);
        setContactModal({ isOpen: true, editingContact: contactToEdit });
    };

    const handleSaveContact = (contactData) => {
        if (contactModal.editingContact) {
            setContacts(contacts.map(c => 
                c.id === contactModal.editingContact.id ? { ...contactData, id: c.id } : c
            ));
        } else {
            const newContact = {
                ...contactData,
                id: Math.max(0, ...contacts.map(c => c.id)) + 1
            };
            setContacts([...contacts, newContact]);
        }
        setContactModal({ isOpen: false, editingContact: null });
    };

    const handleDeleteContact = (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            setContacts(contacts.filter(c => c.id !== id));
        }
    };



    // Operational Standards Handlers

    const handleAddOperational = () => {

        setOperationalModal({ isOpen: true, editingOperational: null });

    };



    const handleEditOperational = () => {

        setOperationalModal({ isOpen: true, editingOperational: { ...operationalStandards } });

    };



    const handleSaveOperational = (operationalData) => {

        setOperationalStandards({

            ...operationalStandards,

            ...operationalData

        });

        setOperationalModal({ isOpen: false, editingOperational: null });

    };



    const handleDeleteTemplate = (id) => {

        if (confirm('Are you sure you want to delete this template?')) {

            setLetterTemplates(letterTemplates.filter(t => t.id !== id));

        }

    };



    const handleToggleTemplate = (id) => {

        setLetterTemplates(letterTemplates.map(t => 

            t.id === id 

                ? { ...t, active: !t.active }

                : t

        ));

    };



    // Hosting Platform Handlers

    const handleHostingPlatformChange = (field, value) => {

        if (field.includes('.')) {

            const [parent, child] = field.split('.');

            setHostingPlatform(prev => ({

                ...prev,

                [parent]: {

                    ...prev[parent],

                    [child]: value

                }

            }));

        } else {

            setHostingPlatform(prev => ({

                ...prev,

                [field]: value

            }));

        }

    };



    const handleSaveHostingPlatform = () => {

        // Validate required fields

        if (!hostingPlatform.platformName || !hostingPlatform.companyName || !hostingPlatform.email) {

            alert('Please fill in all required fields');

            return;

        }

        

        // Save hosting platform configuration

        console.log('Saving hosting platform:', hostingPlatform);

        alert('Hosting Platform registration saved successfully!');

    };



    // Modal Components

    const FeeModal = () => {

        if (!feeModal.isOpen) return null;

        

        const initialData = feeModal.editingFee || {

            name: '',

            amount: 0,

            type: 'one-time',

            description: ''

        };



        return (

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">

                    <div className="flex justify-between items-center p-6 border-b">

                        <h3 className="text-lg font-semibold text-slate-800">

                            {feeModal.editingFee ? 'Edit Fee' : 'Add New Fee'}

                        </h3>

                        <button 

                            onClick={() => setFeeModal({ isOpen: false, editingFee: null })}

                            className="text-slate-400 hover:text-slate-600"

                        >

                            <X className="w-5 h-5" />

                        </button>

                    </div>

                    

                    <div className="p-6 space-y-4">

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Fee Name</label>

                            <input

                                type="text"

                                defaultValue={initialData.name}

                                id="feeName"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>

                            <input

                                type="number"

                                step="0.01"

                                defaultValue={initialData.amount}

                                id="feeAmount"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>

                            <select

                                defaultValue={initialData.type}

                                id="feeType"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            >

                                <option value="one-time">One-time</option>

                                <option value="recurring">Recurring</option>

                                <option value="per-night">Per Night</option>

                            </select>

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>

                            <textarea

                                defaultValue={initialData.description}

                                id="feeDescription"

                                rows={3}

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                    </div>

                    

                    <div className="flex justify-end gap-3 p-6 border-t">

                        <button

                            onClick={() => setFeeModal({ isOpen: false, editingFee: null })}

                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"

                        >

                            Cancel

                        </button>

                        <button

                            onClick={() => {

                                const feeData = {

                                    name: document.getElementById('feeName').value,

                                    amount: parseFloat(document.getElementById('feeAmount').value),

                                    type: document.getElementById('feeType').value,

                                    description: document.getElementById('feeDescription').value

                                };

                                handleSaveFee(feeData);

                            }}

                            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 min-w-[120px]"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}

                        >

                            <Save className="w-4 h-4 mr-2" />

                            Save

                        </button>

                    </div>

                </div>

            </div>

        );

    };



    const UseTypeModal = () => {

        if (!useTypeModal.isOpen) return null;

        

        const initialData = useTypeModal.editingUseType || {

            name: '',

            description: '',

            maxOccupancy: 2,

            minStay: 1

        };



        return (

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">

                    <div className="flex justify-between items-center p-6 border-b">

                        <h3 className="text-lg font-semibold text-slate-800">

                            {useTypeModal.editingUseType ? 'Edit Use Type' : 'Add New Use Type'}

                        </h3>

                        <button 

                            onClick={() => setUseTypeModal({ isOpen: false, editingUseType: null })}

                            className="text-slate-400 hover:text-slate-600"

                        >

                            <X className="w-5 h-5" />

                        </button>

                    </div>

                    

                    <div className="p-6 space-y-4">

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Use Type Name</label>

                            <input

                                type="text"

                                defaultValue={initialData.name}

                                id="useTypeName"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>

                            <textarea

                                defaultValue={initialData.description}

                                id="useTypeDescription"

                                rows={3}

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Max Occupancy</label>

                                <input

                                    type="number"

                                    defaultValue={initialData.maxOccupancy}

                                    id="maxOccupancy"

                                    min="1"

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Min Stay (nights)</label>

                                <input

                                    type="number"

                                    defaultValue={initialData.minStay}

                                    id="minStay"

                                    min="1"

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                />

                            </div>

                        </div>

                    </div>

                    

                    <div className="flex justify-end gap-3 p-6 border-t">

                        <button

                            onClick={() => setUseTypeModal({ isOpen: false, editingUseType: null })}

                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"

                        >

                            Cancel

                        </button>

                        <button

                            onClick={() => {

                                const useTypeData = {

                                    name: document.getElementById('useTypeName').value,

                                    description: document.getElementById('useTypeDescription').value,

                                    maxOccupancy: parseInt(document.getElementById('maxOccupancy').value),

                                    minStay: parseInt(document.getElementById('minStay').value)

                                };

                                handleSaveUseType(useTypeData);

                            }}

                            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 min-w-[120px]"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}

                        >

                            <Save className="w-4 h-4 mr-2" />

                            Save

                        </button>

                    </div>

                </div>

            </div>

        );

    };



    const TemplateModal = () => {

        if (!templateModal.isOpen) return null;

        

        const initialData = templateModal.editingTemplate || {

            name: '',

            type: 'custom',

            subject: '',

            active: true

        };



        return (

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">

                    <div className="flex justify-between items-center p-6 border-b">

                        <h3 className="text-lg font-semibold text-slate-800">

                            {templateModal.editingTemplate ? 'Edit Template' : 'Add New Template'}

                        </h3>

                        <button 

                            onClick={() => setTemplateModal({ isOpen: false, editingTemplate: null })}

                            className="text-slate-400 hover:text-slate-600"

                        >

                            <X className="w-5 h-5" />

                        </button>

                    </div>

                    

                    <div className="p-6 space-y-4">

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Template Name</label>

                            <input

                                type="text"

                                defaultValue={initialData.name}

                                id="templateName"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>

                            <input

                                type="text"

                                defaultValue={initialData.subject}

                                id="templateSubject"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>

                            <select

                                defaultValue={initialData.type}

                                id="templateType"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            >

                                <option value="violation">Violation</option>

                                <option value="approval">Approval</option>

                                <option value="rejection">Rejection</option>

                                <option value="reminder">Reminder</option>

                                <option value="custom">Custom</option>

                            </select>

                        </div>

                        

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                            <textarea
                                defaultValue={initialData.content}
                                id="templateContent"
                                rows={8}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent font-serif text-sm"
                                placeholder="Letter content with [Placeholders]..."
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked={initialData.active}
                                    id="templateActive"
                                    className="rounded border-slate-300 text-hawaii-ocean focus:ring-hawaii-ocean w-4 h-4"
                                />
                                <span className="text-sm font-medium text-slate-700">Active / Enabled</span>
                            </label>
                        </div>

                    </div>

                    

                    <div className="flex justify-end gap-3 p-6 border-t">

                        <button

                            onClick={() => setTemplateModal({ isOpen: false, editingTemplate: null })}

                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"

                        >

                            Cancel

                        </button>

                        <button

                            onClick={() => {
                                const templateData = {
                                    name: document.getElementById('templateName').value,
                                    subject: document.getElementById('templateSubject').value,
                                    type: document.getElementById('templateType').value,
                                    content: document.getElementById('templateContent').value,
                                    active: document.getElementById('templateActive').checked
                                };
                                handleSaveTemplate(templateData);
                            }}

                            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 min-w-[120px]"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}

                        >

                            <Save className="w-4 h-4 mr-2" />

                            Save

                        </button>

                    </div>

                </div>

            </div>

        );

    };



    const ThresholdModal = () => {

        if (!thresholdModal.isOpen) return null;

        

        const initialData = thresholdModal.editingThreshold || {

            name: '',

            type: 'warning',

            amount: 0,

            trigger: 'multiple_violations',

            autoIssue: false,

            days: 30

        };



        return (

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">

                    <div className="flex justify-between items-center p-6 border-b">

                        <h3 className="text-lg font-semibold text-slate-800">

                            {thresholdModal.editingThreshold ? 'Edit Threshold' : 'Add New Threshold'}

                        </h3>

                        <button 

                            onClick={() => setThresholdModal({ isOpen: false, editingThreshold: null })}

                            className="text-slate-400 hover:text-slate-600"

                        >

                            <X className="w-5 h-5" />

                        </button>

                    </div>

                    

                    <div className="p-6 space-y-4">

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Threshold Name</label>

                            <input

                                type="text"

                                defaultValue={initialData.name}

                                id="thresholdName"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                placeholder="e.g., High Risk Violations"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>

                            <select

                                defaultValue={initialData.type}

                                id="thresholdType"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            >

                                <option value="warning">Warning</option>

                                <option value="fine">Fine</option>

                                <option value="lien">Lien</option>

                                <option value="suspension">Suspension</option>

                            </select>

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>

                            <input

                                type="number"

                                step="0.01"

                                defaultValue={initialData.amount}

                                id="thresholdAmount"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                placeholder="e.g., 500.00"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Trigger Condition</label>

                            <select

                                defaultValue={initialData.trigger}

                                id="thresholdTrigger"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            >

                                <option value="single_violation">Single Violation</option>

                                <option value="multiple_violations">Multiple Violations</option>

                                <option value="complaint_based">Complaint Based</option>

                                <option value="time_based">Time Based</option>

                            </select>

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Auto-Issue</label>

                            <select

                                defaultValue={initialData.autoIssue ? 'auto' : 'manual'}

                                id="thresholdAutoIssue"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            >

                                <option value="manual">Manual Review</option>

                                <option value="auto">Automatic</option>

                            </select>

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Days/Count</label>

                            <input

                                type="number"

                                defaultValue={initialData.days}

                                id="thresholdDays"

                                min="1"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                placeholder="e.g., 30"

                            />

                        </div>

                    </div>

                    

                    <div className="flex justify-end gap-3 p-6 border-t">

                        <button

                            onClick={() => setThresholdModal({ isOpen: false, editingThreshold: null })}

                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"

                        >

                            Cancel

                        </button>

                        <button

                            onClick={() => {

                                const thresholdData = {

                                    name: document.getElementById('thresholdName').value,

                                    type: document.getElementById('thresholdType').value,

                                    amount: parseFloat(document.getElementById('thresholdAmount').value),

                                    trigger: document.getElementById('thresholdTrigger').value,

                                    autoIssue: document.getElementById('thresholdAutoIssue').value === 'auto',

                                    days: parseInt(document.getElementById('thresholdDays').value)

                                };

                                handleSaveThreshold(thresholdData);

                            }}

                            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 min-w-[120px]"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}

                        >

                            <Save className="w-4 h-4 mr-2" />

                            Save

                        </button>

                    </div>

                </div>

            </div>

        );

    };



    const ContactModal = () => {
        if (!contactModal.isOpen) return null;

        const initialData = contactModal.editingContact || {
            departmentName: '',
            phone: '',
            email: '',
            website: '',
            emergencyContact: '',
            address: ''
        };

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                    <div className="flex justify-between items-center p-6 bg-slate-50 border-b border-slate-200">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {contactModal.editingContact ? 'Edit Contact' : 'Add New Contact'}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">Enter department contact details below</p>
                        </div>
                        <button 
                            onClick={() => setContactModal({ isOpen: false, editingContact: null })}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-hawaii-ocean" />
                                    Department Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={initialData.departmentName}
                                    id="contactDepartmentName"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean transition-all placeholder:text-slate-400"
                                    placeholder="e.g., Planning Department"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-hawaii-ocean" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={initialData.email}
                                        id="contactEmail"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean transition-all"
                                        placeholder="dept@hawaiicounty.gov"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-hawaii-ocean" />
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        defaultValue={initialData.website}
                                        id="contactWebsite"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean transition-all"
                                        placeholder="https://hawaiicounty.gov"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-hawaii-ocean" />
                                        Office Phone
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue={initialData.phone}
                                        id="contactPhone"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean transition-all"
                                        placeholder="(808) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        Emergency Contact
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue={initialData.emergencyContact}
                                        id="contactEmergency"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-amber-700"
                                        placeholder="Emergency hotline"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Office Address</label>
                                <textarea
                                    defaultValue={initialData.address}
                                    id="contactAddress"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean transition-all resize-none"
                                    placeholder="Full mailing address..."
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 p-6 bg-slate-50 border-t border-slate-200">
                        <button
                            onClick={() => setContactModal({ isOpen: false, editingContact: null })}
                            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-white hover:border-slate-400 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                const contactData = {
                                    departmentName: document.getElementById('contactDepartmentName').value,
                                    phone: document.getElementById('contactPhone').value,
                                    email: document.getElementById('contactEmail').value,
                                    website: document.getElementById('contactWebsite').value,
                                    emergencyContact: document.getElementById('contactEmergency').value,
                                    address: document.getElementById('contactAddress').value
                                };
                                handleSaveContact(contactData);
                            }}
                            className="flex items-center gap-2 px-8 py-2.5 bg-hawaii-ocean text-white rounded-xl font-bold hover:bg-hawaii-ocean/90 transition-all active:scale-95 shadow-md shadow-hawaii-ocean/20"
                        >
                            <Save className="w-4 h-4" />
                            {contactModal.editingContact ? 'Update Contact' : 'Create Contact'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };



    const OperationalModal = () => {

        if (!operationalModal.isOpen) return null;

        

        const initialData = operationalModal.editingOperational || operationalStandards;



        return (

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">

                    <div className="flex justify-between items-center p-6 border-b">

                        <h3 className="text-lg font-semibold text-slate-800">

                            Edit Operational Standards

                        </h3>

                        <button 

                            onClick={() => setOperationalModal({ isOpen: false, editingOperational: null })}

                            className="text-slate-400 hover:text-slate-600"

                        >

                            <X className="w-5 h-5" />

                        </button>

                    </div>

                    

                    <div className="p-6 space-y-4">

                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours Start</label>

                                <input

                                    type="time"

                                    defaultValue={initialData.quietHoursStart}

                                    id="operationalQuietHoursStart"

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours End</label>

                                <input

                                    type="time"

                                    defaultValue={initialData.quietHoursEnd}

                                    id="operationalQuietHoursEnd"

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                />

                            </div>

                        </div>

                        

                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Max Occupancy Per Bedroom</label>

                                <input

                                    type="number"

                                    defaultValue={initialData.maxOccupancyPerBedroom}

                                    id="operationalMaxOccupancy"

                                    min="1"

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Parking Spaces Required</label>

                                <input

                                    type="number"

                                    defaultValue={initialData.parkingSpacesRequired}

                                    id="operationalParking"

                                    min="0"

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                                />

                            </div>

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Noise Limit (dB)</label>

                            <input

                                type="number"

                                defaultValue={initialData.noiseLimit}

                                id="operationalNoise"

                                min="0"

                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"

                            />

                        </div>

                        

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">Trash Collection Days</label>

                            <div className="space-y-2">

                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (

                                    <label key={day} className="flex items-center">

                                        <input

                                            type="checkbox"

                                            defaultChecked={initialData.trashCollectionDays?.includes(day) || false}

                                            id={`operationalTrash${day}`}

                                            className="mr-2"

                                        />

                                        {day}

                                    </label>

                                ))}

                            </div>

                        </div>

                    </div>

                    

                    <div className="flex justify-end gap-3 p-6 border-t">

                        <button

                            onClick={() => setOperationalModal({ isOpen: false, editingOperational: null })}

                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"

                        >

                            Cancel

                        </button>

                        <button

                            onClick={() => {

                                const operationalData = {

                                    quietHoursStart: document.getElementById('operationalQuietHoursStart').value,

                                    quietHoursEnd: document.getElementById('operationalQuietHoursEnd').value,

                                    maxOccupancyPerBedroom: parseInt(document.getElementById('operationalMaxOccupancy').value),

                                    parkingSpacesRequired: parseInt(document.getElementById('operationalParking').value),

                                    noiseLimit: parseInt(document.getElementById('operationalNoise').value),

                                    trashCollectionDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

                                        .filter(day => document.getElementById(`operationalTrash${day}`)?.checked)

                                };

                                handleSaveOperational(operationalData);

                            }}

                            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 min-w-[120px]"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}

                        >

                            <Save className="w-4 h-4 mr-2" />

                            Save

                        </button>

                    </div>

                </div>

            </div>

        );

    };



    return (

        <div className="p-6 max-w-7xl mx-auto">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-slate-800 mb-2">Configuration & Admin Controls</h1>

                <p className="text-slate-600">Manage system settings, fees, operational standards, and templates</p>

            </div>



            {/* Tab Navigation */}

            <div className="border-b border-slate-200 mb-6">

                <nav className="flex space-x-8">

                    {tabs.map((tab) => (

                        <button

                            key={tab.id}

                            onClick={() => setActiveTab(tab.id)}

                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${

                                activeTab === tab.id

                                    ? 'border-hawaii-ocean text-hawaii-ocean'

                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'

                            }`}

                        >

                            <tab.icon className="w-4 h-4" />

                            {tab.label}

                        </button>

                    ))}

                </nav>

            </div>



            {/* Tab Content */}

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

                {/* Fee Management */}

                {activeTab === 'fees' && (

                    <div>

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-semibold text-slate-800">Fee Management</h2>

                            <button onClick={handleAddFee} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>

                            <Plus className="w-4 h-4" />

                            Add New Fee

                        </button>

                        </div>

                        

                        <div className="space-y-4">

                            {fees.map((fee) => (

                                <div key={fee.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">

                                    <div className="flex justify-between items-start">

                                        <div className="flex-1">

                                            <h3 className="font-medium text-slate-800">{fee.name}</h3>

                                            <p className="text-sm text-slate-600 mt-1">{fee.description}</p>

                                            <div className="flex items-center gap-4 mt-2">

                                                <span className="text-lg font-semibold text-hawaii-ocean">${fee.amount.toFixed(2)}</span>

                                                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{fee.type}</span>

                                            </div>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <button onClick={() => handleEditFee(fee.id)} className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">

                                                <Edit2 className="w-4 h-4" />

                                            </button>

                                            <button onClick={() => handleDeleteFee(fee.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">

                                                <Trash2 className="w-4 h-4" />

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}



                {/* Use Types */}

                {activeTab === 'useTypes' && (

                    <div>

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-semibold text-slate-800">Use Types</h2>

                            <button onClick={handleAddUseType} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"

                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>

                            <Plus className="w-4 h-4" />

                            Add Use Type

                        </button>

                        </div>

                        

                        <div className="space-y-4">

                            {useTypes.map((useType) => (

                                <div key={useType.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">

                                    <div className="flex justify-between items-start">

                                        <div className="flex-1">

                                            <h3 className="font-medium text-slate-800">{useType.name}</h3>

                                            <p className="text-sm text-slate-600 mt-1">{useType.description}</p>

                                            <div className="flex items-center gap-4 mt-2">

                                                <span className="text-sm text-slate-500">Max Occupancy: <strong>{useType.maxOccupancy}</strong></span>

                                                <span className="text-sm text-slate-500">Min Stay: <strong>{useType.minStay} nights</strong></span>

                                            </div>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <button onClick={() => handleEditUseType(useType.id)} className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">

                                                <Edit2 className="w-4 h-4" />

                                            </button>

                                            <button onClick={() => handleDeleteUseType(useType.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">

                                                <Trash2 className="w-4 h-4" />

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}







                {/* Contact Info */}
                {activeTab === 'contact' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Contact Information</h2>
                            <button onClick={handleAddContact} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            <Plus className="w-4 h-4" />
                            Add New Contact
                        </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contacts.map((contact) => (
                                <div key={contact.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-hawaii-ocean/30 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{contact.departmentName}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                                <Globe className="w-3 h-3" />
                                                <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-hawaii-ocean underline">
                                                    {contact.website?.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEditContact(contact.id)}
                                                className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteContact(contact.id)}
                                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-white border border-slate-100 rounded text-slate-400">
                                                <Mail className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Email</span>
                                                <span className="text-slate-700">{contact.email}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-white border border-slate-100 rounded text-slate-400">
                                                <Clock className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Phone</span>
                                                <span className="text-slate-700">{contact.phone}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-white border border-slate-100 rounded text-slate-400">
                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Emergency</span>
                                                <span className="text-slate-700 font-medium">{contact.emergencyContact}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                                        <p className="text-sm text-slate-500 leading-relaxed italic">
                                            {contact.address}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {contacts.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-800">No Contact Info Found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-6">Add department contact information to help users reach out for assistance.</p>
                                <button onClick={handleAddContact} className="px-6 py-2.5 bg-hawaii-ocean text-white rounded-lg font-semibold hover:bg-hawaii-ocean/90 transition-all shadow-sm shadow-hawaii-ocean/20">
                                    Add First Contact
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Operational Standards */}

                {activeTab === 'operational' && (

                    <div>

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-semibold text-slate-800">Operational Standards</h2>

                            <div className="flex items-center gap-2">

                                <button onClick={handleEditOperational} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"

                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>

                                <Edit2 className="w-4 h-4" />

                                Edit Standards

                            </button>

                            </div>

                        </div>

                        

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours Start</label>

                                <input

                                    type="time"

                                    value={operationalStandards.quietHoursStart}

                                    readOnly

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Quiet Hours End</label>

                                <input

                                    type="time"

                                    value={operationalStandards.quietHoursEnd}

                                    readOnly

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Max Occupancy Per Bedroom</label>

                                <input

                                    type="number"

                                    value={operationalStandards.maxOccupancyPerBedroom}

                                    readOnly

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Parking Spaces Required</label>

                                <input

                                    type="number"

                                    value={operationalStandards.parkingSpacesRequired}

                                    readOnly

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Noise Limit (dB)</label>

                                <input

                                    type="number"

                                    value={operationalStandards.noiseLimit}

                                    readOnly

                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"

                                />

                            </div>

                            

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">Trash Collection Days</label>

                                <div className="space-y-2">

                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (

                                        <label key={day} className="flex items-center">

                                            <input

                                                type="checkbox"

                                                checked={operationalStandards.trashCollectionDays.includes(day)}

                                                readOnly

                                                className="mr-2 bg-slate-50 text-slate-600"

                                            />

                                            {day}

                                        </label>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                )}

                {/* Violation Thresholds */}
                {activeTab === 'thresholds' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Violation Payment Thresholds</h2>
                            <button onClick={handleAddThreshold} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity" style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                                <Plus className="w-4 h-4" />
                                Add Threshold
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Configure the dollar amounts that trigger various enforcement actions and notifications within the system.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {violationThresholds.map(threshold => (
                                    <div key={threshold.id} className="border border-slate-200 rounded-lg p-4 group">
                                        <div className="flex justify-between items-start mb-2">
                                            <label className="block text-sm font-medium text-slate-700">{threshold.name} ($)</label>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditThreshold(threshold.id)} className="p-1 text-slate-400 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteThreshold(threshold.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={threshold.amount}
                                            readOnly
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-700 bg-slate-50"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">{threshold.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}



                {/* Letter Templates */}
                {activeTab === 'templates' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Letter Templates</h2>
                                <p className="text-sm text-slate-500 mt-1">Manage automated correspondence templates and placeholders</p>
                            </div>
                            <button 
                                onClick={handleAddTemplate} 
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Plus className="w-4 h-4" />
                                Add Template
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {letterTemplates.map((template) => (
                                <div key={template.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800">{template.name}</h3>
                                                {!template.active && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">Inactive</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-1 italic">{template.subject}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEditTemplate(template.id)}
                                                className="p-1.5 text-slate-400 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded-lg transition-colors"
                                                title="Edit Template"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleTemplate(template.id)}
                                                className={`p-1.5 rounded-lg transition-colors ${template.active ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                                title={template.active ? "Deactivate" : "Activate"}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Template"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-lg p-3 mb-4 h-24 overflow-hidden relative">
                                        <p className="text-[11px] text-slate-600 whitespace-pre-wrap line-clamp-4 font-serif leading-relaxed">
                                            {template.content}
                                        </p>
                                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent"></div>
                                    </div>

                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded font-medium uppercase tracking-wider">
                                            {template.type}
                                        </span>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                {template.usageCount || 0} uses
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {letterTemplates.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No letter templates configured. Click "Add Template" to get started.</p>
                            </div>
                        )}
                    </div>
                )}



            {/* Save Button */}

            <div className="mt-6 flex justify-end items-center gap-4">
                {showSaveSuccess && (
                    <div className="flex items-center gap-2 text-green-600 font-medium animate-in fade-in slide-in-from-right-4">
                        <Check className="w-5 h-5" />
                        <span>Changes saved to session</span>
                    </div>
                )}
                
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-all ${isSaving ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-95'}`}
                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </>
                    )}
                </button>
            </div>



            </div>



            {/* Modal Components */}

            <FeeModal />

            <UseTypeModal />

            <TemplateModal />

            {thresholdModal.isOpen && (
                <ThresholdModal
                    isOpen={thresholdModal.isOpen}
                    onClose={() => setThresholdModal({ isOpen: false, editingThreshold: null })}
                    onSave={handleSaveThreshold}
                    initialData={thresholdModal.editingThreshold}
                />
            )}

            <ContactModal />

            <OperationalModal />

        </div>

    );

};

const ThresholdModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        amount: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            ...formData,
            amount: parseInt(formData.amount) || 0 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Threshold Setting' : 'Add New Threshold'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Threshold Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-slate-700"
                                placeholder="e.g. Action Threshold"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($) *</label>
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-slate-700"
                                placeholder="e.g. 500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 text-slate-700 min-h-[100px]"
                                placeholder="What enforcement action does this amount trigger?"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2.5 bg-hawaii-ocean text-white font-medium rounded-lg hover:bg-hawaii-ocean/90 shadow-sm shadow-hawaii-ocean/20 transition-all">
                            {initialData ? 'Save Changes' : 'Add Threshold'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminConfiguration;

