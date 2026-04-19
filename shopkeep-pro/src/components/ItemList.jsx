import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ItemList = ({ inventory = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search items by name or category..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
        {filteredInventory.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No items found matching "{searchQuery}".
          </div>
        ) : (
          filteredInventory.map((item, idx) => (
            <div key={item._id || idx} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
              <div className="flex-1 pr-2">
                <div className="font-bold text-slate-800 break-words">{item.name}</div>
                <div className="mt-1.5">
                  <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-slate-700 text-sm md:text-base">
                  ₹{item.price?.toFixed(2)}
                </div>
                <div className="mt-1">
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Com: ₹{(item.price * 0.05).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemList;
