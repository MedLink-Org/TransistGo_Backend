import cors from 'cors';
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import routeRoutes from "./routes/route.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import userRoutes from './routes/user.routes.js';
import morgan from 'morgan';
dotenv.config();

const app = express();
app.use(morgan("dev"));

const allowedOrigins = [
    'http://localhost:5174',
    process.env.FRONTEND_URL,
];

app.use(cors({
    origin: (origin, callback) => {
    
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'TransistGo  API is running',
    });
});

export default app;