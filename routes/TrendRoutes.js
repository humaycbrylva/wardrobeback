import express from 'express';
import multer from 'multer';
import { createTrend, deleteTrend, getTrends, updateTrend } from '../controllers/TrendController.js';


const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/trending'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.get('/', getTrends);
router.post('/', upload.single('image'), createTrend);
router.put('/:id', updateTrend);
router.delete('/:id', deleteTrend);

export default router;
