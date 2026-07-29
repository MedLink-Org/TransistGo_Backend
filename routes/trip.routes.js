import express from 'express';
import {
    createTrip, getTrips, getTripById, updateTrip, updateTripStatus, deleteTrip
} from '../controllers/trip.controller.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTrips);
router.get('/:id', getTripById);
router.post('/', verifyToken, createTrip);
router.put('/:id', verifyToken, updateTrip);
router.patch('/:id/status', verifyToken, updateTripStatus);
router.delete('/:id', verifyToken, deleteTrip);

export default router;