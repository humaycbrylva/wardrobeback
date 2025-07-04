// routes/suggestionRoutes.js
import express from 'express';
import Suggestion from '../models/Suggestion.js';

const router = express.Router();

// Bütün təklifləri al
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.find({});
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Təkliflər gətirilə bilmədi' });
  }
});

// Yeni təklif əlavə et (admin üçün düşünülüb)
router.post('/', async (req, res) => {
  try {
    const suggestion = new Suggestion(req.body);
    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (err) {
    res.status(500).json({ message: 'Təklif əlavə edilə bilmədi' });
  }
});

export default router;
