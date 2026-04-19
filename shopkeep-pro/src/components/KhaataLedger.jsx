import React, { useState } from 'react';
import { BookOpen, X, Building2, Phone, MapPin, Search } from 'lucide-react';

const KhaataLedger = ({ sales, stats, settleBill, deleteSale }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const creditSales = sales.filter(s => s.paymentMethod === 'Credit (Udhaar)');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-600 text-white p-6 rounded-[32px] shadow-lg shadow-amber-100">
                    <p className="text-amber-100 text-xs font-black uppercase tracking-widest mb-2">Total Outstanding</p>
                    <h3 className="text-3xl font-black">₹{stats.khaataTotal.toLocaleString('en-IN')}</h3>
                    <p className="text-amber-100 text-[10px] mt-4">Across all credit customers</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b font-black text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-amber-500" />
                    Active Credit Accounts
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-5">Customer Name</th>
                            <th className="px-6 py-5">Recent Credit Date</th>
                            <th className="px-6 py-5">Handled By</th>
                            <th className="px-6 py-5">Amount Due</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                        {creditSales.map(sale => (
                            <tr key={sale._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-bold text-slate-800">{sale.customerName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">#TXN-{sale._id.slice(-6)}</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedCustomer(sale)}
                                            className="p-1.5 bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Search size={14} />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-500 font-bold">{new Date(sale.timestamp).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">{new Date(sale.timestamp).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                        {sale.salesmanName || 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-black text-rose-600 text-lg">₹{sale.total.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => settleBill(sale._id)}
                                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all active:scale-95"
                                        >
                                            Settle Bill
                                        </button>
                                        {deleteSale && (
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm("Cancel this sale? This will delete the record and restore stock.")) {
                                                        deleteSale(sale._id);
                                                    }
                                                }}
                                                className="bg-rose-50 text-rose-500 px-4 py-2 rounded-xl text-xs font-black hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                                            >
                                                Cancel Sale
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {creditSales.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-300 italic font-medium">
                                    No pending credits. Your ledger is clean!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800 tracking-tight">{selectedCustomer.customerName}</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Udhaar Account Details</p>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-800 transition bg-white p-1.5 rounded-full shadow-sm"><X size={18}/></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><Phone size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</p>
                                    <p className="font-black text-slate-800">{selectedCustomer.customerContact || 'Not Provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><Building2 size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company / Business</p>
                                    <p className="font-bold text-slate-800">{selectedCustomer.customerCompany || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><MapPin size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                                    <p className="font-bold text-slate-800 text-sm leading-relaxed">{selectedCustomer.customerAddress || 'No Address Provided'}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Original Transaction Handled By</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-xs">
                                        {(selectedCustomer.salesmanName || 'AD').substring(0,2).toUpperCase()}
                                    </div>
                                    <p className="font-black text-slate-700 uppercase tracking-widest text-xs">{selectedCustomer.salesmanName || 'Administrator'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button onClick={() => setSelectedCustomer(null)} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-xl text-xs transition">Close Details</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KhaataLedger;