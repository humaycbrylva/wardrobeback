import Trend from '../models/Trend.js';

// 🔹 Trendləri gətir
export const getTrends = async (req, res) => {
  try {
    const trends = await Trend.find().sort({ createdAt: -1 });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Trendləri gətirmək mümkün olmadı' });
  }
};

// 🔹 Yeni trend əlavə et
export const createTrend = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    const image = req.file?.filename;

    if (!title || !image) {
      return res.status(400).json({ message: 'Başlıq və şəkil tələb olunur' });
    }

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [];

    const trend = new Trend({
      title,
      description,
      tags: parsedTags,
      category,
      image
    });

    await trend.save();
    res.status(201).json(trend);
  } catch (err) {
    console.error('Trend yaratma xətası:', err);
    res.status(500).json({ message: 'Trend əlavə olunmadı' });
  }
};

// 🔹 Mövcud trendi yenilə
export const updateTrend = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, category } = req.body;

    const updateData = {
      title,
      description,
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [],
      category
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Trend.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Trend yenilənmədi' });
  }
};

// 🔹 Trend sil
export const deleteTrend = async (req, res) => {
  try {
    const { id } = req.params;
    await Trend.findByIdAndDelete(id);
    res.json({ message: 'Trend silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Trend silinmədi' });
  }
};
