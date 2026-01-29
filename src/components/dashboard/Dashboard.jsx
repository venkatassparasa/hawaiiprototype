import React from 'react';
import { Users, Home, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import StatCard from './StatCard';
import { Link } from 'react-router-dom';
import { RoleContext } from '../../context/RoleContext';
import FinanceOverview from './departmental/FinanceOverview';
import PlanningOverview from './departmental/PlanningOverview';
import LegalOverview from './departmental/LegalOverview';
import PublicOverview from './departmental/PublicOverview';
import { useContext } from 'react';

const Dashboard = () => {
    const { user } = useContext(RoleContext);

    const renderDepartmentalOverview = () => {
        switch (user?.role) {
            case 'Finance':
                return <FinanceOverview />;
            case 'Planning':
                return <PlanningOverview />;
            case 'Legal':
                return <LegalOverview />;
            case 'Public':
                return <PublicOverview />;
            default:
                return null;
        }
    };

    const stats = [
        { title: 'Total Active Listings', value: '4,217', change: '+12%', trend: 'up', icon: Home, colorClass: 'darkascent bg-blue-600' },
        { title: 'Compliant Properties', value: '3,842', change: '+5%', trend: 'up', icon: CheckCircle, colorClass: 'text-green-600 bg-green-600' },
        { title: 'Pending Violations', value: '312', change: '-8%', trend: 'down', icon: AlertTriangle, colorClass: 'text-yellow-600 bg-yellow-600' },
        { title: 'Entity Resolutions', value: '89', change: '+24', trend: 'up', icon: Users, colorClass: 'secondarybadge bg-purple-600' },
    ];

    const highRiskProperties = [
        { id: 1, address: '75-5660 Palani Rd', tmk: '3-7-5-004-001', matchScore: '98%', status: 'Non-Compliant', platforms: ['Airbnb', 'VRBO'], risk: 'High' },
        { id: 2, address: '69-425 Waikoloa Beach Dr', tmk: '3-6-9-007-034', matchScore: '95%', status: 'Under Review', platforms: ['Airbnb'], risk: 'Medium' },
        { id: 3, address: '77-6425 Ali\'i Dr', tmk: '3-7-7-012-005', matchScore: '92%', status: 'Non-Compliant', platforms: ['VRBO', 'FlipKey'], risk: 'High' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Command Center</h1>
                <p className="text-slate-500">Overview of Short-Term Rental Compliance</p>
            </div>

            {renderDepartmentalOverview()}

            {user?.role !== 'Public' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>
            )}

            {user?.role !== 'Public' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Priority Action Items</h2>
                            <p className="text-sm text-slate-500">Properties requiring immediate attention</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-hawaii-ocean rounded-lg hover:bg-blue-800">
                                View All
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto" role="region" aria-label="Priority action items table">
                        <table className="w-full text-left text-sm min-w-[800px]">
                            <thead className="bg-slate-50 text-slate-500 font-medium whitespace-nowrap">
                                <tr>
                                    <th className="px-6 py-4">Property Address</th>
                                    <th className="px-6 py-4">TMK</th>
                                    <th className="px-6 py-4">Entity Match</th>
                                    <th className="px-6 py-4">Platforms</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {highRiskProperties.map((prop) => (
                                    <tr key={prop.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">{prop.address}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{prop.tmk}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500" style={{ width: prop.matchScore }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-purple-700">{prop.matchScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {prop.platforms.map((p, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600" title={p}>
                                                        {p[0]}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${prop.status === 'Non-Compliant' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                prop.status === 'Under Review' ? 'highlight text-yellow-700 border border-yellow-100' :
                                                    'bg-green-50 text-green-700 border border-green-100'
                                                }`}>
                                                {prop.status === 'Non-Compliant' && <AlertTriangle className="w-3 h-3" />}
                                                {prop.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {prop.status === 'Compliant' ? (
                                                    <Link
                                                        to={`/property/${prop.id}`}
                                                        className="text-hawaii-ocean font-medium hover:underline text-sm"
                                                    >
                                                        Details
                                                    </Link>
                                                ) : (
                                                    <div className="flex gap-2 whitespace-nowrap">
                                                        <Link
                                                            to={`/case/${prop.id}`}
                                                            className="text-hawaii-ocean font-bold hover:underline text-sm"
                                                        >
                                                            View Case
                                                        </Link>
                                                        <Link
                                                            to={`/property/${prop.id}`}
                                                            className="text-slate-400 font-medium hover:underline text-sm"
                                                        >
                                                            Property
                                                        </Link>
                                                    </div>
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

export default Dashboard;
