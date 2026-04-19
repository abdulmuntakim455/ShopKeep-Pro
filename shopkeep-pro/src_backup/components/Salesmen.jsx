import React, { useState, useMemo } from "react";
import { Plus, ArrowLeft, Calendar, FileText } from "lucide-react";

const Salesmen = ({ sales = [] }) => {
  const generateSalesmanId = () => {
    return "SM" + Math.floor(100000 + Math.random() * 900000);
  };

  const defaultSalesmen = [
    { id: "SM1001", name: "Abdul Muntakim", phone: "9876543210", password: "123", commission: 0 },
    { id: "SM1002", name: "Yash", phone: "9876543211", password: "123", commission: 0 },
    { id: "SM1003", name: "Ajay", phone: "9876543212", password: "123", commission: 0 },
    { id: "SM1004", name: "Sanskar", phone: "9876543213", password: "123", commission: 0 },
    { id: "SM1005", name: "Sarth", phone: "9876543214", password: "123", commission: 0 }
  ];

  const [salesmen, setSalesmen] = useState(defaultSalesmen);
  const [showModal, setShowModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    id: generateSalesmanId(),
  });

  const handleAddSalesman = () => {
    if (!form.name || !form.phone || !form.password) return;

    const newSalesman = {
      id: form.id,
      name: form.name,
      phone: form.phone,
      commission: 0,
    };

    setSalesmen([...salesmen, newSalesman]);

    // reset + new ID
    setForm({
      name: "",
      phone: "",
      password: "",
      id: generateSalesmanId(),
    });

    setShowModal(false);
  };

  // ----------------------------------------------------
  // DETAILED VIEW COMPUTATIONS
  // ----------------------------------------------------
  const salesmanData = useMemo(() => {
    if (!selectedSalesman) return [];

    let filtered = sales.filter(s => s.salesmanName === selectedSalesman.name);

    if (filterDate) {
      const targetDate = new Date(filterDate).toDateString();
      filtered = filtered.filter(s => new Date(s.timestamp).toDateString() === targetDate);
    }
    return filtered;
  }, [sales, selectedSalesman, filterDate]);

  const totalCommission = salesmanData.reduce((acc, s) => acc + (s.total * 0.05), 0);
  const totalSalesVolume = salesmanData.reduce((acc, s) => acc + s.total, 0);

  if (selectedSalesman) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => { setSelectedSalesman(null); setFilterDate(""); }} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition">
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-800">{selectedSalesman.name}'s Dashboard</h2>
              <p className="text-slate-500 font-medium tracking-wide">ID: {selectedSalesman.id} • Phone: {selectedSalesman.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Calendar size={18} className="text-indigo-600" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none"
            />
            {filterDate && (
              <button onClick={() => setFilterDate("")} className="text-xs text-red-500 ml-2 font-bold hover:underline">Clear</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
             <FileText size={64} className="absolute right-[-10px] top-[-10px] opacity-20" />
             <p className="font-semibold text-indigo-200 uppercase tracking-widest text-xs mb-1">Total Sales Volume</p>
             <h3 className="text-4xl font-black">₹{totalSalesVolume.toFixed(2)}</h3>
          </div>
          <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
             <FileText size={64} className="absolute right-[-10px] top-[-10px] opacity-20" />
             <p className="font-semibold text-emerald-200 uppercase tracking-widest text-xs mb-1">Earned Commission (5%)</p>
             <h3 className="text-4xl font-black">₹{totalCommission.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Customer History</h3>
          </div>
          
          {salesmanData.length === 0 ? (
            <div className="p-10 text-center text-slate-400 font-medium">No sales mapped to this user {filterDate ? 'on this date' : ''}.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {salesmanData.map(sale => (
                <div key={sale._id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-lg text-slate-800">{sale.customerName || "Walk-in"}</h4>
                      <p className="text-xs text-slate-500 font-medium">{new Date(sale.timestamp).toLocaleString()} • {sale.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800">Total: ₹{sale.total}</p>
                      <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">Com: ₹{(sale.total * 0.05).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-slate-100/50 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Items Bought</p>
                    <ul className="space-y-1 text-sm font-medium text-slate-700">
                      {sale.items?.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LIST VIEW
  // ----------------------------------------------------
  return (
    <div>
      {/* 🔷 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Salesmen Management</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Salesman
        </button>
      </div>

      {/* 🔷 TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Salesman ID</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {salesmen.map((s, i) => {
              // Calculate real commission for display if possible, sticking to requested fake or real mapping
              const personalSales = sales.filter(sale => sale.salesmanName === s.name);
              const realCom = personalSales.reduce((acc, sale) => acc + (sale.total * 0.05), 0);

              return (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-800">{s.name}</td>
                  <td className="p-4 text-slate-600 font-medium">{s.phone}</td>
                  <td className="p-4 text-slate-500 font-medium">{s.id}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedSalesman(s)}
                      className="bg-indigo-50 text-indigo-600 font-bold px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition shadow-sm"
                    >
                      Dashboard
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {salesmen.length === 0 && (
          <p className="text-center text-slate-400 py-6">
            No salesmen added yet
          </p>
        )}
      </div>

      {/* 🔥 MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform animate-slideInLeft transition-transform">

            <h3 className="text-xl font-black mb-5 text-slate-800">Add Salesman</h3>

            {/* FORM */}
            <div className="space-y-4">

              {/* NAME */}
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Name
                </label>
                <input
                  type="text"
                  name="salesmanName"
                  autoComplete="off"
                  placeholder="Enter name"
                  className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="salesmanPhone"
                  autoComplete="off"
                  placeholder="Enter phone number"
                  className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              {/* SALESMAN ID */}
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Salesman ID
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 font-bold cursor-not-allowed"
                  value={form.id}
                  disabled
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Temporary Password
                </label>
                <input
                  type="password"
                  name="salesmanPassword"
                  autoComplete="new-password"
                  placeholder="Enter temporary password"
                  className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm({
                    name: "",
                    phone: "",
                    password: "",
                    id: generateSalesmanId(),
                  });
                }}
                className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSalesman}
                className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
              >
                Save User
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Salesmen;