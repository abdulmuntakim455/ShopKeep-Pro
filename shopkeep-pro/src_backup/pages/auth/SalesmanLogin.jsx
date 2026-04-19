import { useState } from "react";

const API_BASE_URL = 'http://localhost:5000/api';

const SalesmanLogin = ({ setIsAuthenticated, setRole }) => {
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'
  const [otpStep, setOtpStep] = useState(1); // 1 = enter phone, 2 = enter otp
  
  const [salesmanId, setSalesmanId] = useState("");
  const [password, setPassword] = useState("");
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-salesman`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesmanId, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", "sales123"); // Mock token if missing
        localStorage.setItem("role", "salesman");
        localStorage.setItem("name", data.name || "Salesman");
        setIsAuthenticated(true);
        setRole("salesman");
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleSendOtp = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      
      if (response.ok) {
        // Output mock OTP for testing
        console.log("Mock OTP:", data.mockOtp);
        setOtpStep(2);
      } else {
        setError(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", "sales123"); // Mock token
        localStorage.setItem("role", "salesman");
        localStorage.setItem("name", data.name || "Salesman");
        setIsAuthenticated(true);
        setRole("salesman");
      } else {
        setError(data.msg || "Invalid OTP");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 bg-red-100 p-2 rounded-md text-sm text-center">{error}</div>}

      {loginMethod === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Salesman ID"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={salesmanId}
            onChange={(e) => setSalesmanId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            Login
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setLoginMethod("otp"); setError(""); }}
              className="text-indigo-500 text-sm hover:underline"
            >
              Forgot Password? Login with OTP
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {otpStep === 1 ? (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                onClick={handleSendOtp}
                className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="text-sm text-center text-slate-500">OTP sent to {phone}. Check console for mock.</div>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button 
                onClick={handleVerifyOtp}
                className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition"
              >
                Verify & Login
              </button>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setLoginMethod("password"); setOtpStep(1); setError(""); }}
              className="text-slate-500 text-sm hover:underline mt-2"
            >
              Back to Password Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesmanLogin;