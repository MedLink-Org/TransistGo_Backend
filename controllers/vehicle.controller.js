import * as VehicleModel from '../models/vehicle.model.js';

export async function createVehicle(req, res) {
    const { plate_number, capacity, driver_id } = req.body;
    if (!plate_number || !capacity) {
        return res.status(400).json({ message: 'plate_number and capacity are required' });
    }
    try {
        const vehicle = await VehicleModel.create({ plate_number, capacity, driver_id });
        res.status(201).json(vehicle);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') return res.status(409).json({ message: 'Plate number already exists' });
        res.status(500).json({ message: 'Server error creating vehicle' });
    }
}

export async function getVehicles(req, res) {
    try {
        const vehicles = await VehicleModel.findAll();
        res.json(vehicles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching vehicles' });
    }
}

export async function getVehicleById(req, res) {
    try {
        const vehicle = await VehicleModel.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching vehicle' });
    }
}

export async function updateVehicle(req, res) {
    try {
        const vehicle = await VehicleModel.update(req.params.id, req.body);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating vehicle' });
    }
}

export async function deleteVehicle(req, res) {
    try {
        const vehicle = await VehicleModel.remove(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting vehicle' });
    }
}