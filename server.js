require('./config/queue.js');
require('./workers/ticketWorker.js');
require('./workers/emailWorker');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { connectRedis } = require('./config/redis');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

dotenv.config();
connectDB();
connectRedis();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Velocity_Ticket Engine Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`⚡ Engine screaming on port ${PORT} in ${process.env.NODE_ENV} mode`);
});