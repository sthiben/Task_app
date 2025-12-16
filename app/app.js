import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/db/connection.js'; // Import the connection
// Import routes
import authRouter from '../routes/auth.routes.js';
import userRouter from '../routes/user.routes.js';
import gymRouter from '../routes/gym.routes.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB(); // Call the connection function

// Use routes
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', gymRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

export default app;