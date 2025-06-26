import mongoose from 'mongoose';

const closetItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const ClosetItem = mongoose.model('ClosetItem', closetItemSchema);
export default ClosetItem;

