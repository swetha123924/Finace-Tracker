import express from 'express';
import { getMembers, addMember, updateMember, deleteMember, getMemberStats } from '../controllers/memberController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getMembers);
router.post('/', addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);
router.get('/:id/stats', getMemberStats);

export default router;
