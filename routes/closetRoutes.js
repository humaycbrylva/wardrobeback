import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  addClothingItem,
  getMyClothes,
  deleteClothingItem,
  editClothingItem,
} from '../controllers/closetController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer konfiqurasiyası
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../closet'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});
const upload = multer({ storage });

// Geyim əlavə et
router.post('/', verifyToken, upload.single('image'), addClothingItem);

// Geyimləri getir (yalnız istifadəçiyə aid)
router.get('/', verifyToken, getMyClothes);

// Geyimi sil
router.delete('/:id', verifyToken, deleteClothingItem);

// Geyimi redaktə et
router.put('/:id', verifyToken, upload.single('image'), editClothingItem);

export default router;
