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

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await ClosetItem.countDocuments();

    // Kateqoriyaların sayı product kolleksiyasındakı unikal kateqoriyalarla hesablanır
    const distinctCategories = await ClosetItem.distinct('category');
    const totalCategories = distinctCategories.length;

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

// ✅ Kateqoriyalar və məhsul sayı (Product kolleksiyası üçün mövcud)
export const getCategoriesWithProductCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products',
        },
      },
      {
        $project: {
          name: 1,
          productCount: { $size: '$products' },
        },
      },
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Kateqoriyalar alınmadı' });
  }
};

// ✅ Yeni: Closet kateqoriyaları və məhsul sayı (ClosetItem kolleksiyası üçün)
export const getClosetCategoriesWithCount = async (req, res) => {
  try {
    const categories = await ClosetItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
      { $sort: { category: 1 } },
    ]);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Closet kateqoriyaları alınmadı' });
  }
};

// ✅ Closet kateqoriyasını silmək (bütün həmin kateqoriyaya aid məhsulları silir)
export const deleteClosetCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await ClosetItem.deleteMany({ category });
    res.json({ message: `${result.deletedCount} closet məhsulu silindi` });
  } catch (err) {
    res.status(500).json({ message: 'Closet kateqoriyası silinmədi' });
  }
};

// ✅ Closet kateqoriyasını yeniləmək (bütün həmin kateqoriyaya aid məhsulların kateqoriyasını dəyişir)
export const updateClosetCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { newCategory } = req.body;
    if (!newCategory) return res.status(400).json({ message: 'Yeni kateqoriya adı lazımdır' });

    const result = await ClosetItem.updateMany({ category }, { $set: { category: newCategory } });
    res.json({ message: `${result.modifiedCount} closet məhsulu yeniləndi` });
  } catch (err) {
    res.status(500).json({ message: 'Closet kateqoriyası yenilənmədi' });
  }
};

// Kateqoriya silmə (Product kolleksiyası üçün)
export const deleteCategory = async (req, res) => {
  try {
    // Əvvəlcə həmin kateqoriyaya aid məhsulların olub olmadığını yoxla
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({ message: 'Kateqoriyada məhsullar mövcuddur, əvvəlcə onları silin.' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kateqoriya silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Kateqoriya silinmədi' });
  }
};

// Kateqoriya redaktə (Product kolleksiyası üçün)
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Kateqoriya tapılmadı' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Kateqoriya yenilənmədi' });
  }
};

// Kateqoriya əlavə et (Product kolleksiyası üçün)
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Kateqoriya adı lazımdır" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Kateqoriya artıq mövcuddur" });

    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Kateqoriya əlavə edilə bilmədi" });
  }
};



