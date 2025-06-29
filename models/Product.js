import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: false },
  category: {
    type: String,
    ref: 'Category',
  },
  images: [String],
  brand: { type: String, default: '' },   // ✅ əlavə olundu
  size: { type: String, default: '' },    // ✅ əlavə olundu
  color: { type: String, default: '' },   // ✅ əlavə olundu
  user: {
    type: String,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

