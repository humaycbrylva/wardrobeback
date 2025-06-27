import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    res.json({
      totalUsers,
      totalProducts,
      totalCategories,
      totalIncome: 0, // Payment olmadığından 0 göstərilir
      latestUsers
    });
  } catch (err) {
    console.error("Statistik məlumatlar alınmadı:", err);
    res.status(500).json({ message: "Statistik məlumatlar alınmadı" });
  }
};
