import * as RouteModel from '../models/route.model.js';

export async function createRoute(req, res) {
    const { name, origin, destination, fare, stops } = req.body;

    if (!name || !origin || !destination || !fare) {
        return res.status(400).json({ message: 'name, origin, destination, and fare are required' });
    }

    try {
        const route = await RouteModel.create({ name, origin, destination, fare, stops });
        res.status(201).json(route);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating route' });
    }
}

export async function getRoutes(req, res) {
    try {
        const routes = await RouteModel.findAll();
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching routes' });
    }
}

export async function getRouteById(req, res) {
    try {
        const route = await RouteModel.findById(req.params.id);
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json(route);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching route' });
    }
}

export async function updateRoute(req, res) {
    try {
        const route = await RouteModel.update(req.params.id, req.body);
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json(route);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating route' });
    }
}

export async function deleteRoute(req, res) {
    try {
        const route = await RouteModel.remove(req.params.id);
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json({ message: 'Route deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting route' });
    }
}