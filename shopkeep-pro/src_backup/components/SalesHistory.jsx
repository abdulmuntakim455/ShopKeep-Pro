import React from 'react';
import { Receipt, FileText, Trash2 } from 'lucide-react';

const SalesHistory = ({ sales, downloadBill, deleteSale }) => {
    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-50 font-black text-slate-800 bg-slate-50/50 flex justify-between items-center">
                <span>Complete Sales Registry</span>
                <div className="flex items-center gap-2">
                    <Receipt size={16} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Digital Archive
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-5">Date</th>
                            <th className="px-6 py-5">Customer</th>
                            <th className="px-6 py-5">Items Summary</th>
                            <th className="px-6 py-5">Mode</th>
                            <th className="px-6 py-5 text-right">Total</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50 font-medium">
                        {sales.map(s => (
                            <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(s.timestamp).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {s.customerName}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="max-w-[200px] truncate text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-lg font-bold uppercase">
                                        {s.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                            s.paymentMethod === 'Credit (Udhaar)'
                                                ? 'bg-rose-50 text-rose-500'
                                                : 'bg-indigo-50 text-indigo-500'
                                        }`}
                                    >
                                        {s.paymentMethod}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right font-black text-slate-800 text-lg">
                                    ₹{s.total.toLocaleString('en-IN')}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        
                                        {/* Download Button */}
                                        <button
                                            onClick={() => downloadBill(s)}
                                            className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-bold"
                                        >
                                            <FileText size={16} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this sale?")) {
                                                    deleteSale(s._id);
                                                }
                                            }}
                                            className="bg-rose-50 text-rose-500 p-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-bold"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {sales.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest">
                                    No Sales Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;