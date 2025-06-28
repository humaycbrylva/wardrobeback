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
  getUserCloset
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/user/:id', verifyToken, isAdmin, getSingleUser);
router.put('/user/:id', verifyToken, isAdmin, updateUser);
router.delete('/user/:id', verifyToken, isAdmin, deleteUser);

router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/user-products-summary', verifyToken, isAdmin, getUserProductSummary);
router.get('/user-products/:userId', verifyToken, isAdmin, getUserProducts);
router.get('/user/:id/closet', verifyToken, isAdmin, getUserCloset); // 🆕 closet geyimləri

export default router;


