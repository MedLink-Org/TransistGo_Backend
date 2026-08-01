import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function register(req, res) {
    const {name, email, password, role} = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({message : "All field are required"});
    }

    try{
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({message : "User already exists"});
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users(name, email, password_hash, role)
             VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`, [name, email, passwordHash, role]);

        const user = result.rows[0];
        const token = jwt.sign({id: user.id, role:user.role, email: user.email}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.status(201).json({token, user})
    }catch (err){
        console.error(err);
        res.status(500).json({message : 'Server Down Try again'});
    }
}

export async function login(req, res) {
    const {email, password} = req.body;
    if (!email || !password)
        return res.status(400).json({message : "All field are required"});

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return res.status(401).json({message : "Invalid email or password"});
const user = result.rows[0];
const validPassword = await bcrypt.compare(password, user.password_hash);
if (!validPassword)
    return res.status(401).json({message : "Invalid email or password"});

const token = jwt.sign({id:user.id, role: user.role, email: user.email}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at },
            token,
        });
    }catch (err){
        console.error(err);
        res.status(500).json({message : 'Server Down Try again'});
    }
}
