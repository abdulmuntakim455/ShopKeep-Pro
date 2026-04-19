import React, { useState, useMemo, useEffect } from "react";
import { Plus, ArrowLeft, Calendar, FileText, Edit, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../config";

const Salesmen = ({ sales = [] }) => {
  const generateSalesmanId = () => {
    return "SM" + Math.floor(100000 + Math.random() * 900000);
  };

  const [salesmen, setSalesmen] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'date', 'month'
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    salesmanId: generateSalesmanId(),
  });

  const fetchSalesmen = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/salesmen`);
      const data = await res.json();
      setSalesmen(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const handleAddSalesman = async () => {
    if (!form.name || !form.phone) return; // password can be blank on edit

    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode ? `${API_BASE_URL}/salesmen/${editId}` : `${API_BASE_URL}/salesmen`;
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          password: form.password,
          salesmanId: form.salesmanId
        })
      });

      if (!response.ok) {
        let errMsg = "Failed to save salesman";
        try {
          const errorData = await response.json();
          errMsg = errorData.message || errMsg;
        } catch (e) {
          errMsg = "Server returned an invalid response. Please restart the backend server.";
        }
        alert(errMsg);
        return;
      }

      fetchSalesmen();
      
      setForm({
        name: "",
        phone: "",
        password: "",
        salesmanId: generateSalesmanId(),
      });
      setShowModal(false);
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      console.error("Error saving salesman", err);
      alert("Network Error: Could not reach the backend. Did you restart the server?");
    }
  };

  const handleEditClick = (s) => {
    setEditMode(true);
    setEditId(s._id);
    setForm({
      name: s.name,
      phone: s.phone || "",
      password: "", // User must re-enter if they want to change it
      salesmanId: s.salesmanId,
      hasChangedPassword: s.hasChangedPassword
    });
    setShowModal(true);
  };

  const handleDeleteSalesman = async (s) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete salesman: ${s.name}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/salesmen/${s._id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        alert("Server failed to delete user.");
        return;
      }
      fetchSalesmen();
      if (selectedSalesman && selectedSalesman._id === s._id) setSelectedSalesman(null);
    } catch (err) {
      console.error(err);
      alert("Network exception deleting user.");
    }
  };

  // ----------------------------------------------------
  // DETAILED VIEW COMPUTATIONS
  // ----------------------------------------------------
  const salesmanData = useMemo(() => {
    if (!selectedSalesman) return [];

    let filtered = sales.filter(s => s.salesmanName === selectedSalesman.name);

    if (filterMode === 'date' && filterDate) {
      const targetDate = new Date(filterDate).toDateString();
      filtered = filtered.filter(s => new Date(s.timestamp).toDateString() === targetDate);
    } else if (filterMode === 'month' && filterMonth) {
      const targetYear = filterMonth.split('-')[0];
      const targetMonthStr = filterMonth.split('-')[1];
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return d.getFullYear().toString() === targetYear && (d.getMonth() + 1).toString().padStart(2, '0') === targetMonthStr;
      });
    }
    return filtered;
  }, [sales, selectedSalesman, filterMode, filterDate, filterMonth]);

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
              <p className="text-slate-500 font-medium tracking-wide">ID: {selectedSalesman.salesmanId} • Phone: {selectedSalesman.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={filterMode} 
              onChange={(e) => {
                setFilterMode(e.target.value);
                setFilterDate("");
                setFilterMonth("");
              }}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-3 py-2 rounded-xl outline-none"
            >
              <option value="all">All Time</option>
              <option value="date">Specific Date</option>
              <option value="month">Specific Month</option>
            </select>

            {filterMode !== 'all' && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <Calendar size={18} className="text-indigo-600" />
                {filterMode === 'date' && (
                  <input 
                    type="date" 
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-transparent font-medium text-slate-700 outline-none"
                  />
                )}
                {filterMode === 'month' && (
                  <input 
                    type="month" 
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="bg-transparent font-medium text-slate-700 outline-none"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border text-slate-800 border-slate-200 border-t-4 border-t-amber-500 rounded-lg p-6 shadow-sm overflow-hidden relative">
             <FileText size={64} className="absolute right-[-10px] top-[-10px] opacity-10 text-amber-500" />
             <p className="font-black text-slate-500 uppercase tracking-widest text-[10px] mb-2">Total Sales Volume</p>
             <h3 className="text-4xl font-black tracking-tight text-slate-800">₹{totalSalesVolume.toFixed(2)}</h3>
          </div>
          <div className="bg-white border text-slate-800 border-slate-200 border-t-4 border-t-emerald-500 rounded-lg p-6 shadow-sm overflow-hidden relative">
             <FileText size={64} className="absolute right-[-10px] top-[-10px] opacity-10 text-emerald-500" />
             <p className="font-black text-slate-500 uppercase tracking-widest text-[10px] mb-2">Earned Commission (5%)</p>
             <h3 className="text-4xl font-black tracking-tight text-slate-800">₹{totalCommission.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs uppercase tracking-widest font-black text-slate-800">Customer History</h3>
          </div>
          
          {salesmanData.length === 0 ? (
            <div className="p-10 text-center text-slate-500 font-bold text-xs uppercase tracking-widest">No sales mapped to this user {filterMode !== 'all' ? 'for the selected period' : ''}.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {salesmanData.map(sale => (
                <div key={sale._id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-lg text-slate-800">{sale.customerName || "Walk-in"}</h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{new Date(sale.timestamp).toLocaleString()} • {sale.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 tracking-tight">Total: ₹{sale.total}</p>
                      <p className="text-xs font-black tracking-widest uppercase border border-emerald-200 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mt-1">Com: ₹{(sale.total * 0.05).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-white border text-sm border-slate-200 rounded-lg p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Items Bought</p>
                    <ul className="space-y-1 font-bold text-slate-700">
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
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Salesmen Management</h2>

        <button
          onClick={() => {
            setEditMode(false);
            setEditId(null);
            setForm({
              name: "",
              phone: "",
              password: "",
              salesmanId: generateSalesmanId()
            });
            setShowModal(true);
          }}
          className="bg-amber-500 text-slate-900 border border-amber-600 px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:bg-amber-400 transition"
        >
          <Plus size={18} />
          <span className="font-black tracking-widest uppercase text-xs">Add Salesman</span>
        </button>
      </div>

      {/* 🔷 TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="p-4 text-xs font-black uppercase tracking-widest">Name</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest">Phone</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest">Salesman ID</th>
              <th className="p-4 text-right text-xs font-black uppercase tracking-widest">Action</th>
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
                  <td className="p-4 text-slate-600 font-bold">{s.phone}</td>
                  <td className="p-4 text-slate-500 font-bold">{s.salesmanId}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(s)}
                      className="bg-white border border-slate-300 text-slate-600 text-xs tracking-widest uppercase font-black p-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm"
                      title="Edit Settings"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteSalesman(s)}
                      className="bg-white border border-rose-200 text-rose-500 text-xs tracking-widest uppercase font-black p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition shadow-sm"
                      title="Purge Identity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => setSelectedSalesman(s)}
                      className="bg-white border border-slate-300 text-slate-600 text-xs tracking-widest uppercase font-black px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-amber-600 transition shadow-sm"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-7 w-full max-w-md shadow-2xl border-t-4 border-amber-500 transform animate-slideInLeft transition-transform">

            <h3 className="text-xl font-black mb-5 text-slate-800 tracking-tight">ADD SALESMAN</h3>

            {/* FORM */}
            <div className="space-y-4">

              {/* NAME */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  name="salesmanName"
                  autoComplete="off"
                  placeholder="Enter name"
                  className="w-full mt-1 px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="salesmanPhone"
                  autoComplete="off"
                  placeholder="Enter phone number"
                  className="w-full mt-1 px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              {/* SALESMAN ID */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">
                  Salesman ID
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-400 font-black tracking-widest cursor-not-allowed"
                  value={form.salesmanId}
                  disabled
                />
              </div>

              {/* PASSWORD INFORMATION */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1 block">
                  Password Status
                </label>
                {editMode && form.hasChangedPassword ? (
                  <div className="w-full px-4 py-3 border border-emerald-200 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold flex items-center justify-center">
                    User Secured via OTP
                  </div>
                ) : (
                  <div className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-between">
                    <span>Generated Temporary Password:</span>
                    <span className="font-mono text-amber-600 tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                      {((form.name || "").replace(/\s+/g, "").length >= 3 
                        ? (form.name || "").replace(/\s+/g, "").substring(0, 3).toLowerCase() 
                        : (form.name || "").replace(/\s+/g, "").toLowerCase()) 
                        + (form.phone || "").substring(0, 3)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-8 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setEditId(null);
                  setForm({
                    name: "",
                    phone: "",
                    password: "",
                    salesmanId: generateSalesmanId(),
                    hasChangedPassword: false
                  });
                }}
                className="px-5 py-3 rounded-lg font-black tracking-widest text-[10px] uppercase border border-slate-300 text-slate-500 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSalesman}
                className="px-5 py-3 rounded-lg font-black tracking-widest text-[10px] uppercase bg-amber-500 text-slate-900 shadow-md hover:bg-amber-400 transition"
              >
                {editMode ? "Update" : "Save Protocol"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Salesmen;