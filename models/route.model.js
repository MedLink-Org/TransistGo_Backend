import pool from '../config/db.js';

export async function create({ name, origin, destination, fare, stops }) {
    const result = await pool.query(
       ` INSERT INTO routes (name, origin, destination, fare, stops)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, origin, destination, fare, JSON.stringify(stops || [])]
);
    return result.rows[0];
}

export async function findAll() {
    const result = await pool.query('SELECT * FROM routes ORDER BY created_at DESC');
    return result.rows;
}

export async function findById(id) {
    const result = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export async function update(id, { name, origin, destination, fare, stops }) {
    const result = await pool.query(
        `UPDATE routes SET name = $1, origin = $2, destination = $3, fare = $4, stops = $5
    WHERE id = $6 RETURNING *`,
        [name, origin, destination, fare, JSON.stringify(stops || []), id]
);
    return result.rows[0] || null;
}

export async function remove(id) {
    const result = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}