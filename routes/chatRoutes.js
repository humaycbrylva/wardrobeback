import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createMessage, getMessages } from '../controllers/chatController.js';
import { deleteMessage } from '../controllers/chatController.js';
import {updateMessage} from '../controllers/chatController.js'



const router = express.Router();

// Mesaj göndər
router.post('/', verifyToken, createMessage);

// İki istifadəçi arasındakı mesajları al
router.get('/:userId', verifyToken, getMessages);
router.delete('/:id', verifyToken, deleteMessage);
router.put('/:id', verifyToken, updateMessage);

export default router;
