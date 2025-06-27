// scripts/seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email: 'humaycebrayilova146@gmail.com' });

    if (existingAdmin) {
      console.log('Admin artıq mövcuddur');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const newAdmin = new User({
        name: 'Admin',
        email: 'humaycebrayilova146@gmail.com',
        password: hashedPassword,
        gender: 'male',
        style: 'classic',
        profileImage: 'admin.jpg', // əgər istəsən boş da qoya bilərsən
        isVerified: true,
        isAdmin: true
      });

      await newAdmin.save();
      console.log('✅ Admin uğurla yaradıldı');
    }

    process.exit();
  } catch (err) {
    console.error('❌ Admin yaradılmadı:', err);
    process.exit(1);
  }
};

seedAdmin();
