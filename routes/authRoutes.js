import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

export default router;
