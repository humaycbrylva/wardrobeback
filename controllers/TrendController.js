import Trend from '../models/Trend.js';
import fs from 'fs';
import path from 'path';

// Trendləri gətir
export const getTrends = async (req, res) => {
  try {
    const trends = await Trend.find().sort({ createdAt: -1 });
    res.json(trends);
  } catch (err) {
    console.error('Trendlər gətirilə bilmədi:', err);
    res.status(500).json({ message: 'Trendlər gətirilə bilmədi' });
  }
};

// Yeni trend əlavə et
export const createTrend = async (req, res) => {
  try {
    const { title, brand, tags, category } = req.body;

    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: 'Başlıq və əsas şəkil tələb olunur' });
    }

    const mainImage = req.files.mainImage[0].filename;

    const galleryImages = req.files.galleryImages
      ? req.files.galleryImages.map(file => file.filename)
      : [];

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [];

    const trend = new Trend({
      title,
      brand,
      tags: parsedTags,
      category,
      mainImage,
      galleryImages,
    });

    await trend.save();
    res.status(201).json(trend);
  } catch (err) {
    console.error('Trend yaratma xətası:', err);
    res.status(500).json({ message: 'Trend əlavə olunmadı' });
  }
};

// Trend yenilə
export const updateTrend = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brand, tags, category } = req.body;

    const updateData = {
      title,
      brand,
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [],
      category,
    };

    if (req.files) {
      if (req.files.mainImage) {
        updateData.mainImage = req.files.mainImage[0].filename;
      }
      if (req.files.galleryImages) {
        updateData.galleryImages = req.files.galleryImages.map(file => file.filename);
      }
    }

    const updated = await Trend.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Trend yenilənmə xətası:', err);
    res.status(500).json({ message: 'Trend yenilənmədi' });
  }
};

// Trend sil
export const deleteTrend = async (req, res) => {
  try {
    const { id } = req.params;

    const trend = await Trend.findById(id);
    if (!trend) {
      return res.status(404).json({ message: 'Trend tapılmadı' });
    }

    if (trend.mainImage) {
      const mainImagePath = path.join('uploads/trending', trend.mainImage);
      fs.unlink(mainImagePath, (err) => {
        if (err) console.error('Main image silinmədi:', err);
      });
    }

    if (trend.galleryImages && trend.galleryImages.length > 0) {
      trend.galleryImages.forEach((filename) => {
        const galleryImagePath = path.join('uploads/gallery', filename);
        fs.unlink(galleryImagePath, (err) => {
          if (err) console.error('Gallery image silinmədi:', err);
        });
      });
    }

    await Trend.findByIdAndDelete(id);

    res.json({ message: 'Trend silindi' });
  } catch (err) {
    console.error('Trend silmə xətası:', err);
    res.status(500).json({ message: 'Trend silinmədi' });
  }
};
