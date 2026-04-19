import React from 'react';
import { Search, Edit3, Trash2, AlertCircle, XCircle } from 'lucide-react';

const Inventory = ({
    filteredInventory,
    searchTerm,
    setSearchTerm,
    inventoryFilter,
    setInventoryFilter,
    isAdmin,
    setEditProduct,
    setIsAddingProduct,
    deleteProduct
}) => {

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            
            {/* Search and Filter Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/30">
                
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={`Search in ${inventoryFilter} inventory...`}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-slate-200 border focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* FILTER BUTTONS (NO EXPIRY) */}
                <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl shrink-0">
                    {['all', 'low', 'out'].map(f => (
                        <button
                            key={f}
                            onClick={() => setInventoryFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition-all ${
                                inventoryFilter === f
                                    ? 'bg-white shadow-md text-indigo-600'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {f === 'out' ? 'Out of Stock' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-5">Product Details</th>
                            <th className="px-6 py-5">Pricing (₹)</th>
                            {isAdmin && <th className="px-6 py-5">Profit Margin</th>}
                            <th className="px-6 py-5">Status & Stock</th>
                            {isAdmin && <th className="px-6 py-5 text-right">Actions</th>}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredInventory.map(item => {
                            const outOfStock = item.stock <= 0;

                            return (
                                <tr key={item._id} className="hover:bg-slate-50/50 group transition-colors">

                                    {/* PRODUCT */}
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                            {item.category}
                                        </p>
                                    </td>

                                    {/* PRICE */}
                                    <td className="px-6 py-4">
                                        <p className="font-black text-slate-800">₹{item.price}</p>
                                        {isAdmin && (
                                            <p className="text-[10px] text-slate-400 font-bold">
                                                Cost: ₹{item.costPrice}
                                            </p>
                                        )}
                                    </td>

                                    {/* PROFIT */}
                                    {isAdmin && (
                                        <td className="px-6 py-4 font-bold text-emerald-600">
                                            ₹{(item.price - item.costPrice).toFixed(2)}
                                        </td>
                                    )}

                                    {/* STOCK STATUS */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">

                                            <div className="flex gap-1 flex-wrap">
                                                {outOfStock ? (
                                                    <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1">
                                                        <XCircle size={10} /> OUT OF STOCK
                                                    </span>
                                                ) : (
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 ${
                                                        item.stock <= (item.minStock || 5)
                                                            ? 'bg-amber-100 text-amber-600'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {item.stock} UNITS
                                                    </span>
                                                )}
                                            </div>

                                        </div>
                                    </td>

                                    {/* ACTIONS */}
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditProduct(item);
                                                        setIsAddingProduct(true);
                                                    }}
                                                    className="p-2 hover:bg-indigo-50 text-indigo-500 rounded-xl transition-colors"
                                                >
                                                    <Edit3 size={16} />
                                                </button>

                                                <button
                                                    onClick={() => deleteProduct(item._id)}
                                                    className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}

                        {/* EMPTY STATE */}
                        {filteredInventory.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-40">
                                        <Search size={48} className="mb-4 text-slate-300" />
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                                            No {inventoryFilter === 'all' ? '' : inventoryFilter} products found
                                        </p>
                                        <p className="text-slate-400 text-[10px] font-bold mt-1">
                                            Try adjusting your filters or search term.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;