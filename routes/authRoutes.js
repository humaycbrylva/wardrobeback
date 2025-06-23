// routes/authRoutes.js
import express from 'express';
import multer from 'multer';
import { register, verifyOtp,login } from '../controllers/authController.js';
import { forgotPassword } from '../controllers/authController.js';
import { resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Multer setup for profile image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/register', upload.single('profileImage'), register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);


router.post('/reset-password', resetPassword);


export default router;

