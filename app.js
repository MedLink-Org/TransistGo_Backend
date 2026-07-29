import cors from 'cors';
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import routeRoutes from "./routes/route.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import morgan from 'morgan';
dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'TransistGo  API is running',
    });
});


export default app;