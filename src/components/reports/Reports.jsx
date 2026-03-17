import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, Calendar, FileText, TrendingUp, DollarSign } from 'lucide-react';

const Reports = () => {
    const complianceData = [
        { name: 'Aug', compliant: 2000, nonCompliant: 400 },
        { name: 'Sep', compliant: 2100, nonCompliant: 350 },
        { name: 'Oct', compliant: 2200, nonCompliant: 300 },
        { name: 'Nov', compliant: 2350, nonCompliant: 280 },
        { name: 'Dec', compliant: 2500, nonCompliant: 200 },
        { name: 'Jan', compliant: 2800, nonCompliant: 150 },
    ];

    const violationsData = [
        { name: 'Noise', value: 35 },
        { name: 'Parking', value: 25 },
        { name: 'Unpermitted', value: 30 },
        { name: 'Safety', value: 10 },
    ];

    const COLORS = ['#0f4c81', '#ff7f50', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
                    <p className="text-slate-500">Enforcement trends and compliance metrics.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Calendar className="w-4 h-4" /> Last 6 Months
                    </button>
                    <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 text-sm shadow-sm"
                     style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Compliance Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-6">Compliance Rate Over Time</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
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
                        <ResponsiveContainer width="100%" height="100%">
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
                        <ResponsiveContainer width="100%" height="100%">
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
                                <span className="text-slate-600">Honolulu</span>
                                <span className="font-medium">245 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Maui</span>
                                <span className="font-medium">189 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Kauai</span>
                                <span className="font-medium">127 cases</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Big Island</span>
                                <span className="font-medium">203 cases</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
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
                        <button className="w-full mt-4 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
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
                        <button className="w-full mt-4 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors">
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
                        <button className="w-full mt-4 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
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
                        <button className="w-full mt-4 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
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
                        <button className="w-full mt-4 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors">
                            Generate Report
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-slate-200 pt-6">
                    <div className="text-sm text-slate-500">
                        <p>Last updated: March 15, 2024 at 2:30 PM HST</p>
                        <p>Data source: County Compliance Management System</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            Schedule Reports
                        </button>
                        <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                         style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                            Export All Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
