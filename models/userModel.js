import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  style: { type: String },
  profileImage: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpires: Date,

});

export default mongoose.model('User', userSchema);

