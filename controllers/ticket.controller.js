import * as TicketModel from '../models/ticket.model.js';

export async function createTicket(req, res) {
    const { trip_id, seat_count, boarding_stop } = req.body;
    const passenger_id = req.user.id;

    if (!trip_id) {
        return res.status(400).json({ message: 'trip_id is required' });
    }
    if (seat_count && (!Number.isInteger(seat_count) || seat_count < 1)) {
        return res.status(400).json({ message: 'seat_count must be a positive integer' });
    }

    try {
        const ticket = await TicketModel.create({ trip_id, passenger_id, seat_count, boarding_stop });
        res.status(201).json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating ticket' });
    }
}

export async function getTickets(req, res) {
    try {
        const tickets = await TicketModel.findAll();
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching tickets' });
    }
}

export async function getMyTickets(req, res) {
    try {
        const tickets = await TicketModel.findByPassenger(req.user.id);
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching your tickets' });
    }
}

export async function getTicketById(req, res) {
    try {
        const ticket = await TicketModel.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching ticket' });
    }
}

export async function updatePayment(req, res) {
    const { payment_status } = req.body;
    const validStatuses = ['pending', 'paid', 'failed'];

    if (!validStatuses.includes(payment_status)) {
        return res.status(400).json({ message: `payment_status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        const ticket = await TicketModel.updatePaymentStatus(req.params.id, payment_status);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating payment status' });
    }
}

// Driver scans QR code to board a passenger
export async function boardByQrCode(req, res) {
    const { qr_code } = req.body;

    if (!qr_code) {
        return res.status(400).json({ message: 'qr_code is required' });
    }

    try {
        const ticket = await TicketModel.findByQrCode(qr_code);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (ticket.boarding_status === 'boarded') {
            return res.status(409).json({ message: 'Ticket already used to board' });
        }
        if (ticket.payment_status !== 'paid') {
            return res.status(402).json({ message: 'Ticket has not been paid for' });
        }

        const boarded = await TicketModel.markBoarded(ticket.id);
        res.json(boarded);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error boarding ticket' });
    }
}

export async function deleteTicket(req, res) {
    try {
        const ticket = await TicketModel.remove(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting ticket' });
    }
}

export async function getTicketsByTrip(req, res) {
    try {
        const tickets = await TicketModel.findByTripId(req.params.tripId);
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching trip passengers' });
    }
}