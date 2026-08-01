import * as UserModel from '../models/user.model.js';

export async function getUsers(req, res) {
    try {
        const users = await UserModel.findAll(req.query.role);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching users' });
    }
}