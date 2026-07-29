import express from 'express'
import verifyToken, {requireRole} from "../middleware/auth.js";
const router = express.Router();
import {createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle} from "../controllers/vehicle.controller.js";

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', verifyToken, requireRole('admin'), createVehicle);
router.put('/:id', verifyToken, requireRole('admin'), updateVehicle);
router.delete('/:id', verifyToken, requireRole('admin'), deleteVehicle);

export default router;