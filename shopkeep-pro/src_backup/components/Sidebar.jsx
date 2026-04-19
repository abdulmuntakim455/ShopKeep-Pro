import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, BookOpen, History, ShieldCheck, ShieldAlert, Users, ClipboardList } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, onLogout }) => {
    const tabs = [
        { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'pos', label: 'Billing / POS', icon: ShoppingCart },
        { id: 'itemlist', label: 'Item List', icon: ClipboardList },
        { id: 'khaata', label: 'Khaata Ledger', icon: BookOpen },
        { id: 'history', label: 'Sales History', icon: History },
        { id: 'salesmen', label: 'Salesmen', icon: Users }
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
                        <Package className="text-white w-6 h-6" />
                    </div>
                    <h1 className="font-extrabold text-xl tracking-tight">Vikaas Timber<span className="text-indigo-600"></span></h1>
                    
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <tab.icon size={20} />
                        <span className="font-semibold">{tab.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Mode</span>
                    {isAdmin ? <ShieldCheck size={16} className="text-indigo-600" /> : <Users size={16} className="text-blue-500" />}
                </div>
                <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`w-full py-2 rounded-xl text-xs font-black transition-all border ${isAdmin ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                >
                    {isAdmin ? 'OWNER MODE' : 'STAFF MODE'}
                </button>
                <button
                    onClick={onLogout}
                     className="w-full py-2 rounded-xl text-sm font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all"
>
                     Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;