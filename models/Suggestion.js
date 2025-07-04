// models/Suggestion.js
import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Kombinin adı, məsələn "Ad günü Casual"
  occasion: { type: String, default: 'general' }, // İstifadə yeri (ad günü, rəsmi, casual, s.)
  style: { type: String, default: '' },           // Stil təsviri, opsional
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      image: String,
      title: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Suggestion', suggestionSchema);
