import User from '../models/userModel.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ClosetItem from '../models/closetItem.js';

// ✅ Bütün istifadəçiləri al
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'İstifadəçilər alınmadı' });
  }
};

// ✅ Tək istifadəçini al
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'İstifadəçi alınmadı' });
  }
};

// ✅ İstifadəçini yenilə
export const updateUser = async (req, res) => {
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
};

// ✅ İstifadəçini sil
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'İstifadəçi silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silinmə xətası' });
  }
};

// ✅ Dashboard statistikaları
export const getStats = async (req, res) => {
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
      totalIncome: 0,
      latestUsers,
      latestProducts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Statistik məlumatlar alınmadı' });
  }
};

// ✅ Hər istifadəçinin məhsul sayı
export const getUserProductSummary = async (req, res) => {
  try {
    const summary = await User.aggregate([
      {
        $lookup: {
          from: 'closetitems',
          localField: '_id',
          foreignField: 'user',
          as: 'products',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          productCount: { $size: '$products' },
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'İstifadəçi məlumatları alınmadı' });
  }
};

// ✅ Tək istifadəçinin məhsulları
export const getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.params.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Məhsullar alınmadı' });
  }
};

// ✅ Tək istifadəçinin closet geyimləri
export const getUserCloset = async (req, res) => {
  try {
    const items = await ClosetItem.find({ user: req.params.id }).populate('user', 'name profileImage');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Closet məhsulları alınmadı' });
  }
};

