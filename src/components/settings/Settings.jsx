import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Save, User, Shield, Database, Trash2, Edit2, Plus, Search, UserPlus, Filter, X, ChevronDown, Check } from 'lucide-react';
import GranularPermissions from '../admin/GranularPermissions';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('compliance');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userFormData, setUserFormData] = useState({ id: null, name: '', email: '', role: 'Public User', status: 'Active' });
    const [showSuccess, setShowSuccess] = useState(false);

    // Compliance State
    const [autoMerge, setAutoMerge] = useState(true);
    const [fuzzyAddress, setFuzzyAddress] = useState(true);
    const [baseFine, setBaseFine] = useState(500);
    const [multiplier, setMultiplier] = useState('2x per offense');

    const [users, setUsers] = useState([
        { id: 1, name: 'Jane Doe', email: 'jane.doe@hawaiicounty.gov', role: 'System Administrator', status: 'Active' },
        { id: 2, name: 'John Smith', email: 'j.smith@hawaiicounty.gov', role: 'Compliance Officer', status: 'Active' },
        { id: 3, name: 'Keleka Akana', email: 'k.akana@hawaiicounty.gov', role: 'TVR Registration Clerk', status: 'Active' },
        { id: 4, name: 'Michael Wong', email: 'm.wong@hawaiicounty.gov', role: 'Finance Manager', status: 'Inactive' },
        { id: 5, name: 'Leilani Kapahu', email: 'l.kapahu@hawaiicounty.gov', role: 'Legal Counsel', status: 'Active' }
    ]);

    // Load from SessionStorage
    useEffect(() => {
        const savedCompliance = sessionStorage.getItem('complianceSettings');
        if (savedCompliance) {
            const parsed = JSON.parse(savedCompliance);
            setAutoMerge(parsed.autoMerge);
            setFuzzyAddress(parsed.fuzzyAddress);
            setBaseFine(parsed.baseFine);
            setMultiplier(parsed.multiplier);
        }
    }, []);

    const handleSaveCompliance = () => {
        const settings = { autoMerge, fuzzyAddress, baseFine, multiplier };
        sessionStorage.setItem('complianceSettings', JSON.stringify(settings));
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const rolesList = [
        'Public User',
        'TVR Registration Clerk',
        'Compliance Officer',
        'Finance Manager',
        'Legal Counsel',
        'System Administrator'
    ];

    const handleAddUser = () => {
        setUserFormData({ id: null, name: '', email: '', role: 'Public User', status: 'Active' });
        setIsUserModalOpen(true);
    };

    const handleEditUser = (user) => {
        setUserFormData({ ...user });
        setIsUserModalOpen(true);
    };

    const handleSaveUser = () => {
        if (!userFormData.name || !userFormData.email) {
            alert('Please fill in all required fields.');
            return;
        }

        if (userFormData.id === null) {
            // Add new
            const newUser = {
                ...userFormData,
                id: Math.max(...users.map(u => u.id), 0) + 1
            };
            setUsers([...users, newUser]);
        } else {
            // Update existing
            setUsers(users.map(u => u.id === userFormData.id ? userFormData : u));
        }
        setIsUserModalOpen(false);
    };

    const handleDeleteUser = (id) => {
        if(confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="max-w-6xl space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {activeTab === 'compliance' && 'Compliance Rules'}
                        {activeTab === 'users' && 'User Management'}
                        {activeTab === 'permissions' && 'Granular Permissions'}
                    </h1>
                    <p className="text-slate-500">
                        {activeTab === 'compliance' && 'Global configuration for compliance rules and ordinance logic.'}
                        {activeTab === 'users' && 'Manage system users, roles, and account status.'}
                        {activeTab === 'permissions' && 'Configure detailed access control and permission templates.'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {showSuccess && (
                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-right-2 duration-300">
                            <Check className="w-4 h-4" /> Settings Saved to Session
                        </span>
                    )}
                    {activeTab === 'compliance' && (
                        <button 
                            onClick={handleSaveCompliance}
                            className="px-6 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium shadow-sm transition-all active:scale-95"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Settings Layout */}
            <div className="flex flex-col md:flex-row gap-8">

                {/* Navigation Sidebar */}
                <div className="w-full md:w-64 space-y-1 flex-shrink-0">
                    <button 
                        onClick={() => setActiveTab('compliance')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                            activeTab === 'compliance' 
                            ? 'bg-hawaii-ocean/10 border-l-4 border-hawaii-ocean font-medium text-hawaii-ocean shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Shield className="w-5 h-5" /> Compliance Rules
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                            activeTab === 'users' 
                            ? 'bg-hawaii-ocean/10 border-l-4 border-hawaii-ocean font-medium text-hawaii-ocean shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <User className="w-5 h-5" /> User Management
                    </button>
                    <button 
                        onClick={() => setActiveTab('permissions')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                            activeTab === 'permissions' 
                            ? 'bg-hawaii-ocean/10 border-l-4 border-hawaii-ocean font-medium text-hawaii-ocean shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Database className="w-5 h-5" /> Permissions
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'compliance' && (
                        <div className="space-y-6">
                            {/* Section: Entity Resolution */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h2 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">Entity Resolution Logic</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                                        <div>
                                            <h3 className="font-medium text-slate-900">Auto-Merge Listings</h3>
                                            <p className="text-sm text-slate-500">Automatically merge properties with &gt;95% image similarity.</p>
                                        </div>
                                        <button onClick={() => setAutoMerge(!autoMerge)}>
                                            {autoMerge ? <ToggleRight className="w-10 h-10 text-hawaii-ocean" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-slate-900">Fuzzy Address Matching</h3>
                                            <p className="text-sm text-slate-500">Allow slight variations in address syntax.</p>
                                        </div>
                                        <button onClick={() => setFuzzyAddress(!fuzzyAddress)}>
                                            {fuzzyAddress ? <ToggleRight className="w-10 h-10 text-hawaii-ocean" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Smart Fining */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h2 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">Ordinance §19-7.2 Configuration</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Base Fine Amount ($)</label>
                                        <input 
                                            type="number" 
                                            value={baseFine} 
                                            onChange={(e) => setBaseFine(parseInt(e.target.value))}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Recidivism Multiplier</label>
                                        <select 
                                            value={multiplier}
                                            onChange={(e) => setMultiplier(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 bg-white"
                                        >
                                            <option>2x per offense</option>
                                            <option>3x per offense</option>
                                            <option>Progressive Scale</option>
                                        </select>
                                        <p className="text-xs text-slate-500 mt-2">Applies to repeat offenders within a 12-month period.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4 flex-wrap">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search users by name or email..." 
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                                        <Filter className="w-4 h-4" /> Filter
                                    </button>                                    <button 
                                        onClick={handleAddUser}
                                        className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 text-sm font-medium shadow-sm transition-all"
                                        style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                                    >
                                        <UserPlus className="w-4 h-4" /> Add User
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEditUser(user)}
                                                            className="p-2 text-slate-400 hover:text-hawaii-ocean hover:bg-hawaii-ocean/10 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
                            <GranularPermissions />
                        </div>
                    )}
                </div>

                {/* User Modal */}
                {isUserModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {userFormData.id ? 'Edit User' : 'Add New User'}
                                    </h3>
                                    <p className="text-xs text-slate-500">Configure account details and access</p>
                                </div>
                                <button 
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                                    <input 
                                        type="text"
                                        value={userFormData.name}
                                        onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none transition-all font-medium"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                                    <input 
                                        type="email"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none transition-all font-medium"
                                        placeholder="name@hawaiicounty.gov"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Role</label>
                                        <div className="relative">
                                            <select
                                                value={userFormData.role}
                                                onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                                                className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none font-medium cursor-pointer"
                                            >
                                                {rolesList.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Status</label>
                                        <div className="relative">
                                            <select
                                                value={userFormData.status}
                                                onChange={(e) => setUserFormData({...userFormData, status: e.target.value})}
                                                className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean outline-none font-medium cursor-pointer"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                            <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveUser}
                                    className="px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95"
                                    style={{background: '#4D7833'}}
                                >
                                    {userFormData.id ? 'Save Changes' : 'Add User'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;

