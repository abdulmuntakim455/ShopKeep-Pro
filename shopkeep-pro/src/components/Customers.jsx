import React, { useState, useMemo } from 'react';
import { Users, Calendar, ChevronDown, ChevronUp, Phone, Building2, MapPin, Receipt, PackageOpen, Search } from 'lucide-react';

const Customers = ({ sales }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCustomerId, setExpandedCustomerId] = useState(null);

    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            if (!startDate && !endDate) return true;
            const saleDate = new Date(sale.timestamp);
            const start = startDate ? new Date(startDate) : new Date('1970-01-01');
            const end = endDate ? new Date(endDate) : new Date('2099-12-31');
            // Normalize dates to start/end of day
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return saleDate >= start && saleDate <= end;
        });
    }, [sales, startDate, endDate]);

    const customersData = useMemo(() => {
        const grouped = {};
        
        filteredSales.forEach(sale => {
            // Grouping Strategy:
            // 1. If Contact exists, use Contact as key (Best for returning customers)
            // 2. If no Contact but has Name (not 'Walk-in'), use Name
            // 3. Fallback: treat as individual walk-in using Sale ID to avoid merging unrelated people
            const contact = sale.customerContact;
            const name = sale.customerName || "Walk-in";
            
            let key;
            if (contact && contact !== 'N/A') {
                key = contact;
            } else if (name && name !== 'Walk-in') {
                key = `NAME_${name}`;
            } else {
                key = `SALE_${sale._id}`; // Keep anonymous walk-ins separate
            }
            
            if (!grouped[key]) {
                grouped[key] = {
                    id: key,
                    name: name,
                    contact: contact || 'N/A',
                    company: sale.customerCompany || 'N/A',
                    address: sale.customerAddress || 'N/A',
                    totalPurchased: 0,
                    purchaseCount: 0,
                    history: []
                };
            }
            
            grouped[key].totalPurchased += sale.total;
            grouped[key].purchaseCount += 1;
            grouped[key].history.push(sale);
        });

        const list = Object.values(grouped).sort((a, b) => b.totalPurchased - a.totalPurchased);

        if (!searchTerm) return list;

        return list.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.contact.includes(searchTerm) ||
            c.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [filteredSales, searchTerm]);

    const totalUniqueCustomers = customersData.length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Filters & Stats Header */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-amber-600 text-white p-6 rounded-[32px] shadow-lg shadow-amber-100 flex flex-col justify-between">
                    <div>
                        <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest mb-2">Total Unique Customers</p>
                        <h3 className="text-4xl font-black">{totalUniqueCustomers}</h3>
                    </div>
                    <Users size={40} className="mt-4 opacity-20 self-end" />
                </div>

                <div className="lg:col-span-3 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 w-full">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Calendar size={14} /> Filter by Purchase Date
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 ml-1">Start Date</label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none focus:border-amber-500 transition-all text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 ml-1">End Date</label>
                                <input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none focus:border-amber-500 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setStartDate(''); setEndDate(''); }}
                        className="bg-slate-100 text-slate-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all self-end md:mb-1"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Customers List */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 border-b border-slate-50 font-black text-slate-800 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-amber-500" />
                        Customer Directory
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Search name, number or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-slate-700 focus:border-amber-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-50 flex-1 overflow-y-auto">
                    {customersData.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <PackageOpen size={48} className="text-slate-200" />
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">No customer records found for this period</p>
                        </div>
                    ) : (
                        customersData.map(customer => (
                            <div key={customer.id} className="group">
                                <div 
                                    onClick={() => setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id)}
                                    className={`p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all ${expandedCustomerId === customer.id ? 'bg-slate-50/80 shadow-inner' : ''}`}
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                                            <div>
                                                <h4 className="font-black text-slate-800 text-lg leading-tight">{customer.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                                   <Phone size={10} /> {customer.contact}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Generated</p>
                                                <p className="font-black text-slate-800 text-xl">₹{customer.totalPurchased.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Visits</p>
                                                <p className="font-black text-slate-800">{customer.purchaseCount} {customer.purchaseCount === 1 ? 'Sale' : 'Sales'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        {expandedCustomerId === customer.id ? <ChevronUp size={24} className="text-amber-500" /> : <ChevronDown size={24} className="text-slate-300" />}
                                    </div>
                                </div>

                                {/* Expandable Itemized History */}
                                {expandedCustomerId === customer.id && (
                                    <div className="px-6 pb-8 animate-in slide-in-from-top-4 duration-300">
                                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Business Presence</p>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Building2 size={16} /></div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Company</p>
                                                            <p className="font-bold text-slate-800">{customer.company}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><MapPin size={16} /></div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Address</p>
                                                            <p className="font-medium text-slate-600 text-sm leading-relaxed">{customer.address}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Full Purchase Log</p>
                                                    <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                                        {customer.history.map((sale, idx) => (
                                                            <div key={sale._id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Receipt size={14} className="text-slate-400" />
                                                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                                                                            {new Date(sale.timestamp).toLocaleDateString()}
                                                                        </span>
                                                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${sale.paymentMethod === 'Credit (Udhaar)' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                                            {sale.paymentMethod}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        {sale.items.map((item, iIdx) => (
                                                                            <div key={iIdx} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                                                                {item.quantity}x {item.name}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-black text-slate-800">₹{sale.total.toLocaleString('en-IN')}</p>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Total</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;
