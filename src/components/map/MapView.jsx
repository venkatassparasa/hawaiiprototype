import React from 'react';
import { Layers, Map, Filter, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapView = () => {
    // Mock property data for pins
    const properties = [
        { id: 1, top: '40%', left: '45%', status: 'Non-Compliant', count: 12, address: '74-5599 Alii Dr, Kailua-Kona, HI 96740' },
        { id: 2, top: '35%', left: '55%', status: 'Compliant', count: 8, address: '69-425 Waikoloa Beach Dr, Kailua-Kona, HI 96740' },
        { id: 3, top: '42%', left: '48%', status: 'Non-Compliant', count: 15, address: '77-6425 Alii Dr, Kailua-Kona, HI 96740' },
        { id: 4, top: '50%', left: '40%', status: 'Under Review', count: 5, address: '75-1234 Kuakini Hwy, Kailua-Kona, HI 96740' },
        { id: 5, top: '38%', left: '52%', status: 'Compliant', count: 22, address: '78-4567 Mamalahoa Bay Dr, Kailua-Kona, HI 96740' },
        { id: 6, top: '45%', left: '43%', status: 'Non-Compliant', count: 18, address: '79-2001 Kamehameha Hwy, Kailua-Kona, HI 96740' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
            {/* OpenStreetMap Iframe - Hilo, Hawaii */}
            <div className="absolute inset-0">
                <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-155.1500%2C19.6500%2C-154.9500%2C19.7500&layer=mapnik"
                    className="w-full h-full border-0"
                    title="Hilo District Map"
                    style={{ minHeight: '400px' }}
                />
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
                            className={`absolute w-12 h-12 rounded-full ${bgColor}/90 text-slate-900 flex items-center justify-center font-bold text-sm shadow-lg ring-4 ${bgColor.replace('bg-', 'ring-')}/20 cursor-pointer hover:scale-110 transition-transform`}
                            style={{ top: prop.top, left: prop.left }}
                            title={`${prop.count} ${prop.status} properties - Click to view all`}
                        >
                            <span className="text-2xl font-bold">{prop.count}</span>
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
                            className={`absolute w-6 h-6 rounded-full ${bgColor} border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform`}
                            style={{ top: prop.top, left: prop.left }}
                            title={prop.status}
                        >
                            <span className="text-2xl font-bold text-slate-900">{prop.count}</span>
                        </Link>
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

            {/* Legend */}
            <div className="absolute bottom-8 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-100">
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

            {/* Location Info */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-slate-100">
                <h1 className="font-bold text-slate-800 text-lg">Geospatial Enforcement</h1>
                <p className="text-xs text-slate-500">Hilo District</p>
            </div>
        </div>
    );
};

export default MapView;
