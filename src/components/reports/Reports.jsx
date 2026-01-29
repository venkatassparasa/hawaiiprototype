import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar } from 'lucide-react';

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
                    <button className="px-4 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 text-sm shadow-sm">
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
        </div>
    );
};

// Need to import Area and AreaChart as I switched to AreaChart in the first example
import { AreaChart, Area } from 'recharts';

export default Reports;
