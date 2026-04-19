import React from 'react';
import { XCircle } from 'lucide-react';

const ProductModal = ({ editProduct, setIsAddingProduct, handleAddOrEdit }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[48px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b bg-indigo-600 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-2xl tracking-tight">
                            {editProduct ? 'Edit Details' : 'Register Product'}
                        </h3>
                        <p className="text-indigo-100 text-sm font-medium opacity-80">Track stock and expiry precisely.</p>
                    </div>
                    <button
                        onClick={() => setIsAddingProduct(false)}
                        className="hover:bg-white/20 p-2 rounded-2xl transition-colors"
                    >
                        <XCircle size={32} />
                    </button>
                </div>

                <form onSubmit={handleAddOrEdit} className="p-10 space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                        <input required name="name" defaultValue={editProduct?.name} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <input required name="category" defaultValue={editProduct?.category} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                            <input name="expiryDate" type="date" defaultValue={editProduct?.expiryDate} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                            <input required name="price" type="number" step="0.01" defaultValue={editProduct?.price} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost (₹)</label>
                            <input required name="costPrice" type="number" step="0.01" defaultValue={editProduct?.costPrice} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</label>
                            <input required name="stock" type="number" defaultValue={editProduct?.stock} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Alert</label>
                            <input required name="minStock" type="number" defaultValue={editProduct?.minStock || 5} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsAddingProduct(false)}
                            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;