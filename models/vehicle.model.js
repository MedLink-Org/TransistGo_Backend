import pool from '../config/db.js';

export async function create({ plate_number, capacity, driver_id }) {
    const result = await pool.query(
        `INSERT INTO vehicles (plate_number, capacity, driver_id)
    VALUES ($1, $2, $3) RETURNING *`,
        [plate_number, capacity, driver_id || null]
);
    return result.rows[0];
}

export async function findAll() {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return result.rows;
}

export async function findById(id) {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export async function update(id, { plate_number, capacity, driver_id }) {
    const result = await pool.query(
        `UPDATE vehicles SET plate_number = $1, capacity = $2, driver_id = $3
    WHERE id = $4 RETURNING *`,
        [plate_number, capacity, driver_id || null, id]
);
    return result.rows[0] || null;
}

export async function remove(id) {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}