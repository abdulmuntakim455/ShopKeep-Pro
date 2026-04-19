import { useState } from "react";

const ForgotPassword = ({ setShowForgot }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  // 🔹 STEP 1: SEND OTP
 const handleSendOtp = async () => {
  if (!email) return setError("Enter email");

  try {
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) return setError(data.msg);

    setStep(2);
    setError("");
  } catch {
    setError("Server error");
  }
};

  // 🔹 STEP 2: VERIFY OTP
  const handleVerifyOtp = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) return setError(data.msg);

    setStep(3);
    setError("");
  } catch {
    setError("Server error");
  }
};

  // 🔹 STEP 3: RESET PASSWORD
  const handleReset = async () => {
  if (newPass !== confirmPass) {
    return setError("Passwords do not match");
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        newPassword: newPass,
        confirmPassword: confirmPass,
      }),
    });

    const data = await res.json();

    if (!res.ok) return setError(data.msg);

    alert("Password changed successfully");
    setShowForgot(false);
  } catch {
    setError("Server error");
  }
};

  return (
    <div className="space-y-4">

      {/* 🔹 STEP 1 */}
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSendOtp}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg"
          >
            Send OTP
          </button>
        </>
      )}

      {/* 🔹 STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* 🔹 STEP 3 */}
      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setNewPass(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <button
            onClick={handleReset}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg"
          >
            Reset Password
          </button>
        </>
      )}

      {/* 🔴 ERROR */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* 🔙 BACK */}
      <p
        onClick={() => setShowForgot(false)}
        className="text-sm text-center text-gray-500 cursor-pointer"
      >
        Back to Login
      </p>

    </div>
  );
};

export default ForgotPassword;