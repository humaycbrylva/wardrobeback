import Planner from '../models/Planner.js';

// İstifadəçinin planlarını gətir
export const getPlannerByUser = async (req, res) => {
  try {
    const plans = await Planner.find({ user: req.userId });
    res.json(plans);
  } catch (err) {
    console.error('Planlar gətirilərkən xəta:', err);
    res.status(500).json({ message: 'Planlar gətirilə bilmədi' });
  }
};

// Yeni plan yarat
export const createPlanner = async (req, res) => {
  try {
    const { name, image, occasion, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Plan üçün ən azı bir məhsul seçilməlidir' });
    }

    const plan = new Planner({
      user: req.userId,
      name: name || 'My Outfit Plan',
      image,           // Burada image əlavə olundu
      occasion: occasion || 'general',
      items,           // burada items içində product, image, title gözlənilir
    });

    await plan.save();

    res.status(201).json(plan);
  } catch (err) {
    console.error('Plan yaradılarkən xəta:', err);
    res.status(500).json({ message: 'Plan yaradılmadı' });
  }
};

// Planı yenilə
export const updatePlanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, occasion, items } = req.body;

    const updatedPlan = await Planner.findOneAndUpdate(
      { _id: id, user: req.userId },
      { name, image, occasion, items },   // Burada image əlavə olundu
      { new: true }
    );

    if (!updatedPlan) return res.status(404).json({ message: 'Plan tapılmadı' });

    res.json(updatedPlan);
  } catch (err) {
    console.error('Plan yenilənərkən xəta:', err);
    res.status(500).json({ message: 'Plan yenilənmədi' });
  }
};

// Planı sil
export const deletePlanner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Planner.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Plan tapılmadı' });
    res.json({ message: 'Plan silindi' });
  } catch (err) {
    console.error('Plan silinərkən xəta:', err);
    res.status(500).json({ message: 'Plan silinmədi' });
  }
};

