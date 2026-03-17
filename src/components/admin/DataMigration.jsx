import React, { useState } from 'react';
import { Database, Upload, Download, CheckCircle, AlertCircle, FileText, Users, Calendar, MapPin, ShieldCheck, Clock, Settings, Play, Pause, RotateCcw, ArrowRight, Info } from 'lucide-react';

const DataMigration = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, running, completed, error
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [migrationProgress, setMigrationProgress] = useState(0);
    const [migrationLogs, setMigrationLogs] = useState([]);
    
    // Form states for different data types
    const [tvrData, setTvrData] = useState({
        sourceSystem: 'EPIC',
        exportDate: '',
        totalRecords: 0,
        dataFormat: 'CSV',
        validationRules: 'strict'
    });
    
    const [propertyData, setPropertyData] = useState({
        sourceSystem: 'EPIC',
        exportDate: '',
        totalRecords: 0,
        includeHistorical: true,
        addressValidation: true
    });
    
    const [ownerData, setOwnerData] = useState({
        sourceSystem: 'EPIC',
        exportDate: '',
        totalRecords: 0,
        contactVerification: true,
        duplicateCheck: true
    });

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'upload', label: 'Data Upload', icon: Upload },
        { id: 'mapping', label: 'Field Mapping', icon: Settings },
        { id: 'validation', label: 'Validation', icon: CheckCircle },
        { id: 'monitoring', label: 'Monitoring', icon: Clock },
    ];

    const handleFileUpload = (event, dataType) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prev => [...prev, ...files.map(file => ({...file, dataType}))]);
    };

    const startMigration = () => {
        setMigrationStatus('running');
        setMigrationProgress(0);
        setMigrationLogs([]);
        
        // Simulate migration process
        const interval = setInterval(() => {
            setMigrationProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setMigrationStatus('completed');
                    setMigrationLogs(prev => [...prev, 
                        { timestamp: new Date().toISOString(), type: 'success', message: 'Migration completed successfully!' },
                        { timestamp: new Date().toISOString(), type: 'info', message: `Processed ${tvrData.totalRecords + propertyData.totalRecords + ownerData.totalRecords} total records` }
                    ]);
                    return 100;
                }
                
                // Add progress logs
                if (prev % 20 === 0) {
                    setMigrationLogs(logs => [...logs, 
                        { timestamp: new Date().toISOString(), type: 'info', message: `Processing... ${prev}% complete` }
                    ]);
                }
                
                return prev + 10;
            });
        }, 1000);
    };

    const pauseMigration = () => {
        setMigrationStatus('paused');
        setMigrationLogs(prev => [...prev, 
            { timestamp: new Date().toISOString(), type: 'warning', message: 'Migration paused by user' }
        ]);
    };

    const resetMigration = () => {
        setMigrationStatus('idle');
        setMigrationProgress(0);
        setMigrationLogs([]);
        setSelectedFiles([]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Data Migration</h1>
                <p className="text-slate-600">Migrate TVR data from EPIC system to the new compliance dashboard</p>
            </div>

            {/* Migration Status Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${
                migrationStatus === 'running' ? 'bg-blue-50 border-blue-200' :
                migrationStatus === 'completed' ? 'bg-green-50 border-green-200' :
                migrationStatus === 'error' ? 'bg-red-50 border-red-200' :
                migrationStatus === 'paused' ? 'bg-amber-50 border-amber-200' :
                'bg-slate-50 border-slate-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {migrationStatus === 'running' && <Play className="w-5 h-5 text-blue-600" />}
                        {migrationStatus === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {migrationStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                        {migrationStatus === 'paused' && <Pause className="w-5 h-5 text-amber-600" />}
                        {migrationStatus === 'idle' && <Database className="w-5 h-5 text-slate-600" />}
                        <div>
                            <p className="font-medium text-slate-800">
                                Status: {migrationStatus.charAt(0).toUpperCase() + migrationStatus.slice(1)}
                            </p>
                            {migrationStatus === 'running' && (
                                <p className="text-sm text-slate-600">Migration in progress...</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {migrationStatus === 'running' && (
                            <button
                                onClick={pauseMigration}
                                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                            >
                                Pause
                            </button>
                        )}
                        {(migrationStatus === 'completed' || migrationStatus === 'error' || migrationStatus === 'paused') && (
                            <button
                                onClick={resetMigration}
                                className="px-3 py-1 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Progress Bar */}
                {migrationStatus === 'running' && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>{migrationProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${migrationProgress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'border-hawaii-ocean text-hawaii-ocean'
                                    : 'border-transparent text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900">Migration Overview</h3>
                                <p className="text-blue-800 mt-1">
                                    The County of Hawaii is migrating TVR registration data from the legacy EPIC system to the new compliance dashboard. 
                                    This migration involves transferring approximately 50,000 records across multiple data categories while ensuring data integrity, 
                                    security, and compliance with County regulations.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Database className="w-8 h-8 text-blue-600" />
                                <span className="text-2xl font-bold text-slate-800">50K+</span>
                            </div>
                            <h4 className="font-semibold text-slate-800">Total Records</h4>
                            <p className="text-sm text-slate-600 mt-1">Across all data categories</p>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8 text-green-600" />
                                <span className="text-2xl font-bold text-slate-800">2,847</span>
                            </div>
                            <h4 className="font-semibold text-slate-800">Properties</h4>
                            <p className="text-sm text-slate-600 mt-1">TVR properties to migrate</p>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Clock className="w-8 h-8 text-purple-600" />
                                <span className="text-2xl font-bold text-slate-800">12 weeks</span>
                            </div>
                            <h4 className="font-semibold text-slate-800">Migration Duration</h4>
                            <p className="text-sm text-slate-600 mt-1">From planning to go-live</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Migration Goals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">Zero Data Loss</h4>
                                    <p className="text-sm text-slate-600">Ensure all records are transferred without loss or corruption</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">Data Integrity</h4>
                                    <p className="text-sm text-slate-600">Maintain referential integrity and business rules</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">Minimal Downtime</h4>
                                    <p className="text-sm text-slate-600">Limit system disruption during migration</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-slate-800">Security Compliance</h4>
                                    <p className="text-sm text-slate-600">Maintain PII protection and access controls</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-800">2,847</div>
                                <div className="text-sm text-slate-600">TVR Registrations</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-800">1,934</div>
                                <div className="text-sm text-slate-600">Active Properties</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-800">3,421</div>
                                <div className="text-sm text-slate-600">Property Owners</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-800">45K+</div>
                                <div className="text-sm text-slate-600">Historical Records</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Migration Progress</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>Planning & Assessment</span>
                                    <span className="text-green-600">Completed</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>System Preparation</span>
                                    <span className="text-green-600">Completed</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>Data Extraction</span>
                                    <span className="text-green-600">Completed</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>Data Transformation</span>
                                    <span className="text-blue-600">In Progress</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>Validation & Testing</span>
                                    <span className="text-slate-400">Pending</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>Go-Live</span>
                                    <span className="text-slate-400">Pending</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Upload Tab */}
            {activeTab === 'upload' && (
                <div className="space-y-6">
                    {/* TVR Registration Data */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            TVR Registration Data
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Source System</label>
                                <select
                                    value={tvrData.sourceSystem}
                                    onChange={(e) => setTvrData({...tvrData, sourceSystem: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                >
                                    <option value="EPIC">EPIC System</option>
                                    <option value="LEGACY">Legacy System</option>
                                    <option value="MANUAL">Manual Entry</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Export Date</label>
                                <input
                                    type="date"
                                    value={tvrData.exportDate}
                                    onChange={(e) => setTvrData({...tvrData, exportDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Expected Records</label>
                                <input
                                    type="number"
                                    value={tvrData.totalRecords}
                                    onChange={(e) => setTvrData({...tvrData, totalRecords: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                    placeholder="Number of records"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Data Format</label>
                                <select
                                    value={tvrData.dataFormat}
                                    onChange={(e) => setTvrData({...tvrData, dataFormat: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                >
                                    <option value="CSV">CSV</option>
                                    <option value="JSON">JSON</option>
                                    <option value="XML">XML</option>
                                    <option value="XLSX">Excel</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-hawaii-ocean transition-colors">
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 mb-2">Drop TVR data file here or click to browse</p>
                                <input
                                    type="file"
                                    accept=".csv,.json,.xml,.xlsx"
                                    onChange={(e) => handleFileUpload(e, 'tvr')}
                                    className="hidden"
                                    id="tvr-file-upload"
                                />
                                <label
                                    htmlFor="tvr-file-upload"
                                    className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg cursor-pointer hover:bg-blue-700 text-sm"
                                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                                >
                                    Select File
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Property Data */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Property Data
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Source System</label>
                                <select
                                    value={propertyData.sourceSystem}
                                    onChange={(e) => setPropertyData({...propertyData, sourceSystem: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                >
                                    <option value="EPIC">EPIC System</option>
                                    <option value="GIS">GIS System</option>
                                    <option value="TAX">Tax Records</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Export Date</label>
                                <input
                                    type="date"
                                    value={propertyData.exportDate}
                                    onChange={(e) => setPropertyData({...propertyData, exportDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Expected Records</label>
                                <input
                                    type="number"
                                    value={propertyData.totalRecords}
                                    onChange={(e) => setPropertyData({...propertyData, totalRecords: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                    placeholder="Number of properties"
                                />
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={propertyData.includeHistorical}
                                        onChange={(e) => setPropertyData({...propertyData, includeHistorical: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-slate-700">Include Historical</span>
                                </label>
                                
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={propertyData.addressValidation}
                                        onChange={(e) => setPropertyData({...propertyData, addressValidation: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-slate-700">Address Validation</span>
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-hawaii-ocean transition-colors">
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 mb-2">Drop property data file here or click to browse</p>
                                <input
                                    type="file"
                                    accept=".csv,.json,.xml,.xlsx"
                                    onChange={(e) => handleFileUpload(e, 'property')}
                                    className="hidden"
                                    id="property-file-upload"
                                />
                                <label
                                    htmlFor="property-file-upload"
                                    className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg cursor-pointer hover:bg-blue-700 text-sm"
                                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                                >
                                    Select File
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Owner Data */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Owner Data
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Source System</label>
                                <select
                                    value={ownerData.sourceSystem}
                                    onChange={(e) => setOwnerData({...ownerData, sourceSystem: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                >
                                    <option value="EPIC">EPIC System</option>
                                    <option value="CRM">CRM System</option>
                                    <option value="MANUAL">Manual Entry</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Export Date</label>
                                <input
                                    type="date"
                                    value={ownerData.exportDate}
                                    onChange={(e) => setOwnerData({...ownerData, exportDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Expected Records</label>
                                <input
                                    type="number"
                                    value={ownerData.totalRecords}
                                    onChange={(e) => setOwnerData({...ownerData, totalRecords: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean"
                                    placeholder="Number of owners"
                                />
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={ownerData.contactVerification}
                                        onChange={(e) => setOwnerData({...ownerData, contactVerification: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-slate-700">Contact Verification</span>
                                </label>
                                
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={ownerData.duplicateCheck}
                                        onChange={(e) => setOwnerData({...ownerData, duplicateCheck: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-slate-700">Duplicate Check</span>
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-hawaii-ocean transition-colors">
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 mb-2">Drop owner data file here or click to browse</p>
                                <input
                                    type="file"
                                    accept=".csv,.json,.xml,.xlsx"
                                    onChange={(e) => handleFileUpload(e, 'owner')}
                                    className="hidden"
                                    id="owner-file-upload"
                                />
                                <label
                                    htmlFor="owner-file-upload"
                                    className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg cursor-pointer hover:bg-blue-700 text-sm"
                                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                                >
                                    Select File
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Uploaded Files Summary */}
                    {selectedFiles.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Uploaded Files</h3>
                            <div className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-slate-600" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{file.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {file.dataType} • {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setSelectedFiles([])}
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={startMigration}
                            disabled={selectedFiles.length === 0 || migrationStatus === 'running'}
                            className="px-6 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}
                        >
                            Start Migration
                        </button>
                    </div>
                </div>
            )}

            {/* Field Mapping Tab */}
            {activeTab === 'mapping' && (
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Field Mapping Configuration</h3>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Source Field</label>
                                    <input
                                        type="text"
                                        defaultValue="PROPERTY_ID"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Field</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                        <option>propertyId</option>
                                        <option>registrationId</option>
                                        <option>parcelId</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Source Field</label>
                                    <input
                                        type="text"
                                        defaultValue="OWNER_NAME"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Field</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                        <option>ownerName</option>
                                        <option>contactName</option>
                                        <option>legalOwner</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Source Field</label>
                                    <input
                                        type="text"
                                        defaultValue="REGISTRATION_DATE"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Field</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                        <option>registrationDate</option>
                                        <option>createdDate</option>
                                        <option>effectiveDate</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-700"
                                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                                Save Mapping
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Tab */}
            {activeTab === 'validation' && (
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Validation Rules</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-slate-800">Required Field Validation</h4>
                                    <p className="text-sm text-slate-600">Ensure all required fields are present and not empty</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-slate-800">Data Format Validation</h4>
                                    <p className="text-sm text-slate-600">Validate data formats (dates, numbers, emails)</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-slate-800">Duplicate Detection</h4>
                                    <p className="text-sm text-slate-600">Identify and flag duplicate records</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Monitoring Tab */}
            {activeTab === 'monitoring' && (
                <div className="space-y-6">
                    {/* Data Source Configuration */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Source Configuration</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="w-5 h-5 text-blue-600" />
                                    <h4 className="font-medium text-slate-800">Real-time API</h4>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">Live data from migration backend API</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Endpoint:</span>
                                        <span className="font-mono">/api/migration/status</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Update Frequency:</span>
                                        <span>Real-time (WebSocket)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Latency:</span>
                                        <span className="text-green-600">&lt;100ms</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                    <h4 className="font-medium text-slate-800">Nightly Batch Job</h4>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">Scheduled data aggregation and reporting</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Schedule:</span>
                                        <span>Daily 2:00 AM HST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Processing Time:</span>
                                        <span>~15 minutes</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Last Run:</span>
                                        <span>Today 2:17 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-800">
                                    Currently using: <strong>Real-time API</strong> for live migration monitoring
                                </span>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                                Switch to Batch Mode
                            </button>
                        </div>
                    </div>

                    {/* Migration Logs */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Migration Logs</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Live Feed
                            </div>
                        </div>
                        
                        {migrationLogs.length > 0 ? (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {migrationLogs.map((log, index) => (
                                    <div key={index} className={`p-3 rounded-lg text-sm ${
                                        log.type === 'success' ? 'bg-green-50 text-green-800' :
                                        log.type === 'error' ? 'bg-red-50 text-red-800' :
                                        log.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                                        'bg-blue-50 text-blue-800'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            {log.type === 'success' && <CheckCircle className="w-4 h-4" />}
                                            {log.type === 'error' && <AlertCircle className="w-4 h-4" />}
                                            {log.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                                            {log.type === 'info' && <Info className="w-4 h-4" />}
                                            <span className="font-medium">{log.message}</span>
                                            <span className="text-xs opacity-75">• API</span>
                                        </div>
                                        <div className="text-xs opacity-75 mt-1">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No migration logs available</p>
                                <p className="text-sm">Start a migration to see real-time logs</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Migration Statistics */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Migration Statistics</h3>
                            <div className="text-xs text-slate-500">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-800">
                                    {tvrData.totalRecords + propertyData.totalRecords + ownerData.totalRecords}
                                </div>
                                <div className="text-sm text-slate-600">Total Records</div>
                                <div className="text-xs text-slate-500 mt-1">From API</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-800">
                                    {Math.floor((tvrData.totalRecords + propertyData.totalRecords + ownerData.totalRecords) * 0.95)}
                                </div>
                                <div className="text-sm text-green-600">Successfully Migrated</div>
                                <div className="text-xs text-green-500 mt-1">Live Data</div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 rounded-lg">
                                <div className="text-2xl font-bold text-amber-800">
                                    {Math.floor((tvrData.totalRecords + propertyData.totalRecords + ownerData.totalRecords) * 0.05)}
                                </div>
                                <div className="text-sm text-amber-600">Need Review</div>
                                <div className="text-xs text-amber-500 mt-1">API Count</div>
                            </div>
                        </div>
                    </div>

                    {/* Data Source Details */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Source Implementation Details</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-medium text-slate-800 mb-2">Real-time API Approach</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• WebSocket connection to migration backend for live updates</li>
                                    <li>• REST API calls every 5 seconds for status updates</li>
                                    <li>• Immediate log updates as migration progresses</li>
                                    <li>• Real-time statistics and progress tracking</li>
                                    <li>• Best for: Active migration monitoring</li>
                                </ul>
                            </div>
                            
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-medium text-slate-800 mb-2">Nightly Batch Job Approach</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Scheduled cron job runs daily at 2:00 AM HST</li>
                                    <li>• Aggregates migration data from database logs</li>
                                    <li>• Generates daily summary reports</li>
                                    <li>• Updates statistics tables for dashboard</li>
                                    <li>• Best for: Historical reporting and trends</li>
                                </ul>
                            </div>
                            
                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-medium text-slate-800 mb-2">Hybrid Approach (Recommended)</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Real-time API for active migration monitoring</li>
                                    <li>• Nightly batch for historical data aggregation</li>
                                    <li>• Caching layer for performance optimization</li>
                                    <li>• Fallback to batch data if API unavailable</li>
                                    <li>• Best for: Complete monitoring solution</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* API Status */}
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">API Connection Status</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-800">Migration API</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="text-xs text-green-600 mt-1">Connected • 45ms latency</div>
                            </div>
                            
                            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-800">WebSocket Feed</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="text-xs text-green-600 mt-1">Active • Live updates</div>
                            </div>
                            
                            <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-800">Database</span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="text-xs text-green-600 mt-1">Connected • 12ms query time</div>
                            </div>
                            
                            <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-amber-800">Batch Processor</span>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                </div>
                                <div className="text-xs text-amber-600 mt-1">Idle • Next run: 2:00 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataMigration;
