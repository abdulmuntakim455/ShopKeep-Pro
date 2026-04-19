import { useState } from "react";
import { API_BASE_URL } from "../../config";

const SalesmanLogin = ({ setIsAuthenticated, setRole }) => {
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'
  const [otpStep, setOtpStep] = useState(1); // 1 = enter phone, 2 = enter otp
  
  const [salesmanId, setSalesmanId] = useState("");
  const [password, setPassword] = useState("");
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-salesman`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesmanId, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.requirePasswordChange) {
           setPhone(data.phone);
           setLoginMethod("first-login");
           handleSendOtpForFirstLogin(data.phone);
           return;
        }

        localStorage.setItem("token", "sales123"); // Mock token if missing
        localStorage.setItem("role", "salesman");
        localStorage.setItem("name", data.name || "Salesman");
        setIsAuthenticated(true);
        setRole("salesman");
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError(`Network Error: ${err.message}. Please check your Vercel VITE_API_URL and ensure your Backend is running.`);
    }
  };

  const handleSendOtpForFirstLogin = async (phoneNumber) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, salesmanId: salesmanId })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Mock OTP for First Login:", data.mockOtp);
      } else {
        setError(data.msg || "Failed to send OTP for first login verification");
      }
    } catch (err) {
      setError(`Network Error: ${err.message}. Please check your Vercel VITE_API_URL and ensure your Backend is running.`);
    }
  };

  const handleChangeFirstPassword = async () => {
    if (!newPassword || !confirmNewPassword || !otp) {
      setError("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-first-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesmanId, otp, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Password updated successfully. Please login.");
        setLoginMethod("password");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setOtp("");
      } else {
        setError(data.msg || "Failed to update password");
      }
    } catch (err) {
      setError("Server error during password change");
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
      setError(`Network Error: ${err.message}. Please check your Vercel VITE_API_URL and ensure your Backend is running.`);
    }
  };

  const handleVerifyOtp = async () => {
    if (!newPassword || !confirmNewPassword || !otp) {
      setError("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMsg("Password updated successfully. Please login.");
        setLoginMethod("password");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setOtp("");
        setOtpStep(1);
      } else {
        setError(data.msg || "Invalid OTP");
      }
    } catch (err) {
      setError(`Network Error: ${err.message}. Please check your Vercel VITE_API_URL and ensure your Backend is running.`);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-rose-500 bg-rose-50/50 border border-rose-200 p-2 rounded-md font-bold text-xs text-center">{error}</div>}
      {successMsg && <div className="text-emerald-600 bg-emerald-50 border border-emerald-200 p-2 rounded-md font-bold text-xs text-center">{successMsg}</div>}

      {loginMethod === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Salesman ID"
            className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
            value={salesmanId}
            onChange={(e) => setSalesmanId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-3.5 rounded-lg font-black uppercase tracking-widest text-sm shadow-md transition-all active:scale-[0.98]"
          >
            Authenticate
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setLoginMethod("otp"); setError(""); }}
              className="text-xs font-bold text-amber-600 hover:text-amber-500 mt-2 transition-colors"
            >
              Forgot Password? Login with OTP
            </button>
          </div>
        </form>
      ) : loginMethod === "first-login" ? (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-xs text-center font-bold text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm leading-relaxed">
            <span className="block text-sm font-black mb-1 text-amber-600 uppercase tracking-widest">Welcome, Salesman!</span>
            For security purposes, please configure your new permanent password. An OTP has been dispatched to {phone ? `${phone.slice(0,2)}*****${phone.slice(-3)}` : 'your registered number'}.
          </div>
          
          <input
            type="text"
            placeholder="Enter 6-Digit OTP"
            className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400 text-center tracking-widest font-black"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          
          <input
            type="password"
            placeholder="Enter New Permanent Password"
            className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Permanent Password"
            className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          
          <button 
            type="button"
            onClick={handleChangeFirstPassword}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-3.5 rounded-lg font-black uppercase tracking-widest text-sm shadow-md transition-all active:scale-[0.98]"
          >
            Update Password
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {otpStep === 1 ? (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                onClick={handleSendOtp}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-3.5 rounded-lg font-black uppercase tracking-widest text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Send Secure OTP
              </button>
            </>
          ) : (
            <>
              <div className="text-xs text-center font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-200">OTP sent to {phone}. Check console for mock.</div>
              <input
                type="text"
                placeholder="Enter 6-Digit OTP"
                className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400 text-center tracking-widest font-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 rounded-lg outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <button 
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-3.5 rounded-lg font-black uppercase tracking-widest text-sm shadow-sm transition-all active:scale-[0.98]"
              >
                Verify & Update Password
              </button>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setLoginMethod("password"); setOtpStep(1); setError(""); }}
              className="text-slate-500 text-xs font-bold hover:text-slate-700 transition mt-2 hover:underline"
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