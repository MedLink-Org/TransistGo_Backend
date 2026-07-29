import express from 'express';
import {
    createTicket, getTickets, getMyTickets, getTicketById,
    updatePayment, boardByQrCode, deleteTicket
} from '../controllers/ticket.controller.js';
import verifyToken, {requireRole} from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('admin'), getTickets);
router.get('/mine', verifyToken, getMyTickets); // any authenticated user, their own tickets
router.get('/:id', verifyToken, getTicketById);
router.post('/', verifyToken, requireRole('passenger'), createTicket); // only passengers book
router.patch('/:id/payment', verifyToken, requireRole('admin'), updatePayment);
router.post('/board', verifyToken, requireRole('driver', 'admin'), boardByQrCode);
router.delete('/:id', verifyToken, requireRole('admin'), deleteTicket);
export default router;