import React, { useState, useEffect } from 'react';
import { FileText, Send, Download, Eye, Edit2, Trash2, Plus, Search, Filter, Clock, CheckCircle, AlertTriangle, Building, Mail, Printer, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const LetterGenerator = () => {
    const [activeTab, setActiveTab] = useState('templates');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [selectedCases, setSelectedCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [propertySearch, setPropertySearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deliveryMethod, setDeliveryMethod] = useState('email');
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [selectedPropertyForForm, setSelectedPropertyForForm] = useState(null);
    const [searchParams] = useSearchParams();

    // Mock TVR Properties Data - Realistic Hawaii County locations
    const [tvrProperties] = useState([
        {
            id: 1,
            registrationNumber: 'TVR-2024-HI-001',
            address: '75-5685 Kuakini Hwy, Kailua-Kona, HI 96740',
            ownerName: 'Keiko Tanaka',
            ownerEmail: 'keiko.tanaka@email.com',
            ownerPhone: '(808) 329-1234',
            ownerAddress: '75-5685 Kuakini Hwy, Kailua-Kona, HI 96740',
            propertyType: 'Single Family Home',
            maxOccupancy: 6,
            status: 'Active',
            registrationDate: '2024-01-15',
            expiryDate: '2025-01-15',
            taxMapKey: '3-7-5-068-056',
            parcelNumber: '375056008000',
            zoning: 'RS-15 (Single Family Residential)',
            buildingPermit: 'BP2023-0042'
        },
        {
            id: 2,
            registrationNumber: 'TVR-2024-HI-002',
            address: '16-264 Kalani Dr, Volcano, HI 96785',
            ownerName: 'David & Mary Kama',
            ownerEmail: 'kama.ohana@email.com',
            ownerPhone: '(808) 967-7890',
            ownerAddress: '16-264 Kalani Dr, Volcano, HI 96785',
            propertyType: 'Vacation Rental',
            maxOccupancy: 8,
            status: 'Active',
            registrationDate: '2024-02-20',
            expiryDate: '2025-02-20',
            taxMapKey: '1-6-2-064-026',
            parcelNumber: '162064026000',
            zoning: 'V-1 (Vacation Rental)',
            buildingPermit: 'BP2022-0178'
        },
        {
            id: 3,
            registrationNumber: 'TVR-2024-HI-003',
            address: '67-1480 Leilani St, Waikoloa, HI 96738',
            ownerName: 'Michael Chang',
            ownerEmail: 'm.chang.rentals@email.com',
            ownerPhone: '(808) 883-4567',
            ownerAddress: '67-1480 Leilani St, Waikoloa, HI 96738',
            propertyType: 'Condominium',
            maxOccupancy: 4,
            status: 'Under Review',
            registrationDate: '2024-03-10',
            expiryDate: '2025-03-10',
            taxMapKey: '6-7-1-048-000',
            parcelNumber: '671048000000',
            zoning: 'RM-2 (Residential Medium)',
            buildingPermit: 'BP2021-0095'
        },
        {
            id: 4,
            registrationNumber: 'TVR-2024-HI-004',
            address: '27-330 Old Mamalahoa Hwy, Honokaa, HI 96727',
            ownerName: 'Sarah Johnson-Leong',
            ownerEmail: 'sarah.jl.hawaii@email.com',
            ownerPhone: '(808) 775-2345',
            ownerAddress: '27-330 Old Mamalahoa Hwy, Honokaa, HI 96727',
            propertyType: 'Single Family Home',
            maxOccupancy: 6,
            status: 'Active',
            registrationDate: '2023-12-01',
            expiryDate: '2024-12-01',
            taxMapKey: '2-7-3-030-033',
            parcelNumber: '273030033000',
            zoning: 'RS-20 (Single Family Residential)',
            buildingPermit: 'BP2020-0156'
        },
        {
            id: 5,
            registrationNumber: 'TVR-2024-HI-005',
            address: '93-860 Manu Mele Pl, Waianae, HI 96792',
            ownerEmail: 'aloha.paradise.rentals@email.com',
            ownerPhone: '(808) 696-8901',
            ownerAddress: '93-860 Manu Mele Pl, Waianae, HI 96792',
            propertyType: 'Single Family Home',
            maxOccupancy: 10,
            status: 'Active',
            registrationDate: '2024-01-08',
            expiryDate: '2025-01-08',
            taxMapKey: '9-3-8-060-086',
            parcelNumber: '938060086000',
            zoning: 'RS-7.5 (Single Family Residential)',
            buildingPermit: 'BP2019-0089'
        }
    ]);

    // Mock Cases/Violations Data - Realistic Hawaii County compliance issues
    const [cases] = useState([
        {
            id: 1,
            propertyId: 1,
            caseNumber: 'CASE-2024-KN-001',
            type: 'Violation',
            description: 'Noise complaint from neighboring property - loud music and gatherings after 10:00 PM county quiet hours',
            violationDate: '2024-03-01',
            severity: 'Medium',
            status: 'Open',
            inspectorName: 'Officer K. Nakamura',
            dueDate: '2024-03-15',
            complaintSource: 'Neighbor complaint',
            hawaiiCountyCode: 'Chapter 25, Article 3 - Noise Control',
            fineAmount: 250.00
        },
        {
            id: 2,
            propertyId: 2,
            caseNumber: 'CASE-2024-VL-002',
            type: 'Inspection',
            description: 'Routine annual compliance inspection - parking, occupancy, and safety requirements verification',
            inspectionDate: '2024-03-05',
            severity: 'Low',
            status: 'Completed',
            inspectorName: 'Officer L. Higa',
            dueDate: '2024-03-10',
            inspectionType: 'Annual Compliance',
            hawaiiCountyCode: 'Chapter 25, Article 8 - TVR Regulations',
            findings: 'All requirements met - compliant'
        },
        {
            id: 3,
            propertyId: 3,
            caseNumber: 'CASE-2024-KL-003',
            type: 'Violation',
            description: 'Exceeding maximum occupancy - observed 12 guests when maximum permitted is 4',
            violationDate: '2024-03-08',
            severity: 'High',
            status: 'Open',
            inspectorName: 'Officer M. Silva',
            dueDate: '2024-03-20',
            complaintSource: 'Community patrol report',
            hawaiiCountyCode: 'Chapter 25, Article 8, Section 25-8-23 - Occupancy Limits',
            fineAmount: 500.00
        },
        {
            id: 4,
            propertyId: 4,
            caseNumber: 'CASE-2024-HN-004',
            type: 'Violation',
            description: 'Improper parking - vehicles blocking public right-of-way and emergency access',
            violationDate: '2024-02-28',
            severity: 'Medium',
            status: 'Pending Review',
            inspectorName: 'Officer J. Rodrigues',
            dueDate: '2024-03-25',
            complaintSource: 'Fire department concern',
            hawaiiCountyCode: 'Chapter 25, Article 4 - Parking Requirements',
            fineAmount: 150.00
        },
        {
            id: 5,
            propertyId: 5,
            caseNumber: 'CASE-2024-WN-005',
            type: 'Violation',
            description: 'Failure to display TVR registration certificate prominently as required',
            violationDate: '2024-03-12',
            severity: 'Low',
            status: 'Open',
            inspectorName: 'Officer T. Kaohi',
            dueDate: '2024-03-27',
            complaintSource: 'Inspector observation',
            hawaiiCountyCode: 'Chapter 25, Article 8, Section 25-8-15 - Signage Requirements',
            fineAmount: 100.00
        }
    ]);

    // Set active tab based on URL parameter
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Letter Templates with Dynamic Placeholders
    const [templates, setTemplates] = useState([
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
        },
        { 
            id: 5, 
            name: 'Violation Notice', 
            type: 'violation', 
            subject: 'TVR Violation Notice - [Case Number]',
            content: 'Dear [Owner Name],\n\nThis notice is to inform you of violations found during inspection of your property at [Property Address].\n\nCase Number: [Case Number]\nViolation Date: [Violation Date]\nInspector: [Inspector Name]\n\n[Violation Details]\n\nPlease correct these violations by [Due Date]. Failure to comply may result in additional penalties.\n\nSincerely,\nCounty of Hawaii Planning Department',
            active: true,
            usageCount: 67
        }
    ]);

    // Helper function to replace template variables
    const replaceTemplateVariables = (content, property, caseInfo = null) => {
        let replacedContent = content;
        
        // Property-related variables
        if (property) {
            replacedContent = replacedContent.replace(/\[Property Address\]/g, property.address || '');
            replacedContent = replacedContent.replace(/\[Registration Number\]/g, property.registrationNumber || '');
            replacedContent = replacedContent.replace(/\[Owner Name\]/g, property.ownerName || '');
            replacedContent = replacedContent.replace(/\[Owner Email\]/g, property.ownerEmail || '');
            replacedContent = replacedContent.replace(/\[Owner Phone\]/g, property.ownerPhone || '');
            replacedContent = replacedContent.replace(/\[Property Type\]/g, property.propertyType || '');
            replacedContent = replacedContent.replace(/\[Max Occupancy\]/g, property.maxOccupancy || '');
            replacedContent = replacedContent.replace(/\[Registration Date\]/g, property.registrationDate || '');
            replacedContent = replacedContent.replace(/\[Expiry Date\]/g, property.expiryDate || '');
        }
        
        // Case-related variables
        if (caseInfo) {
            replacedContent = replacedContent.replace(/\[Case Number\]/g, caseInfo.caseNumber || '');
            replacedContent = replacedContent.replace(/\[Violation Date\]/g, caseInfo.violationDate || caseInfo.inspectionDate || '');
            replacedContent = replacedContent.replace(/\[Inspector Name\]/g, caseInfo.inspectorName || '');
            replacedContent = replacedContent.replace(/\[Due Date\]/g, caseInfo.dueDate || '');
            replacedContent = replacedContent.replace(/\[Violation Details\]/g, caseInfo.description || '');
        } else {
            // Default values if no case info
            replacedContent = replacedContent.replace(/\[Case Number\]/g, '');
            replacedContent = replacedContent.replace(/\[Violation Date\]/g, '');
            replacedContent = replacedContent.replace(/\[Inspector Name\]/g, '');
            replacedContent = replacedContent.replace(/\[Due Date\]/g, '30 days from receipt');
            replacedContent = replacedContent.replace(/\[Violation Details\]/g, 'Please refer to the attached inspection report.');
        }
        
        // Default values for missing variables
        replacedContent = replacedContent.replace(/\[Rejection Reason\]/g, 'Application does not meet current zoning requirements.');
        
        return replacedContent;
    };

    // Filter properties based on search
    const filteredProperties = tvrProperties.filter(property => 
        property.address.toLowerCase().includes(propertySearch.toLowerCase()) ||
        property.ownerName.toLowerCase().includes(propertySearch.toLowerCase()) ||
        property.registrationNumber.toLowerCase().includes(propertySearch.toLowerCase())
    );

    // Get cases for selected properties
    const availableCases = cases.filter(caseItem => 
        selectedProperties.some(property => property.id === caseItem.propertyId)
    );

    // Generated Letters
    const [generatedLetters, setGeneratedLetters] = useState([
        {
            id: 1,
            templateId: 1,
            recipient: 'John Doe',
            property: '123 Beach Road',
            subject: 'TVR Compliance Notice',
            status: 'sent',
            sentDate: '2024-03-15',
            dueDate: '2024-03-30'
        },
        {
            id: 2,
            templateId: 2,
            recipient: 'Jane Smith',
            property: '456 Ocean View',
            subject: 'TVR Registration Approved',
            status: 'pending',
            sentDate: null,
            dueDate: '2024-03-20'
        }
    ]);

    const tabs = [
        { id: 'generator', label: 'Generate Letters', icon: Send },
        { id: 'history', label: 'Letter History', icon: Clock }
    ];

    const handleCreateTemplate = () => {
        const newTemplate = {
            id: Math.max(...templates.map(t => t.id)) + 1,
            name: 'New Template',
            type: 'custom',
            subject: 'New Letter Template',
            content: 'Dear [Recipient Name],\n\n[Letter content here...]',
            active: true,
            usageCount: 0
        };
        setTemplates([...templates, newTemplate]);
    };

    const handleEditTemplate = (id) => {
        const template = templates.find(t => t.id === id);
        const newName = prompt('Edit template name:', template.name);
        const newSubject = prompt('Edit subject:', template.subject);
        
        if (newName && newSubject) {
            setTemplates(templates.map(t => 
                t.id === id 
                    ? { ...t, name: newName, subject: newSubject }
                    : t
            ));
        }
    };

    const handleDeleteTemplate = (id) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const handleToggleTemplate = (id) => {
        setTemplates(templates.map(t => 
            t.id === id ? { ...t, active: !t.active } : t
        ));
    };

    const handleGenerateLetters = () => {
        if (!selectedTemplate) {
            alert('Please select a template first');
            return;
        }
        
        if (selectedProperties.length === 0) {
            alert('Please select at least one property');
            return;
        }
        
        // Generate detailed report
        const reportWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        
        let reportContent = `
            <html>
                <head>
                    <title>Letter Generation Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                        .header { border-bottom: 2px solid #4D7833; padding-bottom: 20px; margin-bottom: 30px; }
                        .section { margin-bottom: 30px; }
                        .property-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: #f9f9f9; }
                        .case-card { border-left: 4px solid #4D7833; padding: 10px; margin: 10px 0; background: #fff; }
                        .highlight { background: #fff3cd; padding: 2px 4px; border-radius: 3px; }
                        .badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
                        .badge-blue { background: #e3f2fd; color: #1976d2; }
                        .badge-green { background: #e8f5e8; color: #2e7d32; }
                        .badge-orange { background: #fff3e0; color: #f57c00; }
                        .badge-red { background: #ffebee; color: #c62828; }
                        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                        th { background: #f5f5f5; font-weight: bold; }
                        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
                        .summary-card { text-align: center; padding: 15px; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                        .summary-card h3 { margin: 0 0 5px 0; font-size: 24px; }
                        .summary-card p { margin: 0; opacity: 0.9; }
                        @media print { body { margin: 10px; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📊 Letter Generation Report</h1>
                        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Template:</strong> ${selectedTemplate.name} (${selectedTemplate.type})</p>
                        <p><strong>Delivery Method:</strong> ${deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1)}</p>
                    </div>

                    <div class="section">
                        <h2>📈 Generation Summary</h2>
                        <div class="summary-grid">
                            <div class="summary-card">
                                <h3>${selectedProperties.length}</h3>
                                <p>Properties Selected</p>
                            </div>
                            <div class="summary-card">
                                <h3>${selectedCases.length}</h3>
                                <p>Cases Linked</p>
                            </div>
                            <div class="summary-card">
                                <h3>${selectedProperties.length + selectedCases.length}</h3>
                                <p>Total Letters</p>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2>🏠 Selected Properties</h2>
        `;
        
        // Add property details
        selectedProperties.forEach((property, index) => {
            const relevantCases = selectedCases.filter(caseItem => caseItem.propertyId === property.id);
            reportContent += `
                <div class="property-card">
                    <h3>${index + 1}. ${property.ownerName}</h3>
                    <table>
                        <tr><td><strong>Registration:</strong></td><td><span class="highlight">${property.registrationNumber}</span></td></tr>
                        <tr><td><strong>Address:</strong></td><td>${property.address}</td></tr>
                        <tr><td><strong>Property Type:</strong></td><td>${property.propertyType}</td></tr>
                        <tr><td><strong>Max Occupancy:</strong></td><td>${property.maxOccupancy} guests</td></tr>
                        <tr><td><strong>Zoning:</strong></td><td>${property.zoning}</td></tr>
                        <tr><td><strong>Tax Map Key:</strong></td><td>${property.taxMapKey}</td></tr>
                        <tr><td><strong>Status:</strong></td><td><span class="badge ${property.status === 'Active' ? 'badge-green' : 'badge-orange'}">${property.status}</span></td></tr>
                        <tr><td><strong>Contact:</strong></td><td>${property.ownerEmail} | ${property.ownerPhone}</td></tr>
                    </table>
                    
                    ${relevantCases.length > 0 ? `
                        <h4>📋 Linked Cases (${relevantCases.length})</h4>
                        ${relevantCases.map(caseItem => `
                            <div class="case-card">
                                <strong>${caseItem.caseNumber}</strong> - ${caseItem.type}<br>
                                <em>${caseItem.description}</em><br>
                                <small>Severity: <span class="badge badge-${caseItem.severity === 'High' ? 'red' : caseItem.severity === 'Medium' ? 'orange' : 'blue'}">${caseItem.severity}</span> | 
                                Status: <span class="badge badge-${caseItem.status === 'Open' ? 'red' : caseItem.status === 'Completed' ? 'green' : 'orange'}">${caseItem.status}</span> | 
                                Inspector: ${caseItem.inspectorName}</small>
                            </div>
                        `).join('')}
                    ` : '<p><em>No cases linked to this property</em></p>'}
                </div>
            `;
        });
        
        // Add template preview
        reportContent += `
                    </div>

                    <div class="section">
                        <h2>📄 Template Preview</h2>
                        <div class="property-card">
                            <h3>${selectedTemplate.name}</h3>
                            <p><strong>Subject:</strong> ${selectedTemplate.subject}</p>
                            <p><strong>Type:</strong> <span class="badge badge-blue">${selectedTemplate.type}</span></p>
                            <p><strong>Usage Count:</strong> ${selectedTemplate.usageCount} previous uses</p>
                            
                            <h4>Sample Content (with first property data):</h4>
                            <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 12px;">
        `;
        
        if (selectedProperties.length > 0) {
            const sampleProperty = selectedProperties[0];
            const sampleCase = selectedCases.find(c => c.propertyId === sampleProperty.id);
            const sampleContent = replaceTemplateVariables(selectedTemplate.content, sampleProperty, sampleCase);
            reportContent += sampleContent;
        } else {
            reportContent += selectedTemplate.content;
        }
        
        reportContent += `
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2>📧 Delivery Information</h2>
                        <table>
                            <tr><th>Property</th><th>Recipient</th><th>Email</th><th>Phone</th><th>Method</th></tr>
        `;
        
        selectedProperties.forEach(property => {
            reportContent += `
                <tr>
                    <td>${property.address}</td>
                    <td>${property.ownerName}</td>
                    <td>${property.ownerEmail}</td>
                    <td>${property.ownerPhone}</td>
                    <td><span class="badge badge-blue">${deliveryMethod}</span></td>
                </tr>
            `;
        });
        
        reportContent += `
                        </table>
                    </div>

                    <div class="section">
                        <h2>⚠️ Hawaii County Compliance Notes</h2>
                        <div class="property-card">
                            <h4>📋 Relevant County Codes</h4>
                            <ul>
                                <li><strong>Chapter 25, Article 8:</strong> TVR Regulations and Requirements</li>
                                <li><strong>Chapter 25, Article 3:</strong> Noise Control Ordinance</li>
                                <li><strong>Chapter 25, Article 4:</strong> Parking Requirements</li>
                                <li><strong>Zoning Ordinance:</strong> Property eligibility based on zoning classification</li>
                            </ul>
                            
                            <h4>📞 Contact Information</h4>
                            <p><strong>County of Hawaii Planning Department</strong><br>
                            101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720<br>
                            Phone: (808) 961-8285 | Email: planning@hawaiicounty.gov</p>
                            
                            <h4>⏰ Processing Times</h4>
                            <p>• Email delivery: Immediate<br>
                            • Print preparation: 1-2 business days<br>
                            • Mail preparation: 2-3 business days</p>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #4D7833; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            🖨️ Print Report
                        </button>
                        <button onclick="window.close()" style="margin-left: 10px; padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ❌ Close
                        </button>
                    </div>
                </body>
            </html>
        `;
        
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
        
        // Ask for confirmation after showing report
        setTimeout(() => {
            if (confirm(`Ready to generate ${selectedProperties.length + selectedCases.length} letters for delivery via ${deliveryMethod}?`)) {
                // Proceed with actual letter generation
                const newLetters = [];
                
                selectedProperties.forEach(property => {
                    const relevantCases = selectedCases.filter(caseItem => caseItem.propertyId === property.id);
                    
                    if (relevantCases.length === 0) {
                        // Generate letter without case information
                        const letter = {
                            id: Math.max(...generatedLetters.map(l => l.id), 0) + 1,
                            templateId: selectedTemplate.id,
                            propertyId: property.id,
                            property: property.address,
                            recipient: property.ownerName,
                            recipientEmail: property.ownerEmail,
                            recipientPhone: property.ownerPhone,
                            subject: replaceTemplateVariables(selectedTemplate.subject, property),
                            content: replaceTemplateVariables(selectedTemplate.content, property),
                            status: 'pending',
                            sentDate: null,
                            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            deliveryMethod: deliveryMethod,
                            registrationNumber: property.registrationNumber
                        };
                        newLetters.push(letter);
                    } else {
                        // Generate letters for each case
                        relevantCases.forEach(caseItem => {
                            const letter = {
                                id: Math.max(...generatedLetters.map(l => l.id), 0) + newLetters.length + 1,
                                templateId: selectedTemplate.id,
                                propertyId: property.id,
                                caseId: caseItem.id,
                                property: property.address,
                                recipient: property.ownerName,
                                recipientEmail: property.ownerEmail,
                                recipientPhone: property.ownerPhone,
                                subject: replaceTemplateVariables(selectedTemplate.subject, property, caseItem),
                                content: replaceTemplateVariables(selectedTemplate.content, property, caseItem),
                                status: 'pending',
                                sentDate: null,
                                dueDate: caseItem.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                deliveryMethod: deliveryMethod,
                                registrationNumber: property.registrationNumber,
                                caseNumber: caseItem.caseNumber
                            };
                            newLetters.push(letter);
                        });
                    }
                });
                
                setGeneratedLetters([...generatedLetters, ...newLetters]);
                
                // Reset selections
                setSelectedProperties([]);
                setSelectedCases([]);
                setSelectedTemplate(null);
                
                alert(`Successfully generated ${newLetters.length} letter(s) for delivery via ${deliveryMethod}`);
                reportWindow.close();
            }
        }, 1000);
    };

    const handleSendLetter = (letterId) => {
        const letter = generatedLetters.find(l => l.id === letterId);
        if (!letter) return;
        
        // Simulate sending based on delivery method
        let success = true;
        let message = '';
        
        switch (letter.deliveryMethod) {
            case 'email':
                message = `Letter sent via email to ${letter.recipientEmail}`;
                break;
            case 'print':
                message = `Letter prepared for printing - ${letter.property}`;
                break;
            case 'mail':
                message = `Letter prepared for mailing to ${letter.recipient} at ${letter.recipientEmail}`;
                break;
            default:
                message = `Letter sent successfully`;
        }
        
        setGeneratedLetters(generatedLetters.map(l => 
            l.id === letterId 
                ? { ...l, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
                : l
        ));
        
        alert(message);
    };

    const handlePreviewLetter = (letter) => {
        const preview = window.open('', '_blank');
        preview.document.write(`
            <html>
                <head>
                    <title>Letter Preview - ${letter.subject}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                        .header { border-bottom: 2px solid #4D7833; padding-bottom: 20px; margin-bottom: 30px; }
                        .content { white-space: pre-wrap; }
                        .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>County of Hawaii Planning Department</h2>
                        <p>101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720</p>
                        <p>Phone: (808) 961-8285 | Email: planning@hawaiicounty.gov</p>
                    </div>
                    <div class="content">
                        <h3>${letter.subject}</h3>
                        <p><strong>To:</strong> ${letter.recipient}</p>
                        <p><strong>Property:</strong> ${letter.property}</p>
                        <p><strong>Registration:</strong> ${letter.registrationNumber || 'N/A'}</p>
                        ${letter.caseNumber ? `<p><strong>Case Number:</strong> ${letter.caseNumber}</p>` : ''}
                        <hr>
                        ${letter.content}
                    </div>
                    <div class="footer">
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                        <p>Delivery Method: ${letter.deliveryMethod}</p>
                    </div>
                </body>
            </html>
        `);
        preview.document.close();
    };

    const handleDownloadLetter = (letter) => {
        // Create a text file with the letter content
        const content = `${letter.subject}\n\nTo: ${letter.recipient}\nProperty: ${letter.property}\n${letter.caseNumber ? `Case Number: ${letter.caseNumber}\n` : ''}Registration: ${letter.registrationNumber || 'N/A'}\n\n${letter.content}\n\n---\nGenerated: ${new Date().toLocaleDateString()}\nDelivery Method: ${letter.deliveryMethod}`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Letter_${letter.registrationNumber || letter.property.replace(/[^a-zA-Z0-9]/g, '_')}_${letter.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handlePrintLetter = (letter) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Letter - ${letter.subject}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                        .header { border-bottom: 2px solid #4D7833; padding-bottom: 20px; margin-bottom: 30px; }
                        .content { white-space: pre-wrap; }
                        .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
                        @media print { body { margin: 20px; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>County of Hawaii Planning Department</h2>
                        <p>101 Aupuni Center, 101 Pauahi Street, Hilo, HI 96720</p>
                        <p>Phone: (808) 961-8285 | Email: planning@hawaiicounty.gov</p>
                    </div>
                    <div class="content">
                        <h3>${letter.subject}</h3>
                        <p><strong>To:</strong> ${letter.recipient}</p>
                        <p><strong>Property:</strong> ${letter.property}</p>
                        <p><strong>Registration:</strong> ${letter.registrationNumber || 'N/A'}</p>
                        ${letter.caseNumber ? `<p><strong>Case Number:</strong> ${letter.caseNumber}</p>` : ''}
                        <hr>
                        ${letter.content}
                    </div>
                    <div class="footer">
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleTogglePropertySelection = (property) => {
        setSelectedProperties(prev => 
            prev.some(p => p.id === property.id) 
                ? prev.filter(p => p.id !== property.id)
                : [...prev, property]
        );
    };

    const handleToggleCaseSelection = (caseItem) => {
        setSelectedCases(prev => 
            prev.some(c => c.id === caseItem.id) 
                ? prev.filter(c => c.id !== caseItem.id)
                : [...prev, caseItem]
        );
    };

    const handleViewRegistrationForm = (property) => {
        setSelectedPropertyForForm(property);
        setShowRegistrationForm(true);
    };

    const handleCloseRegistrationForm = () => {
        setShowRegistrationForm(false);
        setSelectedPropertyForForm(null);
    };

    const filteredLetters = generatedLetters.filter(letter => {
        const matchesSearch = letter.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           letter.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || letter.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Letter Generation Tools</h1>
                <p className="text-slate-600 mb-6">Automated letter generation, templates, and tracking for TVR compliance communications.</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-hawaii-ocean text-hawaii-ocean'
                                    : 'border-transparent text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Generate Letters Tab */}
            {activeTab === 'generator' && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Generate Letters</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Template Selection */}
                            <div>
                                <h3 className="font-medium text-slate-700 mb-3">Select Template</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                                    {templates.filter(t => t.active).map((template) => (
                                        <label key={template.id} className="flex items-center p-2 hover:bg-slate-50 rounded cursor-pointer">
                                            <input
                                                type="radio"
                                                name="template"
                                                value={template.id}
                                                checked={selectedTemplate?.id === template.id}
                                                onChange={() => setSelectedTemplate(template)}
                                                className="mr-3"
                                            />
                                            <div>
                                                <div className="font-medium text-slate-800">{template.name}</div>
                                                <div className="text-sm text-slate-600">{template.subject}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Property Selection */}
                            <div>
                                <h3 className="font-medium text-slate-700 mb-3">Select Properties</h3>
                                <div className="border border-slate-200 rounded-lg p-3">
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search properties..."
                                            value={propertySearch}
                                            onChange={(e) => setPropertySearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {filteredProperties.map((property) => (
                                            <div key={property.id} className="flex items-center p-2 hover:bg-slate-50 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProperties.some(p => p.id === property.id)}
                                                    onChange={() => handleTogglePropertySelection(property)}
                                                    className="mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-800">{property.ownerName}</div>
                                                    <div className="text-sm text-slate-600">{property.address}</div>
                                                    <div className="text-xs text-slate-500">{property.registrationNumber}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewRegistrationForm(property)}
                                                    className="p-1 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                                    title="View Registration Form"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600">
                                        {selectedProperties.length} propert{selectedProperties.length !== 1 ? 'ies' : 'y'} selected
                                    </div>
                                </div>
                            </div>

                            {/* Case Selection & Delivery Method */}
                            <div>
                                <h3 className="font-medium text-slate-700 mb-3">Case Selection & Delivery</h3>
                                <div className="space-y-4">
                                    {/* Case Selection */}
                                    <div className="border border-slate-200 rounded-lg p-3">
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Related Cases (Optional)</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {availableCases.length > 0 ? (
                                                availableCases.map((caseItem) => (
                                                    <label key={caseItem.id} className="flex items-center p-2 hover:bg-slate-50 rounded cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCases.some(c => c.id === caseItem.id)}
                                                            onChange={() => handleToggleCaseSelection(caseItem)}
                                                            className="mr-3"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-slate-800">{caseItem.caseNumber}</div>
                                                            <div className="text-sm text-slate-600">{caseItem.description}</div>
                                                            <div className="text-xs text-slate-500">{caseItem.type} - {caseItem.status}</div>
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-500 italic">No cases available for selected properties</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivery Method */}
                                    <div className="border border-slate-200 rounded-lg p-3">
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Delivery Method</h4>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="email"
                                                    checked={deliveryMethod === 'email'}
                                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <Mail className="w-4 h-4 mr-2" />
                                                Email
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="print"
                                                    checked={deliveryMethod === 'print'}
                                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <Printer className="w-4 h-4 mr-2" />
                                                Print
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="mail"
                                                    checked={deliveryMethod === 'mail'}
                                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <FileText className="w-4 h-4 mr-2" />
                                                Mail
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleGenerateLetters}
                                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Send className="w-4 h-4" />
                                Generate Letters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Letter History Tab */}
            {activeTab === 'history' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Letter History</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search letters..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="sent">Sent</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Recipient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Delivery</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sent Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredLetters.map((letter) => (
                                    <tr key={letter.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.registrationNumber || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <div>
                                                <div className="font-medium">{letter.recipient}</div>
                                                <div className="text-xs text-slate-500">{letter.recipientEmail}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.property}</td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <div>
                                                <div className="font-medium">{letter.subject}</div>
                                                {letter.caseNumber && <div className="text-xs text-slate-500">Case: {letter.caseNumber}</div>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                letter.deliveryMethod === 'email' ? 'bg-blue-100 text-blue-800' :
                                                letter.deliveryMethod === 'print' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {letter.deliveryMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                letter.status === 'sent' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : letter.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {letter.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.sentDate || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handlePreviewLetter(letter)}
                                                    className="p-1 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDownloadLetter(letter)}
                                                    className="p-1 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handlePrintLetter(letter)}
                                                    className="p-1 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                                    title="Print"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                </button>
                                                {letter.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleSendLetter(letter.id)}
                                                        className="p-1 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Send"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Letter Templates Tab */}
            {activeTab === 'templates' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">Letter Templates</h2>
                        <button
                            onClick={handleCreateTemplate}
                            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            <Plus className="w-4 h-4" />
                            Create Template
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <div key={template.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800 mb-1">{template.name}</h3>
                                        <p className="text-sm text-slate-600">{template.subject}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleTemplate(template.id)}
                                            className={`p-2 rounded transition-colors ${
                                                template.active 
                                                    ? 'text-green-600 hover:bg-green-50' 
                                                    : 'text-slate-400 hover:bg-slate-50'
                                            }`}
                                        >
                                            {template.active ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleEditTemplate(template.id)}
                                            className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                        {template.type}
                                    </span>
                                    <span className="text-slate-500">Used {template.usageCount} times</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TVR Registration Form Modal */}
            {showRegistrationForm && selectedPropertyForForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                            <h3 className="text-xl font-semibold text-slate-800">
                                TVR Registration Form - {selectedPropertyForForm.registrationNumber}
                            </h3>
                            <button 
                                onClick={handleCloseRegistrationForm}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-blue-800 mb-2">📋 Data Capture Information</h4>
                                <p className="text-blue-700 text-sm">
                                    This form shows where the property and owner information is captured during the TVR registration process. 
                                    This data is then used for compliance monitoring, inspections, and official correspondence.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Property Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-slate-800 border-b pb-2">🏠 Property Information</h4>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Property Address *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.address}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Physical location of the TVR property</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Tax Map Key (TMK) *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.taxMapKey}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Hawaii County property tax map identifier</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Parcel Number *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.parcelNumber}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">County parcel identification number</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Zoning Classification *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.zoning}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">County zoning designation for TVR eligibility</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Building Permit Number *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.buildingPermit}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">County building permit for the structure</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
                                            <select
                                                value={selectedPropertyForForm.propertyType}
                                                disabled
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            >
                                                <option>Single Family Home</option>
                                                <option>Condominium</option>
                                                <option>Vacation Rental</option>
                                                <option>Multi-Family</option>
                                            </select>
                                            <p className="text-xs text-slate-500 mt-1">Type of dwelling being registered</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Occupancy *</label>
                                            <input
                                                type="number"
                                                value={selectedPropertyForForm.maxOccupancy}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Maximum number of guests permitted</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-slate-800 border-b pb-2">👤 Owner Information</h4>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name(s) *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.ownerName}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Legal owner(s) of the property</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Owner Email Address *</label>
                                            <input
                                                type="email"
                                                value={selectedPropertyForForm.ownerEmail}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Primary contact for official correspondence</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Owner Phone Number *</label>
                                            <input
                                                type="tel"
                                                value={selectedPropertyForForm.ownerPhone}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Primary contact phone for urgent matters</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Mailing Address *</label>
                                            <textarea
                                                value={selectedPropertyForForm.ownerAddress}
                                                readOnly
                                                rows={2}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Address for official mail and notices</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact *</label>
                                            <input
                                                type="text"
                                                value={selectedPropertyForForm.ownerPhone}
                                                readOnly
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">24/7 emergency contact number</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Details */}
                            <div className="mt-6 space-y-4">
                                <h4 className="font-semibold text-slate-800 border-b pb-2">📄 Registration Details</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                                        <input
                                            type="text"
                                            value={selectedPropertyForForm.registrationNumber}
                                            readOnly
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">County-issued registration ID</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Registration Date</label>
                                        <input
                                            type="date"
                                            value={selectedPropertyForForm.registrationDate}
                                            readOnly
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Initial registration date</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={selectedPropertyForForm.expiryDate}
                                            readOnly
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Registration renewal deadline</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Status</label>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            selectedPropertyForForm.status === 'Active' 
                                                ? 'bg-green-100 text-green-800'
                                                : selectedPropertyForForm.status === 'Under Review'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {selectedPropertyForForm.status}
                                        </span>
                                        <p className="text-xs text-slate-500">Current registration status with County of Hawaii</p>
                                    </div>
                                </div>
                            </div>

                            {/* Required Documents Section */}
                            <div className="mt-6 bg-slate-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-800 mb-3">📎 Required Documents (Uploaded During Registration)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Proof of Ownership</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Building Permit</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Tax Clearance Certificate</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Fire Safety Inspection</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Wastewater Approval</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Neighborhood Notice</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LetterGenerator;
