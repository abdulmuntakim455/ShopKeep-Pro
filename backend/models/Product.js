import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    expiryDate: Date,
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 5 }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);