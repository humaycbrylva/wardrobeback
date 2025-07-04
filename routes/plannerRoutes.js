import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getPlannerByUser,
  createPlanner,
  updatePlanner,
  deletePlanner,
} from '../controllers/plannerController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getPlannerByUser);
router.post('/', createPlanner);
router.put('/:id', updatePlanner);
router.delete('/:id', deletePlanner);

export default router;
