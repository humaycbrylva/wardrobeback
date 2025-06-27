import express from 'express';
import User from '../models/userModel.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { verifyToken } from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// ✅ Bütün istifadəçiləri al (Admin üçün)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'İstifadəçilər alınmadı' });
  }
});

// ✅ Tək istifadəçini al (Admin üçün)
router.get('/user/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'İstifadəçi alınmadı' });
  }
});

// ✅ İstifadəçini yenilə (Admin üçün)
router.put('/user/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');

    if (!updated) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Yeniləmə xətası' });
  }
});

// ✅ İstifadəçini sil (Admin üçün)
router.delete('/user/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'İstifadəçi silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silinmə xətası' });
  }
});

// ✅ Dashboard statistikaları
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');

    res.json({
      totalUsers,
      totalProducts,
      totalCategories,
      totalIncome: 0, // Əgər payment sistemi varsa, buranı dəyiş
      latestUsers,
      latestProducts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Statistik məlumatlar alınmadı' });
  }
});

export default router;

