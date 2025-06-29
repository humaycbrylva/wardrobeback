import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getStats,
  getUserProductSummary,
  getUserProducts,
  getUserCloset,
  addCategory,
  getCategoriesWithProductCount,
  deleteCategory,
  updateCategory,
  getClosetCategoriesWithCount,
  deleteClosetCategory,
  updateClosetCategory,  // bu funksiyanı da import et
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/user/:id', verifyToken, isAdmin, getSingleUser);
router.put('/user/:id', verifyToken, isAdmin, updateUser);
router.delete('/user/:id', verifyToken, isAdmin, deleteUser);

router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/user-products-summary', verifyToken, isAdmin, getUserProductSummary);
router.get('/user-products/:userId', verifyToken, isAdmin, getUserProducts);
router.get('/user/:id/closet', verifyToken, isAdmin, getUserCloset);

// Mövcud kateqoriyalar endpointləri
router.get('/categories', verifyToken, isAdmin, getCategoriesWithProductCount);
router.post('/categories', verifyToken, isAdmin, addCategory);
router.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);
router.put('/categories/:id', verifyToken, isAdmin, updateCategory);

// Yeni: Closet kateqoriyaları və məhsul sayı
router.get('/closet-categories', verifyToken, isAdmin, getClosetCategoriesWithCount);

router.delete('/closet-categories/:category', verifyToken, isAdmin, deleteClosetCategory);
router.put('/closet-categories/:category', verifyToken, isAdmin, updateClosetCategory);


export default router;



