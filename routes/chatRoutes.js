import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createMessage, getMessages } from '../controllers/chatController.js';

const router = express.Router();

// Mesaj göndər
router.post('/', verifyToken, createMessage);

// İki istifadəçi arasındakı mesajları al
router.get('/:userId', verifyToken, getMessages);

export default router;
