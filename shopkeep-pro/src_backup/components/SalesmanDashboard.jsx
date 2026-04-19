import React, { useState } from 'react';
import { Menu, X, DollarSign, Wallet, TrendingUp, Users, Package, Tag, LogOut, ChevronRight, ClipboardList, ShoppingCart } from 'lucide-react';
import ItemList from './ItemList';
import POS from './POS';

const SalesmanDashboard = ({ 
  sales, inventory, filteredInventory,
  addToCart, cart, setCart, paymentMethod, setPaymentMethod,
  customerName, setCustomerName, completeSale, onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const name = localStorage.getItem('name') || 'Salesman';
  
  // Simulated Metric Calculations
  const today = new Date();
  const todaysSales = sales.filter(s => {
    const d = new Date(s.timestamp);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  
  const thisMonthSales = sales.filter(s => {
    const d = new Date(s.timestamp);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const calcEarning = (salesArray) => salesArray.reduce((acc, sale) => acc + (sale.total * 0.05), 0); // Simulated 5% commission
  
  const todayEarning = calcEarning(todaysSales);
  const monthEarning = calcEarning(thisMonthSales);
  const totalEarning = calcEarning(sales);

  const menuItems = [
    { id: 'dashboard', icon: <TrendingUp size={20} />, label: 'Dashboard' },
    { id: 'pos', icon: <ShoppingCart size={20} />, label: 'Add Sale' },
    { id: 'itemlist', icon: <ClipboardList size={20} />, label: 'Item List' },
    { id: 'customers', icon: <Users size={20} />, label: 'Customers' },
    { id: 'commission', icon: <DollarSign size={20} />, label: 'Commission List' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex justify-center">
      {/* Mobile container - restricts width on desktop to simulate mobile */}
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen relative overflow-hidden flex flex-col">
        
        {/* Top Navigation Bar */}
        <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMenuOpen(true)} className="p-1 hover:bg-white/20 rounded-lg transition">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-wide">Hi, {name}</h1>
          </div>
        </div>

        {/* Slide-over Menu */}
        {isMenuOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
            <div className="w-3/4 max-w-sm bg-white h-full shadow-2xl relative flex flex-col transform animate-slideInLeft transition-transform">
              <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                <span className="font-bold text-xl">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left transition font-medium border-b border-slate-100 last:border-0 ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    <span className={activeTab === item.id ? 'text-indigo-600' : 'text-indigo-400'}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100">
                <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-medium">
                  <LogOut size={20} />
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
              <h2 className="text-xl font-bold mb-4">Item List & Prices</h2>
              <ItemList inventory={inventory} />
            </div>
          ) : activeTab === 'pos' ? (
            <div className="pb-10">
              <h2 className="text-xl font-bold mb-4 text-slate-800">Add Sale (POS)</h2>
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
                completeSale={completeSale}
              />
            </div>
          ) : activeTab === 'dashboard' ? (
            <>
              {/* Earnings Cards (Horizontal Scroll or Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet size={64} /></div>
                  <p className="text-indigo-100 font-medium mb-1">Today's Earning</p>
                  <h2 className="text-4xl font-black">₹{todayEarning.toFixed(2)}</h2>
                </div>
                
                <div className="bg-white border text-center border-slate-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium mb-1 line-clamp-1">This Month</p>
                  <h3 className="text-xl font-bold text-slate-800">₹{monthEarning.toFixed(2)}</h3>
                </div>

                <div className="bg-white border text-center border-slate-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium mb-1 line-clamp-1">Total Earning</p>
                  <h3 className="text-xl font-bold text-slate-800">₹{totalEarning.toFixed(2)}</h3>
                </div>
              </div>

              {/* Glipmse of Sales */}
              <div>
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="font-bold text-lg text-slate-800">Recent Sales</h3>
                  <button className="text-indigo-600 text-sm font-semibold flex items-center">
                    See all <ChevronRight size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {sales.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
                      No sales recorded yet.
                    </div>
                  ) : (
                    sales.slice(0, 5).map((sale) => (
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
