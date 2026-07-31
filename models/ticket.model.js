import pool from '../config/db.js';
import crypto from 'crypto';

export async function create({ trip_id, passenger_id, seat_count, boarding_stop }) {
    const qr_code = crypto.randomBytes(16).toString('hex');

    const result = await pool.query(
        `INSERT INTO tickets (trip_id, passenger_id, qr_code, seat_count, boarding_stop)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [trip_id, passenger_id, qr_code, seat_count || 1, boarding_stop || null]
    );
    return result.rows[0];
}

export async function findAll() {
    const result = await pool.query(
        `SELECT tickets.*, trips.departure_time, routes.name AS route_name
         FROM tickets
         JOIN trips ON tickets.trip_id = trips.id
         JOIN routes ON trips.route_id = routes.id
         ORDER BY tickets.created_at DESC`
    );
    return result.rows;
}

export async function findByPassenger(passenger_id) {
    const result = await pool.query(
        `SELECT tickets.*, trips.departure_time, routes.name AS route_name
         FROM tickets
         JOIN trips ON tickets.trip_id = trips.id
         JOIN routes ON trips.route_id = routes.id
         WHERE tickets.passenger_id = $1
         ORDER BY tickets.created_at DESC`,
        [passenger_id]
    );
    return result.rows;
}

export async function findById(id) {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export async function findByQrCode(qr_code) {
    const result = await pool.query('SELECT * FROM tickets WHERE qr_code = $1', [qr_code]);
    return result.rows[0] || null;
}

export async function updatePaymentStatus(id, payment_status) {
    const result = await pool.query(
        `UPDATE tickets SET payment_status = $1 WHERE id = $2 RETURNING *`,
        [payment_status, id]
    );
    return result.rows[0] || null;
}

export async function markBoarded(id) {
    const result = await pool.query(
        `UPDATE tickets SET boarding_status = 'boarded' WHERE id = $1 AND boarding_status = 'not_boarded' RETURNING *`,
        [id]
    );
    return result.rows[0] || null;
}

export async function remove(id) {
    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}