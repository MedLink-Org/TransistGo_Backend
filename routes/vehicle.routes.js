import express from 'express'
import verifyToken from "../middleware/auth.js";
const router = express.Router();
import {createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle} from "../controllers/vehicle.controller.js";

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/',verifyToken ,createVehicle);
router.put('/:id', verifyToken , updateVehicle);
router.delete('/:id', verifyToken , deleteVehicle);

export default router;