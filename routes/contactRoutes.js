import express from 'express';
import { createContactRequest, getContactRequests, markRequestRead } from '../controllers/contactController.js';
import { verifyToken,isAdmin} from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/', createContactRequest);

// Aşağıdakı routelara admin girişi tələb olunur
router.get('/', verifyToken, isAdmin, getContactRequests);
router.put('/:id/read', verifyToken, isAdmin, markRequestRead);

export default router;
