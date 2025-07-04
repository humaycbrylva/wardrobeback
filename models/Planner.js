import mongoose from 'mongoose';

const plannerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Outfit Plan' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      image: String,
      title: String,
    }
  ],
  occasion: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Planner', plannerSchema);
