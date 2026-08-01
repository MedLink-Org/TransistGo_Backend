import pool from '../config/db.js';

export async function findAll(role) {
    if (role) {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE role = $1 ORDER BY name', [role]);
        return result.rows;
    }
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY name');
    return result.rows;
}