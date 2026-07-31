import express from 'express';
import {
    createTrip, getTrips, getTripById, updateTrip, updateTripStatus, deleteTrip, getMyTrips
} from '../controllers/trip.controller.js';
import verifyToken ,{requireRole} from '../middleware/auth.js';

const router = express.Router();
router.get('/', getTrips);
router.get('/mine', verifyToken, requireRole('driver'), getMyTrips);
router.get('/:id', getTripById);
router.post('/', verifyToken, requireRole('admin'), createTrip);
router.put('/:id', verifyToken, requireRole('admin'), updateTrip);
router.patch('/:id/status', verifyToken, requireRole('admin', 'driver'), updateTripStatus);
router.delete('/:id', verifyToken, requireRole('admin'), deleteTrip);
export default router;