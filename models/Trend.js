import mongoose from 'mongoose';

const trendSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  tags: [String],
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Trend', trendSchema);