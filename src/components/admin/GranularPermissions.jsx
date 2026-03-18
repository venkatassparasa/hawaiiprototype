import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Settings, Edit2, Trash2, Plus, Eye, EyeOff, Save, Search, Filter, Lock, Unlock, Database, FileText, AlertTriangle, CheckCircle, X, Copy, Download, Upload, ChevronDown } from 'lucide-react';

const GranularPermissions = () => {
    const [activeTab, setActiveTab] = useState('permissions');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState('all');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roleFormData, setRoleFormData] = useState({ id: null, name: '', description: '', templateId: 'null' });

    // Initial Data
    const initialTemplates = [
        {
            id: 1,
            name: 'TVR Registration Clerk',
            description: 'Can process TVR registrations and manage property records',
            permissions: {
                modules: ['registrations', 'properties'],
                actions: ['read', 'create', 'update'],
                records: ['own', 'department']
            },
            active: true
        },
        {
            id: 2,
            name: 'Compliance Officer',
            description: 'Can conduct inspections and manage violations',
            permissions: {
                modules: ['inspections', 'violations', 'complaints'],
                actions: ['read', 'create', 'update', 'delete'],
                records: ['all']
            },
            active: true
        },
        {
            id: 3,
            name: 'Finance Manager',
            description: 'Can manage payments and financial reports',
            permissions: {
                modules: ['payments', 'reports', 'analytics'],
                actions: ['read', 'create', 'update'],
                records: ['department', 'all']
            },
            active: true
        },
        {
            id: 4,
            name: 'Legal Staff',
            description: 'Can manage legal cases and appeals',
            permissions: {
                modules: ['violations', 'appeals', 'legal-documents'],
                actions: ['read', 'create', 'update', 'delete'],
                records: ['all']
            },
            active: true
        },
        {
            id: 5,
            name: 'System Administrator',
            description: 'Full system access and configuration management',
            permissions: {
                modules: ['all'],
                actions: ['all'],
                records: ['all']
            },
            active: true
        }
    ];

    const initialRoles = [
        {
            id: 1,
            name: 'Public User',
            description: 'General public access to property search and registration',
            templateId: null,
            customPermissions: [],
            active: true
        },
        {
            id: 2,
            name: 'TVR Registration Clerk',
            description: 'County staff processing TVR registrations',
            templateId: 1,
            customPermissions: [],
            active: true
        },
        {
            id: 3,
            name: 'Compliance Officer',
            description: 'Enforcement staff conducting inspections',
            templateId: 2,
            customPermissions: [],
            active: true
        },
        {
            id: 4,
            name: 'Finance Manager',
            description: 'Financial management and payment processing',
            templateId: 3,
            customPermissions: [],
            active: true
        },
        {
            id: 5,
            name: 'Legal Counsel',
            description: 'Legal review and case management',
            templateId: 4,
            customPermissions: [],
            active: true
        },
        {
            id: 6,
            name: 'System Administrator',
            description: 'Full system access and configuration',
            templateId: null,
            customPermissions: [],
            active: true
        }
    ];

    // Permission Templates
    const [permissionTemplates, setPermissionTemplates] = useState(initialTemplates);

    // User Roles with Permissions
    const [userRoles, setUserRoles] = useState(initialRoles);

    // Persistence: Load from sessionStorage
    useEffect(() => {
        const savedTemplates = sessionStorage.getItem('permissionTemplates');
        const savedRoles = sessionStorage.getItem('userRoles');
        
        if (savedTemplates) {
            setPermissionTemplates(JSON.parse(savedTemplates));
        }
        if (savedRoles) {
            setUserRoles(JSON.parse(savedRoles));
        }
    }, []);

    // Module Definitions
    const modules = [
        { id: 'registrations', name: 'TVR Registrations', icon: FileText, category: 'core' },
        { id: 'properties', name: 'Property Registry', icon: Database, category: 'core' },
        { id: 'violations', name: 'Violation Cases', icon: AlertTriangle, category: 'enforcement' },
        { id: 'inspections', name: 'Inspections', icon: ShieldCheck, category: 'enforcement' },
        { id: 'complaints', name: 'Complaints', icon: AlertTriangle, category: 'enforcement' },
        { id: 'payments', name: 'Payments', icon: Settings, category: 'finance' },
        { id: 'reports', name: 'Analytics Reports', icon: FileText, category: 'finance' },
        { id: 'appeals', name: 'Appeals', icon: FileText, category: 'legal' },
        { id: 'legal-documents', name: 'Legal Documents', icon: FileText, category: 'legal' },
        { id: 'workflows', name: 'Workflows', icon: Settings, category: 'system' },
        { id: 'admin-config', name: 'Admin Configuration', icon: Settings, category: 'system' },
        { id: 'letter-generator', name: 'Letter Generator', icon: FileText, category: 'system' },
        { id: 'hosting-portal', name: 'Hosting Portal', icon: Database, category: 'system' },
        { id: 'data-migration', name: 'Data Migration', icon: Database, category: 'system' }
    ];

    // Action Definitions
    const actions = [
        { id: 'read', name: 'Read', description: 'View and access data' },
        { id: 'create', name: 'Create', description: 'Add new records' },
        { id: 'update', name: 'Update', description: 'Modify existing records' },
        { id: 'delete', name: 'Delete', description: 'Remove records' },
        { id: 'approve', name: 'Approve', description: 'Approve requests and applications' },
        { id: 'reject', name: 'Reject', description: 'Reject requests and applications' },
        { id: 'export', name: 'Export', description: 'Export data and reports' }
    ];

    // Record Scope Definitions
    const recordScopes = [
        { id: 'own', name: 'Own Records Only', description: 'Only records created by the user' },
        { id: 'department', name: 'Department Records', description: 'Records within user\'s department' },
        { id: 'all', name: 'All Records', description: 'Access to all system records' }
    ];

    const tabs = [
        { id: 'permissions', label: 'Permission Templates', icon: ShieldCheck },
        { id: 'roles', label: 'User Roles', icon: Users },
        { id: 'matrix', label: 'Permission Matrix', icon: Database }
    ];

    const handleCreateTemplate = () => {
        const newTemplate = {
            id: Math.max(...permissionTemplates.map(t => t.id)) + 1,
            name: 'New Permission Template',
            description: 'Custom permission template',
            permissions: {
                modules: [],
                actions: ['read'],
                records: ['own']
            },
            active: true
        };
        setPermissionTemplates([...permissionTemplates, newTemplate]);
    };

    const handleEditTemplate = (id) => {
        const template = permissionTemplates.find(t => t.id === id);
        const newName = prompt('Edit template name:', template.name);
        const newDescription = prompt('Edit description:', template.description);
        
        if (newName && newDescription) {
            setPermissionTemplates(permissionTemplates.map(t => 
                t.id === id 
                    ? { ...t, name: newName, description: newDescription }
                    : t
            ));
        }
    };

    const handleDeleteTemplate = (id) => {
        if (confirm('Are you sure you want to delete this permission template?')) {
            setPermissionTemplates(permissionTemplates.filter(t => t.id !== id));
        }
    };

    const handleToggleTemplate = (id) => {
        setPermissionTemplates(permissionTemplates.map(t => 
            t.id === id ? { ...t, active: !t.active } : t
        ));
    };

    const handleCreateRole = () => {
        setRoleFormData({ id: null, name: '', description: '', templateId: 'null' });
        setIsRoleModalOpen(true);
    };

    const handleEditRole = (id) => {
        const role = userRoles.find(r => r.id === id);
        if (role) {
            setRoleFormData({
                id: role.id,
                name: role.name,
                description: role.description,
                templateId: role.templateId || 'null'
            });
            setIsRoleModalOpen(true);
        }
    };

    const handleSaveRole = () => {
        if (!roleFormData.name.trim()) {
            alert('Please enter a role name.');
            return;
        }

        if (roleFormData.id === null) {
            // Create new
            const newRole = {
                id: Math.max(...userRoles.map(r => r.id), 0) + 1,
                name: roleFormData.name,
                description: roleFormData.description,
                templateId: roleFormData.templateId === 'null' ? null : parseInt(roleFormData.templateId),
                customPermissions: [],
                active: true
            };
            setUserRoles([...userRoles, newRole]);
        } else {
            // Update existing
            setUserRoles(userRoles.map(r => 
                r.id === roleFormData.id 
                    ? { 
                        ...r, 
                        name: roleFormData.name, 
                        description: roleFormData.description, 
                        templateId: roleFormData.templateId === 'null' ? null : parseInt(roleFormData.templateId) 
                      } 
                    : r
            ));
        }
        
        setIsRoleModalOpen(false);
        setHasUnsavedChanges(true);
    };

    const handleDeleteRole = (id) => {
        if (confirm('Are you sure you want to delete this user role?')) {
            setUserRoles(userRoles.filter(r => r.id !== id));
        }
    };

    const handleAssignTemplate = (roleId, templateId) => {
        setUserRoles(userRoles.map(role => 
            role.id === roleId 
                ? { ...role, templateId: templateId === 'null' ? null : parseInt(templateId) }
                : role
        ));
    };

    const getTemplatePermissions = (templateId) => {
        if (!templateId) {
            return { modules: [], actions: [], records: [] };
        }
        const template = permissionTemplates.find(t => t.id === templateId);
        return template ? template.permissions : { modules: [], actions: [], records: [] };
    };

    const getRolePermissions = (role) => {
        if (role.templateId) {
            return getTemplatePermissions(role.templateId);
        }
        return role.customPermissions;
    };

    const hasPermission = (role, module, action, record) => {
        // Check if role has a template assigned
        if (role.templateId) {
            // For template-based roles, check both template and custom permissions
            const template = permissionTemplates.find(t => t.id === role.templateId);
            if (template) {
                // Check template permissions
                const hasTemplateAccess = !template.permissions.modules || template.permissions.modules.includes('all') || template.permissions.modules.includes(module);
                const hasTemplateAction = !template.permissions.actions || template.permissions.actions.includes('all') || template.permissions.actions.includes(action);
                const hasTemplateRecord = !template.permissions.records || template.permissions.records.includes('all') || 
                                      template.permissions.records.includes(record) || 
                                      (record === 'own' && action === 'read');
                
                // Check custom permissions (overrides/restrictions)
                const customPermissions = role.customPermissions || [];
                if (!Array.isArray(customPermissions)) return hasTemplateAccess && hasTemplateAction && hasTemplateRecord;
                
                // Custom permissions can override or restrict template permissions
                const hasCustomPermission = customPermissions.some(
                    p => p.moduleId === module && p.action === action && p.recordScope === record
                );
                
                // If custom permission exists, use it; otherwise use template permission
                return hasCustomPermission || (hasTemplateAccess && hasTemplateAction && hasTemplateRecord);
            }
        }
        
        // Check custom permissions (individual permission objects) for non-template roles
        const customPermissions = role.customPermissions || [];
        if (!Array.isArray(customPermissions)) return false;
        
        return customPermissions.some(
            p => p.moduleId === module && p.action === action && p.recordScope === record
        );
    };

    const handleTogglePermission = (roleId, moduleId, action, recordScope) => {
        setHasUnsavedChanges(true);
        setUserRoles(userRoles.map(role => {
            if (role.id !== roleId) return role;
            
            const currentPermissions = Array.isArray(role.customPermissions) ? role.customPermissions : [];
            const permissionIndex = currentPermissions.findIndex(
                p => p.moduleId === moduleId && p.action === action && p.recordScope === recordScope
            );
            
            let newPermissions;
            if (permissionIndex >= 0) {
                // Remove permission if it exists
                newPermissions = currentPermissions.filter((_, index) => index !== permissionIndex);
            } else {
                // Add permission if it doesn't exist
                newPermissions = [...currentPermissions, { moduleId, action, recordScope }];
            }
            
            return { ...role, customPermissions: newPermissions };
        }));
    };

    const handleSaveChanges = async () => {
        try {
            // Simulate API call to save changes
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Persist to session storage
            sessionStorage.setItem('permissionTemplates', JSON.stringify(permissionTemplates));
            sessionStorage.setItem('userRoles', JSON.stringify(userRoles));
            
            setHasUnsavedChanges(false);
            setLastSavedTime(new Date());
            
            // Show success message
            alert('Permission changes saved successfully for this session!');
        } catch (error) {
            console.error('Failed to save changes:', error);
            alert('Failed to save changes. Please try again.');
        }
    };

    const handleQuickClone = (templateId) => {
        const template = permissionTemplates.find(t => t.id === parseInt(templateId));
        if (!template) return;
        
        const newName = prompt('Enter name for the cloned template:', `${template.name} (Copy)`);
        if (!newName) return;
        
        const clonedTemplate = {
            id: Math.max(...permissionTemplates.map(t => t.id)) + 1,
            name: newName,
            description: `Cloned from: ${template.name}`,
            permissions: JSON.parse(JSON.stringify(template.permissions)),
            active: true
        };
        
        setPermissionTemplates([...permissionTemplates, clonedTemplate]);
        setHasUnsavedChanges(true);
        alert(`Template "${newName}" created successfully!`);
    };

    const handleCloneTemplate = (templateId) => {
        const template = permissionTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        const clonedTemplate = {
            id: Math.max(...permissionTemplates.map(t => t.id)) + 1,
            name: `${template.name} (Clone)`,
            description: `Cloned from: ${template.name}`,
            permissions: { ...template.permissions },
            templateId: templateId, // Reference to original template
            isCloned: true,
            active: true
        };
        
        setPermissionTemplates([...permissionTemplates, clonedTemplate]);
        setHasUnsavedChanges(true);
        setEditingTemplate(clonedTemplate.id);
    };

    const handleCustomizeTemplate = (templateId) => {
        const template = permissionTemplates.find(t => t.id === templateId);
        if (!template) return;
        
        const customizedTemplate = {
            id: Math.max(...permissionTemplates.map(t => t.id)) + 1,
            name: `${template.name} (Custom)`,
            description: `Customized from: ${template.name}`,
            permissions: { ...template.permissions },
            templateId: templateId, // Reference to original template
            isCustom: true,
            active: true
        };
        
        setPermissionTemplates([...permissionTemplates, customizedTemplate]);
        setHasUnsavedChanges(true);
        setEditingTemplate(customizedTemplate.id);
    };

    const handleExportTemplate = (template) => {
        const dataStr = JSON.stringify(template, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${template.name.replace(/\s+/g, '_')}_permissions.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportTemplate = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTemplate = JSON.parse(e.target.result);
                importedTemplate.id = Math.max(...permissionTemplates.map(t => t.id)) + 1;
                importedTemplate.name = `${importedTemplate.name} (Imported)`;
                importedTemplate.isImported = true;
                
                setPermissionTemplates([...permissionTemplates, importedTemplate]);
                setHasUnsavedChanges(true);
                alert('Template imported successfully!');
            } catch (error) {
                alert('Failed to import template. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    const filteredTemplates = permissionTemplates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRoles = userRoles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Granular Permissions Management</h1>
                <p className="text-slate-600 mb-6">Configure detailed permissions at module, record, and action level for different user roles.</p>
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

            {/* Permission Templates Tab */}
            {activeTab === 'permissions' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-slate-800">Permission Templates</h2>
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Unsaved changes</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {lastSavedTime && (
                                <span className="text-sm text-slate-500">
                                    Last saved: {lastSavedTime.toLocaleTimeString()}
                                </span>
                            )}
                            <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                Import Template
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportTemplate}
                                    className="hidden"
                                />
                            </label>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasUnsavedChanges}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={handleCreateTemplate}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Plus className="w-4 h-4" />
                                Create Template
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredTemplates.map((template) => (
                            <div key={template.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800 mb-1">{template.name}</h3>
                                        <p className="text-sm text-slate-600">{template.description}</p>
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
                                            onClick={() => handleCloneTemplate(template.id)}
                                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                            title="Clone Template"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleCustomizeTemplate(template.id)}
                                            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors"
                                            title="Customize Template"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleExportTemplate(template)}
                                            className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                            title="Export Template"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700">Modules:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {template.permissions.modules.map(moduleId => {
                                            const module = modules.find(m => m.id === moduleId);
                                            return module ? (
                                                <span key={moduleId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    {module.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                    
                                    <div className="text-sm font-medium text-slate-700 mt-2">Actions:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {template.permissions.actions.map(actionId => {
                                            const action = actions.find(a => a.id === actionId);
                                            return action ? (
                                                <span key={actionId} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                    {action.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                    
                                    <div className="text-sm font-medium text-slate-700 mt-2">Record Scope:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {template.permissions.records.map(scopeId => {
                                            const scope = recordScopes.find(s => s.id === scopeId);
                                            return scope ? (
                                                <span key={scopeId} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                                    {scope.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Roles Tab */}
            {activeTab === 'roles' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">User Roles</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search roles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleCreateRole}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                            >
                                <Plus className="w-4 h-4" />
                                Create Role
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredRoles.map((role) => (
                            <div key={role.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-800 mb-1">{role.name}</h3>
                                        <p className="text-sm text-slate-600">{role.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleTemplate(role.id)}
                                            className={`p-2 rounded transition-colors ${
                                                role.active 
                                                    ? 'text-green-600 hover:bg-green-50' 
                                                    : 'text-slate-400 hover:bg-slate-50'
                                            }`}
                                        >
                                            {role.active ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleEditRole(role.id)}
                                            className="p-2 text-slate-600 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRole(role.id)}
                                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-700">Template:</span>
                                        <select
                                            value={role.templateId || ''}
                                            onChange={(e) => handleAssignTemplate(role.id, e.target.value)}
                                            className="px-3 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent text-sm"
                                        >
                                            <option value="">No Template</option>
                                            {permissionTemplates.filter(t => t.active).map(template => (
                                                <option key={template.id} value={template.id}>
                                                    {template.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {role.templateId && (
                                        <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                                            <div className="font-medium text-slate-700 mb-1">Assigned Permissions:</div>
                                            <div className="space-y-1">
                                                <div>Modules: {getTemplatePermissions(role.templateId).modules.join(', ')}</div>
                                                <div>Actions: {getTemplatePermissions(role.templateId).actions.join(', ')}</div>
                                                <div>Scope: {getTemplatePermissions(role.templateId).records.join(', ')}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Permission Matrix Tab */}
            {activeTab === 'matrix' && (
                <div>
                    <div className="mb-6 flex justify-between items-end">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">Permission Matrix</h2>
                            <p className="text-sm text-slate-600">Visual overview of permissions across all roles and modules.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                <Copy className="w-4 h-4 text-hawaii-ocean" /> Clone & Customize:
                            </div>
                            <select 
                                onChange={(e) => {
                                    if(e.target.value) handleQuickClone(e.target.value);
                                    e.target.value = "";
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-hawaii-ocean/20 outline-none min-w-[200px]"
                            >
                                <option value="">Select template to clone...</option>
                                {permissionTemplates.filter(t => t.active).map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <div className="h-6 w-px bg-slate-200 mx-1"></div>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasUnsavedChanges}
                                className="flex items-center gap-2 px-5 py-2 text-white rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md active:scale-95"
                                style={{background: '#4D7833'}}
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[250px] sticky left-0 bg-slate-50 z-10">Role & Template</th>
                                        {modules.map((module) => (
                                            <th key={module.id} className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <div className="flex flex-col items-center min-w-[100px]">
                                                    <span className="text-slate-800">{module.name}</span>
                                                    <span className="text-[10px] text-slate-400 normal-case font-medium mt-1">({module.id})</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {userRoles.filter(role => role.active).map((role) => (
                                        <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50/100 z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                                <div className="space-y-3">
                                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                        {role.name}
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Template</label>
                                                        <div className="relative">
                                                            <select
                                                                value={role.templateId || "null"}
                                                                onChange={(e) => handleAssignTemplate(role.id, e.target.value)}
                                                                className="w-full appearance-none pl-2 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none cursor-pointer transition-all"
                                                            >
                                                                <option value="null">No Template (Custom)</option>
                                                                {permissionTemplates.filter(t => t.active).map(t => (
                                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {modules.map((module) => {
                                                const hasAccess = hasPermission(role, module.id, 'read', 'all');
                                                return (
                                                    <td key={module.id} className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.currentTarget.classList.add('scale-125');
                                                                setTimeout(() => e.currentTarget && e.currentTarget.classList.remove('scale-125'), 200);
                                                                handleTogglePermission(role.id, module.id, 'read', 'all');
                                                            }}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all shadow-sm ${
                                                                hasAccess 
                                                                    ? 'bg-green-100 text-green-700 shadow-green-100' 
                                                                    : 'bg-slate-50 text-slate-300'
                                                            } hover:shadow-md active:scale-95`}
                                                            title={`Toggle ${module.name} access for ${role.name}`}
                                                        >
                                                            {hasAccess ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-3">Legend</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span>Has Access (Click to remove)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center">
                                            <X className="w-3 h-3" />
                                        </div>
                                        <span>No Access (Click to add)</span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2">
                                        <strong>Interactive:</strong> Click any permission cell to toggle access
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-medium text-slate-800 mb-3">Permission Types</h3>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Modules:</strong> System areas (registrations, violations, etc.)</div>
                                    <div><strong>Actions:</strong> Operations (read, create, update, delete, etc.)</div>
                                    <div><strong>Records:</strong> Data scope (own, department, all)</div>
                                    <div><strong>Templates:</strong> Pre-defined permission sets</div>
                                    <div><strong>Custom:</strong> Role-specific permissions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Role Creation/Editing Modal */}
            {isRoleModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    {roleFormData.id ? 'Edit User Role' : 'Create New User Role'}
                                </h3>
                                <p className="text-xs text-slate-500">Define role details and initial template</p>
                            </div>
                            <button 
                                onClick={() => setIsRoleModalOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Role Name</label>
                                <input 
                                    type="text"
                                    value={roleFormData.name}
                                    onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                                    placeholder="e.g. Zoning Inspector"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none transition-all placeholder:text-slate-400 font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Description</label>
                                <textarea 
                                    value={roleFormData.description}
                                    onChange={(e) => setRoleFormData({...roleFormData, description: e.target.value})}
                                    placeholder="Briefly describe what this role does..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Initial Template (Optional)</label>
                                <div className="relative">
                                    <select
                                        value={roleFormData.templateId}
                                        onChange={(e) => setRoleFormData({...roleFormData, templateId: e.target.value})}
                                        className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none transition-all font-medium cursor-pointer"
                                    >
                                        <option value="null">No Template (Start with Empty)</option>
                                        {permissionTemplates.filter(t => t.active).map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">You can further customize specific permissions in the Matrix tab after creation.</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsRoleModalOpen(false)}
                                className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveRole}
                                className="px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-green-200 active:scale-95 transition-all"
                                style={{background: '#4D7833'}}
                            >
                                {roleFormData.id ? 'Update Role' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GranularPermissions;
