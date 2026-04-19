import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Check if test salesman exists
    const existing = await User.findOne({ salesmanId: "sales123" });
    if (existing) {
      console.log("Salesman already exists. Deleting & recreating...");
      await User.deleteOne({ salesmanId: "sales123" });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const salesman = new User({
      name: "John Doe",
      email: "salesman@test.com",
      phone: "1234567890",
      password: hashedPassword,
      role: "salesman",
      salesmanId: "sales123"
    });

    await salesman.save();
    console.log("-----------------------------------------");
    console.log("SUCCESS! Test Salesman Account Created:");
    console.log("Salesman ID: sales123");
    console.log("Password: password123");
    console.log("Phone: 1234567890 (For OTP Fallback)");
    console.log("-----------------------------------------");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
