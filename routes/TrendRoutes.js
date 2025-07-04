import express from 'express';
import multer from 'multer';
import { createTrend, deleteTrend, getTrends, updateTrend } from '../controllers/TrendController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'mainImage') {
      cb(null, 'uploads/trending');
    } else if (file.fieldname === 'galleryImages') {
      cb(null, 'uploads/gallery');
    } else {
      cb(null, 'uploads/others'); // ehtiyat üçün
    }
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.get('/', getTrends);
router.post('/', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 },
]), createTrend);

router.put('/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 },
]), updateTrend);

router.delete('/:id', deleteTrend);

export default router;
