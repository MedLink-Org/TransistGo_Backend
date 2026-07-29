import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectUnauthorized: false},
});

pool.on('connect', () => {
    console.log('Connected TO Supabase!');
});

pool.on('error', (err) => {
    console.error('Error connecting to Supabase: ', err);
    process.exit(-1);
});


export default pool;