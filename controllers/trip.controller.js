import * as TripModel from '../models/trip.model.js';

export async function createTrip(req, res) {
    const { route_id, driver_id, vehicle_id, departure_time } = req.body;

    if(!route_id || !departure_time) 
        return res.status(400).json({ message: 'Route ID and departure time are required' });

    try{
        const newTrip = await TripModel.create({ route_id, driver_id, vehicle_id, departure_time });
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ message: 'Error creating trip: ', error });
    }
}

export async function getTrips(req, res) {
    try {
        const trips = await TripModel.findAll();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips: ', error });
    }
}

export async function getTripById(req, res) {
    try{
        const trip = await TripModel.findById(req.params.id);
        if(!trip) return res.status(404).json({ message: 'Trip not found' });
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trip: ', error });  
    }
}

export async function updateTrip(req, res) {
    try {
        const trip = await TripModel.update(req.params.id, req.body);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating trip' });
    }
}

export async function updateTripStatus(req, res) {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'in_transit', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const trip = await TripModel.updateStatus(req.params.id, status);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating trip status' });
    }
}

export async function deleteTrip(req, res) {
    try {
        const trip = await TripModel.remove(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Trip deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting trip' });
    }
}