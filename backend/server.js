import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Product from './models/Product.js';
import Sale from './models/Sale.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import authRoutes from "./routes/authRoutes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// 🔹 CONNECT MONGODB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.error("Connection Error:", err));


// =======================
// --- PRODUCT ROUTES ---
// =======================

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


// =======================
// --- SALES ROUTES ---
// =======================

// 🔹 GET ALL SALES
app.get('/api/sales', async (req, res) => {
  const sales = await Sale.find().sort({ timestamp: -1 });
  res.json(sales);
});

// 🔹 CREATE SALE
app.post('/api/sales', async (req, res) => {
  const { items, total, paymentMethod, customerName, customerContact, customerAddress, customerCompany, salesmanName } = req.body;

  const newSale = new Sale({ items, total, paymentMethod, customerName, customerContact, customerAddress, customerCompany, salesmanName });
  await newSale.save();

  // 🔻 Reduce stock
  const bulkOps = items.map(item => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $inc: { stock: -item.quantity } }
    }
  }));

  await Product.bulkWrite(bulkOps);

  res.json(newSale);
});

// � UPDATE SALE
app.put('/api/sales/:id', async (req, res) => {
  const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// �🔥 DELETE SALE (PERMANENT + RESTORE STOCK)
app.delete('/api/sales/:id', async (req, res) => {
  try {
    console.log("DELETE ID:", req.params.id); // debug

    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // 🔒 SAFE CHECK
    if (sale.items && Array.isArray(sale.items)) {
      const bulkOps = sale.items.map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { stock: item.quantity || 0 } }
        }
      }));

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
      }
    }

    await Sale.findByIdAndDelete(req.params.id);

    res.json({ message: "Sale deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
});


// =======================
// --- SALESMEN ROUTES ---
// =======================

app.get('/api/salesmen', async (req, res) => {
  try {
    const salesmen = await User.find({ role: 'salesman' });
    res.json(salesmen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/salesmen', async (req, res) => {
  try {
    const { name, phone, salesmanId } = req.body;
    
    const existing = await User.findOne({ salesmanId });
    if (existing) return res.status(400).json({ message: "Salesman ID already exists" });

    // Generate default password: first 3 letters of name + first 3 digits of phone
    const safeName = (name || "").replace(/\s+/g, "");
    const namePart = safeName.length >= 3 ? safeName.substring(0, 3).toLowerCase() : safeName.toLowerCase();
    const phonePart = (phone || "").substring(0, 3);
    const defaultPassword = `${namePart}${phonePart}`;
    
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newSalesman = new User({
      name, 
      phone, 
      password: hashedPassword, 
      salesmanId,
      role: 'salesman',
      hasChangedPassword: false
    });
    
    await newSalesman.save();
    res.json(newSalesman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/salesmen/:id', async (req, res) => {
  try {
    const { name, phone, password, salesmanId } = req.body;
    const updateData = { name, phone, salesmanId };
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/salesmen/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Salesman deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =======================
// --- AI ANALYSIS ---
// =======================

app.get('/api/ai/analysis', async (req, res) => {
  try {
    const { salesmanName } = req.query;
    const products = await Product.find();
    let sales = await Sale.find();
    const salesmen = await User.find({ role: 'salesman' });

    let mode = 'admin'; // default
    let filteredSales = sales;

    if (salesmanName) {
      mode = 'salesman';
      filteredSales = sales.filter(s => s.salesmanName === salesmanName);
    }

    // 1. Summarize Inventory (Admin only or General for Salesman)
    const lowStock = products.filter(p => p.stock < 10);

    // 2. Summarize Sales
    const totalRevenue = filteredSales.reduce((acc, s) => acc + s.total, 0);
    const categoryRevenue = {};
    const productPopularity = {};

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const originalProduct = products.find(p => p._id.toString() === item._id.toString());
        const cat = originalProduct ? originalProduct.category : 'General';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.price * item.quantity);
        productPopularity[item.name] = (productPopularity[item.name] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productPopularity).sort((a,b) => b[1] - a[1]).slice(0, 5);

    // 3. Performance
    let performanceContext = "";
    if (mode === 'admin') {
      const salesmanRanking = salesmen.map(sm => {
        const hisSales = sales.filter(s => s.salesmanName === sm.name);
        return {
          name: sm.name,
          revenue: hisSales.reduce((acc, s) => acc + s.total, 0),
          count: hisSales.length
        };
      }).sort((a,b) => b.revenue - a.revenue);
      performanceContext = `Salesman Performance:\n${salesmanRanking.map(sm => `- ${sm.name}: ₹${sm.revenue.toLocaleString()} (${sm.count} sales)`).join('\n')}`;
    } else {
      performanceContext = `Your Performance:\n- Revenue: ₹${totalRevenue.toLocaleString()}\n- Total Sales: ${filteredSales.length}`;
    }

    // 4. Credits
    const pendingCredits = filteredSales.filter(s => s.paymentMethod === 'Credit (Udhaar)');
    const totalOutStanding = pendingCredits.reduce((acc, s) => acc + s.total, 0);

    // Construct Prompt
    const businessContext = mode === 'admin' ? `
      You are a specialized Business Growth Analyst for "Vikaas Timber", a timber and hardware retail shop.
      Here is the current business snapshot:
      - Total Registered Products: ${products.length}
      - Lifetime Total Sales: ${sales.length}
      - Lifetime Revenue: ₹${totalRevenue.toLocaleString()}
      - Total Outstanding Udhaar (Credit): ₹${totalOutStanding.toLocaleString()} from ${pendingCredits.length} active debts.

      Sales by Category:
      ${Object.entries(categoryRevenue).map(([cat, rev]) => `- ${cat}: ₹${rev.toLocaleString()}`).join('\n')}

      Top 5 Best Selling Products:
      ${topProducts.map(([name, qty]) => `- ${name}: ${qty} units sold`).join('\n')}

      Inventory Alert (Low Stock - Needs Attention):
      ${lowStock.map(p => `- ${p.name}: Only ${p.stock} units left`).join('\n')}

      ${performanceContext}

      TASK:
      Please provide a professional, actionable "Business Audit Report".
      Include:
      1. Overall Performance Review (Health of the shop).
      2. Inventory Strategy (What to buy more of, what to clear out).
      3. Credit (Khaata) Risk Assessment.
      4. Salesmen Feedback.
      5. Top 3 Growth Tips (How to increase revenue next month).

      Format the response ONLY in high-quality Markdown. Use bold headers, tables where appropriate, and emoji for readability.
    ` : `
      You are a "Sales Performance Coach" for a salesman named ${salesmanName} at "Vikaas Timber".
      Your goal is to help them sell more and earn more commission.

      Here is their current record:
      - Total Sales made by ${salesmanName}: ${filteredSales.length}
      - Total Revenue generated: ₹${totalRevenue.toLocaleString()}
      - Total Credits (Udhaar) pending from their customers: ₹${totalOutStanding.toLocaleString()}

      Their Top Products Sold:
      ${topProducts.map(([name, qty]) => `- ${name}: ${qty} units sold`).join('\n')}

      Sales per Category:
      ${Object.entries(categoryRevenue).map(([cat, rev]) => `- ${cat}: ₹${rev.toLocaleString()}`).join('\n')}

      TASK:
      Provide a motivational, strategy-focused "Salesman Growth Plan".
      Include:
      1. Performance Appraisal (How are they doing?).
      2. Customer Insights (Based on their sales).
      3. Collection Advice (Help them recover the pending Udhaar they issued).
      4. Upselling Tips (What should they try to sell more of?).
      5. A Monthly Target recommendation.

      Format the response ONLY in high-quality Markdown. Use encouraging tone, bold sections, and emoji.
    `;

    const result = await model.generateContent(businessContext);
    const responseText = result.response.text();

    res.json({ analysis: responseText });

  } catch (err) {
    console.error("AI Analysis Detailed Error:", err);
    res.status(500).json({ 
      message: "Failed to generate AI insights.",
      error: err.message 
    });
  }
});


// =======================
// --- SERVER START ---
// =======================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;