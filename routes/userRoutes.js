// routes/userRoutes.js
import express from 'express';
import { getProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import multer from 'multer';
import { updateProfile } from '../controllers/userController.js';
import { changePassword } from '../controllers/userController.js';


const router = express.Router();

router.get('/profile', verifyToken, getProfile);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.put('/update', verifyToken, upload.single('profileImage'), updateProfile);

router.put('/change-password', verifyToken, changePassword);


export default router;





