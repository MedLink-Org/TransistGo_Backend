import express from 'express';
import {createRoute, getRoutes, getRouteById, updateRoute, deleteRoute} from "../controllers/route.controller.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get('/', getRoutes);
router.get('/:id', getRouteById);
router.post('/register', verifyToken, createRoute);
router.put('/:id', verifyToken, updateRoute);
router.delete('/:id', verifyToken, deleteRoute);

export default router;