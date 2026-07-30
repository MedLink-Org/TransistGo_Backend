import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 5000;

// Health check route - lets you verify DB connectivity without relying on boot-time logs
// (serverless functions don't have a persistent "boot", so this replaces the old listen() check)
app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', dbTime: result.rows[0].now });
    } catch (e) {
        console.error('Error while trying to connect to the database', e.message);
        res.status(500).json({ status: 'error', message: e.message });
    }
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

export default app;