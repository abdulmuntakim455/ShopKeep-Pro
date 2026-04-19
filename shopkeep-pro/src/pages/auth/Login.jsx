import React, { useState } from 'react';
import { ShieldAlert, UserSquare2 } from 'lucide-react';
import AdminLogin from './AdminLogin';
import SalesmanLogin from './SalesmanLogin';
import AuthLayout from '../../components/layout/AuthLayout';

const Login = ({ setIsAuthenticated, setRole }) => {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto relative animate-in fade-in zoom-in duration-500">
        
        {/* Role Toggle */}
        <div className="bg-white p-2 rounded-lg flex mb-6 shadow-sm border border-slate-200">
          <button 
            className={`flex-1 py-3 px-4 rounded-md font-black tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2 ${
              isAdmin 
              ? "bg-amber-500 text-slate-900 shadow-md" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
            }`}
            onClick={() => setIsAdmin(true)}
          >
            <ShieldAlert size={16} /> Admin Portal
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-md font-black tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2 ${
              !isAdmin 
              ? "bg-amber-500 text-slate-900 shadow-md" 
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
            }`}
            onClick={() => setIsAdmin(false)}
          >
            <UserSquare2 size={16} /> Salesman
          </button>
        </div>

        {/* Login Forms */}
        <div className="bg-white rounded-lg shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative p-8">
           <div className="h-1.5 w-full bg-slate-800 absolute top-0 left-0"></div> {/* Dark header accent */}
           {isAdmin ? <AdminLogin setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : <SalesmanLogin setIsAuthenticated={setIsAuthenticated} setRole={setRole} />}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;