import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
    console.log(`Listening on port ${PORT}`);

    try{
        const result = await pool.query('SELECT NOW()');
        console.log('DB connection successfully, Server time:', result.rows[0].now);
    }
    catch(e){
        console.error('Error while trying to connect to the database', e.message);
    }
});