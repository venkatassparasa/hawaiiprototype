import React, { useState } from 'react';
import { FileText, Send, Download, Eye, Edit2, Trash2, Plus, Search, Filter, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const LetterGenerator = () => {
    const [activeTab, setActiveTab] = useState('templates');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [recipients, setRecipients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Letter Templates
    const [templates, setTemplates] = useState([
        { 
            id: 1, 
            name: 'Compliance Notice', 
            type: 'violation', 
            subject: 'TVR Compliance Notice',
            content: 'Dear Property Owner,\n\nThis is to notify you of a compliance issue regarding your TVR registration...',
            active: true,
            usageCount: 45
        },
        { 
            id: 2, 
            name: 'Approval Letter', 
            type: 'approval', 
            subject: 'TVR Registration Approved',
            content: 'Congratulations! Your TVR registration has been approved...',
            active: true,
            usageCount: 32
        },
        { 
            id: 3, 
            name: 'Rejection Letter', 
            type: 'rejection', 
            subject: 'TVR Registration Denied',
            content: 'We regret to inform you that your TVR registration has been denied...',
            active: true,
            usageCount: 18
        },
        { 
            id: 4, 
            name: 'Renewal Reminder', 
            type: 'reminder', 
            subject: 'TVR Registration Renewal Due',
            content: 'This is a reminder that your TVR registration is due for renewal...',
            active: false,
            usageCount: 0
        },
        { 
            id: 5, 
            name: 'Violation Notice', 
            type: 'violation', 
            subject: 'TVR Violation Notice',
            content: 'This notice is to inform you of violations found during inspection...',
            active: true,
            usageCount: 67
        }
    ]);

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
        { id: 'templates', label: 'Letter Templates', icon: FileText },
        { id: 'generator', label: 'Generate Letters', icon: Send },
        { id: 'history', label: 'Letter History', icon: Clock },
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
        
        alert(`Generating letters using template: ${selectedTemplate.name}`);
    };

    const handleSendLetter = (id) => {
        setGeneratedLetters(generatedLetters.map(letter => 
            letter.id === id 
                ? { ...letter, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
                : letter
        ));
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

            {/* Generate Letters Tab */}
            {activeTab === 'generator' && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Generate Letters</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            
                            {/* Recipients */}
                            <div>
                                <h3 className="font-medium text-slate-700 mb-3">Recipients</h3>
                                <div className="border border-slate-200 rounded-lg p-3">
                                    <textarea
                                        placeholder="Enter recipient names (one per line)..."
                                        className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                        onChange={(e) => setRecipients(e.target.value.split('\n').filter(r => r.trim()))}
                                    />
                                    <div className="mt-2 text-sm text-slate-600">
                                        {recipients.length} recipient{recipients.length !== 1 ? 's' : ''} added
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Recipient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sent Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredLetters.map((letter) => (
                                    <tr key={letter.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.recipient}</td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.property}</td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.subject}</td>
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
                                        <td className="px-6 py-4 text-sm text-slate-900">{letter.dueDate}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                {letter.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleSendLetter(letter.id)}
                                                        className="p-1 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
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
        </div>
    );
};

export default LetterGenerator;
