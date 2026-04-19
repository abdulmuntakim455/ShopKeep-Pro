import { useState } from "react";
import ForgotPassword from "./ForgotPassword";

const AdminLogin = ({ setIsAuthenticated, setRole }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
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
        placeholder="Email"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => {
  setForm({ ...form, email: e.target.value });
  setError(""); // clear error
}}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => {
  setForm({ ...form, password: e.target.value });
  setError(""); // clear error
}}
      />
      {error && (
  <p className="text-red-500 text-sm text-center">
    {error}
  </p>
)}

      <button onClick={handleLogin} className="w-full bg-indigo-500 text-white py-3 rounded-lg">
  Login as Admin
</button>
<p 
  onClick={() => setShowForgot(true)}
  className="text-sm text-indigo-600 text-center cursor-pointer mt-2"
>
  Forgot Password?
</p>
    </div>
  );
};

export default AdminLogin;