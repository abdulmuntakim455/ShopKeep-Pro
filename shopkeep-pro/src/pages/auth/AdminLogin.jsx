import { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { API_BASE_URL } from "../../config";

const AdminLogin = ({ setIsAuthenticated, setRole }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.msg); // ✅ show error in UI
      return;
    }

    // success
    setError(""); // clear error

    localStorage.setItem("token", "dummy");
    localStorage.setItem("role", data.role);

    setIsAuthenticated(true);
    setRole(data.role);

  } catch {
    setError("Server error. Try again.");
  }
};
if (showForgot) {
  return <ForgotPassword setShowForgot={setShowForgot} />;
}

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Admin Email"
        className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
        onChange={(e) => {
  setForm({ ...form, email: e.target.value });
  setError(""); // clear error
}}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
        onChange={(e) => {
  setForm({ ...form, password: e.target.value });
  setError(""); // clear error
}}
      />
      {error && (
  <p className="text-rose-500 text-xs font-bold text-center">
    {error}
  </p>
)}

      <button onClick={handleLogin} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-3.5 rounded-lg font-black uppercase tracking-widest text-sm shadow-md transition-all active:scale-[0.98]">
        Authenticate
      </button>
<p 
  onClick={() => setShowForgot(true)}
  className="text-xs font-bold text-amber-600 hover:text-amber-500 text-center cursor-pointer mt-3 transition-colors"
>
  Forgot Password?
</p>
    </div>
  );
};

export default AdminLogin;