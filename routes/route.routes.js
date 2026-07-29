import express from 'express';
import {createRoute, getRoutes, getRouteById, updateRoute, deleteRoute} from "../controllers/route.controller.js";
import verifyToken, {requireRole} from "../middleware/auth.js";

const router = express.Router();

router.get('/', getRoutes);
router.get('/:id', getRouteById);
router.post('/register', verifyToken, requireRole('admin'), createRoute);
router.put('/:id', verifyToken,requireRole('admin'), updateRoute);
router.delete('/:id', verifyToken,requireRole('admin'), deleteRoute);

export default router;