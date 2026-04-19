import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, QrCode, Printer, X, FileText } from 'lucide-react';

const POS = ({
    filteredInventory,
    addToCart,
    cart,
    setCart,
    paymentMethod,
    setPaymentMethod,
    customerName,
    setCustomerName,
    customerContact,
    setCustomerContact,
    customerAddress,
    setCustomerAddress,
    customerCompany,
    setCustomerCompany,
    completeSale,
    isMobileView = false
}) => {
    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    const [showUdhaarModal, setShowUdhaarModal] = useState(false);

    const handlePaymentMethodSelect = (m) => {
        setPaymentMethod(m);
        // Only show modal if details are missing
        if (!customerName || !customerContact) {
            setShowUdhaarModal(true);
        }
    };

    const handleComplete = () => {
        // Require customer name and contact for ALL transactions now
        if (!customerName || !customerContact) {
            setShowUdhaarModal(true); // force them to fill it
            return;
        }
        completeSale();
    };

    return (
        <div className={`flex gap-4 animate-in fade-in duration-500 ${isMobileView ? 'flex-col' : 'flex-col lg:flex-row lg:gap-8'}`}>
            {/* Products Section */}
            <div className={`flex-1 ${isMobileView ? 'space-y-4' : 'space-y-4 md:space-y-6'}`}>
                <div className={`flex items-center justify-between mb-2 ${isMobileView ? '' : 'lg:hidden'}`}>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tap items to add</p>
                </div>
                <div className={`grid gap-2 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 md:gap-4'}`}>
                    {filteredInventory.filter(i => i.stock > 0).map(item => (
                        <button key={item._id} onClick={() => addToCart(item)} className={`bg-white border text-left hover:border-amber-500 shadow-sm border-slate-200 transition-all active:scale-[0.98] flex flex-col justify-between ${isMobileView ? 'p-3 rounded-lg' : 'p-4 md:p-5 rounded-lg hover:shadow-md'}`}>
                            <p className={`font-bold text-slate-800 leading-tight line-clamp-2 mb-2 ${isMobileView ? 'text-xs' : 'text-xs md:text-sm'}`}>{item.name}</p>
                            <div className="flex justify-between items-end w-full mt-auto">
                                <span className={`text-slate-800 font-black ${isMobileView ? 'text-sm' : 'text-sm md:text-lg'}`}>₹{item.price}</span>
                                <div className={`bg-slate-100 border border-slate-300 text-slate-600 rounded-md ${isMobileView ? 'p-1' : 'p-1 md:p-1.5'}`}><Plus size={14} strokeWidth={3} /></div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart & Payment Section */}
            <div className={`w-full flex flex-col shrink-0 ${isMobileView ? 'gap-3 mt-4' : 'lg:w-[400px] gap-4 md:gap-6 lg:mt-0'}`}>
                {/* Cart breakdown */}
                <div className={`bg-white shadow-sm border border-x-slate-200 border-b-slate-200 border-t-4 border-t-amber-500 flex flex-col relative ${isMobileView ? 'rounded-lg p-4' : 'rounded-lg p-5 md:p-8'}`}>
                    <h4 className={`font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 ${isMobileView ? 'text-sm mb-3' : 'text-sm mb-4 md:mb-6'}`}>
                        <ShoppingCart size={18} className="text-amber-500" /> New Bill
                        {cart.length > 0 && <span className="absolute top-4 right-4 bg-slate-100 border border-slate-200 text-slate-600 tracking-widest text-[10px] font-black px-2 py-1 rounded-md">{cart.length} items</span>}
                    </h4>
                    
                    <div className={`flex-1 overflow-y-auto pr-2 ${isMobileView ? 'min-h-[120px] max-h-48 space-y-2' : 'min-h-[150px] max-h-60 lg:max-h-[350px] space-y-2 md:space-y-3'}`}>
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 mt-4">
                                <ShoppingCart size={32} opacity={0.5}/>
                                <p className="text-[10px] uppercase font-black tracking-widest text-center mt-2">Cart is empty</p>
                            </div>
                        ) : (
                            cart.map(i => (
                                <div key={i._id} className={`bg-slate-50 flex justify-between items-center border border-slate-200 ${isMobileView ? 'p-2.5 rounded-lg' : 'p-3 md:p-4 rounded-lg'}`}>
                                    <div className="flex-1 pr-2">
                                        <p className={`font-bold text-slate-800 line-clamp-1 ${isMobileView ? 'text-xs' : 'text-xs md:text-sm'}`}>{i.name}</p>
                                        <p className={`text-slate-500 font-black tracking-wider uppercase ${isMobileView ? 'text-[9px]' : 'text-[10px] md:text-[10px]'}`}>{i.quantity} x ₹{i.price}</p>
                                    </div>
                                    <div className={`flex items-center gap-3`}>
                                        <span className={`font-black text-slate-800 tracking-tight ${isMobileView ? 'text-xs' : 'text-sm'}`}>₹{i.price * i.quantity}</span>
                                        <button onClick={() => setCart(c => c.filter(x => x._id !== i._id))} className="text-slate-400 hover:text-rose-500 p-1.5 focus:outline-none transition-colors border border-slate-200 hover:border-rose-200 bg-white rounded-md shadow-sm"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className={`border-t-2 border-dashed border-slate-200 ${isMobileView ? 'pt-3 mt-3 space-y-3' : 'pt-4 md:pt-6 mt-4 md:mt-4 space-y-4'}`}>
                        {paymentMethod === 'UPI/Online' && cart.length > 0 && (
                            <div className={`bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 animate-in ${isMobileView ? 'p-2 rounded-lg' : 'p-3 rounded-lg'}`}>
                                <QrCode size={18} className="text-emerald-600" />
                                <p className={`font-black uppercase tracking-widest text-emerald-600 ${isMobileView ? 'text-[10px]' : 'text-[10px]'}`}>UPI Payment Selected</p>
                            </div>
                        )}
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Bill Total</p>
                                <p className={`font-black tracking-tight text-slate-800 leading-none ${isMobileView ? 'text-3xl' : 'text-3xl md:text-4xl'}`}>₹{total.toLocaleString('en-IN')}</p>
                            </div>
                            <button onClick={() => window.print()} className={`bg-slate-50 text-slate-500 border border-slate-200 shadow-sm ${isMobileView ? 'p-2.5 rounded-lg' : 'p-3 rounded-lg hover:text-amber-500 hover:border-amber-500 transition'}`}><Printer size={16} /></button>
                        </div>
                    </div>
                </div>

                <div className={`bg-white border text-slate-800 shadow-sm ${isMobileView ? 'rounded-lg p-5 space-y-4' : 'rounded-lg p-5 md:p-6 space-y-5'}`}>
                    <div className={`space-y-4`}>
                        <div className="flex gap-2">
                            <input value={customerName} readOnly placeholder="Customer Name (Required)" className={`flex-1 bg-slate-50 border-slate-200 border py-3 px-4 font-bold text-slate-800 placeholder:text-slate-400 cursor-not-allowed ${isMobileView ? 'rounded-lg text-xs' : 'rounded-lg text-sm'}`} />
                            <button onClick={() => setShowUdhaarModal(true)} className="px-4 bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all">Edit Info</button>
                        </div>
                        <div className={`grid gap-2 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                            {['Cash', 'UPI/Online', 'Credit (Udhaar)', 'Card'].map(m => (
                                <button key={m} onClick={() => handlePaymentMethodSelect(m)} className={`py-2.5 font-black uppercase tracking-widest transition-all ${paymentMethod === m ? 'bg-amber-500 text-slate-900 shadow-sm' : 'border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'} rounded-md text-[10px]`}>{m}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleComplete} disabled={cart.length === 0} className={`w-full py-4 text-xs font-black uppercase tracking-widest transition-all rounded-md ${cart.length === 0 ? 'bg-slate-100 border border-slate-200 text-slate-400' : 'bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-[0.98] shadow-lg shadow-amber-500/20'}`}>Complete Transaction</button>
                </div>
            </div>

            {/* Customer Details Modal */}
            {showUdhaarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2"><FileText size={18} className="text-amber-500"/> Customer Information</h3>
                            <button onClick={() => setShowUdhaarModal(false)} className="text-slate-400 hover:text-slate-800 transition"><X size={20}/></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Customer Context for the Invoice</p>
                            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer Name *" required className="w-full bg-slate-50 border-slate-200 border py-3 px-4 font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-amber-500 transition rounded-lg text-sm" />
                            <input value={customerContact} onChange={e => setCustomerContact(e.target.value)} placeholder="Contact Number *" required className="w-full bg-slate-50 border-slate-200 border py-3 px-4 font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-amber-500 transition rounded-lg text-sm" />
                            <input value={customerCompany} onChange={e => setCustomerCompany(e.target.value)} placeholder="Company / Business Name" className="w-full bg-slate-50 border-slate-200 border py-3 px-4 font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-amber-500 transition rounded-lg text-sm" />
                            <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Full Address" className="w-full bg-slate-50 border-slate-200 border py-3 px-4 font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-amber-500 transition rounded-lg text-sm h-24 resize-none"></textarea>
                            <button onClick={() => setShowUdhaarModal(false)} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-lg text-xs transition">Save Details</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default POS;