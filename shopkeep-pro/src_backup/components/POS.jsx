import React from 'react';
import { ShoppingCart, Plus, Trash2, QrCode, Printer } from 'lucide-react';

const POS = ({
    filteredInventory,
    addToCart,
    cart,
    setCart,
    paymentMethod,
    setPaymentMethod,
    customerName,
    setCustomerName,
    completeSale,
    isMobileView = false
}) => {
    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);

    return (
        <div className={`flex gap-4 animate-in fade-in duration-500 ${isMobileView ? 'flex-col' : 'flex-col lg:flex-row lg:gap-8'}`}>
            {/* Products Section */}
            <div className={`flex-1 ${isMobileView ? 'space-y-4' : 'space-y-4 md:space-y-6'}`}>
                <div className={`flex items-center justify-between mb-2 ${isMobileView ? '' : 'lg:hidden'}`}>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tap items to add</p>
                </div>
                <div className={`grid gap-2 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 md:gap-4'}`}>
                    {filteredInventory.filter(i => i.stock > 0).map(item => (
                        <button key={item._id} onClick={() => addToCart(item)} className={`bg-white border border-slate-100 shadow-sm text-left hover:border-indigo-500 transition-all active:scale-[0.95] flex flex-col justify-between ${isMobileView ? 'p-3 rounded-2xl' : 'p-4 md:p-5 rounded-2xl md:rounded-3xl hover:shadow-md'}`}>
                            <p className={`font-bold text-slate-800 leading-tight line-clamp-2 mb-2 ${isMobileView ? 'text-xs' : 'text-xs md:text-sm'}`}>{item.name}</p>
                            <div className="flex justify-between items-end w-full mt-auto">
                                <span className={`text-indigo-600 font-black ${isMobileView ? 'text-sm' : 'text-sm md:text-lg'}`}>₹{item.price}</span>
                                <div className={`bg-indigo-50 text-indigo-600 rounded-md ${isMobileView ? 'p-1' : 'p-1 md:p-1.5'}`}><Plus size={14} strokeWidth={3} /></div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart & Payment Section */}
            <div className={`w-full flex flex-col shrink-0 ${isMobileView ? 'gap-3 mt-4' : 'lg:w-[400px] gap-4 md:gap-6 lg:mt-0'}`}>
                {/* Cart breakdown */}
                <div className={`bg-white shadow-lg border border-slate-100 flex flex-col relative ${isMobileView ? 'rounded-2xl p-4' : 'rounded-3xl md:rounded-[40px] p-5 md:p-8'}`}>
                    <h4 className={`font-black text-slate-800 flex items-center gap-2 ${isMobileView ? 'text-lg mb-3' : 'text-xl mb-4 md:mb-6'}`}>
                        <ShoppingCart size={20} className="text-indigo-600" /> New Bill
                        {cart.length > 0 && <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-full">{cart.length} items</span>}
                    </h4>
                    
                    <div className={`flex-1 overflow-y-auto pr-2 ${isMobileView ? 'min-h-[120px] max-h-48 space-y-2' : 'min-h-[150px] max-h-60 lg:max-h-[350px] space-y-2 md:space-y-3'}`}>
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 mt-4">
                                <ShoppingCart size={32} opacity={0.5}/>
                                <p className="text-xs font-medium text-center">Cart is empty</p>
                            </div>
                        ) : (
                            cart.map(i => (
                                <div key={i._id} className={`bg-slate-50 flex justify-between items-center border border-slate-100 ${isMobileView ? 'p-2.5 rounded-xl' : 'p-3 md:p-4 rounded-xl md:rounded-2xl'}`}>
                                    <div className="flex-1 pr-2">
                                        <p className={`font-bold text-slate-800 line-clamp-1 ${isMobileView ? 'text-xs' : 'text-xs md:text-sm'}`}>{i.name}</p>
                                        <p className={`text-slate-400 font-bold ${isMobileView ? 'text-[10px]' : 'text-[10px] md:text-xs'}`}>{i.quantity} x ₹{i.price}</p>
                                    </div>
                                    <div className={`flex items-center ${isMobileView ? 'gap-2' : 'gap-2 md:gap-3'}`}>
                                        <span className={`font-black text-slate-700 ${isMobileView ? 'text-xs' : 'text-sm'}`}>₹{i.price * i.quantity}</span>
                                        <button onClick={() => setCart(c => c.filter(x => x._id !== i._id))} className="text-slate-300 hover:text-rose-500 p-1 bg-white rounded-md shadow-sm border border-slate-100"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className={`border-t-2 border-dashed border-slate-100 ${isMobileView ? 'pt-3 mt-3 space-y-3' : 'pt-4 md:pt-6 mt-4 md:mt-4 space-y-4'}`}>
                        {paymentMethod === 'UPI/Online' && cart.length > 0 && (
                            <div className={`bg-indigo-50 flex items-center justify-center gap-2 animate-in ${isMobileView ? 'p-2 rounded-xl' : 'p-3 md:p-4 rounded-xl md:rounded-2xl'}`}>
                                <QrCode size={20} className="text-indigo-600" />
                                <p className={`font-bold text-indigo-600 ${isMobileView ? 'text-[10px]' : 'text-xs'}`}>UPI Payment Selected</p>
                            </div>
                        )}
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bill Total</p>
                                <p className={`font-black text-indigo-600 leading-none ${isMobileView ? 'text-2xl' : 'text-2xl md:text-3xl'}`}>₹{total.toLocaleString('en-IN')}</p>
                            </div>
                            <button onClick={() => window.print()} className={`bg-slate-50 text-slate-400 border border-slate-200 shadow-sm ${isMobileView ? 'p-2 rounded-lg' : 'p-2.5 md:p-3 rounded-xl hover:text-indigo-600 transition'}`}><Printer size={16} /></button>
                        </div>
                    </div>
                </div>

                {/* Checkout Block */}
                <div className={`bg-indigo-600 text-white shadow-xl ${isMobileView ? 'rounded-2xl p-4 space-y-4' : 'rounded-3xl md:rounded-[40px] p-5 md:p-8 space-y-5'}`}>
                    <div className={`space-y-3`}>
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer Name (Optional)" className={`w-full bg-white/10 border border-white/20 py-2.5 px-3 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition ${isMobileView ? 'rounded-xl text-xs' : 'rounded-xl text-sm'}`} />
                        <div className={`grid gap-2 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                            {['Cash', 'UPI/Online', 'Credit (Udhaar)', 'Card'].map(m => (
                                <button key={m} onClick={() => setPaymentMethod(m)} className={`py-2 font-black transition-all ${paymentMethod === m ? 'bg-white text-indigo-600 shadow-sm transform scale-[1.02]' : 'bg-white/10 text-white/70 hover:bg-white/20'} ${isMobileView ? 'rounded-lg text-[10px]' : 'rounded-lg md:rounded-xl text-[10px] md:text-xs'}`}>{m}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={completeSale} disabled={cart.length === 0} className={`w-full py-3 font-black uppercase shadow-lg transition-all ${cart.length === 0 ? 'bg-indigo-700/50 text-indigo-300 opacity-50' : 'bg-emerald-400 text-indigo-950 hover:bg-emerald-300 active:scale-[0.98]'} ${isMobileView ? 'rounded-xl text-[10px]' : 'rounded-xl md:rounded-2xl text-[10px] md:text-xs md:py-4'}`}>Complete Transaction</button>
                </div>
            </div>
        </div>
    );
};

export default POS;