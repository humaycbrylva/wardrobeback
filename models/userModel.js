import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: String,
  birthday: Date,
  stylePreference: String,
  profileImage: String,
  profileEmoji: String,
  profileColor: String,
});

export default mongoose.model('User', userSchema);
