import React, { useState } from 'react';
import { Database, ArrowRight, CheckCircle, AlertCircle, Info, Download, Upload, ShieldCheck, Clock, Users, FileText, Server, Cloud, RefreshCw } from 'lucide-react';

const DataMigrationExplanation = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'process', label: 'Migration Process', icon: RefreshCw },
        { id: 'storage', label: 'Data Storage', icon: Server },
        { id: 'validation', label: 'Data Validation', icon: CheckCircle },
        { id: 'timeline', label: 'Timeline', icon: Clock },
    ];

    const migrationSteps = [
        {
            id: 1,
            title: 'EPIC Data Extraction',
            description: 'Extract all TVR registration data from the legacy EPIC system',
            status: 'completed',
            duration: '2 weeks',
            dataPoints: ['2,847 properties', '1,934 active TVRs', '5 years of historical data'],
            risks: ['Data format inconsistencies', 'Missing fields', 'Duplicate records'],
            mitigation: ['Automated data mapping', 'Manual review process', 'Deduplication algorithms']
        },
        {
            id: 2,
            title: 'Data Cleaning & Transformation',
            description: 'Clean and transform data to match new system schema',
            status: 'in-progress',
            duration: '3 weeks',
            dataPoints: ['Address standardization', 'Contact validation', 'License verification'],
            risks: ['Data loss during transformation', 'Incorrect mapping', 'Performance issues'],
            mitigation: ['Incremental processing', 'Rollback procedures', 'Performance monitoring']
        },
        {
            id: 3,
            title: 'Data Validation & Testing',
            description: 'Comprehensive validation of migrated data',
            status: 'pending',
            duration: '2 weeks',
            dataPoints: ['Data integrity checks', 'Business rule validation', 'User acceptance testing'],
            risks: ['Validation failures', 'User rejection', 'Timeline delays'],
            mitigation: ['Parallel validation', 'User training', 'Contingency planning']
        },
        {
            id: 4,
            title: 'Go-Live & Cutover',
            description: 'Final migration and system cutover',
            status: 'pending',
            duration: '1 week',
            dataPoints: ['Final data sync', 'System cutover', 'Post-migration support'],
            risks: ['System downtime', 'Data corruption', 'User disruption'],
            mitigation: ['Rollback procedures', '24/7 support', 'Gradual cutover']
        }
    ];

    const dataCategories = [
        {
            category: 'Property Information',
            records: 2847,
            fields: ['Property ID', 'Address', 'Type', 'Size', 'Amenities', 'Photos'],
            validation: ['Address verification', 'Type classification', 'Photo quality check'],
            storage: 'Primary database with geographic indexing'
        },
        {
            category: 'Owner Information',
            records: 2156,
            fields: ['Owner ID', 'Name', 'Contact', 'Address', 'Business details'],
            validation: ['Contact verification', 'Business license check', 'Address validation'],
            storage: 'Secure encrypted database with PII protection'
        },
        {
            category: 'Registration History',
            records: 12456,
            fields: ['Registration ID', 'Date', 'Status', 'Fees', 'Documents'],
            validation: ['Date consistency', 'Status verification', 'Fee calculation'],
            storage: 'Time-series database with audit trail'
        },
        {
            category: 'Compliance Records',
            records: 8934,
            fields: ['Violation ID', 'Date', 'Type', 'Status', 'Actions'],
            validation: ['Date accuracy', 'Type classification', 'Status tracking'],
            storage: 'Compliance database with workflow tracking'
        },
        {
            category: 'Financial Records',
            records: 15678,
            fields: ['Payment ID', 'Date', 'Amount', 'Method', 'Status'],
            validation: ['Amount verification', 'Date consistency', 'Status tracking'],
            storage: 'Financial database with transaction logging'
        }
    ];

    const validationRules = [
        {
            rule: 'Data Completeness',
            description: 'All required fields must be present and populated',
            check: 'NULL value validation',
            threshold: '100% completeness',
            status: 'pass'
        },
        {
            rule: 'Data Consistency',
            description: 'Related data must be consistent across tables',
            check: 'Referential integrity validation',
            threshold: '99.5% consistency',
            status: 'pass'
        },
        {
            rule: 'Data Accuracy',
            description: 'Data must match external verification sources',
            check: 'Third-party API validation',
            threshold: '95% accuracy',
            status: 'warning'
        },
        {
            rule: 'Data Uniqueness',
            description: 'No duplicate records should exist',
            check: 'Duplicate detection algorithms',
            threshold: '100% uniqueness',
            status: 'pass'
        },
        {
            rule: 'Data Format',
            description: 'Data must conform to specified formats',
            check: 'Format validation rules',
            threshold: '98% format compliance',
            status: 'pass'
        }
    ];

    const timeline = [
        {
            phase: 'Planning & Assessment',
            start: '2024-01-15',
            end: '2024-02-15',
            status: 'completed',
            deliverables: ['Migration strategy', 'Risk assessment', 'Resource allocation'],
            team: ['Project Manager', 'Data Architect', 'DBA']
        },
        {
            phase: 'System Preparation',
            start: '2024-02-16',
            end: '2024-03-15',
            status: 'completed',
            deliverables: ['Database setup', 'Migration tools', 'Testing environment'],
            team: ['DBA', 'DevOps', 'QA Engineer']
        },
        {
            phase: 'Data Extraction',
            start: '2024-03-16',
            end: '2024-03-30',
            status: 'completed',
            deliverables: ['EPIC data export', 'Initial data mapping', 'Quality assessment'],
            team: ['Data Engineer', 'Business Analyst']
        },
        {
            phase: 'Data Transformation',
            start: '2024-03-31',
            end: '2024-04-20',
            status: 'in-progress',
            deliverables: ['Data cleaning', 'Format conversion', 'Schema mapping'],
            team: ['Data Engineer', 'Developer']
        },
        {
            phase: 'Validation & Testing',
            start: '2024-04-21',
            end: '2024-05-05',
            status: 'pending',
            deliverables: ['Data validation', 'User testing', 'Performance testing'],
            team: ['QA Engineer', 'Business Analyst', 'Users']
        },
        {
            phase: 'Go-Live',
            start: '2024-05-06',
            end: '2024-05-12',
            status: 'pending',
            deliverables: ['Final migration', 'System cutover', 'Post-migration support'],
            team: ['All teams']
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
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
                    </div>
                );

            case 'process':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Migration Process Steps</h3>
                        
                        {migrationSteps.map((step, index) => (
                            <div key={step.id} className="bg-white border border-slate-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            step.status === 'completed' ? 'bg-green-100 text-green-600' :
                                            step.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : step.id}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">{step.title}</h4>
                                            <p className="text-slate-600 mt-1">{step.description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-sm text-slate-500">Duration: {step.duration}</span>
                                                <span className={`text-sm px-2 py-1 rounded ${
                                                    step.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {step.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {index < migrationSteps.length - 1 && (
                                        <ArrowRight className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <h5 className="font-medium text-slate-700 mb-2">Data Points</h5>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {step.dataPoints.map((point, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-hawaii-ocean">•</span>
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h5 className="font-medium text-slate-700 mb-2">Risks</h5>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {step.risks.map((risk, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <AlertCircle className="w-3 h-3 text-red-500 mt-0.5" />
                                                    {risk}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h5 className="font-medium text-slate-700 mb-2">Mitigation</h5>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {step.mitigation.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'storage':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Data Storage Architecture</h3>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Server className="w-6 h-6 text-blue-600" />
                                <h4 className="font-semibold text-slate-800">Primary Database</h4>
                            </div>
                            <p className="text-slate-600 mb-4">
                                All migrated data will be stored in a secure, cloud-based PostgreSQL database with the following characteristics:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h5 className="font-medium text-slate-800 mb-2">Security Features</h5>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• AES-256 encryption at rest</li>
                                        <li>• TLS 1.3 encryption in transit</li>
                                        <li>• Role-based access control</li>
                                        <li>• PII data masking</li>
                                        <li>• Regular security audits</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h5 className="font-medium text-slate-800 mb-2">Performance Features</h5>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• Automatic indexing</li>
                                        <li>• Query optimization</li>
                                        <li>• Connection pooling</li>
                                        <li>• Read replicas for reporting</li>
                                        <li>• Automatic scaling</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Cloud className="w-6 h-6 text-purple-600" />
                                <h4 className="font-semibold text-slate-800">Backup & Recovery</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="font-medium text-slate-700 mb-2">Backup Strategy</h5>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• Hourly incremental backups</li>
                                        <li>• Daily full backups</li>
                                        <li>• 30-day retention period</li>
                                        <li>• Geographic redundancy</li>
                                        <li>• Automated backup verification</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium text-slate-700 mb-2">Recovery Options</h5>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• Point-in-time recovery</li>
                                        <li>• Database cloning</li>
                                        <li>• Cross-region failover</li>
                                        <li>• RTO: 4 hours</li>
                                        <li>• RPO: 1 hour</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-800">Data Categories</h4>
                            {dataCategories.map((category) => (
                                <div key={category.category} className="bg-white border border-slate-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-medium text-slate-800">{category.category}</h5>
                                        <span className="text-sm text-slate-600">{category.records.toLocaleString()} records</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h6 className="text-sm font-medium text-slate-700 mb-1">Fields</h6>
                                            <div className="flex flex-wrap gap-1">
                                                {category.fields.map((field) => (
                                                    <span key={field} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                                        {field}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-medium text-slate-700 mb-1">Validation</h6>
                                            <div className="flex flex-wrap gap-1">
                                                {category.validation.map((item) => (
                                                    <span key={item} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-medium text-slate-700 mb-1">Storage</h6>
                                            <p className="text-xs text-slate-600">{category.storage}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'validation':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Data Validation Process</h3>
                        
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                                <h4 className="font-semibold text-slate-800">Validation Rules</h4>
                            </div>
                            <div className="space-y-4">
                                {validationRules.map((rule) => (
                                    <div key={rule.rule} className="border border-slate-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-slate-800">{rule.rule}</h5>
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                rule.status === 'pass' ? 'bg-green-100 text-green-800' :
                                                rule.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {rule.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{rule.description}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-slate-700">Check: </span>
                                                <span className="text-slate-600">{rule.check}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-slate-700">Threshold: </span>
                                                <span className="text-slate-600">{rule.threshold}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-slate-700">Status: </span>
                                                <span className={`${
                                                    rule.status === 'pass' ? 'text-green-600' :
                                                    rule.status === 'warning' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>{rule.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h4 className="font-semibold text-slate-800 mb-4">Validation Metrics</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-2xl font-bold text-green-600">98.7%</span>
                                    </div>
                                    <h5 className="font-medium text-green-800">Data Quality</h5>
                                    <p className="text-sm text-green-700 mt-1">Overall quality score</p>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Database className="w-5 h-5 text-blue-600" />
                                        <span className="text-2xl font-bold text-blue-600">49,832</span>
                                    </div>
                                    <h5 className="font-medium text-blue-800">Valid Records</h5>
                                    <p className="text-sm text-blue-700 mt-1">Passed validation</p>
                                </div>
                                
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                        <span className="text-2xl font-bold text-yellow-600">168</span>
                                    </div>
                                    <h5 className="font-medium text-yellow-800">Warnings</h5>
                                    <p className="text-sm text-yellow-700 mt-1">Require review</p>
                                </div>
                                
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-2xl font-bold text-red-600">12</span>
                                    </div>
                                    <h5 className="font-medium text-red-800">Errors</h5>
                                    <p className="text-sm text-red-700 mt-1">Require correction</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <h4 className="font-semibold text-slate-800 mb-4">Validation Tools</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-slate-200 rounded-lg p-4">
                                    <h5 className="font-medium text-slate-800 mb-2">Automated Validation</h5>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• Schema validation scripts</li>
                                        <li>• Data quality checks</li>
                                        <li>• Business rule validation</li>
                                        <li>• Performance monitoring</li>
                                        <li>• Continuous integration testing</li>
                                    </ul>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-4">
                                    <h5 className="font-medium text-slate-800 mb-2">Manual Review</h5>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• Data sample verification</li>
                                        <li>• User acceptance testing</li>
                                        <li>• Business process validation</li>
                                        <li>• Compliance audit</li>
                                        <li>• Stakeholder review</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'timeline':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800">Migration Timeline</h3>
                        
                        <div className="space-y-4">
                            {timeline.map((phase, index) => (
                                <div key={phase.phase} className="bg-white border border-slate-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                phase.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {phase.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800">{phase.phase}</h4>
                                                <p className="text-slate-600 mt-1">
                                                    {new Date(phase.start).toLocaleDateString()} - {new Date(phase.end).toLocaleDateString()}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`text-sm px-2 py-1 rounded ${
                                                        phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {phase.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {index < timeline.length - 1 && (
                                            <ArrowRight className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h5 className="font-medium text-slate-700 mb-2">Deliverables</h5>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                {phase.deliverables.map((deliverable) => (
                                                    <li key={deliverable} className="flex items-start gap-2">
                                                        <FileText className="w-3 h-3 text-hawaii-ocean mt-0.5" />
                                                        {deliverable}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-slate-700 mb-2">Team Members</h5>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                {phase.team.map((member) => (
                                                    <li key={member} className="flex items-start gap-2">
                                                        <Users className="w-3 h-3 text-blue-500 mt-0.5" />
                                                        {member}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-slate-700 mb-2">Duration</h5>
                                            <p className="text-sm text-slate-600">
                                                {Math.ceil((new Date(phase.end) - new Date(phase.start)) / (1000 * 60 * 60 * 24))} days
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900">Critical Path</h4>
                                    <p className="text-blue-800 mt-1">
                                        The migration follows a critical path approach with dependencies between phases. 
                                        Any delays in the Data Transformation phase will impact the subsequent Validation & Testing phase.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Data Migration Explanation</h1>
                <p className="text-slate-600">Comprehensive overview of EPIC data migration to the new compliance dashboard</p>
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
                {renderTabContent()}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Migration Plan
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                    <Upload className="w-4 h-4" />
                    Request Migration Status
                </button>
            </div>
        </div>
    );
};

export default DataMigrationExplanation;
