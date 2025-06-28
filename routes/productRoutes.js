import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import upload from '../middleware/uploadMiddleware.js'
import {
  addProduct,
  getMyProducts,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Məhsul əlavə et
router.post('/', verifyToken, upload.array('images'), addProduct);

// Öz məhsullarını al
router.get('/my', verifyToken, getMyProducts);

// Məhsul sil
router.delete('/:id', verifyToken, deleteProduct);

export default router;
