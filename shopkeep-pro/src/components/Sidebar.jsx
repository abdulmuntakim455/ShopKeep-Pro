import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, BookOpen, History, ShieldCheck, ShieldAlert, Users, ClipboardList, Sparkles } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, onLogout }) => {
    const tabs = [
        { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'pos', label: 'Billing / POS', icon: ShoppingCart },
        { id: 'itemlist', label: 'Item List', icon: ClipboardList },
        { id: 'khaata', label: 'Khaata Ledger', icon: BookOpen },
        { id: 'history', label: 'Sales History', icon: History },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'salesmen', label: 'Salesmen', icon: Users },
        { id: 'ai', label: 'Business Strategist', icon: Sparkles }
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-slate-600">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500 p-2 rounded-lg shadow-sm">
                        <Package className="text-slate-900 w-6 h-6" />
                    </div>
                    <h1 className="font-extrabold text-xl tracking-tight text-slate-800">Vikaas Timber</h1>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg rounded-l-sm transition-all focus:outline-none ${activeTab === tab.id ? 'bg-slate-100 text-amber-600 border-l-4 border-amber-500 font-black' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-bold'}`}
                    >
                        <tab.icon size={20} className={activeTab === tab.id ? "text-amber-500" : ""} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 space-y-4 bg-slate-50/50">
                <button
                    onClick={onLogout}
                    className="w-full py-2.5 rounded-lg text-xs tracking-widest uppercase font-black bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-all focus:outline-none"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;