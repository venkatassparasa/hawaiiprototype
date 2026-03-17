import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign, Home, MapPin, Calendar, Filter, Download, Eye, Building2, Users, FileText } from 'lucide-react';

const InternalCountyDashboard = () => {
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
    const [selectedTVRType, setSelectedTVRType] = useState('all');

    // Mock data for demonstration
    const regions = [
        { id: 'all', name: 'All Regions' },
        { id: 'hilo', name: 'Hilo District' },
        { id: 'kona', name: 'Kona District' },
        { id: 'puna', name: 'Puna District' },
        { id: 'hamakua', name: 'Hamakua District' },
        { id: 'north-kohala', name: 'North Kohala' },
        { id: 'south-kohala', name: 'South Kohala' },
        { id: 'ka-u', name: 'Kaʻū District' },
    ];

    const tvrTypes = [
        { id: 'all', name: 'All Types' },
        { id: 'single-family', name: 'Single Family Home' },
        { id: 'condo', name: 'Condominium' },
        { id: 'vacation-rental', name: 'Vacation Rental' },
        { id: 'hostel', name: 'Hostel' },
        { id: 'b-and-b', name: 'Bed & Breakfast' },
    ];

    const timeRanges = [
        { id: '7days', name: 'Last 7 Days' },
        { id: '30days', name: 'Last 30 Days' },
        { id: '90days', name: 'Last 90 Days' },
        { id: '1year', name: 'Last Year' },
        { id: 'ytd', name: 'Year to Date' },
    ];

    // Mock analytics data
    const analyticsData = {
        totalProperties: 2847,
        activeTVRs: 2156,
        pendingApplications: 89,
        compliantProperties: 1934,
        violations: 222,
        totalRevenue: 1245678.50,
        avgOccupancy: 72.3,
        avgNightlyRate: 185.50,
    };

    const regionData = [
        { region: 'Hilo', properties: 623, revenue: 345678, compliance: 89.2 },
        { region: 'Kona', properties: 892, revenue: 567890, compliance: 85.7 },
        { region: 'Puna', properties: 445, revenue: 234567, compliance: 91.3 },
        { region: 'Hamakua', properties: 234, revenue: 123456, compliance: 87.9 },
        { region: 'North Kohala', properties: 312, revenue: 198765, compliance: 92.1 },
        { region: 'South Kohala', properties: 278, revenue: 156789, compliance: 88.4 },
        { region: 'Kaʻū', properties: 163, revenue: 87654, compliance: 90.5 },
    ];

    const tvrTypeData = [
        { type: 'Single Family Home', count: 1234, percentage: 57.3, avgRevenue: 145.50 },
        { type: 'Condominium', count: 567, percentage: 26.3, avgRevenue: 125.75 },
        { type: 'Vacation Rental', count: 234, percentage: 10.9, avgRevenue: 195.25 },
        { type: 'Bed & Breakfast', count: 89, percentage: 4.1, avgRevenue: 165.00 },
        { type: 'Hostel', count: 32, percentage: 1.4, avgRevenue: 85.50 },
    ];

    const paymentStatusData = [
        { status: 'Paid', count: 1934, percentage: 89.7, amount: 1123456.78 },
        { status: 'Pending', count: 156, percentage: 7.2, amount: 98765.43 },
        { status: 'Overdue', count: 66, percentage: 3.1, amount: 23456.29 },
    ];

    const recentActivity = [
        { id: 1, type: 'registration', property: 'Oceanview Paradise', owner: 'John Doe', status: 'approved', date: '2024-03-16' },
        { id: 2, type: 'payment', property: 'Mountain Retreat', owner: 'Jane Smith', status: 'completed', date: '2024-03-16' },
        { id: 3, type: 'violation', property: 'Beach House', owner: 'Bob Johnson', status: 'reported', date: '2024-03-15' },
        { id: 4, type: 'inspection', property: 'Forest Cabin', owner: 'Alice Brown', status: 'scheduled', date: '2024-03-15' },
        { id: 5, type: 'renewal', property: 'City Apartment', owner: 'Charlie Wilson', status: 'pending', date: '2024-03-14' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Internal County Dashboard</h1>
                <p className="text-slate-600">Comprehensive reporting and analytics for TVR operations</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Filters:</span>
                    </div>
                    
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                    >
                        {regions.map(region => (
                            <option key={region.id} value={region.id}>{region.name}</option>
                        ))}
                    </select>
                    
                    <select
                        value={selectedTVRType}
                        onChange={(e) => setSelectedTVRType(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                    >
                        {tvrTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                    
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                    >
                        {timeRanges.map(range => (
                            <option key={range.id} value={range.id}>{range.name}</option>
                        ))}
                    </select>
                    
                    <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        style={{background: '#4D7833 0% 0% no-repeat padding-box'}}>
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm text-green-600 font-medium">+12.3%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{analyticsData.totalProperties.toLocaleString()}</h3>
                    <p className="text-sm text-slate-600">Total Properties</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Home className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm text-green-600 font-medium">+8.7%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{analyticsData.activeTVRs.toLocaleString()}</h3>
                    <p className="text-sm text-slate-600">Active TVRs</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Users className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-sm text-red-600 font-medium">-2.1%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{analyticsData.avgOccupancy}%</h3>
                    <p className="text-sm text-slate-600">Avg Occupancy</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm text-green-600 font-medium">+15.8%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">${(analyticsData.totalRevenue / 1000000).toFixed(1)}M</h3>
                    <p className="text-sm text-slate-600">Total Revenue</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Regional Performance */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Regional Performance</h3>
                    <div className="space-y-3">
                        {regionData.map((region) => (
                            <div key={region.region} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    <div>
                                        <p className="font-medium text-slate-800">{region.region}</p>
                                        <p className="text-sm text-slate-600">{region.properties} properties</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-slate-800">${(region.revenue / 1000).toFixed(0)}K</p>
                                    <p className="text-sm text-green-600">{region.compliance}% compliant</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TVR Type Distribution */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">TVR Type Distribution</h3>
                    <div className="space-y-3">
                        {tvrTypeData.map((type) => (
                            <div key={type.type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-4 h-4 text-slate-500" />
                                    <div>
                                        <p className="font-medium text-slate-800">{type.type}</p>
                                        <p className="text-sm text-slate-600">{type.count} properties ({type.percentage}%)</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-slate-800">${type.avgRevenue}/night</p>
                                    <p className="text-sm text-slate-600">avg rate</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">TAT Payment Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentStatusData.map((status) => (
                        <div key={status.status} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-slate-800">{status.status}</h4>
                                <span className={`text-sm px-2 py-1 rounded ${
                                    status.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                    status.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {status.percentage}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{status.count}</p>
                            <p className="text-sm text-slate-600">${status.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
                    <button className="text-sm text-hawaii-ocean hover:text-hawaii-ocean/80 transition-colors">
                        View All
                    </button>
                </div>
                <div className="space-y-3">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    activity.type === 'registration' ? 'bg-blue-100' :
                                    activity.type === 'payment' ? 'bg-green-100' :
                                    activity.type === 'violation' ? 'bg-red-100' :
                                    activity.type === 'inspection' ? 'bg-purple-100' :
                                    'bg-yellow-100'
                                }`}>
                                    {activity.type === 'registration' && <FileText className="w-4 h-4 text-blue-600" />}
                                    {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-600" />}
                                    {activity.type === 'violation' && <Eye className="w-4 h-4 text-red-600" />}
                                    {activity.type === 'inspection' && <Calendar className="w-4 h-4 text-purple-600" />}
                                    {activity.type === 'renewal' && <TrendingUp className="w-4 h-4 text-yellow-600" />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{activity.property}</p>
                                    <p className="text-sm text-slate-600">{activity.owner}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm px-2 py-1 rounded ${
                                    activity.status === 'approved' || activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    activity.status === 'pending' || activity.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {activity.status}
                                </span>
                                <p className="text-sm text-slate-600 mt-1">{activity.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InternalCountyDashboard;
