import React, { useState } from 'react';
import { Menu, X, DollarSign, Wallet, TrendingUp, Users, Package, Tag, LogOut, ChevronRight, ClipboardList, ShoppingCart, BookOpen, Sparkles } from 'lucide-react';
import ItemList from './ItemList';
import POS from './POS';
import SalesHistory from './SalesHistory';
import KhaataLedger from './KhaataLedger';
import Customers from './Customers';
import AIAnalyst from './AIAnalyst';

const SalesmanDashboard = ({ 
  sales, inventory, filteredInventory,
  addToCart, cart, setCart, paymentMethod, setPaymentMethod,
  customerName, setCustomerName, customerContact, setCustomerContact,
  customerAddress, setCustomerAddress, customerCompany, setCustomerCompany,
  completeSale, downloadBill, dismissSale, settleBill, deleteSale, stats, onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const name = localStorage.getItem('name') || 'Salesman';

  // Base scope for salesman (Filter out dismissed sales)
  const mySales = sales.filter(s => s.salesmanName === name && s.salesmanDismissed !== true);
  
  // Simulated Metric Calculations
  const today = new Date();
  const todaysSales = mySales.filter(s => {
    const d = new Date(s.timestamp);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  
  const thisMonthSales = mySales.filter(s => {
    const d = new Date(s.timestamp);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const calcEarning = (salesArray) => salesArray.reduce((acc, sale) => acc + (sale.total * 0.05), 0); // Simulated 5% commission
  
  const todayEarning = calcEarning(todaysSales);
  const monthEarning = calcEarning(thisMonthSales);
  const totalEarning = calcEarning(mySales);

  const menuItems = [
    { id: 'dashboard', icon: <TrendingUp size={20} />, label: 'Dashboard' },
    { id: 'pos', icon: <ShoppingCart size={20} />, label: 'Add Sale' },
    { id: 'itemlist', icon: <ClipboardList size={20} />, label: 'Item List' },
    { id: 'saleshistory', icon: <ClipboardList size={20} />, label: 'Sales History' },
    { id: 'khaata', icon: <BookOpen size={20} />, label: 'My Khaata' },
    { id: 'customers', icon: <Users size={20} />, label: 'My Customers' },
    { id: 'ai', icon: <Sparkles size={20} className="text-indigo-500" />, label: 'Sales Coach' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex justify-center">
      {/* Mobile container - restricts width on desktop to simulate mobile */}
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen relative flex flex-col">
        
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-slate-200 text-slate-800 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMenuOpen(true)} className="p-1 hover:bg-slate-100 rounded-lg transition active:scale-[0.95]">
              <Menu size={24} className="text-slate-800"/>
            </button>
            <h1 className="text-xl font-black tracking-widest uppercase">Hi, {name}</h1>
          </div>
        </div>

        {/* Slide-over Menu */}
        {isMenuOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
            <div className="w-3/4 max-w-sm bg-white text-slate-600 h-full shadow-2xl relative flex flex-col transform animate-slideInLeft transition-transform">
              <div className="p-6 bg-slate-50 text-slate-800 flex justify-between items-center border-b border-slate-200">
                <span className="font-black text-xl tracking-widest uppercase text-slate-800">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 space-y-2">
                {menuItems.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left transition font-black tracking-widest uppercase text-sm ${activeTab === item.id ? 'bg-slate-100 text-amber-600 border-l-4 border-amber-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                  >
                    <span className={activeTab === item.id ? 'text-amber-500' : 'text-slate-500'}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200">
                <button onClick={onLogout} className="w-full justify-center flex items-center gap-3 px-4 py-3.5 bg-white border-rose-200 border text-rose-500 hover:bg-rose-50 hover:border-rose-300 rounded-lg transition font-black tracking-widest uppercase text-xs">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {activeTab === 'itemlist' ? (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-slate-800">Item List & Prices</h2>
              <ItemList inventory={inventory} />
            </div>
          ) : activeTab === 'pos' ? (
            <div className="pb-10">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-slate-800">Add Sale (POS)</h2>
               <POS
                isMobileView={true}
                filteredInventory={filteredInventory}
                addToCart={addToCart}
                cart={cart}
                setCart={setCart}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerContact={customerContact}
                setCustomerContact={setCustomerContact}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                customerCompany={customerCompany}
                setCustomerCompany={setCustomerCompany}
                completeSale={completeSale}
              />
            </div>
          ) : activeTab === 'dashboard' ? (
            <>
              {/* Earnings Cards (Horizontal Scroll or Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-white border border-slate-200 border-t-4 border-t-amber-500 rounded-lg p-5 text-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><Wallet size={80} /></div>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2">Today's Earning</p>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800">₹{todayEarning.toFixed(2)}</h2>
                </div>
                
                <div className="bg-white border-x border-b border-t border-t-slate-300 text-center border-slate-200 rounded-lg p-4 shadow-sm">
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1 line-clamp-1">This Month</p>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">₹{monthEarning.toFixed(2)}</h3>
                </div>

                <div className="bg-white border-x border-b border-t border-t-slate-300 text-center border-slate-200 rounded-lg p-4 shadow-sm">
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1 line-clamp-1">Total Earning</p>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">₹{totalEarning.toFixed(2)}</h3>
                </div>
              </div>

              {/* Glipmse of Sales */}
              <div>
                <div className="flex justify-between items-center px-1 mb-3">
                  <h3 className="font-black tracking-widest uppercase text-xs text-slate-800">Recent Sales</h3>
                  <button className="text-amber-600 text-xs font-black flex items-center hover:underline">
                    See all <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {mySales.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
                      No sales recorded yet.
                    </div>
                  ) : (
                    mySales.slice(0, 5).map((sale) => (
                      <div key={sale._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                        <div>
                          <p className="font-bold text-slate-800">{sale.customerName || 'Walk-in Customer'}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(sale.timestamp).toLocaleDateString()} • {sale.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-800">₹{sale.total}</p>
                          <p className="text-xs font-semibold text-emerald-500 bg-emerald-50 inline-block px-2 py-0.5 rounded-full mt-1">
                            + ₹{(sale.total * 0.05).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : activeTab === 'saleshistory' ? (
            <div className="pb-10">
              <SalesHistory 
                sales={mySales} 
                downloadBill={downloadBill} 
                deleteSale={null} 
                dismissSale={dismissSale}
              />
            </div>
          ) : activeTab === 'khaata' ? (
            <div className="pb-10 px-4 origin-top">
              <KhaataLedger 
                sales={mySales} 
                stats={{...stats, khaataTotal: mySales.filter(s => s.paymentMethod === 'Credit (Udhaar)').reduce((a,b) => a+b.total, 0)}} 
                settleBill={settleBill} 
                deleteSale={deleteSale} 
              />
            </div>
          ) : activeTab === 'customers' ? (
            <div className="pb-10 px-4 origin-top">
               <Customers sales={mySales} />
            </div>
          ) : activeTab === 'ai' ? (
            <div className="pb-10 px-4 origin-top">
               <AIAnalyst salesmanName={name} />
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              This tab is under construction.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;
