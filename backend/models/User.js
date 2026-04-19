import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    sparse: true,
  },

  phone: String,

  password: String,

  role: {
    type: String,
    enum: ["admin", "salesman"],
    required: true,
  },

  salesmanId: {
    type: String,
    unique: true,
    sparse: true,
  },

  // ✅ ADD HERE (INSIDE OBJECT)
  otp: String,
  otpExpiry: Date,

  hasChangedPassword: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("User", userSchema);