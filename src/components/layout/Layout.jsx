import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from '../chatbot/Chatbot';

const Layout = ({ children, user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
            <Header user={user} onLogout={onLogout} onMenuToggle={() => setSidebarOpen(true)} />
            <main className="lg:pl-64 pt-16 min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Chatbot />
        </div>
    );
};

export default Layout;
