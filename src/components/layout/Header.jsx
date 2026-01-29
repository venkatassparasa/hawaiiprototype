import React, { useState } from 'react';
import { Search, Bell, HelpCircle, User, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout, onMenuToggle }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header
            role="banner"
            className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-40 flex items-center justify-between px-4 md:px-8 shadow-sm"
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="p-2 -ml-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 w-40 md:w-96">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-hawaii-ocean transition-colors" />
                        <input
                            type="text"
                            placeholder="Search TMK, Address, or Owner..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20 focus:border-hawaii-ocean transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 pl-3 pr-2 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-slate-700">{user?.name || 'Jane Doe'}</p>
                            <p className="text-xs text-slate-400">{user?.role || 'Enforcement Officer'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-hawaii-ocean flex items-center justify-center font-bold text-sm text-white">
                            {user?.avatar || 'JD'}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowUserMenu(false)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-20">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-medium text-slate-900">{user?.name || 'Jane Doe'}</p>
                                    <p className="text-xs text-slate-500">{user?.email || 'jane.doe@hawaiicounty.gov'}</p>
                                </div>

                                <Link
                                    to="/profile"
                                    onClick={() => setShowUserMenu(false)}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                >
                                    <User className="w-4 h-4" />
                                    My Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    onClick={() => setShowUserMenu(false)}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>

                                <div className="border-t border-slate-100 mt-2 pt-2">
                                    <button
                                        onClick={onLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
