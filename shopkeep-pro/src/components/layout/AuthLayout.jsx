import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 relative border-t-8 border-amber-500 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Decorative background pattern (Optional) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #f59e0b 0, transparent 50%), radial-gradient(circle at 0 0, #000 0, transparent 50%)' }}>
        </div>
        
        <div className="relative z-10 w-full">
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;