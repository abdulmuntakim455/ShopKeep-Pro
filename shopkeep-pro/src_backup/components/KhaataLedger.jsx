import React from 'react';
import { BookOpen } from 'lucide-react';

const KhaataLedger = ({ sales, stats, settleBill }) => {
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
                            <th className="px-6 py-5">Amount Due</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                        {creditSales.map(sale => (
                            <tr key={sale._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800">{sale.customerName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">#TXN-{sale._id.slice(-6)}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{new Date(sale.timestamp).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-black text-rose-600 text-lg">₹{sale.total.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => settleBill(sale._id)}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all active:scale-95"
                                    >
                                        Settle Bill
                                    </button>
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
        </div>
    );
};

export default KhaataLedger;