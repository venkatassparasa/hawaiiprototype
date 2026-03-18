import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, Calendar, FileText, TrendingUp, DollarSign, AlertTriangle, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { useRef } from 'react';

const Reports = () => {
    const [showCaseModal, setShowCaseModal] = useState(false);
    const [newCase, setNewCase] = useState({
        propertyAddress: '',
        ownerName: '',
        violationType: 'Non-Compliance',
        severity: 'medium',
        description: '',
        source: 'compliance-report'
    });

    const complianceData = [
        { name: 'Aug', compliant: 2000, nonCompliant: 400 },
        { name: 'Sep', compliant: 2100, nonCompliant: 350 },
        { name: 'Oct', compliant: 2200, nonCompliant: 300 },
        { name: 'Nov', compliant: 2350, nonCompliant: 280 },
        { name: 'Dec', compliant: 2500, nonCompliant: 200 },
        { name: 'Jan', compliant: 2800, nonCompliant: 150 },
    ];

    const [activeReport, setActiveReport] = useState(null);
    const [showReportDetail, setShowReportDetail] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const reportsRef = useRef(null);

    const handleGenerateReport = (reportType) => {
        setActiveReport(reportType);
        setShowReportDetail(true);
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        
        // Wait for state update and rendering
        setTimeout(async () => {
            try {
                const zip = new JSZip();
                const timestamp = new Date().toISOString().split('T')[0];
                const folderName = `Hawaii_County_Compliance_Reports_${timestamp}`;
                
                // Helper to capture a section by ID and return PDF blob
                const captureToPDF = async (elementId, filename, isLandscape = true) => {
                    const element = document.getElementById(elementId);
                    if (!element) return null;
                    
                    const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#f8fafc',
                        windowWidth: 1600
                    });
                    
                    const imgData = canvas.toDataURL('image/png');
                    const orientation = isLandscape ? 'l' : 'p';
                    const pdf = new jsPDF(orientation, 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    
                    // Center and add first page
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    
                    // Handle overflow if any (though each report is designed to fit)
                    let remainingHeight = pdfHeight - pdf.internal.pageSize.getHeight();
                    let currentPosition = -pdf.internal.pageSize.getHeight();
                    
                    while (remainingHeight > 0) {
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, currentPosition, pdfWidth, pdfHeight);
                        remainingHeight -= pdf.internal.pageSize.getHeight();
                        currentPosition -= pdf.internal.pageSize.getHeight();
                    }
                    
                    return pdf.output('blob');
                };

                // 1. Capture Dashboard Overview
                const overviewBlob = await captureToPDF('pdf-dashboard-reports', 'Hawaii_Compliance_Overview.pdf');
                if (overviewBlob) zip.file('01_Hawaii_Compliance_Overview.pdf', overviewBlob);

                // 2. Capture Each Standard Report
                const reportTypes = ['region', 'type', 'tat', 'enforcement', 'trends', 'revenue'];
                const reportNames = {
                    region: 'Regional_Compliance_Detail',
                    type: 'Property_Type_Analysis',
                    tat: 'TAT_Revenue_Audit',
                    enforcement: 'Enforcement_Efficiency',
                    trends: 'Compliance_Velocity',
                    revenue: 'Economic_Impact'
                };

                for (let i = 0; i < reportTypes.length; i++) {
                    const type = reportTypes[i];
                    const blob = await captureToPDF(`pdf-report-${type}`, `${reportNames[type]}.pdf`);
                    if (blob) zip.file(`${String(i + 2).padStart(2, '0')}_${reportNames[type]}.pdf`, blob);
                }

                const content = await zip.generateAsync({ type: 'blob' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${folderName}.zip`;
                link.click();

            } catch (error) {
                console.error('Error generating ZIP of PDFs:', error);
                alert('Failed to generate report package. Please try again.');
            } finally {
                setIsExporting(false);
            }
        }, 800);
    };

    const handleExportAll = async () => {
        const zip = new JSZip();
        
        const reportsData = {
            'Regional_Compliance.csv': [
                { District: 'Hilo', Cases: 245, Compliance: '92.4%' },
                { District: 'Kona', Cases: 189, Compliance: '88.1%' },
                { District: 'Puna', Cases: 127, Compliance: '94.2%' },
                { District: 'Kohala', Cases: 203, Compliance: '90.5%' },
                { District: 'Hamakua', Cases: 92, Compliance: '95.8%' }
            ],
            'Property_Type_Analysis.csv': [
                { Type: 'Single Family', Units: 342, Impact: '6.8/10' },
                { Type: 'Condo/Apt', Units: 278, Impact: '7.2/10' },
                { Type: 'Vacation Home', Units: 156, Impact: '8.4/10' },
                { Type: 'Other', Units: 89, Impact: '5.5/10' }
            ],
            'TAT_Payment_Status.csv': [
                { Status: 'Paid & Current', Volume: 423, Revenue: '$567.8K' },
                { Status: 'Late Payment', Volume: 87, Revenue: '$34.2K' },
                { Status: 'Delinquent', Volume: 34, Revenue: '$12.5K' },
                { Status: 'Not Filed', Volume: 156, Revenue: '$0' }
            ],
            'Enforcement_Efficiency.csv': [
                { Metric: 'Response Time', Value: '2.3 days avg' },
                { Metric: 'Resolution Rate', Value: '78%' },
                { Metric: 'Active Cases', Value: '145' }
            ],
            'Compliance_Trends.csv': [
                { Month: 'Jan', Compliance_Rate: '94.2%', Growth: '+12.3%' },
                { Month: 'Dec', Compliance_Rate: '88.7%', Growth: '+8.7%' }
            ],
            'Revenue_Impact.csv': [
                { Stream: 'Fines Collected', Amount: '$234.5K' },
                { Stream: 'TAT Revenue', Amount: '$567.8K' },
                { Stream: 'Processing Fees', Amount: '$45.2K' },
                { Stream: 'Total Impact', Amount: '$847.5K' }
            ]
        };

        Object.entries(reportsData).forEach(([filename, data]) => {
            zip.file(filename, Papa.unparse(data));
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `Hawaii_County_Standard_Reports_${new Date().toISOString().split('T')[0]}.zip`;
        link.click();
    };

    const handleCreateCase = () => {
        // Generate case number
        const caseNumber = `VC-2024-${Math.floor(Math.random() * 1000)}`;
        
        // Create new case object
        const caseData = {
            ...newCase,
            caseNumber,
            status: 'reported',
            createdDate: new Date().toISOString().split('T')[0],
            estimatedFine: newCase.severity === 'high' ? 1000 : newCase.severity === 'medium' ? 500 : 250
        };
        
        // In a real app, this would save to a database
        console.log('Creating case from compliance report:', caseData);
        
        // Show success message
        alert(`Case ${caseNumber} created successfully from compliance report!`);
        
        // Reset form and close modal
        setNewCase({
            propertyAddress: '',
            ownerName: '',
            violationType: 'Non-Compliance',
            severity: 'medium',
            description: '',
            source: 'compliance-report'
        });
        setShowCaseModal(false);
    };

    const violationsData = [
        { name: 'Noise', value: 35 },
        { name: 'Parking', value: 25 },
        { name: 'Unpermitted', value: 30 },
        { name: 'Safety', value: 10 },
    ];

    const COLORS = ['#0f4c81', '#ff7f50', '#f59e0b', '#ef4444'];

    const renderReportContent = (reportType) => {
        const sharedProps = {
            margin: { top: 10, right: 10, left: -20, bottom: 0 }
        };

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                            {reportType === 'revenue' ? 'Total Collected' : 'Total Records'}
                        </p>
                        <p className="text-2xl font-black text-blue-900">
                            {reportType === 'revenue' ? '$847.5K' : '1,248'}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">
                            {reportType === 'trends' ? 'Growth Rate' : 'Compliance Accuracy'}
                        </p>
                        <p className="text-2xl font-black text-green-900">
                            {reportType === 'trends' ? '+12.3%' : '94.2%'}
                        </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">Audit Confidence</p>
                        <p className="text-2xl font-black text-orange-900">98.5%</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-hawaii-ocean" />
                        {reportType === 'trends' ? 'Monthly Compliance Velocity' : 'Data Distribution Analysis'}
                    </h3>
                    <div className="h-72 bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            {(() => {
                                if (reportType === 'region') {
                                    const data = [
                                        { name: 'Hilo', value: 245 },
                                        { name: 'Kona', value: 189 },
                                        { name: 'Puna', value: 127 },
                                        { name: 'Kohala', value: 203 },
                                        { name: 'Hamakua', value: 92 }
                                    ];
                                    return (
                                        <BarChart data={data} {...sharedProps}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Bar dataKey="value" fill="#0f4c81" radius={[6, 6, 0, 0]} name="Active Cases" />
                                        </BarChart>
                                    );
                                }
                                
                                if (reportType === 'type') {
                                    const data = [
                                        { name: 'Single Family', value: 342 },
                                        { name: 'Condo/Apt', value: 278 },
                                        { name: 'Vacation Home', value: 156 },
                                        { name: 'Other', value: 89 }
                                    ];
                                    return (
                                        <PieChart>
                                            <Pie data={data} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                                {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                        </PieChart>
                                    );
                                }

                                if (reportType === 'tat') {
                                    const data = [
                                        { name: 'Paid', value: 423 },
                                        { name: 'Late', value: 87 },
                                        { name: 'Delinquent', value: 34 },
                                        { name: 'Not Filed', value: 156 }
                                    ];
                                    return (
                                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    );
                                }

                                if (reportType === 'enforcement') {
                                    const data = [
                                        { name: 'Jan', resolved: 45, averageTime: 3.2 },
                                        { name: 'Feb', resolved: 52, averageTime: 2.8 },
                                        { name: 'Mar', resolved: 61, averageTime: 2.3 }
                                    ];
                                    return (
                                        <AreaChart data={data} {...sharedProps}>
                                            <defs>
                                                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Area type="monotone" dataKey="resolved" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRes)" strokeWidth={3} />
                                        </AreaChart>
                                    );
                                }

                                if (reportType === 'trends') {
                                    const data = [
                                        { name: 'Jan', rate: 82 },
                                        { name: 'Feb', rate: 85 },
                                        { name: 'Mar', rate: 94 }
                                    ];
                                    return (
                                        <LineChart data={data} {...sharedProps}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis domain={[80, 100]} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={4} dot={{r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} activityDot={{r: 8}} />
                                        </LineChart>
                                    );
                                }

                                if (reportType === 'revenue') {
                                    const data = [
                                        { name: 'Fines', value: 234.5 },
                                        { name: 'TAT', value: 567.8 },
                                        { name: 'Fees', value: 45.2 }
                                    ];
                                    return (
                                        <BarChart data={data} {...sharedProps}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                                            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} name="Amount ($K)" />
                                        </BarChart>
                                    );
                                }

                                return <div className="flex items-center justify-center h-full text-slate-400 italic">No visualization available for this category.</div>;
                            })()}
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 font-bold text-slate-700">
                                    {reportType === 'region' && 'District'}
                                    {reportType === 'type' && 'Property Category'}
                                    {reportType === 'tat' && 'Payment Status'}
                                    {reportType === 'enforcement' && 'Violation Category'}
                                    {reportType === 'trends' && 'Reporting period'}
                                    {reportType === 'revenue' && 'Revenue Stream'}
                                </th>
                                <th className="px-4 py-3 font-bold text-slate-700">
                                    {reportType === 'revenue' || reportType === 'tat' ? 'Financial Volume' : 'Units Identified'}
                                </th>
                                <th className="px-4 py-3 font-bold text-slate-700">Compliance Factor</th>
                                <th className="px-4 py-3 font-bold text-slate-700">Impact Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(reportType === 'region' ? ['Hilo', 'Kona', 'Puna', 'Kohala', 'Hamakua'] :
                                reportType === 'type' ? ['Single Family', 'Condo/Apt', 'Vacation Home', 'Estate', 'Other'] :
                                reportType === 'tat' ? ['Paid & Current', 'Late Payment', 'Delinquent', 'Not Filed'] :
                                reportType === 'enforcement' ? ['Noise', 'Parking', 'Unpermitted', 'Safety', 'Zoning'] :
                                reportType === 'trends' ? ['Q1 2024', 'Q4 2023', 'Q3 2023', 'Q2 2023'] :
                                ['Fines', 'TAT Revenue', 'Fees', 'Permits']).map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 text-slate-600 font-medium">{item}</td>
                                    <td className="px-4 py-3 text-slate-800">
                                        {reportType === 'revenue' || reportType === 'tat' ? `$${(Math.random() * 50 + 10).toFixed(1)}K` : Math.floor(Math.random() * 300 + 50)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            {(Math.random() * 10 + 90).toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-900 font-bold">
                                        {(Math.random() * 4 + 6).toFixed(1)} / 10
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
                    <p className="text-slate-500">Enforcement trends and compliance metrics.</p>
                </div>
                <div className="flex gap-2">
                    {/* <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Calendar className="w-4 h-4" /> Last 6 Months
                    </button> */}
                    <button 
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 text-sm shadow-sm"
                        style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            <div ref={reportsRef} className="space-y-8 p-4 bg-slate-50/30 rounded-2xl">
                <div id="pdf-dashboard-reports" className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#f8fafc] p-6 pt-24 rounded-2xl">
                    {/* Logo for PDF Export */}
                    <div className="absolute top-6 left-6 flex items-center gap-4">
                        <img src="/h_logo.png" alt="County logo" className="h-16 w-16 object-contain" />
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">County of Hawaii</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Compliance Analytics Overview</p>
                        </div>
                    </div>

                {/* Compliance Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-6">Compliance Rate Over Time</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                            <AreaChart data={complianceData}>
                                <defs>
                                    <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="compliant" stroke="#10b981" fillOpacity={1} fill="url(#colorComp)" name="Compliant Units" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Violations Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-6">Violation Types Breakdown</h2>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                            <PieChart>
                                <Pie
                                    data={violationsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {violationsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        {violationsData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                                <span className="text-slate-600 font-medium">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar Chart - Fines */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h2 className="font-bold text-slate-800 mb-6">Enforcement Revenue (Fines Issued vs. Collected)</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                            <BarChart data={complianceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="compliant" name="Fines Issued" fill="#0f4c81" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="nonCompliant" name="Fines Collected" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Standard Reports Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-6">Internal County Dashboard - Standard Reports</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Reporting by Region */}
                    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BarChart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Reporting by Region</h3>
                                <p className="text-xs text-slate-500">TVR violations by geographic area</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Hilo</span>
                                <span className="font-medium">245 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Kona</span>
                                <span className="font-medium">189 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Puna</span>
                                <span className="font-medium">127 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Kohala</span>
                                <span className="font-medium">203 cases</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleGenerateReport('region')}
                            className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* TVR Type Analysis */}
                    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <PieChart className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">TVR Type Analysis</h3>
                                <p className="text-xs text-slate-500">Breakdown by property type</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Single Family</span>
                                <span className="font-medium">342 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Condo/Apt</span>
                                <span className="font-medium">278 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Vacation Home</span>
                                <span className="font-medium">156 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Other</span>
                                <span className="font-medium">89 cases</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleGenerateReport('type')}
                            className="w-full mt-4 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* TAT Payment Status */}
                    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">TAT Payment Status</h3>
                                <p className="text-xs text-slate-500">Transient Accommodations Tax</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Paid & Current</span>
                                <span className="font-medium text-green-600">423</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Late Payment</span>
                                <span className="font-medium text-amber-600">87</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Delinquent</span>
                                <span className="font-medium text-red-600">34</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Not Filed</span>
                                <span className="font-medium text-slate-600">156</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleGenerateReport('tat')}
                            className="w-full mt-4 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* Other Analytics */}
                    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <LineChart className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Enforcement Analytics</h3>
                                <p className="text-xs text-slate-500">Comprehensive metrics</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Response Time</span>
                                <span className="font-medium">2.3 days avg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Resolution Rate</span>
                                <span className="font-medium">78%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Active Cases</span>
                                <span className="font-medium">145</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Monthly Revenue</span>
                                <span className="font-medium">$45.2K</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleGenerateReport('enforcement')}
                            className="w-full mt-4 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* Compliance Trends */}
                    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Compliance Trends</h3>
                                <p className="text-xs text-slate-500">Monthly compliance rates</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">This Month</span>
                                <span className="font-medium text-green-600">+12.3%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Last Month</span>
                                <span className="font-medium text-green-600">+8.7%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">YTD Average</span>
                                <span className="font-medium text-green-600">+9.4%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Target Goal</span>
                                <span className="font-medium text-blue-600">+15.0%</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleGenerateReport('trends')}
                            className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* Revenue Impact */}
                    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Revenue Impact</h3>
                                <p className="text-xs text-slate-500">Financial analysis</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Fines Collected</span>
                                <span className="font-medium">$234.5K</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">TAT Revenue</span>
                                <span className="font-medium">$567.8K</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Processing Fees</span>
                                <span className="font-medium">$45.2K</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Total Impact</span>
                                <span className="font-medium text-green-600">$847.5K</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleGenerateReport('revenue')}
                            className="w-full mt-4 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-slate-200 pt-6">
                    <div className="text-sm text-slate-500">
                        <p>Last updated: March 15, 2024 at 2:30 PM HST</p>
                        <p>Data source: County Compliance Management System</p>
                        <p className="mt-1 text-xs italic">Note: Underlying data captured from high-fidelity TVR Registration Portal at the time of registration.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            Schedule Reports
                        </button> */}
                        <button 
                            onClick={handleExportAll}
                            className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                            style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            Export All Reports
                        </button>
                    </div>
                </div>

                {/* Detailed Reports for PDF Export Only */}
                {isExporting && (
                    <div className="p-12 space-y-16 bg-[#f8fafc] w-[1400px] mx-auto">

                        {['region', 'type', 'tat', 'enforcement', 'trends', 'revenue'].map(type => (
                            <div key={type} id={`pdf-report-${type}`} className="relative bg-white rounded-3xl p-10 pt-28 shadow-sm border border-slate-100">
                                {/* Logo for PDF Export */}
                                <div className="absolute top-8 left-10 flex items-center gap-4">
                                    <img src="/h_logo.png" alt="County logo" className="h-20 w-20 object-contain" />
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 leading-tight">County of Hawaii</h3>
                                        <p className="text-sm text-hawaii-ocean font-bold uppercase tracking-widest">Department of Finance | Compliance Division</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-slate-800 mb-8 border-l-8 border-hawaii-ocean pl-6 leading-tight">
                                    {type === 'region' && 'Regional Compliance Deep-Dive'}
                                    {type === 'type' && 'Property Type Analysis Detail'}
                                    {type === 'tat' && 'TAT Revenue & Payment Audit'}
                                    {type === 'enforcement' && 'Enforcement Efficiency Metrics'}
                                    {type === 'trends' && 'Compliance Velocity Tracking'}
                                    {type === 'revenue' && 'Economic Impact Assessment'}
                                </h2>
                                {renderReportContent(type)}
                                <div className="mt-10 pt-6 border-t border-slate-50 text-[10px] text-slate-300 font-mono italic">
                                    TVR Registration Portal Data Extract | Secure Audit Log Hash: {Math.random().toString(16).slice(2, 10).toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>

            {/* Case Creation Modal */}
            {showCaseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Create Case from Compliance Report</h2>
                            <button
                                onClick={() => setShowCaseModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Property Address *
                                </label>
                                <input
                                    type="text"
                                    value={newCase.propertyAddress}
                                    onChange={(e) => setNewCase({...newCase, propertyAddress: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Enter property address"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Owner Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCase.ownerName}
                                    onChange={(e) => setNewCase({...newCase, ownerName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Enter owner name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Violation Type *
                                </label>
                                <select
                                    value={newCase.violationType}
                                    onChange={(e) => setNewCase({...newCase, violationType: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="Non-Compliance">Non-Compliance</option>
                                    <option value="Safety Violation">Safety Violation</option>
                                    <option value="Zoning Violation">Zoning Violation</option>
                                    <option value="Noise Complaint">Noise Complaint</option>
                                    <option value="Parking Violation">Parking Violation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Severity *
                                </label>
                                <select
                                    value={newCase.severity}
                                    onChange={(e) => setNewCase({...newCase, severity: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={newCase.description}
                                    onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                                    placeholder="Describe the compliance issue..."
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                            <p className="text-sm text-amber-800">
                                <strong>Source:</strong> Compliance Report Analytics
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                This case will be created based on compliance monitoring data
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCaseModal(false)}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateCase}
                                disabled={!newCase.propertyAddress || !newCase.ownerName || !newCase.description}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Case
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Detail Modal */}
            {showReportDetail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 capitalize">
                                    {activeReport === 'region' && 'Regional Compliance Deep-Dive'}
                                    {activeReport === 'type' && 'Property Type Analysis Detail'}
                                    {activeReport === 'tat' && 'TAT Revenue & Payment Audit'}
                                    {activeReport === 'enforcement' && 'Enforcement Efficiency Metrics'}
                                    {activeReport === 'trends' && 'Compliance Velocity Tracking'}
                                    {activeReport === 'revenue' && 'Economic Impact Assessment'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Detailed breakdown from TVR Registration historical data.</p>
                            </div>
                            <button
                                onClick={() => setShowReportDetail(false)}
                                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto flex-1 bg-white">
                            {/* Detailed Report Content */}
                            {renderReportContent(activeReport)}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Verification Hash: 0X8F23...DE91 | Source: TVR REG PORTAL 2024
                            </p>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                                    Export CSV Data
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                    Print Full Audit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Exporting Overlay */}
            {isExporting && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-[100] text-white">
                    <div className="w-16 h-16 border-4 border-hawaii-ocean border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold mb-2">Generating Comprehensive Report</h2>
                    <p className="text-slate-300">Capturing dashboard visualizations and detailed audit data...</p>
                    <p className="text-sm text-slate-400 mt-8 animate-pulse text-center max-w-xs">
                        This may take a few seconds due to the volume of data being processed.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Reports;
