import Product from '../models/Product.js';

// Məhsul əlavə et
export const addProduct = async (req, res) => {
  try {
    const { title, description, category, brand, size, color } = req.body;
    const userId = req.userId;
    const images = req.files ? req.files.map(file => file.filename) : [];

    if (!title || !category || !userId || images.length === 0) {
      return res.status(400).json({ message: 'Zəruri sahələr boş ola bilməz' });
    }

    const newProduct = await Product.create({
      title,
      description,
      category,
      brand,
      size,
      color,
      images,
      user: userId, // 🧠 ObjectId formatında gələcək
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Məhsul əlavə edilərkən xəta:', err.message);
    res.status(500).json({ message: 'Məhsul əlavə edilə bilmədi' });
  }
};

// İstifadəçinin məhsullarını al
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Məhsullar alınmadı' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Məhsul tapılmadı' });

    // Məhsulun sahibi deyil → admin olub-olmadığını yoxla
    if (product.user.toString() !== req.userId) {
      const currentUser = await User.findById(req.userId);
      if (!currentUser || !currentUser.isAdmin) {
        return res.status(403).json({ message: 'İcazə yoxdur' });
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Məhsul silindi' });
  } catch (err) {
    console.error('❌ Silinmə xətası:', err.message);
    res.status(500).json({ message: 'Server xətası' });
  }
};
