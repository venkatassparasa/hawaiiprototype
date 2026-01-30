import React, { useContext } from 'react';
import { LayoutDashboard, Building2, Map as MapIcon, FileText, Settings, ShieldCheck, ClipboardList, AlertTriangle, DollarSign, MessageSquare, LogOut, X, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { RoleContext } from '../../context/RoleContext';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
    const location = useLocation();
    const { user } = useContext(RoleContext);

    const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

    const getNavItems = () => {
        const items = [
            { label: 'ADMINISTRATION', header: true },
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        ];

        // Role-based visibility
        const isFinance = user?.role === 'Finance' || user?.role === 'Admin' || user?.role === 'Enforcement Officer';
        const isPlanning = user?.role === 'Planning' || user?.role === 'Admin' || user?.role === 'Enforcement Officer';
        const isLegal = user?.role === 'Legal' || user?.role === 'Admin' || user?.role === 'Enforcement Officer';
        const isPublic = user?.role === 'Public';

        if (isFinance || isPlanning) {
            items.push({ icon: Building2, label: 'Property Registry', path: '/properties' });
        }

        if (isPlanning) {
            items.push(
                { icon: ShieldCheck, label: 'NCUC Certificates', path: '/ncuc' },
                { icon: ClipboardList, label: 'Registrations', path: '/registrations' }
            );
        }

        if (!isPublic) {
            items.push({ label: 'ENFORCEMENT', header: true });
        }

        if (isLegal) {
            items.push(
                { icon: AlertTriangle, label: 'Violation Cases', path: '/violations' },
                { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
                { icon: FileText, label: 'Appeals', path: '/appeals' },
                { icon: FileText, label: 'Violation Catalog', path: '/violation-catalog' }
            );
        }

        if (isFinance) {
            items.push({ icon: DollarSign, label: 'Payments', path: '/payments' });
        }

        if (!isPublic) {
            items.push({ icon: ClipboardList, label: 'Inspections', path: '/inspections' });
        }

        items.push({ label: 'PUBLIC PORTAL', header: true });
        items.push({ icon: MapIcon, label: 'Compliance Map', path: '/map' });

        if (isPublic) {
            items.push(
                { icon: Building2, label: 'Property Search', path: '/public-search' },
                { icon: FileText, label: 'Public Resources', path: '/public-resources' },
                { icon: MessageSquare, label: 'Submit Complaint', path: '/submit-complaint' }
            );
        }

        items.push({ label: 'SYSTEM', header: true });

        if (!isPublic) {
            items.push({ icon: FileText, label: 'Analytics Reports', path: '/reports' });
            items.push({ icon: FileText, label: 'Custom Reports', path: '/custom-reports' });
            
            // Workflow Management - Only for Admin, Planning, Legal, Enforcement
            if (['Admin', 'Planning', 'Legal', 'Enforcement Officer'].includes(user?.role)) {
                items.push({ icon: Activity, label: 'Workflows', path: '/workflows' });
            }
        }

        items.push({ icon: Settings, label: 'Settings', path: '/settings' });

        return items;
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-hawaii-ocean backdrop-blur-sm z-50 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            <div className={`w-64 bg-[#345b7e] text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col items-center border-b border-white/10">
                    <div className="w-full mb-2 relative h-12">
                        {/* Layer 1: Original map portion (left side) - Adjusted to 35% width */}
                        <img
                            src="/logo.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{ clipPath: 'inset(0 65% 0 0)' }}
                        />
                        {/* Layer 2: Inverted text portion (right side) - Adjusted to cover remaining 65% */}
                        <img
                            src="/logo.png"
                            alt="County of Hawaii Planning Department"
                            className="absolute inset-0 w-full h-full object-contain brightness-0 invert"
                            style={{ clipPath: 'inset(0 0 0 35%)' }}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Compliance Matrix</p>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar" aria-label="Main Navigation">
                    {navItems.map((item, idx) => (
                        item.header ? (
                            <p key={idx} className="px-4 pt-4 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                {item.label}
                            </p>
                        ) : (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                    ? 'bg-white/10 text-white font-medium shadow-inner border border-white/5'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-hawaii-coral' : 'text-white/60 group-hover:text-white'}`} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        )
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-[#e59a7a] flex items-center justify-center font-bold text-sm">
                            {user?.avatar || 'JD'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name || 'Jane Doe'}</p>
                            <p className="text-xs text-white/50 truncate">{user?.role || 'Enforcement Officer'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
