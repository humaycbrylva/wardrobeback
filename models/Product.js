import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  images: [String],
  brand: { type: String, default: '' },   // ✅ əlavə olundu
  size: { type: String, default: '' },    // ✅ əlavə olundu
  color: { type: String, default: '' },   // ✅ əlavə olundu
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

