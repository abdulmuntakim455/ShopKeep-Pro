import React from 'react';
import { TrendingUp, BookOpen, Calendar, AlertTriangle } from 'lucide-react';

const Dashboard = ({ stats, isAdmin, setActiveTab }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Revenue - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-x-slate-200 border-b-slate-200 border-t-4 border-t-amber-500 relative overflow-hidden">
                        <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-lg flex items-center 
                        justify-center mb-4 font-bold text-lg border border-amber-100">₹</div>
                        <p className="text-slate-500 text-[10px] font-black uppercase 
                        tracking-widest">Total Revenue</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            ₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                )}

                {/* Estimated Profit - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-x-slate-200 border-b-slate-200 border-t-4 border-t-amber-500 relative overflow-hidden">
                        <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-lg flex 
                        items-center justify-center mb-4 border border-emerald-100">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Estimated Profit</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            ₹{stats.totalProfit.toLocaleString('en-IN')}</h3>
                    </div>
                )}

                {/* Total Credit (Udhaar) - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-x-slate-200 border-b-slate-200 border-t-4 border-t-slate-700 relative overflow-hidden">
                        <div className="bg-slate-100 text-slate-700 w-10 h-10 rounded-lg 
                        flex items-center justify-center mb-4 border border-slate-200">
                            <BookOpen size={20} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Total Credit (Udhaar)</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            ₹{stats.khaataTotal.toLocaleString('en-IN')}</h3>
                    </div>
                )}

                {/* Expiry Alerts - Visible to All */}
                {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    ...
                </div> */}
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Top Products */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden lg:col-span-1">
                    <div className="p-5 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-widest text-xs">Fastest Moving</div>
                    <div className="p-4 space-y-4">
                        {stats.topProducts.map(([name, qty], idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-amber-600 flex items-center justify-center font-black text-xs border border-amber-200">#{idx + 1}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{name}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{qty} units sold</p>
                                </div>
                            </div>
                        ))}
                        {stats.topProducts.length === 0 && (
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest p-4 text-center">No sales data yet</p>
                        )}
                    </div>
                </div>

                {/* Stock & Expiry Alerts */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="p-5 bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase tracking-widest text-xs flex justify-between items-center">
                        <span>Stock & Expiry Alerts</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {stats.expiringSoon.concat(stats.lowStock.slice(0, 3)).map((item, idx) => (
                            <div key={idx} className="p-4 flex justify-between items-center 
                            hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg border ${item.stock <= (item.minStock || 5) ?
                                        'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                        {item.stock <= (item.minStock || 5) ? <AlertTriangle size={18} /> :
                                            <Calendar size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                                            {item.stock <= (item.minStock || 5) ? `Only ${item.stock} left` :
                                                `Expires on ${new Date(item.expiryDate).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className="text-xs font-black text-amber-600 uppercase tracking-widest hover:text-amber-500 transition-colors border border-amber-200 hover:border-amber-500 px-3 py-1.5 rounded-lg"
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