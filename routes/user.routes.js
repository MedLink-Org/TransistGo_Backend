import express from 'express';
import { getUsers } from '../controllers/user.controller.js';
import verifyToken, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('admin'), getUsers);

export default router;