import express from 'express';
import { 
  getExpenses, 
  getExpense, 
  addExpense, 
  updateExpense, 
  deleteExpense,
  getExpenseStats,
  getBalances
} from '../controllers/expenseController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.get('/balances', getBalances);
router.get('/:id', getExpense);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
