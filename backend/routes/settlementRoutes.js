import express from 'express';
import { 
  getSettlements, 
  createSettlement, 
  completeSettlement, 
  deleteSettlement,
  settleAll
} from '../controllers/settlementController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getSettlements);
router.post('/', createSettlement);
router.put('/:id/complete', completeSettlement);
router.delete('/:id', deleteSettlement);
router.post('/settle-all', settleAll);

export default router;
