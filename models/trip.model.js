import pool from '../config/db.js';

export async function create({route_id, driver_id, vehicle_id, departure_time}) {
    const result = await pool.query(
        `INSERT INTO trips (route_id, driver_id, vehicle_id, departure_time) VALUES ($1, $2, $3, $4) RETURNING *`,
        [route_id, driver_id || null, vehicle_id || null, departure_time]
    );
    return result.rows[0];
}

export async function findAll() {
    const result = await pool.query(`SELECT trips.*, routes.name AS route_name, vehicles.plate_number
         FROM trips
         JOIN routes ON trips.route_id = routes.id
         LEFT JOIN vehicles ON trips.vehicle_id = vehicles.id
         ORDER BY trips.departure_time DESC`
    );
    return result.rows;
}

export async function findById(id) {
      const result = await pool.query(
        `SELECT trips.*, routes.name AS route_name, vehicles.plate_number
         FROM trips
         JOIN routes ON trips.route_id = routes.id
         LEFT JOIN vehicles ON trips.vehicle_id = vehicles.id
         WHERE trips.id = $1`,
        [id]
    );
    return result.rows[0];
}

export async function updateStatus(id, status) {
    const result = await pool.query(
        `UPDATE trips SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0] || null;
}

export async function update(id, { route_id, driver_id, vehicle_id, departure_time, status }) {
    const result = await pool.query(
        `UPDATE trips SET route_id = $1, driver_id = $2, vehicle_id = $3, departure_time = $4, status = $5
         WHERE id = $6 RETURNING *`,
        [route_id, driver_id || null, vehicle_id || null, departure_time, status, id]
    );
    return result.rows[0] || null;
}

export async function remove(id) {
    const result = await pool.query('DELETE FROM trips WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}

export async function findByDriverId(driverId) {
    const result = await pool.query(
        `SELECT trips.*, routes.name AS route_name, vehicles.plate_number
         FROM trips
         JOIN routes ON trips.route_id = routes.id
         LEFT JOIN vehicles ON trips.vehicle_id = vehicles.id
         WHERE trips.driver_id = $1
         ORDER BY trips.departure_time DESC`,
        [driverId]
    );
    return result.rows;
}
