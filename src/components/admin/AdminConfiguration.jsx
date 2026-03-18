import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, Clock, Mail, FileText, Building, Save, Plus, Edit2, Trash2, Eye, EyeOff, AlertTriangle, Database, X } from 'lucide-react';
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

    const [contactInfo, setContactInfo] = useState({
        departmentName: 'County of Hawaii Planning Department',
        address: '101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720',
        phone: '(808) 961-8285',
        email: 'planning@hawaiicounty.gov',
        website: 'www.hawaiicounty.gov/planning',
        emergencyContact: '(808) 935-3333',
    });

    // Violation Payment Thresholds
    const [violationThresholds, setViolationThresholds] = useState({
        warningThreshold: 500,
        fineThreshold: 1000,
        lienThreshold: 5000,
        suspensionThreshold: 10000,
    });

    const [letterTemplates, setLetterTemplates] = useState([
        { id: 1, name: 'Compliance Notice', type: 'violation', subject: 'TVR Compliance Notice', active: true },
        { id: 2, name: 'Approval Letter', type: 'approval', subject: 'TVR Registration Approved', active: true },
        { id: 3, name: 'Rejection Letter', type: 'rejection', subject: 'TVR Registration Denied', active: true },
        { id: 4, name: 'Renewal Reminder', type: 'reminder', subject: 'TVR Registration Renewal Due', active: false },
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

    const tabs = [
        { id: 'fees', label: 'Fee Management', icon: DollarSign },
        { id: 'useTypes', label: 'Use Types', icon: Building },
        { id: 'operational', label: 'Operational Standards', icon: Settings },
        { id: 'contact', label: 'Contact Info', icon: Mail },
        { id: 'thresholds', label: 'Violation Thresholds', icon: AlertTriangle }
    ];

    const handleSave = () => {
        // Save configuration logic here
        alert('Configuration saved successfully!');
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

    // Threshold Management Handlers
    const handleAddThreshold = () => {
        setThresholdModal({ isOpen: true, editingThreshold: null });
    };

    const handleSaveThreshold = (thresholdData) => {
        if (thresholdModal.editingThreshold) {
            // Update existing threshold
            setViolationThresholds({
                ...violationThresholds,
                ...thresholdData
            });
        } else {
            // Add new threshold type
            const newThreshold = {
                id: Math.max(1, 2, 3, 4) + 1, // Generate new ID
                ...thresholdData,
                active: true
            };
            // For now, we'll just update the main thresholds object
            setViolationThresholds({
                ...violationThresholds,
                ...thresholdData
            });
        }
        setThresholdModal({ isOpen: false, editingThreshold: null });
    };

    // Contact Info Handlers
    const handleAddContact = () => {
        setContactModal({ isOpen: true, editingContact: null });
    };

    const handleSaveContact = (contactData) => {
        if (contactModal.editingContact) {
            // Update existing contact
            setContactInfo({
                ...contactInfo,
                ...contactData
            });
        } else {
            // Add new contact
            const newContact = {
                id: Math.max(1, 2, 3, 4, 5) + 1, // Generate new ID
                ...contactData,
                active: true
            };
            setContactInfo({
                ...contactInfo,
                ...contactData
            });
        }
        setContactModal({ isOpen: false, editingContact: null });
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
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    defaultChecked={initialData.active}
                                    id="templateActive"
                                    className="rounded border-slate-300 text-hawaii-ocean focus:ring-hawaii-ocean"
                                />
                                <span className="text-sm font-medium text-slate-700">Active</span>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-semibold text-slate-800">
                            {contactModal.editingContact ? 'Edit Contact' : 'Add New Contact'}
                        </h3>
                        <button 
                            onClick={() => setContactModal({ isOpen: false, editingContact: null })}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Department Name</label>
                            <input
                                type="text"
                                defaultValue={initialData.departmentName}
                                id="contactDepartmentName"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                placeholder="e.g., Planning Department"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                defaultValue={initialData.phone}
                                id="contactPhone"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                placeholder="+1 (808) 123-4567"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue={initialData.email}
                                id="contactEmail"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                placeholder="contact@hawaiicounty.gov"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                            <input
                                type="url"
                                defaultValue={initialData.website}
                                id="contactWebsite"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                placeholder="https://hawaiicounty.gov"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                            <input
                                type="tel"
                                defaultValue={initialData.emergencyContact}
                                id="contactEmergency"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                placeholder="+1 (808) 987-6543"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                            <textarea
                                defaultValue={initialData.address}
                                id="contactAddress"
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                placeholder="123 County Building, Hilo, HI 96720"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 p-6 border-t">
                        <button
                            onClick={() => setContactModal({ isOpen: false, editingContact: null })}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
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

                {/* Violation Thresholds */}
                {activeTab === 'thresholds' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Violation Payment Thresholds</h2>
                            <button onClick={handleAddThreshold} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            <Plus className="w-4 h-4" />
                            Add New Threshold
                        </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white border border-slate-200 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-4">Warning Threshold</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>
                                        <input
                                            type="number"
                                            value={violationThresholds.warningThreshold}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, warningThreshold: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Triggers</label>
                                        <select
                                            value={violationThresholds.warningTrigger || 'multiple_violations'}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, warningTrigger: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        >
                                            <option value="single_violation">Single Violation</option>
                                            <option value="multiple_violations">Multiple Violations</option>
                                            <option value="complaint_based">Complaint Based</option>
                                            <option value="time_based">Time Based</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-200 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-4">Fine Threshold</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>
                                        <input
                                            type="number"
                                            value={violationThresholds.fineThreshold}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, fineThreshold: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Auto-Issue At</label>
                                        <select
                                            value={violationThresholds.fineAutoIssue || 'manual'}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, fineAutoIssue: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        >
                                            <option value="manual">Manual Review</option>
                                            <option value="auto">Automatic</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-200 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-4">Lien Threshold</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>
                                        <input
                                            type="number"
                                            value={violationThresholds.lienThreshold}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, lienThreshold: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Required Days</label>
                                        <input
                                            type="number"
                                            value={violationThresholds.lienDays}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, lienDays: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-200 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-4">Suspension Threshold</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Violations Count</label>
                                        <input
                                            type="number"
                                            value={violationThresholds.suspensionThreshold}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, suspensionThreshold: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Time Period (days)</label>
                                        <input
                                            type="number"
                                            value={violationThresholds.suspensionDays}
                                            onChange={(e) => setViolationThresholds({...violationThresholds, suspensionDays: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Department Name</label>
                                <input
                                    type="text"
                                    value={contactInfo.departmentName}
                                    onChange={(e) => setContactInfo({...contactInfo, departmentName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                                <input
                                    type="url"
                                    value={contactInfo.website}
                                    onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                                <input
                                    type="tel"
                                    value={contactInfo.emergencyContact}
                                    onChange={(e) => setContactInfo({...contactInfo, emergencyContact: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                <textarea
                                    value={contactInfo.address}
                                    onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                >
                    <Save className="w-4 h-4" />
                    Save Configuration
                </button>
            </div>

            </div>

            {/* Modal Components */}
            <FeeModal />
            <UseTypeModal />
            <TemplateModal />
            <ThresholdModal />
            <ContactModal />
            <OperationalModal />
        </div>
    );
};

export default AdminConfiguration;
