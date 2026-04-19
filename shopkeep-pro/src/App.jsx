import React, { useState, useEffect, useMemo } from 'react';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import KhaataLedger from './components/KhaataLedger';
import SalesHistory from './components/SalesHistory';
import ProductModal from './components/ProductModal';
import { Plus, RefreshCw } from 'lucide-react';
import Login from "./pages/auth/Login";
import Salesmen from "./components/Salesmen";
import SalesmanDashboard from "./components/SalesmanDashboard";
import ItemList from "./components/ItemList";
import Customers from "./components/Customers";
import AIAnalyst from "./components/AIAnalyst";
import { API_BASE_URL } from "./config";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(true);
  useEffect(() => {
  if (role === "admin") setIsAdmin(true);
  else setIsAdmin(false);
}, [role]);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('all');
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  setIsAuthenticated(false);
  setRole(null);
};

  // --- 1. INITIAL DATA FETCH FROM MONGODB ---
 useEffect(() => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (token) {
    setIsAuthenticated(true);
    setRole(userRole);
  }

  fetchData();
}, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, salesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/sales`)
      ]);
      if (prodRes.ok && salesRes.ok) {
        setInventory(await prodRes.json());
        setSales(await salesRes.json());
      }
    } catch (err) {
      console.error("Failed to connect to backend:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ANALYTICS & STATS ---
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);

    const totalProfit = sales.reduce((acc, sale) => {
      const saleProfit = sale.items.reduce((pAcc, item) => {
        // Find original product to get costPrice for profit calculation
        const originalProduct = inventory.find(p => p.name === item.name);
        const cost = originalProduct?.costPrice || 0;
        return pAcc + ((item.price - cost) * item.quantity);
      }, 0);
      return acc + saleProfit;
    }, 0);

    const lowStock = inventory.filter(i => i.stock <= i.minStock && i.stock > 0);
    const outOfStock = inventory.filter(i => i.stock <= 0);

    const today = new Date();
    const expiringSoon = inventory.filter(i => {
      if (!i.expiryDate) return false;
      const exp = new Date(i.expiryDate);
      const diffDays = (exp - today) / (1000 * 60 * 60 * 24);
      return diffDays > 0 && diffDays < 90;
    });

    const khaataTotal = sales
      .filter(s => s.paymentMethod === 'Credit (Udhaar)')
      .reduce((acc, s) => acc + s.total, 0);

    const productSalesMap = {};
    sales.forEach(s => s.items.forEach(i => {
      productSalesMap[i.name] = (productSalesMap[i.name] || 0) + i.quantity;
    }));
    const topProducts = Object.entries(productSalesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { totalRevenue, totalProfit, lowStock, outOfStock, expiringSoon, khaataTotal, topProducts };
  }, [inventory, sales]);

  // --- 3. INVENTORY ACTIONS (DB INTEGRATED) ---
  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      expiryDate: formData.get('expiryDate'),
      price: parseFloat(formData.get('price')),
      costPrice: parseFloat(formData.get('costPrice')),
      stock: parseInt(formData.get('stock')),
      minStock: parseInt(formData.get('minStock'))
    };

    try {
      const url = editProduct ? `${API_BASE_URL}/products/${editProduct._id}` : `${API_BASE_URL}/products`;
      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        fetchData(); // Refresh list from DB
        setIsAddingProduct(false);
        setEditProduct(null);
      }
    } catch (err) {
      alert("Error saving product to database");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this item permanently?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
        if (res.ok) fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // --- 4. POS & SALES LOGIC (DB INTEGRATED) ---
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Out of stock!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Cannot exceed available stock");
          return prev;
        }
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const completeSale = async () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const saleData = {
      items: cart,
      total,
      paymentMethod,
      customerName: customerName || (paymentMethod === 'Credit (Udhaar)' ? "Untitled Customer" : "Walk-in"),
      customerContact,
      customerAddress,
      customerCompany,
      salesmanName: localStorage.getItem('role') === 'salesman' ? localStorage.getItem('name') : 'Admin',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      if (res.ok) {
        fetchData(); // This refreshes inventory stock levels from the server
        setCart([]);
        setCustomerName('');
        setCustomerContact('');
        setCustomerAddress('');
        setCustomerCompany('');
        setPaymentMethod('Cash');
        setActiveTab('history');
      }
    } catch (err) {
      alert("Failed to process transaction");
    }
  };

  const dismissSale = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salesmanDismissed: true })
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to remove sale from dashboard");
      }
    } catch (err) {
      console.error("Dismiss failed:", err);
    }
  };

  const deleteSale = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData(); // Refresh data after deletion
      } else {
        alert("Failed to delete sale");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting sale");
    }
  };

  const settleBill = async (id) => {
    if (window.confirm("Settle this bill? This will mark the credit as paid.")) {
      try {
        const res = await fetch(`${API_BASE_URL}/sales/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethod: 'Cash' })
        });
        if (res.ok) {
          fetchData(); // Refresh data after settling
        } else {
          alert("Failed to settle bill");
        }
      } catch (err) {
        console.error("Settle failed:", err);
        alert("Error settling bill");
      }
    }
  };

  // --- 5. FILTERS & UTILS ---
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (inventoryFilter === 'low') return matchesSearch && item.stock <= (item.minStock || 5) && item.stock > 0;
    if (inventoryFilter === 'out') return matchesSearch && item.stock <= 0;
    if (inventoryFilter === 'expiring') {
      const today = new Date();
      const expDate = item.expiryDate ? new Date(item.expiryDate) : null;
      return matchesSearch && expDate && (expDate < today || (expDate - today) / (1000 * 60 * 60 * 24) < 30);
    }
    return matchesSearch;
  });

  const downloadBill = (sale) => {
    // Configuration
    const shopName = "SHOPKEEP PRO - RETAIL";
    const shopAddress = "123 Market Street, Nashik - 111222\nPhone: +91 1234567890";
    const invoiceId = `INV-${sale._id.slice(-6).toUpperCase()}`;
    const dateStr = new Date(sale.timestamp).toLocaleString();

    // Header and Metadata
    let bill = `${shopName}\n`;
    bill += `${shopAddress}\n`;
    bill += `==========================================\n`;
    bill += `INVOICE ID : ${invoiceId}\n`;
    bill += `DATE       : ${dateStr}\n`;
    bill += `CUSTOMER   : ${sale.customerName}\n`;
    bill += `PAYMENT    : ${sale.paymentMethod}\n`; // Added payment method
    bill += `==========================================\n`;

    // Table Header
    bill += `ITEM                QTY    PRICE   TOTAL\n`;
    bill += `------------------------------------------\n`;

    // Itemized List
    sale.items.forEach(item => {
      const name = item.name.padEnd(18).slice(0, 18);
      const qty = item.quantity.toString().padEnd(5);
      const price = `₹${item.price}`.padEnd(7);
      const total = `₹${item.price * item.quantity}`;
      bill += `${name}  ${qty}  ${price}  ${total}\n`;
    });

    // Footer and Summary
    bill += `------------------------------------------\n`;
    bill += `GRAND TOTAL:          ₹${sale.total.toLocaleString('en-IN')}\n`;
    bill += `==========================================\n\n`;

    // Closing Messages
    bill += `Thank you for shopping with us!\n`; // Added Thank you message
    bill += `Please visit again.\n`;           // Added Visit again message
    bill += `====================================\n`;

    // Generate Download
    const blob = new Blob([bill], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bill_${invoiceId}.txt`;

    // Add to document, trigger, and cleanup
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Loading Screen
  if (!isAuthenticated) {
  return (
    <Login 
      setIsAuthenticated={setIsAuthenticated} 
      setRole={setRole} 
    />
  );
}
  if (loading && inventory.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600 mb-4" size={48} />
        <h2 className="font-bold text-slate-600">Loading...</h2>
      </div>
    );
  }

  if (role === 'salesman') {
    return <SalesmanDashboard 
      sales={sales} 
      inventory={inventory} 
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
      downloadBill={downloadBill}
      dismissSale={dismissSale}
      settleBill={settleBill}
      deleteSale={deleteSale}
      stats={stats}
      onLogout={logout} 
    />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
  activeTab={activeTab} 
  setActiveTab={setActiveTab} 
  isAdmin={isAdmin} 
  setIsAdmin={setIsAdmin} 
  onLogout={logout}
/>

      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight capitalize">{activeTab}</h2>
            <p className="text-slate-500 font-medium">Business in Indian Rupee (₹).</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'inventory' && (
              <button onClick={() => { setEditProduct(null); setIsAddingProduct(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
                <Plus size={20} /> <span className="font-bold">New Item</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === 'dashboard' && <Dashboard stats={stats} isAdmin={isAdmin} setActiveTab={setActiveTab} />}

        {activeTab === 'inventory' && (
          <Inventory
            filteredInventory={filteredInventory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            inventoryFilter={inventoryFilter}
            setInventoryFilter={setInventoryFilter}
            isAdmin={isAdmin}
            setEditProduct={setEditProduct}
            setIsAddingProduct={setIsAddingProduct}
            deleteProduct={deleteProduct} // Added this prop
          />
        )}

        {activeTab === 'pos' && (
          <POS
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
        )}

        {activeTab === 'khaata' && <KhaataLedger sales={sales} stats={stats} settleBill={settleBill} deleteSale={deleteSale} />}

        {activeTab === 'history' && (
          <SalesHistory
            sales={sales}
            downloadBill={downloadBill}
            deleteSale={deleteSale}
          />
        )}
        {activeTab === 'customers' && <Customers sales={sales} />}
        {activeTab === 'ai' && <AIAnalyst />}
        {activeTab === 'salesmen' && <Salesmen sales={sales} />}
        {activeTab === 'itemlist' && <ItemList inventory={inventory} />}

        {isAddingProduct && (
          <ProductModal
            editProduct={editProduct}
            setIsAddingProduct={setIsAddingProduct}
            handleAddOrEdit={handleAddOrEdit}
          />
        )}
      </main>
    </div>
  );
};

export default App;