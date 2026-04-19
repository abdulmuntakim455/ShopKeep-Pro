import { Package } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
        <Package className="text-white w-6 h-6" />
      </div>
      <h1 className="font-extrabold text-xl tracking-tight">
        Vikaas Timber
      </h1>
    </div>
  );
};

export default Logo;