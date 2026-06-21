require('./config/queue');

const express = require('express');
const dotenv = require('dotenv');
const { connectRedis } = require('./config/redis');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');const ticketRoutes = require('./routes/ticketRoutes');

dotenv.config();
connectDB();
connectRedis();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Velocity_Ticket Engine Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`⚡ Engine screaming on port ${PORT} in ${process.env.NODE_ENV} mode`);
});