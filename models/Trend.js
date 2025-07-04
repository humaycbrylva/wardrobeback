import mongoose from 'mongoose';

const trendSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mainImage: { type: String, required: true },  // əsas şəkil
  galleryImages: [String],                      // əlavə şəkillər (array)
  brand: { type: String },
  tags: [String],
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Trend', trendSchema);
