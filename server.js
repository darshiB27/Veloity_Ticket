// http://localhost:8080/health
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Velocity_Ticket Engine Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`⚡ Engine screaming on port ${PORT} in ${process.env.NODE_ENV} mode`);
});