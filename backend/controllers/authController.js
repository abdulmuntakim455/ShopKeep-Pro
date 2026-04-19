import User from "../models/User.js";
import bcrypt from "bcrypt";
import twilio from "twilio";
import { sendEmail } from "../utils/sendEmail.js";

// Helper for sending real SMS
const sendSmsTwilio = async (toPhone, otp) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("[WARNING] Twilio API Keys are missing in .env! Skipping actual SMS.");
    return false;
  }
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your ShopKeep Pro security OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone.startsWith('+') ? toPhone : `+91${toPhone}` // Default to +91 if purely digits
    });
    console.log(`[SMS] Live SMS sent successfully to ${toPhone}`);
    return true;
  } catch (error) {
    console.error("Twilio SMS Dispatch Error:", error);
    return false;
  }
};

// 🔹 SEND OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();

  await sendEmail(email, "OTP", `Your OTP is: ${otp}`);

  res.json({ msg: "OTP sent" });
};

// 🔹 VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp != otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  res.json({ msg: "OTP verified" });
};

// 🔹 RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  const user = await User.findOne({ email });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({ msg: "Password updated" });
};

// 🔹 LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "Email does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Incorrect password" });
  }

  res.json({
    msg: "Login successful",
    role: user.role,
  });
};

// 🔹 SALESMAN LOGIN (ID & PASSWORD)
export const loginSalesman = async (req, res) => {
  const { salesmanId, password } = req.body;

  const user = await User.findOne({ salesmanId });

  if (!user) {
    return res.status(404).json({ msg: "Salesman ID does not exist" });
  }

  // Fallback to cleartext check or bypass if plain text password (simulating for simple DB setup without hashed password)
  let isMatch = false;
  if (user.password && user.password.startsWith('$2b$')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
     isMatch = (password === user.password); // Just in case it's stored plain text for mock users
  }

  // 🔹 DYNAMIC FALLBACK FOR LEGACY USERS
  // If the DB password didn't match, BUT they haven't changed their password yet,
  // allow them to login using the strictly auto-generated deterministic password.
  if (!isMatch && !user.hasChangedPassword) {
    const safeName = (user.name || "").replace(/\s+/g, "");
    const namePart = safeName.length >= 3 ? safeName.substring(0, 3).toLowerCase() : safeName.toLowerCase();
    const phonePart = (user.phone || "").substring(0, 3);
    const expectedAutoPassword = `${namePart}${phonePart}`;

    if (password === expectedAutoPassword) {
      isMatch = true;
    }
  }

  if (!isMatch) {
    return res.status(400).json({ msg: "Incorrect password" });
  }

  res.json({
    msg: "Salesman Login successful",
    role: user.role,
    name: user.name,
    requirePasswordChange: !user.hasChangedPassword,
    phone: user.phone
  });
};

// 🔹 SEND OTP (PHONE)
export const sendOtpPhone = async (req, res) => {
  const { phone, salesmanId } = req.body;

  let query = {};
  if (salesmanId) {
    query.salesmanId = salesmanId;
  } else {
    query.phone = phone;
  }

  const user = await User.findOne(query);

  if (!user) {
    return res.status(404).json({ msg: "Phone/Salesman ID not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp.toString();
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();

  // Attempt sending REAL OTP
  const smsSent = await sendSmsTwilio(phone, otp);

  if (!smsSent) {
    // Fallback log if Twilio isn't set up yet
    console.log(`[MOCK SMS FALLBACK] Sending OTP ${otp} to phone ${phone}`);
  }
  
  res.json({ msg: "OTP Processed", mockOtp: smsSent ? undefined : otp }); // Only return mockOtp if actual sms fails (for dev convenience)
};

// 🔹 RESET PASSWORD VIA PHONE OTP
export const verifyOtpPhone = async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  const user = await User.findOne({ phone });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  // Update password and clear OTP
  user.password = await bcrypt.hash(newPassword, 10);
  user.hasChangedPassword = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ 
    msg: "Password updated successfully"
  });
};

// 🔹 CHANGE FIRST PASSWORD
export const changeFirstPassword = async (req, res) => {
  const { salesmanId, otp, newPassword } = req.body;

  const user = await User.findOne({ salesmanId });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.hasChangedPassword = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({
    msg: "Password updated successfully"
  });
};