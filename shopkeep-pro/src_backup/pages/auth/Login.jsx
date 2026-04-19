import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import AdminLogin from "./AdminLogin";
import SalesmanLogin from "./SalesmanLogin";
import Logo from "../../components/ui/Logo";

const Login = ({ setIsAuthenticated, setRole }) => {
  const [type, setType] = useState("admin");

  return (
    <AuthLayout>
      
      <h2 className="text-2xl font-bold mb-4 text-center">
        LOGIN
      </h2>

      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setType("admin")}
          className={`flex-1 py-2 rounded-lg ${
            type === "admin"
              ? "bg-indigo-500 text-white"
              : "text-gray-600"
          }`}
        >
          Admin
        </button>

        <button
          onClick={() => setType("sales")}
          className={`flex-1 py-2 rounded-lg ${
            type === "sales"
              ? "bg-indigo-500 text-white"
              : "text-gray-600"
          }`}
        >
          Salesman
        </button>
      </div>

      {type === "admin" ? (
  <AdminLogin setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
) : (
  <SalesmanLogin setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
)}
    </AuthLayout>
  );
};

export default Login;