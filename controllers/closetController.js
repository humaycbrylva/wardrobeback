import User from '../models/userModel.js';
import ClosetItem from '../models/closetItem.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addClothingItem = async (req, res) => {
  try {
    console.log('🧑‍💻 userId:', req.userId);
    console.log('📷 file:', req.file);
    console.log('📦 body:', req.body);

    const { category, brand, size, color } = req.body;
    const userId = req.userId;
    const image = req.file ? req.file.filename : null;

    if (!userId || !image || !category) {
      return res.status(400).json({ message: 'Boş sahə var' });
    }

    const newItem = new ClosetItem({
      user: userId,
      category,
      image,
      brand,
      size,
      color,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Geyim əlavə edilərkən xəta:', err);
    res.status(500).json({ message: 'Server xətası' });
  }
};


export const getMyClothes = async (req, res) => {
  try {
    const items = await ClosetItem.find({ user: req.userId }).populate('user', 'name profileImage');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server xətası' });
  }
};

export const deleteClothingItem = async (req, res) => {
  try {
    const item = await ClosetItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Tapılmadı' });

    // 🛡️ Admin və ya sahibi silə bilər
    if (item.user.toString() !== req.userId && !req.user?.isAdmin) {
      return res.status(403).json({ message: 'İcazə yoxdur' });
    }

    // Şəkli sil
    if (item.image) {
      const imagePath = path.join(__dirname, '../closet', item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Şəkil silinmədi:', err.message);
      });
    }

    await ClosetItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Silindi' });
  } catch (err) {
    console.error('❌ Silinmə xətası:', err.message);
    res.status(500).json({ message: 'Server xətası' });
  }
};


export const editClothingItem = async (req, res) => {
  try {
    const { category, brand, size, color } = req.body;
    const item = await ClosetItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Tapılmadı' });

    if (req.file) {
      if (item.image) {
        const oldPath = path.join(__dirname, '../closet', item.image);
        fs.unlink(oldPath, () => {});
      }
      item.image = req.file.filename;
    }

    item.category = category || item.category;
    item.brand = brand || item.brand;
    item.size = size || item.size;
    item.color = color || item.color;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error('Redaktə xətası:', err.message);
    res.status(500).json({ message: 'Redaktə xətası' });
  }
};

