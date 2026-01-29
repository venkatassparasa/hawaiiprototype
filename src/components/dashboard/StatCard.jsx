import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, trend, icon: Icon, colorClass }) => {
    return (
        <section
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.98]"
            aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2
                        id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                        className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider"
                    >
                        {title}
                    </h2>
                    <p className="text-3xl font-extrabold text-slate-800">{value}</p>
                </div>
                <div
                    className={`p-3 rounded-xl ${colorClass} bg-opacity-10 shadow-inner`}
                    aria-hidden="true"
                >
                    <Icon className={`w-7 h-7 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span
                    className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    aria-label={`${trend === 'up' ? 'Increase' : 'Decrease'} of ${change}`}
                >
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {change}
                </span>
                <span className="text-slate-400 ml-2 font-medium">vs last month</span>
            </div>
        </section>
    );
};

export default StatCard;
