import React from 'react';
import { Layers, Map, Filter, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapView = () => {
    // Mock property data for pins
    const properties = [
        { id: 1, top: '40%', left: '45%', status: 'Non-Compliant', count: 12 },
        { id: 2, top: '35%', left: '55%', status: 'Compliant' },
        { id: 3, top: '42%', left: '48%', status: 'Non-Compliant' },
        { id: 4, top: '50%', left: '40%', status: 'Under Review' },
        { id: 5, top: '38%', left: '52%', status: 'Compliant' },
        { id: 6, top: '45%', left: '43%', status: 'Non-Compliant' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">

            {/* Mock Map Background - Using a placeholder pattern to simulate map texture */}
            <div className="absolute inset-0 bg-[#e5e9ec] opacity-60"
                style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Simulation of Island Shape/Features - Abstract */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 opacity-20 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#93c5fd" d="M45.7,-76.3C58.9,-69.3,69.1,-58.3,77.3,-46.2C85.5,-34.1,91.7,-20.9,90.4,-8.2C89.1,4.5,80.3,16.7,70.9,27.3C61.5,37.9,51.5,46.9,40.7,54.8C29.9,62.7,18.3,69.5,5.6,71.3C-7.1,73.1,-20.8,69.9,-33.6,63.1C-46.4,56.3,-58.3,45.9,-66.8,33.2C-75.3,20.5,-80.4,5.5,-78.9,-8.8C-77.4,-23.1,-69.3,-36.7,-58.4,-46.8C-47.5,-56.9,-33.8,-63.5,-20.4,-70.3C-7,-77.1,6.1,-84.1,32.5,-83.3L45.7,-76.3Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* Map Pins */}
            {properties.map((prop) => {
                const isCluster = prop.count !== undefined;

                if (isCluster) {
                    // Cluster - navigate to properties list
                    const bgColor = prop.status === 'Compliant' ? 'bg-green-500' :
                        prop.status === 'Under Review' ? 'bg-yellow-500' : 'bg-red-500';

                    return (
                        <Link
                            key={prop.id}
                            to="/properties"
                            className={`absolute w-8 h-8 rounded-full ${bgColor}/90 text-white flex items-center justify-center font-bold text-xs shadow-lg ring-4 ${bgColor.replace('bg-', 'ring-')}/20 cursor-pointer hover:scale-110 transition-transform`}
                            style={{ top: prop.top, left: prop.left }}
                            title={`${prop.count} ${prop.status} properties - Click to view all`}
                        >
                            {prop.count}
                        </Link>
                    );
                } else {
                    // Individual pin
                    const linkTo = prop.status === 'Compliant' ? `/property/${prop.id}` : `/case/${prop.id}`;
                    const bgColor = prop.status === 'Compliant' ? 'bg-green-500' :
                        prop.status === 'Under Review' ? 'bg-yellow-500' : 'bg-red-500';

                    return (
                        <Link
                            key={prop.id}
                            to={linkTo}
                            className={`absolute w-4 h-4 rounded-full ${bgColor} border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform`}
                            style={{ top: prop.top, left: prop.left }}
                            title={prop.status}
                        />
                    );
                }
            })}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-3 bg-white rounded-lg shadow-md hover:bg-slate-50 text-slate-700" title="Layers">
                    <Layers className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white rounded-lg shadow-md hover:bg-slate-50 text-slate-700" title="Filter">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute bottom-8 right-4 flex flex-col gap-1 bg-white rounded-lg shadow-md overflow-hidden">
                <button className="p-2 hover:bg-slate-100 text-slate-700 border-b border-slate-100">
                    <Plus className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-slate-100 text-slate-700">
                    <Minus className="w-4 h-4" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-8 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-2 text-sm">Zone Status</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span>Violation (Active)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span>Under Investigation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span>Compliant</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-slate-100">
                <h1 className="font-bold text-slate-800 text-lg">Geospatial Enforcement</h1>
                <p className="text-xs text-slate-500">Kailua-Kona District</p>
            </div>

        </div>
    );
};

export default MapView;
