import React from 'react';
import { TrendingUp, BookOpen, Calendar, AlertTriangle } from 'lucide-react';

const Dashboard = ({ stats, isAdmin, setActiveTab }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Revenue - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-2xl flex items-center 
                        justify-center mb-4 font-bold">₹</div>
                        <p className="text-slate-500 text-xs font-bold uppercase 
                        tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-black text-slate-800">
                            ₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                )}

                {/* Estimated Profit - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-2xl flex 
                        items-center justify-center mb-4">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            Estimated Profit</p>
                        <h3 className="text-2xl font-black text-slate-800">
                            ₹{stats.totalProfit.toLocaleString('en-IN')}</h3>
                    </div>
                )}

                {/* Total Credit (Udhaar) - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-2xl 
                        flex items-center justify-center mb-4">
                            <BookOpen size={20} />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            Total Credit (Udhaar)</p>
                        <h3 className="text-2xl font-black text-slate-800">
                            ₹{stats.khaataTotal.toLocaleString('en-IN')}</h3>
                    </div>
                )}

                {/* Expiry Alerts - Visible to All */}
                {/* <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 
                        ${stats.expiringSoon.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                        <Calendar size={20} />
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Expiry Alerts</p>
                    <h3 className="text-2xl font-black text-slate-800">{stats.expiringSoon.length}</h3>
                </div> */}
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Top Products */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden lg:col-span-1">
                    <div className="p-6 border-b border-slate-50 font-black text-slate-800">Fastest Moving</div>
                    <div className="p-4 space-y-4">
                        {stats.topProducts.map(([name, qty], idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">#{idx + 1}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{qty} units sold</p>
                                </div>
                            </div>
                        ))}
                        {stats.topProducts.length === 0 && (
                            <p className="text-slate-400 text-xs italic p-4 text-center">No sales data yet</p>
                        )}
                    </div>
                </div>

                {/* Stock & Expiry Alerts */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm 
                overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-50 font-black text-slate-800 
                    flex justify-between items-center">
                        <span>Stock & Expiry Alerts</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {stats.expiringSoon.concat(stats.lowStock.slice(0, 3)).map((item, idx) => (
                            <div key={idx} className="p-4 flex justify-between items-center 
                            hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${item.stock <= (item.minStock || 5) ?
                                        'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {item.stock <= (item.minStock || 5) ? <AlertTriangle size={18} /> :
                                            <Calendar size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase">
                                            {item.stock <= (item.minStock || 5) ? `Only ${item.stock} left` :
                                                `Expires on ${new Date(item.expiryDate).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                                >
                                    Fix Now
                                </button>
                            </div>
                        ))}
                        {stats.expiringSoon.length === 0 && stats.lowStock.length === 0 && (
                            <p className="text-slate-400 text-sm italic p-12 text-center">No urgent alerts</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;